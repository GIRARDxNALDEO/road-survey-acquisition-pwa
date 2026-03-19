import { useEffect, useMemo, useRef } from 'react';
import maplibregl, { LngLatBoundsLike, Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GpsPointRecord } from '../types/gps';

interface MapViewProps {
  points: GpsPointRecord[];
  current?: { lat: number; lon: number } | null;
}

const STYLE_URL = 'https://demotiles.maplibre.org/style.json';

export function MapView({ points, current }: MapViewProps) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: points.length
        ? [
            {
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: points.map((point) => [point.lon, point.lat])
              },
              properties: {}
            }
          ]
        : []
    }),
    [points]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: current ? [current.lon, current.lat] : [2.3522, 48.8566],
      zoom: current ? 15 : 11
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    mapRef.current.on('load', () => {
      const map = mapRef.current;
      if (!map) return;

      map.addSource('track', {
        type: 'geojson',
        data: geojson
      });

      map.addLayer({
        id: 'track-line',
        type: 'line',
        source: 'track',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 5
        }
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [geojson, current]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource('track') as maplibregl.GeoJSONSource | undefined;
    source?.setData(geojson);

    if (points.length > 1) {
      const bounds = points.reduce(
        (acc, point) => acc.extend([point.lon, point.lat]),
        new maplibregl.LngLatBounds([points[0].lon, points[0].lat], [points[0].lon, points[0].lat])
      );
      map.fitBounds(bounds as LngLatBoundsLike, { padding: 28, maxZoom: 17, animate: true });
    } else if (current) {
      map.easeTo({ center: [current.lon, current.lat], zoom: 15, duration: 500 });
    }
  }, [points, current, geojson]);

  return <div ref={containerRef} className="map-shell panel" />;
}
