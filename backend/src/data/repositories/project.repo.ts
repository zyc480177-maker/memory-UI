import { query, queryOne } from '../db';
import { Project, SubjectProfile } from '../../core/models/domain';

function toProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    ownerUserId: row.owner_user_id as string,
    title: row.title as string,
    subtitle: row.subtitle as string | undefined,
    description: row.description as string | undefined,
    coverAssetId: row.cover_asset_id as string | undefined,
    primarySubjectId: row.primary_subject_id as string | undefined,
    status: row.status as Project['status'],
    phase: row.phase as Project['phase'],
    defaultNarrativeVoice: row.default_narrative_voice as Project['defaultNarrativeVoice'],
    targetAudience: row.target_audience as Project['targetAudience'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function toSubject(row: Record<string, unknown>): SubjectProfile {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    fullName: row.full_name as string,
    displayName: row.display_name as string | undefined,
    relationshipToOwner: row.relationship_to_owner as SubjectProfile['relationshipToOwner'],
    gender: row.gender as SubjectProfile['gender'],
    birthYear: row.birth_year as number | undefined,
    birthDatePrecision: row.birth_date_precision as SubjectProfile['birthDatePrecision'],
    lifeSummary: row.life_summary as string | undefined,
    narrativeVoicePreference: row.narrative_voice_preference as SubjectProfile['narrativeVoicePreference'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export const projectRepo = {
  async findByOwner(ownerUserId: string): Promise<Project[]> {
    const rows = await query(
      'SELECT * FROM projects WHERE owner_user_id = $1 AND status != $2 ORDER BY updated_at DESC',
      [ownerUserId, 'archived']
    );
    return rows.map(toProject);
  },

  async findById(id: string, ownerUserId: string): Promise<Project | null> {
    const row = await queryOne(
      'SELECT * FROM projects WHERE id = $1 AND owner_user_id = $2',
      [id, ownerUserId]
    );
    return row ? toProject(row) : null;
  },

  async create(data: {
    ownerUserId: string;
    title: string;
    subtitle?: string;
    description?: string;
    defaultNarrativeVoice?: Project['defaultNarrativeVoice'];
    targetAudience?: Project['targetAudience'];
  }): Promise<Project> {
    const row = await queryOne(
      `INSERT INTO projects (owner_user_id, title, subtitle, description, default_narrative_voice, target_audience)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.ownerUserId,
        data.title,
        data.subtitle ?? null,
        data.description ?? null,
        data.defaultNarrativeVoice ?? 'first_person',
        data.targetAudience ?? 'self',
      ]
    );
    return toProject(row!);
  },

  async update(id: string, ownerUserId: string, data: Partial<{
    title: string;
    subtitle: string;
    description: string;
    phase: Project['phase'];
    status: Project['status'];
    coverAssetId: string;
    primarySubjectId: string;
  }>): Promise<Project | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.subtitle !== undefined) { fields.push(`subtitle = $${idx++}`); values.push(data.subtitle); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.phase !== undefined) { fields.push(`phase = $${idx++}`); values.push(data.phase); }
    if (data.status !== undefined) { fields.push(`status = $${idx++}`); values.push(data.status); }
    if (data.coverAssetId !== undefined) { fields.push(`cover_asset_id = $${idx++}`); values.push(data.coverAssetId); }
    if (data.primarySubjectId !== undefined) { fields.push(`primary_subject_id = $${idx++}`); values.push(data.primarySubjectId); }

    if (fields.length === 0) return this.findById(id, ownerUserId);

    fields.push(`updated_at = NOW()`);
    values.push(id, ownerUserId);

    const row = await queryOne(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${idx++} AND owner_user_id = $${idx++} RETURNING *`,
      values
    );
    return row ? toProject(row) : null;
  },

  // Subject Profile
  async createSubject(data: {
    projectId: string;
    fullName: string;
    displayName?: string;
    relationshipToOwner?: SubjectProfile['relationshipToOwner'];
    gender?: SubjectProfile['gender'];
    birthYear?: number;
    lifeSummary?: string;
    narrativeVoicePreference?: SubjectProfile['narrativeVoicePreference'];
  }): Promise<SubjectProfile> {
    const row = await queryOne(
      `INSERT INTO subject_profiles
         (project_id, full_name, display_name, relationship_to_owner, gender, birth_year, life_summary, narrative_voice_preference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        data.projectId,
        data.fullName,
        data.displayName ?? null,
        data.relationshipToOwner ?? 'self',
        data.gender ?? 'unknown',
        data.birthYear ?? null,
        data.lifeSummary ?? null,
        data.narrativeVoicePreference ?? 'first_person',
      ]
    );
    return toSubject(row!);
  },

  async findSubject(projectId: string): Promise<SubjectProfile | null> {
    const row = await queryOne('SELECT * FROM subject_profiles WHERE project_id = $1 LIMIT 1', [projectId]);
    return row ? toSubject(row) : null;
  },

  async updateSubject(id: string, data: Partial<Omit<SubjectProfile, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>): Promise<SubjectProfile | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.fullName !== undefined) { fields.push(`full_name = $${idx++}`); values.push(data.fullName); }
    if (data.displayName !== undefined) { fields.push(`display_name = $${idx++}`); values.push(data.displayName); }
    if (data.relationshipToOwner !== undefined) { fields.push(`relationship_to_owner = $${idx++}`); values.push(data.relationshipToOwner); }
    if (data.gender !== undefined) { fields.push(`gender = $${idx++}`); values.push(data.gender); }
    if (data.birthYear !== undefined) { fields.push(`birth_year = $${idx++}`); values.push(data.birthYear); }
    if (data.lifeSummary !== undefined) { fields.push(`life_summary = $${idx++}`); values.push(data.lifeSummary); }
    if (data.narrativeVoicePreference !== undefined) { fields.push(`narrative_voice_preference = $${idx++}`); values.push(data.narrativeVoicePreference); }

    if (fields.length === 0) {
      const row = await queryOne('SELECT * FROM subject_profiles WHERE id = $1', [id]);
      return row ? toSubject(row) : null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const row = await queryOne(
      `UPDATE subject_profiles SET ${fields.join(', ')} WHERE id = $${idx++} RETURNING *`,
      values
    );
    return row ? toSubject(row) : null;
  },
};
