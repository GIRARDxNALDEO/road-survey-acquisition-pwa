export interface GpsPointRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  lat: number;
  lon: number;
  accuracyM: number;
  altitudeM?: number | null;
  speedMS?: number | null;
  headingDeg?: number | null;
}

export interface CurrentPositionState {
  lat: number;
  lon: number;
  accuracyM: number;
  altitudeM?: number | null;
  speedMS?: number | null;
  headingDeg?: number | null;
  timestamp: string;
}
