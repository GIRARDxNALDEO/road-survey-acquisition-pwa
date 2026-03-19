import { useAppState } from '../app/store';
import type { AppSettings } from '../types/settings';

function update<K extends keyof AppSettings>(
  current: AppSettings,
  key: K,
  value: AppSettings[K],
  apply: (next: AppSettings) => void
) {
  apply({ ...current, [key]: value });
}

export function SettingsPage() {
  const { settings, setSettings } = useAppState();

  return (
    <div className="stack-gap page-grid">
      <section className="panel stack-gap">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>Réglages terrain</h2>
        </div>
        <label className="field">
          <span>Cadence d&apos;acquisition</span>
          <select
            className="select"
            value={settings.fps}
            onChange={(event) => update(settings, 'fps', Number(event.target.value) as AppSettings['fps'], setSettings)}
          >
            <option value={1}>1 fps</option>
            <option value={2}>2 fps</option>
            <option value={5}>5 fps</option>
          </select>
        </label>
        <label className="field">
          <span>Qualité JPEG ({Math.round(settings.jpegQuality * 100)} %)</span>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.01"
            value={settings.jpegQuality}
            onChange={(event) => update(settings, 'jpegQuality', Number(event.target.value), setSettings)}
          />
        </label>
        <label className="field checkbox-field">
          <input
            type="checkbox"
            checked={settings.highAccuracyGps}
            onChange={(event) => update(settings, 'highAccuracyGps', event.target.checked, setSettings)}
          />
          <span>Activer le GPS haute précision</span>
        </label>
        <label className="field checkbox-field">
          <input
            type="checkbox"
            checked={settings.liveTrace}
            onChange={(event) => update(settings, 'liveTrace', event.target.checked, setSettings)}
          />
          <span>Afficher la trace en direct sur la carte</span>
        </label>
      </section>
      <section className="panel">
        <p className="muted">
          Dans ce MVP, les réglages sont conservés en mémoire tant que l&apos;application reste ouverte. La persistance locale
          des préférences peut être ajoutée ensuite dans IndexedDB ou localStorage.
        </p>
      </section>
    </div>
  );
}
