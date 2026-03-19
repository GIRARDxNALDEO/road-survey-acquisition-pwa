export type SessionStatus = 'idle' | 'recording' | 'paused' | 'completed' | 'synced';

export interface SessionRecord {
  id: string;
  name: string;
  startedAt: string;
  endedAt?: string;
  status: SessionStatus;
  fpsTarget: number;
  imageQuality: number;
  notes?: string;
  frameCount: number;
  pointCount: number;
}
