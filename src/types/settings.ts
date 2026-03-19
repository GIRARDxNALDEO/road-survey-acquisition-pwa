export interface AppSettings {
  fps: 1 | 2 | 5;
  jpegQuality: number;
  width: number;
  height: number;
  highAccuracyGps: boolean;
  liveTrace: boolean;
  storageWarningMb: number;
}

export const defaultSettings: AppSettings = {
  fps: 5,
  jpegQuality: 0.76,
  width: 1280,
  height: 720,
  highAccuracyGps: true,
  liveTrace: true,
  storageWarningMb: 750
};
