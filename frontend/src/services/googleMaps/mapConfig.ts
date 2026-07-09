import type { SeverityLevel } from '../../types/report';

// ─── Map centre (Delhi) ────────────────────────────────────────────────────────
export const MAP_CENTER: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.209 };

// ─── Dark map style ────────────────────────────────────────────────────────────
export const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0ea5e9' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

// ─── Default map options ───────────────────────────────────────────────────────
export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: 'greedy',
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  backgroundColor: '#020617',
  styles: DARK_MAP_STYLES,
};

// ─── Severity → heatmap weight ─────────────────────────────────────────────────
export const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 5,
};

// ─── Severity → marker fill colour ────────────────────────────────────────────
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#f43f5e',
};

// ─── Severity → Tailwind pill classes ─────────────────────────────────────────
export const SEVERITY_PILL: Record<SeverityLevel, string> = {
  low: 'bg-emerald-400/10 text-emerald-100 border-emerald-300/20',
  medium: 'bg-amber-400/10 text-amber-100 border-amber-300/20',
  high: 'bg-orange-400/10 text-orange-100 border-orange-300/20',
  critical: 'bg-rose-400/10 text-rose-100 border-rose-300/20',
};

// ─── Status → Tailwind pill classes ───────────────────────────────────────────
export const STATUS_PILL: Record<string, string> = {
  submitted: 'bg-cyan-400/10 text-cyan-100 border-cyan-300/20',
  in_review: 'bg-amber-400/10 text-amber-100 border-amber-300/20',
  assigned: 'bg-sky-400/10 text-sky-100 border-sky-300/20',
  resolved: 'bg-emerald-400/10 text-emerald-100 border-emerald-300/20',
};

// ─── Libraries array (stable reference — must not be inlined in component) ────
export const GOOGLE_LIBRARIES: ('visualization' | 'places' | 'geometry')[] = [
  'visualization',
];

// ─── Utility ──────────────────────────────────────────────────────────────────
export const formatLabel = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
