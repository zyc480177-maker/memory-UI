// Frontend domain types — mirrors backend/src/core/models/domain.ts

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  lastLoginAt?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface SubjectProfile {
  id: string;
  projectId: string;
  fullName: string;
  displayName?: string;
  relationshipToOwner: 'self' | 'parent' | 'grandparent' | 'spouse' | 'child' | 'other';
  gender: 'unknown' | 'male' | 'female' | 'other';
  birthYear?: number;
  lifeSummary?: string;
  narrativeVoicePreference: 'first_person' | 'third_person';
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  type: 'image' | 'audio' | 'text' | 'video_reserved';
  source: 'upload' | 'recording' | 'manual_text';
  fileName?: string;
  mimeType?: string;
  byteSize?: number;
  storageKey?: string;
  status: 'pending_upload' | 'uploaded' | 'processing' | 'ready' | 'failed' | 'deleted';
  captureTime?: string;
  locationText?: string;
  summary?: string;
  notes?: string;
  analysisStatus: 'not_started' | 'queued' | 'running' | 'completed' | 'failed';
  url?: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface AssetAnalysis {
  id: string;
  assetId: string;
  provider: string;
  model: string;
  taskType: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  rawText?: string;
  structuredData?: AssetAnalysisStructuredData;
  confidenceScore?: number;
  createdAt: string;
}

export interface Event {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  description?: string;
  startAt?: string;
  timePrecision?: 'year' | 'month' | 'day' | 'range' | 'unknown';
  locationText?: string;
  participants?: string[];
  emotionTags?: string[];
  sourceType: 'ai_generated' | 'manual' | 'merged';
  status: 'draft' | 'confirmed' | 'archived';
  confidenceScore?: number;
  timelineOrderHint?: number;
  assetIds?: string[];
  createdAt: string;
  updatedAt: string;
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
  eventIds?: string[];
  createdAt: string;
  updatedAt: string;
}
