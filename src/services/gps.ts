import type { CurrentPositionState } from '../types/gps';

export interface GpsWatcherHandle {
  stop: () => void;
}

export function watchGps(
  highAccuracy: boolean,
  onUpdate: (position: CurrentPositionState) => void,
  onError: (message: string) => void
): GpsWatcherHandle {
  if (!('geolocation' in navigator)) {
    onError('La géolocalisation n\'est pas disponible sur cet appareil.');
    return { stop: () => undefined };
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracyM: position.coords.accuracy,
        altitudeM: position.coords.altitude,
        speedMS: position.coords.speed,
        headingDeg: position.coords.heading,
        timestamp: new Date(position.timestamp).toISOString()
      });
    },
    (error) => onError(error.message),
    {
      enableHighAccuracy: highAccuracy,
      maximumAge: 1000,
      timeout: 15000
    }
  );

  return {
    stop: () => navigator.geolocation.clearWatch(watchId)
  };
}
