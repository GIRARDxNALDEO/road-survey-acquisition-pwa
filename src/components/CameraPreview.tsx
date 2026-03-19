import { forwardRef } from 'react';

export const CameraPreview = forwardRef<HTMLVideoElement>(function CameraPreview(_, ref) {
  return (
    <div className="camera-shell panel">
      <div className="record-badge">REC</div>
      <video ref={ref} autoPlay playsInline muted className="camera-preview" />
    </div>
  );
});
