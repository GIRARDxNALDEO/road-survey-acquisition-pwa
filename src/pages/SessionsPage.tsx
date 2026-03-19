import { useLiveQuery } from 'dexie-react-hooks';
import { SessionCard } from '../components/SessionCard';
import { db } from '../db/schema';
import { deleteSessionCascade } from '../services/storage';
import { exportSessionMetadata } from '../services/export';

export function SessionsPage() {
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().toArray(), []);

  return (
    <div className="stack-gap page-grid">
      <section className="panel">
        <p className="eyebrow">Historique</p>
        <h2>Sessions locales</h2>
        <p className="muted">
          Exporte le JSON de métadonnées d&apos;une session ou supprime-la localement. L&apos;export des blobs JPEG peut être
          ajouté dans une itération suivante.
        </p>
      </section>
      {sessions?.length ? (
        sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onExport={(sessionId) => void exportSessionMetadata(sessionId)}
            onDelete={(sessionId) => void deleteSessionCascade(sessionId)}
          />
        ))
      ) : (
        <section className="panel">
          <p className="muted">Aucune session enregistrée pour le moment.</p>
        </section>
      )}
    </div>
  );
}
