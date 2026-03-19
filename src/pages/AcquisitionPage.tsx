import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CameraPreview } from '../components/CameraPreview';
import { GpsStatus } from '../components/GpsStatus';
import { RecordControls } from '../components/RecordControls';
import { SessionStats } from '../components/SessionStats';
import { startRearCamera, stopMediaStream } from '../services/camera';
import { captureVideoFrame } from '../services/capture';
import { watchGps } from '../services/gps';
import { addFrame, addGpsPoint, createSession, estimateStorageUsageMb, updateSession } from '../services/storage';
import { useAppState } from '../app/store';
import { createId } from '../utils/id';
import { formatDuration } from '../utils/time';
import { useTicker } from '../hooks/useTicker';
import { db } from '../db/schema';
import type { SessionRecord } from '../types/session';

export function AcquisitionPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const gpsWatcherRef = useRef<{ stop: () => void } | null>(null);
  const frameIndexRef = useRef(0);
  const activeSessionRef = useRef<SessionRecord | null>(null);
  const { activeSession, setActiveSession, currentGps, setCurrentGps, gpsError, setGpsError, settings } = useAppState();
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().toArray(), []);
  const latestSession = useMemo(() => sessions?.[0] ?? null, [sessions]);
  const tick = useTicker(1000);
  const [storageText, setStorageText] = useState('Calcul…');

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    void startPreview();

    gpsWatcherRef.current = watchGps(
      settings.highAccuracyGps,
      async (gps) => {
        setCurrentGps(gps);
        setGpsError(null);

        const currentSession = activeSessionRef.current;

        if (currentSession && currentSession.status === 'recording') {
          await addGpsPoint({
            id: createId('gps'),
            sessionId: currentSession.id,
            timestamp: gps.timestamp,
            lat: gps.lat,
            lon: gps.lon,
            accuracyM: gps.accuracyM,
            altitudeM: gps.altitudeM,
            speedMS: gps.speedMS,
            headingDeg: gps.headingDeg
          });

          const nextPointCount = currentSession.pointCount + 1;
          await updateSession(currentSession.id, {
            pointCount: nextPointCount
          });
          const updatedSession = { ...currentSession, pointCount: nextPointCount };
          activeSessionRef.current = updatedSession;
          setActiveSession(updatedSession);
        }
      },
      (message) => setGpsError(message)
    );

    void refreshStorage();

    return () => {
      gpsWatcherRef.current?.stop();
      stopCaptureTimer();
      stopMediaStream(streamRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'recording') {
      stopCaptureTimer();
      return;
    }

    const intervalMs = Math.round(1000 / settings.fps);
    captureTimerRef.current = window.setInterval(() => {
      void captureFrame();
    }, intervalMs);

    return stopCaptureTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.id, activeSession?.status, settings.fps, settings.jpegQuality, currentGps]);

  async function startPreview() {
    const stream = await startRearCamera(settings.width, settings.height);
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  }

  function stopCaptureTimer() {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
  }

  async function captureFrame() {
    if (!videoRef.current || !activeSession || activeSession.status !== 'recording') return;

    const frame = await captureVideoFrame(videoRef.current, settings.width, settings.height, settings.jpegQuality);
    frameIndexRef.current += 1;

    await addFrame({
      id: createId('frame'),
      sessionId: activeSession.id,
      frameIndex: frameIndexRef.current,
      capturedAt: new Date().toISOString(),
      blob: frame.blob,
      mimeType: frame.blob.type,
      width: frame.width,
      height: frame.height,
      lat: currentGps?.lat,
      lon: currentGps?.lon,
      accuracyM: currentGps?.accuracyM,
      altitudeM: currentGps?.altitudeM,
      speedMS: currentGps?.speedMS,
      headingDeg: currentGps?.headingDeg,
      gpsTimestamp: currentGps?.timestamp
    });

    const nextFrameCount = activeSession.frameCount + 1;
    await updateSession(activeSession.id, { frameCount: nextFrameCount });
    const updatedSession = { ...activeSession, frameCount: nextFrameCount };
    activeSessionRef.current = updatedSession;
    setActiveSession(updatedSession);
    void refreshStorage();
  }

  async function handleStart() {
    const session: SessionRecord = {
      id: createId('session'),
      name: `session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}`,
      startedAt: new Date().toISOString(),
      status: 'recording',
      fpsTarget: settings.fps,
      imageQuality: settings.jpegQuality,
      frameCount: 0,
      pointCount: 0,
      notes: ''
    };

    frameIndexRef.current = 0;
    await createSession(session);
    activeSessionRef.current = session;
    setActiveSession(session);
  }

  async function handlePause() {
    if (!activeSession) return;
    await updateSession(activeSession.id, { status: 'paused' });
    const updatedSession = { ...activeSession, status: 'paused' as const };
    activeSessionRef.current = updatedSession;
    setActiveSession(updatedSession);
  }

  async function handleResume() {
    if (!activeSession) return;
    await updateSession(activeSession.id, { status: 'recording' });
    const updatedSession = { ...activeSession, status: 'recording' as const };
    activeSessionRef.current = updatedSession;
    setActiveSession(updatedSession);
  }

  async function handleStop() {
    if (!activeSession) return;
    const endedAt = new Date().toISOString();
    await updateSession(activeSession.id, { status: 'completed', endedAt });
    const updatedSession = { ...activeSession, status: 'completed' as const, endedAt };
    activeSessionRef.current = updatedSession;
    setActiveSession(updatedSession);
    setTimeout(() => {
      activeSessionRef.current = null;
      setActiveSession(null);
    }, 250);
  }

  async function refreshStorage() {
    const estimate = await estimateStorageUsageMb();
    if (!estimate) {
      setStorageText('Indisponible');
      return;
    }
    setStorageText(`${estimate.usedMb.toFixed(1)} / ${estimate.quotaMb.toFixed(1)} Mo`);
  }

  const current = activeSession ?? latestSession;

  return (
    <div className="stack-gap page-grid">
      <CameraPreview ref={videoRef} />
      <RecordControls
        isRecording={activeSession?.status === 'recording'}
        hasSession={Boolean(activeSession)}
        onStart={() => void handleStart()}
        onPause={() => void handlePause()}
        onResume={() => void handleResume()}
        onStop={() => void handleStop()}
      />
      <SessionStats
        duration={current ? formatDuration(current.startedAt, current.endedAt) : formatDuration(undefined)}
        frameCount={current?.frameCount ?? 0}
        pointCount={current?.pointCount ?? 0}
        fpsTarget={current?.fpsTarget ?? settings.fps}
        status={activeSession?.status ?? latestSession?.status ?? 'idle'}
      />
      <GpsStatus gps={currentGps} error={gpsError} />
      <section className="panel compact-grid two-columns">
        <div>
          <p className="label">Capture</p>
          <strong>{activeSession?.status === 'recording' ? 'Active' : 'Arrêtée'}</strong>
          <p className="muted">Vue temps réel + acquisition terrain.</p>
        </div>
        <div>
          <p className="label">Stockage local</p>
          <strong>{storageText}</strong>
          <p className="muted">IndexedDB + mode hors ligne.</p>
        </div>
        <div>
          <p className="label">Horloge</p>
          <strong>{new Date(tick).toLocaleTimeString('fr-FR')}</strong>
        </div>
        <div>
          <p className="label">Qualité JPEG</p>
          <strong>{Math.round(settings.jpegQuality * 100)} %</strong>
        </div>
      </section>
    </div>
  );
}
