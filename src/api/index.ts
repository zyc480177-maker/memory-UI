import { api, setToken, clearToken, ApiError } from './client';
import type {
  AccountUser, Project, SubjectProfile, Asset, AssetAnalysis, Event, Chapter
} from '../types/domain';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  async login(email: string, password: string): Promise<{ user: AccountUser; token: string }> {
    const res = await api.post<{ user: AccountUser; token: string }>('/api/v1/auth/login', { email, password });
    setToken(res.token);
    return res;
  },

  async getMe(): Promise<AccountUser> {
    const res = await api.get<{ user: AccountUser }>('/api/v1/auth/me');
    return res.user;
  },

  logout(): void {
    clearToken();
  },
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  async list(): Promise<Project[]> {
    const res = await api.get<{ projects: Project[] }>('/api/v1/projects');
    return res.projects;
  },

  async get(id: string): Promise<{ project: Project; subject: SubjectProfile | null }> {
    return api.get(`/api/v1/projects/${id}`);
  },

  async create(data: {
    title: string;
    subtitle?: string;
    description?: string;
    defaultNarrativeVoice?: 'first_person' | 'third_person';
    subject?: {
      fullName: string;
      displayName?: string;
      relationshipToOwner?: SubjectProfile['relationshipToOwner'];
      gender?: SubjectProfile['gender'];
      birthYear?: number;
      lifeSummary?: string;
    };
  }): Promise<{ project: Project; subject: SubjectProfile | null }> {
    return api.post('/api/v1/projects', data);
  },

  async update(id: string, data: Partial<Pick<Project, 'title' | 'subtitle' | 'description' | 'phase' | 'status'>>): Promise<Project> {
    const res = await api.patch<{ project: Project }>(`/api/v1/projects/${id}`, data);
    return res.project;
  },

  async getSubject(projectId: string): Promise<SubjectProfile | null> {
    const res = await api.get<{ subject: SubjectProfile | null }>(`/api/v1/projects/${projectId}/subject`);
    return res.subject;
  },

  async upsertSubject(projectId: string, data: Partial<SubjectProfile>): Promise<SubjectProfile> {
    const res = await api.put<{ subject: SubjectProfile }>(`/api/v1/projects/${projectId}/subject`, data);
    return res.subject;
  },

  async exportHtml(projectId: string): Promise<Response> {
    const token = localStorage.getItem('memoirs_token');
    return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/projects/${projectId}/export`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// ─── Assets ───────────────────────────────────────────────────────────────────

export const assetsApi = {
  async list(projectId: string): Promise<Asset[]> {
    const res = await api.get<{ assets: Asset[] }>(`/api/v1/projects/${projectId}/assets`);
    return res.assets;
  },

  async uploadFile(projectId: string, file: File, meta?: { notes?: string; captureTime?: string }): Promise<Asset> {
    const form = new FormData();
    form.append('file', file);
    if (meta?.notes) form.append('notes', meta.notes);
    if (meta?.captureTime) form.append('captureTime', meta.captureTime);

    const res = await api.post<{ asset: Asset }>(`/api/v1/projects/${projectId}/assets/upload`, form);
    return res.asset;
  },

  async createText(projectId: string, data: { title: string; content: string; notes?: string }): Promise<Asset> {
    const res = await api.post<{ asset: Asset }>(`/api/v1/projects/${projectId}/assets/text`, data);
    return res.asset;
  },

  async get(projectId: string, assetId: string): Promise<{ asset: Asset; analysis: AssetAnalysis | null }> {
    return api.get(`/api/v1/projects/${projectId}/assets/${assetId}`);
  },

  async analyze(projectId: string, assetId: string): Promise<void> {
    await api.post(`/api/v1/projects/${projectId}/assets/${assetId}/analyze`);
  },
};

// ─── Events ───────────────────────────────────────────────────────────────────

export const eventsApi = {
  async list(projectId: string): Promise<Event[]> {
    const res = await api.get<{ events: Event[] }>(`/api/v1/projects/${projectId}/events`);
    return res.events;
  },

  async create(projectId: string, data: Partial<Event> & { title: string; assetIds?: string[] }): Promise<Event> {
    const res = await api.post<{ event: Event }>(`/api/v1/projects/${projectId}/events`, data);
    return res.event;
  },

  async update(projectId: string, eventId: string, data: Partial<Event>): Promise<Event> {
    const res = await api.patch<{ event: Event }>(`/api/v1/projects/${projectId}/events/${eventId}`, data);
    return res.event;
  },
};

// ─── Chapters ─────────────────────────────────────────────────────────────────

export const chaptersApi = {
  async list(projectId: string): Promise<Chapter[]> {
    const res = await api.get<{ chapters: Chapter[] }>(`/api/v1/projects/${projectId}/chapters`);
    return res.chapters;
  },

  async create(projectId: string, data: {
    title: string;
    eventIds?: string[];
    generateContent?: boolean;
    narrativeVoice?: 'first_person' | 'third_person';
  }): Promise<Chapter> {
    const res = await api.post<{ chapter: Chapter }>(`/api/v1/projects/${projectId}/chapters`, data);
    return res.chapter;
  },

  async update(projectId: string, chapterId: string, data: Partial<Chapter>): Promise<Chapter> {
    const res = await api.patch<{ chapter: Chapter }>(`/api/v1/projects/${projectId}/chapters/${chapterId}`, data);
    return res.chapter;
  },

  async regenerate(projectId: string, chapterId: string): Promise<Chapter> {
    const res = await api.post<{ chapter: Chapter }>(`/api/v1/projects/${projectId}/chapters/${chapterId}/regenerate`);
    return res.chapter;
  },
};

export { ApiError };
