import { query, queryOne } from '../db';
import { Asset, AssetAnalysis } from '../../core/models/domain';

function toAsset(row: Record<string, unknown>): Asset {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    type: row.type as Asset['type'],
    source: row.source as Asset['source'],
    fileName: row.file_name as string | undefined,
    mimeType: row.mime_type as string | undefined,
    byteSize: row.byte_size as number | undefined,
    storageKey: row.storage_key as string | undefined,
    status: row.status as Asset['status'],
    captureTime: row.capture_time ? new Date(row.capture_time as string) : undefined,
    captureTimePrecision: row.capture_time_precision as Asset['captureTimePrecision'],
    locationText: row.location_text as string | undefined,
    summary: row.summary as string | undefined,
    notes: row.notes as string | undefined,
    analysisStatus: row.analysis_status as Asset['analysisStatus'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function toAnalysis(row: Record<string, unknown>): AssetAnalysis {
  return {
    id: row.id as string,
    assetId: row.asset_id as string,
    projectId: row.project_id as string,
    version: row.version as number,
    provider: row.provider as string,
    model: row.model as string,
    taskType: row.task_type as AssetAnalysis['taskType'],
    status: row.status as AssetAnalysis['status'],
    rawText: row.raw_text as string | undefined,
    structuredData: row.structured_data as AssetAnalysis['structuredData'],
    confidenceScore: row.confidence_score as number | undefined,
    errorCode: row.error_code as string | undefined,
    errorMessage: row.error_message as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export const assetRepo = {
  async findByProject(projectId: string): Promise<Asset[]> {
    const rows = await query(
      `SELECT * FROM assets WHERE project_id = $1 AND status != 'deleted' ORDER BY created_at DESC`,
      [projectId]
    );
    return rows.map(toAsset);
  },

  async findById(id: string): Promise<Asset | null> {
    const row = await queryOne('SELECT * FROM assets WHERE id = $1', [id]);
    return row ? toAsset(row) : null;
  },

  async create(data: {
    projectId: string;
    type: Asset['type'];
    source: Asset['source'];
    fileName?: string;
    mimeType?: string;
    byteSize?: number;
    storageKey?: string;
    captureTime?: Date;
    notes?: string;
  }): Promise<Asset> {
    const row = await queryOne(
      `INSERT INTO assets (project_id, type, source, file_name, mime_type, byte_size, storage_key, capture_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'uploaded') RETURNING *`,
      [
        data.projectId,
        data.type,
        data.source,
        data.fileName ?? null,
        data.mimeType ?? null,
        data.byteSize ?? null,
        data.storageKey ?? null,
        data.captureTime ?? null,
        data.notes ?? null,
      ]
    );
    return toAsset(row!);
  },

  async updateStatus(id: string, status: Asset['status']): Promise<void> {
    await query('UPDATE assets SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
  },

  async updateAnalysisStatus(id: string, analysisStatus: Asset['analysisStatus']): Promise<void> {
    await query('UPDATE assets SET analysis_status = $1, updated_at = NOW() WHERE id = $2', [analysisStatus, id]);
  },

  async update(id: string, data: Partial<Pick<Asset, 'summary' | 'notes' | 'locationText' | 'captureTime' | 'captureTimePrecision'>>): Promise<Asset | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.summary !== undefined) { fields.push(`summary = $${idx++}`); values.push(data.summary); }
    if (data.notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(data.notes); }
    if (data.locationText !== undefined) { fields.push(`location_text = $${idx++}`); values.push(data.locationText); }
    if (data.captureTime !== undefined) { fields.push(`capture_time = $${idx++}`); values.push(data.captureTime); }
    if (data.captureTimePrecision !== undefined) { fields.push(`capture_time_precision = $${idx++}`); values.push(data.captureTimePrecision); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const row = await queryOne(
      `UPDATE assets SET ${fields.join(', ')} WHERE id = $${idx++} RETURNING *`,
      values
    );
    return row ? toAsset(row) : null;
  },

  async createAnalysis(data: {
    assetId: string;
    projectId: string;
    provider: string;
    model: string;
    taskType: AssetAnalysis['taskType'];
  }): Promise<AssetAnalysis> {
    const maxVersionRow = await queryOne<{ max: number }>(
      'SELECT COALESCE(MAX(version), 0) as max FROM asset_analyses WHERE asset_id = $1',
      [data.assetId]
    );
    const version = (maxVersionRow?.max ?? 0) + 1;

    const row = await queryOne(
      `INSERT INTO asset_analyses (asset_id, project_id, version, provider, model, task_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'running') RETURNING *`,
      [data.assetId, data.projectId, version, data.provider, data.model, data.taskType]
    );
    return toAnalysis(row!);
  },

  async completeAnalysis(id: string, data: {
    rawText?: string;
    structuredData?: AssetAnalysis['structuredData'];
    confidenceScore?: number;
  }): Promise<void> {
    await query(
      `UPDATE asset_analyses SET status = 'completed', raw_text = $1, structured_data = $2,
       confidence_score = $3, updated_at = NOW() WHERE id = $4`,
      [data.rawText ?? null, JSON.stringify(data.structuredData ?? null), data.confidenceScore ?? null, id]
    );
  },

  async failAnalysis(id: string, errorCode: string, errorMessage: string): Promise<void> {
    await query(
      `UPDATE asset_analyses SET status = 'failed', error_code = $1, error_message = $2, updated_at = NOW() WHERE id = $3`,
      [errorCode, errorMessage, id]
    );
  },

  async getLatestAnalysis(assetId: string): Promise<AssetAnalysis | null> {
    const row = await queryOne(
      `SELECT * FROM asset_analyses WHERE asset_id = $1 AND status = 'completed'
       ORDER BY version DESC LIMIT 1`,
      [assetId]
    );
    return row ? toAnalysis(row) : null;
  },
};
