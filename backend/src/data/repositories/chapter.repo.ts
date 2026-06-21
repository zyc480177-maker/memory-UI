import { query, queryOne } from '../db';
import { Chapter } from '../../core/models/domain';

function toChapter(row: Record<string, unknown>): Chapter {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    title: row.title as string,
    subtitle: row.subtitle as string | undefined,
    summary: row.summary as string | undefined,
    sortOrder: row.sort_order as number,
    status: row.status as Chapter['status'],
    draftContent: row.draft_content as string | undefined,
    editedContent: row.edited_content as string | undefined,
    narrativeVoice: row.narrative_voice as Chapter['narrativeVoice'],
    wordCount: row.word_count as number,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export const chapterRepo = {
  async findByProject(projectId: string): Promise<Chapter[]> {
    const rows = await query(
      'SELECT * FROM chapters WHERE project_id = $1 ORDER BY sort_order, created_at',
      [projectId]
    );
    return rows.map(toChapter);
  },

  async findById(id: string): Promise<Chapter | null> {
    const row = await queryOne('SELECT * FROM chapters WHERE id = $1', [id]);
    return row ? toChapter(row) : null;
  },

  async getMaxSortOrder(projectId: string): Promise<number> {
    const row = await queryOne<{ max: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as max FROM chapters WHERE project_id = $1',
      [projectId]
    );
    return (row?.max ?? -1) + 1;
  },

  async create(data: {
    projectId: string;
    title: string;
    subtitle?: string;
    summary?: string;
    sortOrder?: number;
    narrativeVoice?: Chapter['narrativeVoice'];
    draftContent?: string;
  }): Promise<Chapter> {
    const sortOrder = data.sortOrder ?? (await this.getMaxSortOrder(data.projectId));
    const wordCount = data.draftContent ? data.draftContent.length : 0;

    const row = await queryOne(
      `INSERT INTO chapters (project_id, title, subtitle, summary, sort_order, narrative_voice, draft_content, status, word_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        data.projectId,
        data.title,
        data.subtitle ?? null,
        data.summary ?? null,
        sortOrder,
        data.narrativeVoice ?? 'first_person',
        data.draftContent ?? null,
        data.draftContent ? 'ai_draft' : 'outline',
        wordCount,
      ]
    );
    return toChapter(row!);
  },

  async update(id: string, data: Partial<Pick<Chapter, 'title' | 'subtitle' | 'summary' | 'status' | 'draftContent' | 'editedContent' | 'narrativeVoice' | 'sortOrder'>>): Promise<Chapter | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.subtitle !== undefined) { fields.push(`subtitle = $${idx++}`); values.push(data.subtitle); }
    if (data.summary !== undefined) { fields.push(`summary = $${idx++}`); values.push(data.summary); }
    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }
    if (data.draftContent !== undefined) {
      fields.push(`draft_content = $${idx++}`);
      values.push(data.draftContent);
    }
    if (data.editedContent !== undefined) {
      fields.push(`edited_content = $${idx++}`);
      values.push(data.editedContent);
      const wc = data.editedContent ? data.editedContent.length : 0;
      fields.push(`word_count = $${idx++}`);
      values.push(wc);
    }
    if (data.narrativeVoice !== undefined) { fields.push(`narrative_voice = $${idx++}`); values.push(data.narrativeVoice); }
    if (data.sortOrder !== undefined) { fields.push(`sort_order = $${idx++}`); values.push(data.sortOrder); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const row = await queryOne(
      `UPDATE chapters SET ${fields.join(', ')} WHERE id = $${idx++} RETURNING *`,
      values
    );
    return row ? toChapter(row) : null;
  },

  async linkEvents(chapterId: string, eventIds: string[]): Promise<void> {
    for (let i = 0; i < eventIds.length; i++) {
      await query(
        `INSERT INTO chapter_event_links (chapter_id, event_id, sort_order, role)
         VALUES ($1, $2, $3, 'primary') ON CONFLICT DO NOTHING`,
        [chapterId, eventIds[i], i]
      );
    }
  },

  async getEventIds(chapterId: string): Promise<string[]> {
    const rows = await query<{ event_id: string }>(
      'SELECT event_id FROM chapter_event_links WHERE chapter_id = $1 ORDER BY sort_order',
      [chapterId]
    );
    return rows.map((r) => r.event_id);
  },
};
