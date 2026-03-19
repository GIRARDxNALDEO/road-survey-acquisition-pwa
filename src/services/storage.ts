import { db } from '../db/schema';
import type { FrameRecord } from '../types/frame';
import type { GpsPointRecord } from '../types/gps';
import type { SessionRecord } from '../types/session';

export async function createSession(session: SessionRecord) {
  await db.sessions.put(session);
}

export async function updateSession(id: string, patch: Partial<SessionRecord>) {
  await db.sessions.update(id, patch);
}

export async function addFrame(frame: FrameRecord) {
  await db.frames.put(frame);
}

export async function addGpsPoint(point: GpsPointRecord) {
  await db.gpsPoints.put(point);
}

export async function getSessionFrames(sessionId: string) {
  return db.frames.where('sessionId').equals(sessionId).sortBy('frameIndex');
}

export async function getSessionPoints(sessionId: string) {
  return db.gpsPoints.where('sessionId').equals(sessionId).sortBy('timestamp');
}

export async function deleteSessionCascade(sessionId: string) {
  await db.transaction('rw', db.sessions, db.frames, db.gpsPoints, async () => {
    await db.frames.where('sessionId').equals(sessionId).delete();
    await db.gpsPoints.where('sessionId').equals(sessionId).delete();
    await db.sessions.delete(sessionId);
  });
}

export async function estimateStorageUsageMb() {
  if (!('storage' in navigator) || !navigator.storage?.estimate) return undefined;
  const estimate = await navigator.storage.estimate();
  return {
    usedMb: (estimate.usage ?? 0) / 1024 / 1024,
    quotaMb: (estimate.quota ?? 0) / 1024 / 1024
  };
}
