import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { assetRepo } from '../../data/repositories/asset.repo';
import { eventRepo } from '../../data/repositories/event.repo';
import { aiGateway } from '../../external/ai/gateway';
import { storage } from '../../external/storage/storage';
import { Asset, AssetAnalysis, AssetAnalysisStructuredData, Event } from '../models/domain';

const IMAGE_ANALYSIS_PROMPT = `你是一个专业的回忆录素材分析师。
请仔细分析这张照片，并以JSON格式返回以下结构（不要用markdown代码块包裹，直接返回JSON）：
{
  "people": ["照片中出现的人物姓名或描述"],
  "timeHints": ["时间线索，如季节、年代特征、节日等"],
  "locationHints": ["地点线索"],
  "summary": "这张照片的简短描述（2-3句话）",
  "mood": "情感基调（如：喜悦、温馨、庄重、怀念等）",
  "keywords": ["关键词"],
  "suggestedEvents": [
    {
      "title": "建议的事件标题",
      "summary": "事件摘要（1-2句话）",
      "timeHint": "大概时间",
      "locationHint": "地点",
      "participants": ["参与者"],
      "emotionTags": ["情感标签"]
    }
  ]
}`;

const TEXT_ANALYSIS_PROMPT = `你是一个专业的回忆录素材分析师。
请分析以下文字素材，提炼出其中的人生事件，并以JSON格式返回（不要用markdown代码块包裹，直接返回JSON）：
{
  "people": ["提到的人物"],
  "timeHints": ["时间线索"],
  "locationHints": ["地点线索"],
  "summary": "素材核心内容（2-3句话）",
  "mood": "情感基调",
  "keywords": ["关键词"],
  "suggestedEvents": [
    {
      "title": "事件标题",
      "summary": "事件摘要",
      "timeHint": "时间",
      "locationHint": "地点",
      "participants": ["参与者"],
      "emotionTags": ["情感标签"]
    }
  ]
}

素材内容：
`;

export const assetService = {
  async uploadFile(data: {
    projectId: string;
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    byteSize: number;
    notes?: string;
    captureTime?: Date;
  }): Promise<Asset> {
    const ext = path.extname(data.originalName);
    const storageKey = `projects/${data.projectId}/assets/${uuid()}${ext}`;

    await storage.save(storageKey, data.buffer, data.mimeType);

    const type = data.mimeType.startsWith('image/') ? 'image'
      : data.mimeType.startsWith('audio/') ? 'audio'
      : 'text';

    const asset = await assetRepo.create({
      projectId: data.projectId,
      type,
      source: 'upload',
      fileName: data.originalName,
      mimeType: data.mimeType,
      byteSize: data.byteSize,
      storageKey,
      notes: data.notes,
      captureTime: data.captureTime,
    });

    // Trigger analysis asynchronously (fire and forget)
    this.analyzeAsset(asset).catch((err) =>
      console.error(`[AssetService] Analysis failed for ${asset.id}:`, err.message)
    );

    return asset;
  },

  async createTextAsset(data: {
    projectId: string;
    title: string;
    content: string;
    notes?: string;
  }): Promise<Asset> {
    const content = `# ${data.title}\n\n${data.content}`;
    const buffer = Buffer.from(content, 'utf8');
    const storageKey = `projects/${data.projectId}/assets/${uuid()}.txt`;

    await storage.save(storageKey, buffer, 'text/plain');

    const asset = await assetRepo.create({
      projectId: data.projectId,
      type: 'text',
      source: 'manual_text',
      fileName: `${data.title}.txt`,
      mimeType: 'text/plain',
      byteSize: buffer.byteLength,
      storageKey,
      notes: data.notes,
    });

    // Store content as summary immediately
    await assetRepo.update(asset.id, { summary: data.content.substring(0, 500) });

    // Trigger analysis
    this.analyzeAsset({ ...asset, storageKey }).catch((err) =>
      console.error(`[AssetService] Analysis failed for ${asset.id}:`, err.message)
    );

    return asset;
  },

  async analyzeAsset(asset: Asset): Promise<AssetAnalysis | null> {
    await assetRepo.updateAnalysisStatus(asset.id, 'running');

    let analysis: AssetAnalysis | null = null;

    try {
      if (asset.type === 'image') {
        analysis = await this.analyzeImage(asset);
      } else if (asset.type === 'text') {
        analysis = await this.analyzeText(asset);
      } else {
        await assetRepo.updateAnalysisStatus(asset.id, 'not_started');
        return null;
      }

      await assetRepo.updateAnalysisStatus(asset.id, 'completed');
      await assetRepo.updateStatus(asset.id, 'ready');

      // Auto-create events from analysis
      if (analysis?.structuredData?.suggestedEvents) {
        await this.createEventsFromAnalysis(asset.projectId, asset.id, analysis.structuredData);
      }

      return analysis;
    } catch (err) {
      await assetRepo.updateAnalysisStatus(asset.id, 'failed');
      throw err;
    }
  },

  async analyzeImage(asset: Asset): Promise<AssetAnalysis> {
    if (!asset.storageKey) throw new Error('Asset has no storage key');

    const buffer = await storage.getBuffer(asset.storageKey);
    const imageBase64 = buffer.toString('base64');

    const analysisRecord = await assetRepo.createAnalysis({
      assetId: asset.id,
      projectId: asset.projectId,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      taskType: 'image_understanding',
    });

    const rawText = await aiGateway.analyzeImage({
      imageBase64,
      mimeType: asset.mimeType ?? 'image/jpeg',
      prompt: IMAGE_ANALYSIS_PROMPT,
    });

    const structuredData = this.parseJsonSafe(rawText);

    await assetRepo.completeAnalysis(analysisRecord.id, {
      rawText,
      structuredData,
      confidenceScore: 0.8,
    });

    if (structuredData?.summary) {
      await assetRepo.update(asset.id, { summary: structuredData.summary });
    }

    return { ...analysisRecord, rawText, structuredData, status: 'completed' };
  },

  async analyzeText(asset: Asset): Promise<AssetAnalysis> {
    if (!asset.storageKey) throw new Error('Asset has no storage key');

    const buffer = await storage.getBuffer(asset.storageKey);
    const textContent = buffer.toString('utf8');

    const analysisRecord = await assetRepo.createAnalysis({
      assetId: asset.id,
      projectId: asset.projectId,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      taskType: 'text_analysis',
    });

    const rawText = await aiGateway.generateText({
      prompt: TEXT_ANALYSIS_PROMPT + textContent,
    });

    const structuredData = this.parseJsonSafe(rawText);

    await assetRepo.completeAnalysis(analysisRecord.id, {
      rawText,
      structuredData,
      confidenceScore: 0.85,
    });

    return { ...analysisRecord, rawText, structuredData, status: 'completed' };
  },

  async createEventsFromAnalysis(
    projectId: string,
    assetId: string,
    data: AssetAnalysisStructuredData
  ): Promise<Event[]> {
    const events: Event[] = [];

    for (const suggested of data.suggestedEvents ?? []) {
      let startAt: Date | undefined;
      if (suggested.timeHint) {
        const yearMatch = suggested.timeHint.match(/\d{4}/);
        if (yearMatch) {
          startAt = new Date(`${yearMatch[0]}-01-01`);
        }
      }

      const event = await eventRepo.create({
        projectId,
        title: suggested.title,
        summary: suggested.summary,
        startAt,
        timePrecision: startAt ? 'year' : 'unknown',
        locationText: suggested.locationHint,
        participants: suggested.participants,
        emotionTags: suggested.emotionTags,
        sourceType: 'ai_generated',
        confidenceScore: 0.75,
      });

      await eventRepo.linkAssets(event.id, [assetId]);
      events.push(event);
    }

    return events;
  },

  parseJsonSafe(text: string): AssetAnalysisStructuredData | undefined {
    try {
      // Strip markdown code blocks if present
      const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return undefined;
    }
  },

  getFileUrl(storageKey: string): string {
    return storage.getUrl(storageKey);
  },
};
