import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
// leaflet.heat is a UMD bundle that mutates L — import as a side-effect
import 'leaflet.heat/dist/leaflet-heat.js';

interface MapHeatmapLayerProps {
  /** Each point: [lat, lng, intensity (0–1)] */
  points: [number, number, number][];
}

type LeafletWithHeat = typeof L & {
  heatLayer: (
    points: [number, number, number][],
    options?: object,
  ) => L.Layer;
};

/**
 * MapHeatmapLayer — renders a leaflet.heat heatmap layer inside an existing
 * Leaflet MapContainer. The gradient goes from teal (low density) through
 * amber to rose (high density) to match the CivicAI colour palette.
 */
function MapHeatmapLayer({ points }: MapHeatmapLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const heat = (L as LeafletWithHeat).heatLayer(points, {
      radius: 36,
      blur: 20,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: 'rgba(0,0,0,0)',
        0.2: 'rgba(34,211,238,0.6)',   // cyan-400 — low density
        0.4: 'rgba(16,185,129,0.7)',   // emerald-500
        0.6: 'rgba(245,158,11,0.8)',   // amber-500 — medium
        0.8: 'rgba(249,115,22,0.85)',  // orange-500 — high
        1.0: 'rgba(244,63,94,0.9)',    // rose-500 — critical
      },
    });

    heat.addTo(map);
    layerRef.current = heat;

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default MapHeatmapLayer;
