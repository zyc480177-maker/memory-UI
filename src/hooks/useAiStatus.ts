import { useEffect, useState } from 'react';
import { systemApi } from '../api';

// Module-level cache so we only hit /health once per session.
let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

function fetchAiStatus(): Promise<boolean> {
  if (cached !== null) return Promise.resolve(cached);
  if (!inflight) {
    inflight = systemApi.health()
      .then((h) => { cached = h.aiConfigured; return cached; })
      .catch(() => { cached = false; return false; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

/**
 * Returns whether the backend has an AI provider key configured.
 * `null` while loading. Result is cached for the session.
 */
export function useAiStatus(): boolean | null {
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(cached);

  useEffect(() => {
    let active = true;
    fetchAiStatus().then((v) => { if (active) setAiConfigured(v); });
    return () => { active = false; };
  }, []);

  return aiConfigured;
}
