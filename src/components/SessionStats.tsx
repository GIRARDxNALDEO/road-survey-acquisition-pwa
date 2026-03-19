interface SessionStatsProps {
  duration: string;
  frameCount: number;
  pointCount: number;
  fpsTarget: number;
  status: string;
}

export function SessionStats({ duration, frameCount, pointCount, fpsTarget, status }: SessionStatsProps) {
  return (
    <section className="panel compact-grid">
      <div>
        <p className="label">État</p>
        <strong>{status}</strong>
      </div>
      <div>
        <p className="label">Durée</p>
        <strong>{duration}</strong>
      </div>
      <div>
        <p className="label">Images</p>
        <strong>{frameCount}</strong>
      </div>
      <div>
        <p className="label">Points GPS</p>
        <strong>{pointCount}</strong>
      </div>
      <div>
        <p className="label">Cadence</p>
        <strong>{fpsTarget} fps</strong>
      </div>
    </section>
  );
}
