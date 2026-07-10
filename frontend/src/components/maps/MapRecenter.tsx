/**
 * MapRecenter — imperatively re-centres a Leaflet MapContainer whenever
 * `center` changes, using a smooth flyTo animation.
 *
 * Must be rendered inside a <MapContainer> so it can call `useMap()`.
 * Returns null — no DOM output.
 *
 * @param center  [lat, lng] target coordinates
 * @param zoom    Optional zoom level (defaults to current map zoom)
 */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapRecenterProps {
  center: [number, number];
  zoom?: number;
}

function MapRecenter({ center, zoom }: MapRecenterProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom ?? map.getZoom(), {
      animate: true,
      duration: 1.4, // seconds
    });
  }, [map, center, zoom]);

  return null;
}

export default MapRecenter;
