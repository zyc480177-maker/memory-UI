import { query, queryOne } from '../db';
import { Event, EventAssetLink } from '../../core/models/domain';

function toEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    title: row.title as string,
    summary: row.summary as string | undefined,
    description: row.description as string | undefined,
    startAt: row.start_at ? new Date(row.start_at as string) : undefined,
    endAt: row.end_at ? new Date(row.end_at as string) : undefined,
    timePrecision: row.time_precision as Event['timePrecision'],
    locationText: row.location_text as string | undefined,
    participants: row.participants as string[] | undefined,
    emotionTags: row.emotion_tags as string[] | undefined,
    sourceType: row.source_type as Event['sourceType'],
    status: row.status as Event['status'],
    confidenceScore: row.confidence_score as number | undefined,
    timelineOrderHint: row.timeline_order_hint as number | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export const eventRepo = {
  async findByProject(projectId: string, status?: Event['status']): Promise<Event[]> {
    if (status) {
      const rows = await query(
        'SELECT * FROM events WHERE project_id = $1 AND status = $2 ORDER BY timeline_order_hint, start_at, created_at',
        [projectId, status]
      );
      return rows.map(toEvent);
    }
    const rows = await query(
      `SELECT * FROM events WHERE project_id = $1 AND status != 'archived'
       ORDER BY timeline_order_hint NULLS LAST, start_at NULLS LAST, created_at`,
      [projectId]
    );
    return rows.map(toEvent);
  },

  async findById(id: string): Promise<Event | null> {
    const row = await queryOne('SELECT * FROM events WHERE id = $1', [id]);
    return row ? toEvent(row) : null;
  },

  async create(data: {
    projectId: string;
    title: string;
    summary?: string;
    description?: string;
    startAt?: Date;
    timePrecision?: Event['timePrecision'];
    locationText?: string;
    participants?: string[];
    emotionTags?: string[];
    sourceType?: Event['sourceType'];
    confidenceScore?: number;
    timelineOrderHint?: number;
  }): Promise<Event> {
    const row = await queryOne(
      `INSERT INTO events
         (project_id, title, summary, description, start_at, time_precision, location_text,
          participants, emotion_tags, source_type, confidence_score, timeline_order_hint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        data.projectId,
        data.title,
        data.summary ?? null,
        data.description ?? null,
        data.startAt ?? null,
        data.timePrecision ?? 'unknown',
        data.locationText ?? null,
        data.participants ?? null,
        data.emotionTags ?? null,
        data.sourceType ?? 'ai_generated',
        data.confidenceScore ?? null,
        data.timelineOrderHint ?? null,
      ]
    );
    return toEvent(row!);
  },

  async update(id: string, data: Partial<Pick<Event, 'title' | 'summary' | 'description' | 'startAt' | 'timePrecision' | 'locationText' | 'participants' | 'emotionTags' | 'status' | 'timelineOrderHint'>>): Promise<Event | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.summary !== undefined) { fields.push(`summary = $${idx++}`); values.push(data.summary); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.startAt !== undefined) { fields.push(`start_at = $${idx++}`); values.push(data.startAt); }
    if (data.timePrecision !== undefined) { fields.push(`time_precision = $${idx++}`); values.push(data.timePrecision); }
    if (data.locationText !== undefined) { fields.push(`location_text = $${idx++}`); values.push(data.locationText); }
    if (data.participants !== undefined) { fields.push(`participants = $${idx++}`); values.push(data.participants); }
    if (data.emotionTags !== undefined) { fields.push(`emotion_tags = $${idx++}`); values.push(data.emotionTags); }
    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }
    if (data.timelineOrderHint !== undefined) { fields.push(`timeline_order_hint = $${idx++}`); values.push(data.timelineOrderHint); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const row = await queryOne(
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${idx++} RETURNING *`,
      values
    );
    return row ? toEvent(row) : null;
  },

  async linkAssets(eventId: string, assetIds: string[]): Promise<void> {
    for (const assetId of assetIds) {
      await query(
        `INSERT INTO event_asset_links (event_id, asset_id, link_type)
         VALUES ($1, $2, 'evidence') ON CONFLICT DO NOTHING`,
        [eventId, assetId]
      );
    }
  },

  async getAssetIds(eventId: string): Promise<string[]> {
    const rows = await query<{ asset_id: string }>(
      'SELECT asset_id FROM event_asset_links WHERE event_id = $1',
      [eventId]
    );
    return rows.map((r) => r.asset_id);
  },
};
