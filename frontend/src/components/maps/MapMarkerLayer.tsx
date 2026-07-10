import { useState } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import type { AdminMapComplaint } from '../../types/adminDashboard';
import { SEVERITY_COLORS, formatLabel } from '../../services/googleMaps/mapConfig';

interface MapMarkerLayerProps {
  complaints: AdminMapComplaint[];
  selectedId: string | null;
  onSelect: (complaint: AdminMapComplaint) => void;
}

/**
 * MapMarkerLayer — renders all complaint markers as Leaflet CircleMarkers.
 * Severity-coloured fill. Selected marker gets a larger radius + white stroke.
 * Clicking a marker fires onSelect; the Popup mirrors the MapInfoWindow content
 * inline (Leaflet Popups live in the same DOM context so Tailwind works fine).
 */
function MapMarkerLayer({ complaints, selectedId, onSelect }: MapMarkerLayerProps) {
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);

  return (
    <>
      {complaints.map((complaint) => {
        const isSelected = complaint.id === selectedId;
        const fillColor = SEVERITY_COLORS[complaint.severity];
        const radius = isSelected ? 11 : 7;

        return (
          <CircleMarker
            key={complaint.id}
            center={[complaint.latitude, complaint.longitude]}
            radius={radius}
            pathOptions={{
              color: isSelected ? '#ffffff' : '#e2e8f0',
              weight: isSelected ? 3 : 1.5,
              fillColor,
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => {
                onSelect(complaint);
                setOpenPopupId(complaint.id);
              },
            }}
          >
            <Popup
              eventHandlers={{
                remove: () => setOpenPopupId(null),
              }}
            >
              <div className="min-w-[220px] max-w-[280px] text-[13px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 mb-1">
                  Complaint Details
                </p>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{complaint.reference}</h3>
                <p className="text-slate-500 text-xs mb-2">{complaint.citizen}</p>
                <div className="text-xs space-y-1 text-slate-700">
                  <div><span className="text-slate-400 font-semibold">Category: </span>{formatLabel(complaint.category)}</div>
                  <div><span className="text-slate-400 font-semibold">Dept: </span>{formatLabel(complaint.department)}</div>
                  <div><span className="text-slate-400 font-semibold">Location: </span>{complaint.location}</div>
                </div>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                    {formatLabel(complaint.status)}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: fillColor }}
                  >
                    {formatLabel(complaint.severity)}
                  </span>
                </div>
                {complaint.summary && (
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-2">
                    {complaint.summary.slice(0, 120)}…
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default MapMarkerLayer;
