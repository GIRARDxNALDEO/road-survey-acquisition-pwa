import type { SessionRecord } from '../types/session';
import { formatDateTime, formatDuration } from '../utils/time';

export function SessionCard({
  session,
  onExport,
  onDelete
}: {
  session: SessionRecord;
  onExport: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}) {
  return (
    <article className="panel stack-gap">
      <div className="row-between">
        <div>
          <h3>{session.name}</h3>
          <p className="muted">{formatDateTime(session.startedAt)}</p>
        </div>
        <span className={`pill status-${session.status}`}>{session.status}</span>
      </div>
      <div className="compact-grid two-columns">
        <div>
          <p className="label">Durée</p>
          <strong>{formatDuration(session.startedAt, session.endedAt)}</strong>
        </div>
        <div>
          <p className="label">Images</p>
          <strong>{session.frameCount}</strong>
        </div>
        <div>
          <p className="label">Points GPS</p>
          <strong>{session.pointCount}</strong>
        </div>
        <div>
          <p className="label">Cadence</p>
          <strong>{session.fpsTarget} fps</strong>
        </div>
      </div>
      <div className="controls-grid compact">
        <button className="button ghost" onClick={() => onExport(session.id)}>
          Export JSON
        </button>
        <button className="button danger" onClick={() => onDelete(session.id)}>
          Supprimer
        </button>
      </div>
    </article>
  );
}
