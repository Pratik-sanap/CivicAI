/**
 * Leaflet / OpenStreetMap map configuration.
 *
 * Shared constants for the civic-issue heatmap and marker layers:
 * default centre coordinates, severity → weight/colour mappings, and
 * Tailwind pill classes for severity/status badges.
 *
 * No Google Maps API key is required — tiles are served by OpenStreetMap.
 */
import type { SeverityLevel } from '../../types/report';

// ─── Map centre (Pune, India — adjust to your city) ───────────────────────────
export const MAP_CENTER: [number, number] = [28.6139, 77.209];
export const MAP_ZOOM = 12;

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

// ─── Utility ──────────────────────────────────────────────────────────────────
export const formatLabel = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
