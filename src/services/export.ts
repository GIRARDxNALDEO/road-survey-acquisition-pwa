import { getSessionFrames, getSessionPoints } from './storage';
import { db } from '../db/schema';

function downloadText(filename: string, text: string, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportSessionMetadata(sessionId: string) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('Session introuvable.');
  const points = await getSessionPoints(sessionId);
  const frames = await getSessionFrames(sessionId);

  downloadText(
    `${session.name.replace(/\s+/g, '_').toLowerCase()}_metadata.json`,
    JSON.stringify({ session, points, frames: frames.map(({ blob, ...rest }) => rest) }, null, 2)
  );
}
