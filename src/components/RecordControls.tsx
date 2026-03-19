interface RecordControlsProps {
  isRecording: boolean;
  hasSession: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function RecordControls({
  isRecording,
  hasSession,
  onStart,
  onPause,
  onResume,
  onStop
}: RecordControlsProps) {
  return (
    <div className="controls-grid">
      {!hasSession && (
        <button className="button primary" onClick={onStart}>
          Démarrer
        </button>
      )}
      {hasSession && isRecording && (
        <button className="button warning" onClick={onPause}>
          Pause
        </button>
      )}
      {hasSession && !isRecording && (
        <button className="button primary" onClick={onResume}>
          Reprendre
        </button>
      )}
      {hasSession && (
        <button className="button ghost" onClick={onStop}>
          Terminer
        </button>
      )}
    </div>
  );
}
