import { InfoWindowF } from '@react-google-maps/api';
import type { AdminMapComplaint } from '../../types/adminDashboard';
import {
  SEVERITY_PILL,
  STATUS_PILL,
  formatLabel,
} from '../../services/googleMaps/mapConfig';

interface MapInfoWindowProps {
  complaint: AdminMapComplaint;
  onClose: () => void;
}

/**
 * MapInfoWindow — renders a styled `InfoWindowF` anchored to a complaint's
 * lat/lng position. Contains a full complaint detail card with reference,
 * citizen name, category, department, status/severity pills, and summary text.
 *
 * The inline styles for the card background are intentional: Google Maps
 * injects its own iframe context so Tailwind classes on InfoWindow children
 * need to be self-contained or use `style` props for colours.
 */
function MapInfoWindow({ complaint, onClose }: MapInfoWindowProps) {
  const severityClass = SEVERITY_PILL[complaint.severity];
  const statusClass = STATUS_PILL[complaint.status] ?? 'bg-white/10 text-white border-white/20';

  return (
    <InfoWindowF
      position={{ lat: complaint.latitude, lng: complaint.longitude }}
      onCloseClick={onClose}
      options={{ pixelOffset: new google.maps.Size(0, -12) }}
    >
      {/* Inner div: dark card styled to match the CivicAI design system */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem',
          padding: '1rem',
          color: '#f8fafc',
          minWidth: '260px',
          maxWidth: '320px',
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#67e8f9',
            margin: 0,
          }}
        >
          Complaint Details
        </p>

        <h3
          style={{
            marginTop: '0.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0.5rem 0 0',
          }}
        >
          {complaint.reference}
        </h3>

        <p
          style={{
            marginTop: '0.2rem',
            fontSize: '0.8rem',
            color: '#94a3b8',
            margin: '0.2rem 0 0',
          }}
        >
          {complaint.citizen}
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            margin: '0.75rem 0',
          }}
        />

        {/* Detail rows */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
          <tbody>
            <InfoRow label="Category" value={formatLabel(complaint.category)} />
            <InfoRow label="Department" value={formatLabel(complaint.department)} />
            <InfoRow label="Location" value={complaint.location} />
            <InfoRow label="Updated" value={complaint.updatedAt} />
          </tbody>
        </table>

        {/* Pill row */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <Pill label={formatLabel(complaint.status)} className={statusClass} />
          <Pill label={formatLabel(complaint.severity)} className={severityClass} />
        </div>

        {/* Summary box */}
        <div
          style={{
            marginTop: '0.75rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.6rem',
            padding: '0.6rem 0.75rem',
          }}
        >
          <p
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#64748b',
              margin: 0,
            }}
          >
            Complaint Summary
          </p>
          <p
            style={{
              marginTop: '0.4rem',
              fontSize: '0.76rem',
              lineHeight: '1.5',
              color: '#cbd5e1',
              margin: '0.4rem 0 0',
            }}
          >
            {complaint.summary}
          </p>
        </div>
      </div>
    </InfoWindowF>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ color: '#64748b', paddingBottom: '0.3rem', paddingRight: '1rem', whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ color: '#e2e8f0', fontWeight: 600, paddingBottom: '0.3rem' }}>
        {value}
      </td>
    </tr>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  // Convert Tailwind class string to minimal inline styles for the InfoWindow iframe context
  const isRose = className.includes('rose');
  const isAmber = className.includes('amber');
  const isEmerald = className.includes('emerald');
  const isOrange = className.includes('orange');
  const isSky = className.includes('sky');
  const isCyan = className.includes('cyan');

  const bg = isRose
    ? 'rgba(244,63,94,0.15)'
    : isAmber
    ? 'rgba(245,158,11,0.15)'
    : isOrange
    ? 'rgba(249,115,22,0.15)'
    : isEmerald
    ? 'rgba(16,185,129,0.15)'
    : isSky
    ? 'rgba(56,189,248,0.15)'
    : isCyan
    ? 'rgba(34,211,238,0.15)'
    : 'rgba(255,255,255,0.1)';

  const color = isRose
    ? '#fda4af'
    : isAmber
    ? '#fcd34d'
    : isOrange
    ? '#fdba74'
    : isEmerald
    ? '#6ee7b7'
    : isSky
    ? '#7dd3fc'
    : isCyan
    ? '#67e8f9'
    : '#f1f5f9';

  return (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color,
        border: `1px solid ${color}30`,
        borderRadius: '999px',
        padding: '2px 10px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  );
}

export default MapInfoWindow;
