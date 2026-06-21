import { chapterRepo } from '../../data/repositories/chapter.repo';
import { eventRepo } from '../../data/repositories/event.repo';
import { aiGateway } from '../../external/ai/gateway';
import { Chapter, Event } from '../models/domain';

function buildChapterPrompt(events: Event[], narrativeVoice: string, subjectName: string): string {
  const voice = narrativeVoice === 'first_person' ? '第一人称（我）' : '第三人称';
  const eventSummaries = events
    .map((e, i) => `事件${i + 1}：${e.title}\n摘要：${e.summary ?? ''}\n时间：${e.startAt?.getFullYear() ?? '未知'}\n地点：${e.locationText ?? '未知'}\n参与者：${(e.participants ?? []).join('、') || '未知'}`)
    .join('\n\n');

  return `你是一位专业的回忆录撰写助手。
请根据以下人生事件，为"${subjectName}"撰写一段回忆录章节草稿。

要求：
- 使用${voice}叙述
- 语言温情、真实、有画面感
- 3-5段，每段100-200字
- 保留事件的真实细节
- 不要添加不在事件中的虚构内容
- 使用中文写作

事件信息：
${eventSummaries}

请直接输出章节正文，不需要标题：`;
}

export const chapterService = {
  async generateFromEvents(data: {
    projectId: string;
    title: string;
    eventIds: string[];
    narrativeVoice?: Chapter['narrativeVoice'];
    subjectName?: string;
  }): Promise<Chapter> {
    const events = await Promise.all(
      data.eventIds.map((id) => eventRepo.findById(id))
    );
    const validEvents = events.filter(Boolean) as Event[];

    if (validEvents.length === 0) {
      return chapterRepo.create({
        projectId: data.projectId,
        title: data.title,
        narrativeVoice: data.narrativeVoice ?? 'first_person',
      });
    }

    const prompt = buildChapterPrompt(
      validEvents,
      data.narrativeVoice ?? 'first_person',
      data.subjectName ?? '主人公'
    );

    let draftContent: string | undefined;
    try {
      draftContent = await aiGateway.generateText({ prompt, temperature: 0.8 });
    } catch (err) {
      console.error('[ChapterService] AI generation failed:', (err as Error).message);
    }

    const summary = validEvents.map((e) => e.title).join('、');
    const chapter = await chapterRepo.create({
      projectId: data.projectId,
      title: data.title,
      summary,
      narrativeVoice: data.narrativeVoice ?? 'first_person',
      draftContent,
    });

    await chapterRepo.linkEvents(chapter.id, data.eventIds);
    return chapter;
  },

  async exportHtml(projectId: string, title: string): Promise<string> {
    const chapters = await chapterRepo.findByProject(projectId);

    const chaptersHtml = chapters
      .map((ch) => {
        const content = ch.editedContent ?? ch.draftContent ?? '';
        const paragraphs = content
          .split(/\n+/)
          .filter((p) => p.trim())
          .map((p) => `<p>${p}</p>`)
          .join('\n');

        return `
<section class="chapter">
  <h2>${ch.title}</h2>
  ${ch.summary ? `<p class="summary"><em>${ch.summary}</em></p>` : ''}
  <div class="content">${paragraphs}</div>
</section>`;
      })
      .join('\n<hr>\n');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: "Noto Serif SC", "Source Han Serif", serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #FDFAF5; color: #2C2216; line-height: 1.9; }
    h1 { text-align: center; font-size: 2.5rem; color: #8B4513; margin-bottom: 0.5rem; }
    .subtitle { text-align: center; color: #8B4513; opacity: 0.7; margin-bottom: 4rem; }
    .chapter { margin: 3rem 0; }
    h2 { font-size: 1.5rem; color: #8B4513; border-bottom: 1px solid #DEB887; padding-bottom: 0.5rem; }
    .summary { color: #8B6914; font-style: italic; margin-bottom: 1.5rem; }
    p { text-indent: 2em; margin: 0.8em 0; }
    hr { border: none; border-top: 1px dashed #DEB887; margin: 3rem 0; }
    @media print { body { background: white; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="subtitle">— 一份珍贵的人生记录 —</p>
  ${chaptersHtml}
  <footer style="text-align:center; margin-top:4rem; color:#8B4513; opacity:0.5; font-size:0.8rem;">
    由 MEMOIRS 生成 · ${new Date().toLocaleDateString('zh-CN')}
  </footer>
</body>
</html>`;
  },
};
