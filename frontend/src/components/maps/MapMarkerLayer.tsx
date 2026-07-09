import { MarkerClusterer, MarkerF } from '@react-google-maps/api';
import type { AdminMapComplaint } from '../../types/adminDashboard';
import { SEVERITY_COLORS } from '../../services/googleMaps/mapConfig';

interface MapMarkerLayerProps {
  complaints: AdminMapComplaint[];
  selectedId: string | null;
  onSelect: (complaint: AdminMapComplaint) => void;
}

/**
 * MapMarkerLayer — renders all complaint markers inside a `MarkerClusterer`.
 * Severity-coloured circle icons. Selected marker gets a larger scale + white
 * stroke highlight so it stands out clearly from the cluster.
 *
 * This component is purely presentational — all state lives in the parent.
 */
function MapMarkerLayer({ complaints, selectedId, onSelect }: MapMarkerLayerProps) {
  return (
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={48}
      minimumClusterSize={3}
      options={{
        styles: [
          {
            url: '',
            height: 40,
            width: 40,
            textColor: '#f8fafc',
            textSize: 12,
            backgroundPosition: '0 0',
          },
        ],
      }}
    >
      {(clusterer) => (
        <>
          {complaints.map((complaint) => {
            const isSelected = complaint.id === selectedId;
            const fillColor = SEVERITY_COLORS[complaint.severity];

            return (
              <MarkerF
                key={complaint.id}
                position={{ lat: complaint.latitude, lng: complaint.longitude }}
                clusterer={clusterer}
                title={`${complaint.reference} — ${complaint.category}`}
                onClick={() => onSelect(complaint)}
                zIndex={isSelected ? 100 : 1}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: isSelected ? 11 : 8,
                  fillColor,
                  fillOpacity: 1,
                  strokeColor: isSelected ? '#ffffff' : '#e2e8f0',
                  strokeWeight: isSelected ? 3 : 1.5,
                }}
              />
            );
          })}
        </>
      )}
    </MarkerClusterer>
  );
}

export default MapMarkerLayer;
