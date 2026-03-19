export interface FrameRecord {
  id: string;
  sessionId: string;
  frameIndex: number;
  capturedAt: string;
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  lat?: number;
  lon?: number;
  accuracyM?: number;
  altitudeM?: number | null;
  speedMS?: number | null;
  headingDeg?: number | null;
  gpsTimestamp?: string;
}
