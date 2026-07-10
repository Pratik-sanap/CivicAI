import { useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import MapHeatmapLayer from '../maps/MapHeatmapLayer';
import MapLayerToggle, { type LayerMode } from '../maps/MapLayerToggle';
import MapMarkerLayer from '../maps/MapMarkerLayer';

import {
  formatLabel,
  MAP_CENTER,
  MAP_ZOOM,
  SEVERITY_COLORS,
  SEVERITY_PILL,
  SEVERITY_WEIGHTS,
  STATUS_PILL,
} from '../../services/googleMaps/mapConfig';
import type { AdminMapComplaint } from '../../types/adminDashboard';

interface ComplaintsMapProps {
  complaints: AdminMapComplaint[];
}

/**
 * ComplaintsMap — orchestrator for the admin dashboard map panel.
 * Now powered by Leaflet + OpenStreetMap — no API key required.
 *
 * Manages:
 *  - Layer mode (markers / heatmap / both)
 *  - Selected complaint (drives detail panel below the map)
 *  - Heatmap point computation (via useMemo)
 */
function ComplaintsMap({ complaints }: ComplaintsMapProps) {
  const [layerMode, setLayerMode] = useState<LayerMode>('both');
  const [selectedComplaint, setSelectedComplaint] = useState<AdminMapComplaint | null>(null);

  /** Convert complaints to leaflet.heat point format: [lat, lng, intensity] */
  const heatmapPoints = useMemo<[number, number, number][]>(
    () =>
      complaints.map((c) => [
        c.latitude,
        c.longitude,
        Math.min(SEVERITY_WEIGHTS[c.severity] / 5, 1), // normalize 0–1
      ]),
    [complaints],
  );

  const showMarkers = layerMode === 'markers' || layerMode === 'both';
  const showHeatmap = layerMode === 'heatmap' || layerMode === 'both';

  const handleSelect = (complaint: AdminMapComplaint) => {
    setSelectedComplaint((prev) => (prev?.id === complaint.id ? null : complaint));
  };

  const handleClose = () => setSelectedComplaint(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:100ms]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Map</p>
          <h2 className="mt-2 text-lg font-bold text-[#0F172A]">
            Hotspots across the municipality
          </h2>
          <p className="mt-1 text-xs text-[#64748B] font-semibold">
            {complaints.length} complaints · click any marker for details
          </p>
        </div>

        <MapLayerToggle value={layerMode} onChange={setLayerMode} />
      </div>

      {/* ── Map container ───────────────────────────────────────────────── */}
      <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-200">
        {/* Leaflet needs an explicit height on its container */}
        <div style={{ height: '32rem', width: '100%' }}>
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={true}
          >
            {/* OpenStreetMap tiles — free, no API key needed */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />

            {showHeatmap && heatmapPoints.length > 0 && (
              <MapHeatmapLayer points={heatmapPoints} />
            )}

            {showMarkers && (
              <MapMarkerLayer
                complaints={complaints}
                selectedId={selectedComplaint?.id ?? null}
                onSelect={handleSelect}
              />
            )}
          </MapContainer>
        </div>

        {/* Legend pill — absolute-positioned on top of the map */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <LegendPill color="#f43f5e" label="Critical" />
          <LegendPill color="#f97316" label="High" />
          <LegendPill color="#f59e0b" label="Medium" />
          <LegendPill color="#10b981" label="Low" />
        </div>
      </div>

      {/* ── Selected complaint detail panel ─────────────────────────────── */}
      {selectedComplaint ? (
        <ComplaintDetailPanel complaint={selectedComplaint} onClose={handleClose} />
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-5 py-4 text-center text-xs text-[#64748B] font-medium">
          Click a marker on the map to view complaint details
        </div>
      )}
    </section>
  );
}

// ─── Legend pill ───────────────────────────────────────────────────────────────

function LegendPill({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 shadow-sm">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-slate-100"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-bold text-slate-700">{label}</span>
    </div>
  );
}

// ─── Complaint detail panel ────────────────────────────────────────────────────

interface ComplaintDetailPanelProps {
  complaint: AdminMapComplaint;
  onClose: () => void;
}

function ComplaintDetailPanel({ complaint, onClose }: ComplaintDetailPanelProps) {
  const severityPill = SEVERITY_PILL[complaint.severity];
  const statusPill = STATUS_PILL[complaint.status] ?? 'bg-white/10 text-white border-white/20';
  const dotColor = SEVERITY_COLORS[complaint.severity];

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 animate-rise-in">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Selected Complaint
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span
              className="inline-block h-3 w-3 flex-shrink-0 rounded-full ring-2 ring-slate-200"
              style={{ backgroundColor: dotColor }}
            />
            <h3 className="text-sm font-bold text-[#0F172A]">{complaint.reference}</h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 font-semibold">{complaint.citizen}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss complaint detail"
          className="mt-0.5 flex-shrink-0 rounded-full border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-slate-200" />

      {/* Detail grid */}
      <div className="grid gap-y-3 gap-x-8 text-xs sm:grid-cols-2">
        <DetailRow label="Category"   value={formatLabel(complaint.category)} />
        <DetailRow label="Department" value={formatLabel(complaint.department)} />
        <DetailRow label="Location"   value={complaint.location} />
        <DetailRow label="Updated"    value={complaint.updatedAt} />
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${statusPill}`}>
          {formatLabel(complaint.status)}
        </span>
        <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${severityPill}`}>
          {formatLabel(complaint.severity)} priority
        </span>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-lg border border-slate-100 bg-white p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Complaint Summary
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#334155]">{complaint.summary}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{label}</span>
      <span className="font-bold text-[#0F172A]">{value}</span>
    </div>
  );
}

export default ComplaintsMap;