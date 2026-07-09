import { HeatmapLayerF } from '@react-google-maps/api';

interface WeightedPoint {
  location: google.maps.LatLng;
  weight: number;
}

interface MapHeatmapLayerProps {
  points: WeightedPoint[];
}

/**
 * MapHeatmapLayer — renders a Google Maps `HeatmapLayerF` using pre-computed
 * weighted `LatLng` points. The gradient goes from teal (low density) through
 * amber to rose (high density) to match the CivicAI colour palette.
 *
 * Points are computed outside this component (via `useMemo` in the parent) to
 * avoid unnecessary recomputation on every render.
 */
function MapHeatmapLayer({ points }: MapHeatmapLayerProps) {
  return (
    <HeatmapLayerF
      data={points}
      options={{
        radius: 36,
        opacity: 0.7,
        gradient: [
          'rgba(0, 0, 0, 0)',
          'rgba(34, 211, 238, 0.6)',   // cyan-400 — low density
          'rgba(16, 185, 129, 0.7)',   // emerald-500
          'rgba(245, 158, 11, 0.8)',   // amber-500 — medium
          'rgba(249, 115, 22, 0.85)',  // orange-500 — high
          'rgba(244, 63, 94, 0.9)',    // rose-500 — critical density
        ],
      }}
    />
  );
}

export default MapHeatmapLayer;
