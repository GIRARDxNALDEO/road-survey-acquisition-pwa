import type { GpsPointRecord } from '../types/gps';

const EARTH_RADIUS_M = 6371000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistanceMeters(a: Pick<GpsPointRecord, 'lat' | 'lon'>, b: Pick<GpsPointRecord, 'lat' | 'lon'>) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function computeDistanceMeters(points: GpsPointRecord[]) {
  return points.slice(1).reduce((acc, point, index) => acc + haversineDistanceMeters(points[index], point), 0);
}
