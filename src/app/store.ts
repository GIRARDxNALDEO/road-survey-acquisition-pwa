import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CurrentPositionState } from '../types/gps';
import type { AppSettings } from '../types/settings';
import { defaultSettings } from '../types/settings';
import type { SessionRecord } from '../types/session';

interface AppState {
  activeSession: SessionRecord | null;
  setActiveSession: (session: SessionRecord | null) => void;
  currentGps: CurrentPositionState | null;
  setCurrentGps: (gps: CurrentPositionState | null) => void;
  gpsError: string | null;
  setGpsError: (error: string | null) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [currentGps, setCurrentGps] = useState<CurrentPositionState | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const value = useMemo(
    () => ({
      activeSession,
      setActiveSession,
      currentGps,
      setCurrentGps,
      gpsError,
      setGpsError,
      settings,
      setSettings
    }),
    [activeSession, currentGps, gpsError, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState doit être utilisé dans AppStateProvider');
  return context;
}
