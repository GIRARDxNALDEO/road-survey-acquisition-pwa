import type { CurrentPositionState } from '../types/gps';

export function GpsStatus({ gps, error }: { gps: CurrentPositionState | null; error: string | null }) {
  const qualityLabel = !gps
    ? 'Absent'
    : gps.accuracyM <= 8
      ? 'Très bon'
      : gps.accuracyM <= 20
        ? 'Correct'
        : 'Faible';

  return (
    <section className="panel compact-grid">
      <div>
        <p className="label">GPS</p>
        <strong>{qualityLabel}</strong>
        <p className="muted">{error ?? 'Signal actif'}</p>
      </div>
      <div>
        <p className="label">Latitude</p>
        <strong>{gps?.lat?.toFixed(6) ?? '—'}</strong>
      </div>
      <div>
        <p className="label">Longitude</p>
        <strong>{gps?.lon?.toFixed(6) ?? '—'}</strong>
      </div>
      <div>
        <p className="label">Précision</p>
        <strong>{gps ? `${gps.accuracyM.toFixed(1)} m` : '—'}</strong>
      </div>
    </section>
  );
}
