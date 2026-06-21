// Shared domain types — mirrors 02_DOMAIN_MODEL.md

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  status: 'pending' | 'active' | 'disabled';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  ownerUserId: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverAssetId?: string;
  primarySubjectId?: string;
  status: 'draft' | 'active' | 'archived';
  phase: 'collecting' | 'organizing' | 'writing' | 'exporting';
  defaultNarrativeVoice: 'first_person' | 'third_person';
  targetAudience: 'self' | 'family' | 'public_reserved';
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectProfile {
  id: string;
  projectId: string;
  fullName: string;
  displayName?: string;
  relationshipToOwner: 'self' | 'parent' | 'grandparent' | 'spouse' | 'child' | 'other';
  gender: 'unknown' | 'male' | 'female' | 'other';
  birthYear?: number;
  birthDatePrecision: 'year' | 'month' | 'day' | 'unknown';
  lifeSummary?: string;
  narrativeVoicePreference: 'first_person' | 'third_person';
  createdAt: Date;
  updatedAt: Date;
}

export type AssetType = 'image' | 'audio' | 'text' | 'video_reserved';
export type AssetStatus = 'pending_upload' | 'uploaded' | 'processing' | 'ready' | 'failed' | 'deleted';
export type AnalysisStatus = 'not_started' | 'queued' | 'running' | 'completed' | 'failed';

export interface Asset {
  id: string;
  projectId: string;
  type: AssetType;
  source: 'upload' | 'recording' | 'manual_text';
  fileName?: string;
  mimeType?: string;
  byteSize?: number;
  storageKey?: string;
  status: AssetStatus;
  captureTime?: Date;
  captureTimePrecision?: 'year' | 'month' | 'day' | 'minute' | 'unknown';
  locationText?: string;
  summary?: string;
  notes?: string;
  analysisStatus: AnalysisStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetAnalysisStructuredData {
  people?: string[];
  timeHints?: string[];
  locationHints?: string[];
  summary?: string;
  mood?: string;
  keywords?: string[];
  suggestedEvents?: Array<{
    title: string;
    summary: string;
    timeHint?: string;
    locationHint?: string;
    participants?: string[];
    emotionTags?: string[];
  }>;
  transcription?: string;
}

export interface AssetAnalysis {
  id: string;
  assetId: string;
  projectId: string;
  version: number;
  provider: string;
  model: string;
  taskType: 'image_understanding' | 'audio_transcription' | 'structured_extraction' | 'text_analysis';
  status: 'queued' | 'running' | 'completed' | 'failed';
  rawText?: string;
  structuredData?: AssetAnalysisStructuredData;
  confidenceScore?: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  description?: string;
  startAt?: Date;
  endAt?: Date;
  timePrecision?: 'year' | 'month' | 'day' | 'range' | 'unknown';
  locationText?: string;
  participants?: string[];
  emotionTags?: string[];
  sourceType: 'ai_generated' | 'manual' | 'merged';
  status: 'draft' | 'confirmed' | 'archived';
  confidenceScore?: number;
  timelineOrderHint?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAssetLink {
  eventId: string;
  assetId: string;
  relevanceScore?: number;
  linkType: 'evidence' | 'primary_source' | 'supporting_material';
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  subtitle?: string;
  summary?: string;
  sortOrder: number;
  status: 'outline' | 'ai_draft' | 'owner_editing' | 'finalized';
  draftContent?: string;
  editedContent?: string;
  narrativeVoice: 'first_person' | 'third_person';
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterEventLink {
  chapterId: string;
  eventId: string;
  sortOrder: number;
  role: 'primary' | 'supporting';
}

export type JobType = 'asset_analysis' | 'event_generation' | 'chapter_generation' | 'export_generation';
export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  projectId: string;
  resourceType: 'asset' | 'event' | 'chapter' | 'export';
  resourceId: string;
  jobType: JobType;
  status: JobStatus;
  provider?: string;
  model?: string;
  attemptCount: number;
  startedAt?: Date;
  finishedAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  resultSummary?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportVersion {
  id: string;
  projectId: string;
  format: 'html' | 'pdf_reserved';
  status: 'queued' | 'running' | 'ready' | 'failed' | 'expired';
  downloadUrl?: string;
  storageKey?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
