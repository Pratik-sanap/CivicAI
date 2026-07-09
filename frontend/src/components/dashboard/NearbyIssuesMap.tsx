import { MapPin } from 'lucide-react';
import type { DashboardMapMarker } from '../../types/dashboard';

interface NearbyIssuesMapProps {
  markers: DashboardMapMarker[];
}

const severityStyles = {
  low: 'bg-green-600 ring-green-100',
  medium: 'bg-blue-600 ring-blue-100',
  high: 'bg-amber-500 ring-amber-100',
  critical: 'bg-red-600 ring-red-100',
} as const;

const statusColors = {
  submitted: 'text-blue-700 bg-blue-50 border-blue-200',
  in_review: 'text-amber-700 bg-amber-50 border-amber-200',
  assigned: 'text-slate-700 bg-slate-100 border-slate-200',
  resolved: 'text-green-700 bg-green-50 border-green-200',
} as const;

const prettyLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function NearbyIssuesMap({ markers }: NearbyIssuesMapProps) {
  return (
    <section className="gov-card p-6 shadow-sm animate-rise-in [animation-delay:100ms]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Geospatial Preview</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">Nearby verified issues</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          2.4 km radius
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 h-[24rem]">
        {/* Mock Map Vector Styling */}
        <div className="absolute inset-0 opacity-40">
          <svg viewBox="0 0 500 400" className="w-full h-full text-slate-200" preserveAspectRatio="none">
            <defs>
              <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            {/* Waterway */}
            <path d="M -50 80 Q 150 120 300 90 T 550 140 L 550 180 Q 300 130 150 150 T -50 120 Z" fill="#DBEAFE" />
            {/* Primary road crossings */}
            <line x1="80" y1="0" x2="80" y2="400" stroke="#E2E8F0" strokeWidth="10" />
            <line x1="380" y1="0" x2="380" y2="400" stroke="#E2E8F0" strokeWidth="8" />
            <line x1="0" y1="180" x2="500" y2="180" stroke="#E2E8F0" strokeWidth="10" />
            <line x1="0" y1="320" x2="500" y2="320" stroke="#E2E8F0" strokeWidth="6" />
          </svg>
        </div>

        {/* Markers and Tooltips */}
        <div className="absolute inset-0 p-4">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute"
              style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2 group z-10 hover:z-20">
                {/* Ping Beacon */}
                <div className={`absolute -inset-1.5 h-6.5 w-6.5 rounded-full ring-4 animate-ping opacity-25 ${severityStyles[marker.severity]}`} />
                <div className={`relative h-3.5 w-3.5 rounded-full ring-2 ring-white shadow ${severityStyles[marker.severity]}`} />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-44 rounded-xl border border-slate-200 bg-white p-3 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{marker.title}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {marker.location}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${statusColors[marker.status]}`}>
                      {prettyLabel(marker.status)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {prettyLabel(marker.severity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[10px] font-medium text-slate-500 shadow-sm pointer-events-none">
            Map preview reflects active complaint clusters.
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="text-slate-400 mr-1">Legenda:</span>
        <span className="flex items-center gap-1 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-red-600" /> Critical
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> High
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> Medium
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-green-600" /> Low
        </span>
      </div>
    </section>
  );
}

export default NearbyIssuesMap;