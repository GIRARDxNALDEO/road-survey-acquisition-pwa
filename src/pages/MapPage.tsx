import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MapView } from '../components/MapView';
import { useAppState } from '../app/store';
import { db } from '../db/schema';
import { getSessionPoints } from '../services/storage';
import type { GpsPointRecord } from '../types/gps';
import { computeDistanceMeters } from '../utils/geo';

export function MapPage() {
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().toArray(), []);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [points, setPoints] = useState<GpsPointRecord[]>([]);
  const { currentGps } = useAppState();

  useEffect(() => {
    if (!sessions?.length) return;
    setSelectedSessionId((current) => current ?? sessions[0].id);
  }, [sessions]);

  useEffect(() => {
    if (!selectedSessionId) {
      setPoints([]);
      return;
    }
    void getSessionPoints(selectedSessionId).then(setPoints);
  }, [selectedSessionId]);

  const distanceKm = computeDistanceMeters(points) / 1000;

  return (
    <div className="stack-gap page-grid">
      <section className="panel stack-gap">
        <div className="row-between">
          <div>
            <p className="eyebrow">Couverture</p>
            <h2>Rues déjà numérisées</h2>
          </div>
          <select
            className="select"
            value={selectedSessionId ?? ''}
            onChange={(event) => setSelectedSessionId(event.target.value)}
          >
            {sessions?.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>
        <div className="compact-grid two-columns">
          <div>
            <p className="label">Distance estimée</p>
            <strong>{distanceKm.toFixed(2)} km</strong>
          </div>
          <div>
            <p className="label">Points GPS</p>
            <strong>{points.length}</strong>
          </div>
        </div>
      </section>
      <MapView points={points} current={currentGps ? { lat: currentGps.lat, lon: currentGps.lon } : null} />
      <section className="panel">
        <p className="muted">
          La carte affiche la session sélectionnée. Le fond cartographique nécessite une connexion, mais les
          traces locales restent conservées hors ligne dans IndexedDB.
        </p>
      </section>
    </div>
  );
}
