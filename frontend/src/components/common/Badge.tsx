// ─── Badge ─────────────────────────────────────────────────────────────────────
// Reusable status / severity pill that replaces all the repeated inline
// className strings scattered across admin and citizen components.

import type { ReportStatus, SeverityLevel } from '../../types/report';

// ── Status badge ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<ReportStatus, string> = {
  submitted: 'bg-cyan-400/10 text-cyan-100 border-cyan-300/20',
  in_review: 'bg-amber-400/10 text-amber-100 border-amber-300/20',
  assigned:  'bg-sky-400/10  text-sky-100  border-sky-300/20',
  resolved:  'bg-emerald-400/10 text-emerald-100 border-emerald-300/20',
};

const STATUS_DOTS: Record<ReportStatus, string> = {
  submitted: 'bg-cyan-400',
  in_review: 'bg-amber-400',
  assigned:  'bg-sky-400',
  resolved:  'bg-emerald-400',
};

interface StatusBadgeProps {
  status: ReportStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, showDot = true, size = 'sm' }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClass} ${STATUS_STYLES[status]}`}
    >
      {showDot && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      )}
      {label}
    </span>
  );
}

// ── Severity badge ─────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<SeverityLevel, string> = {
  low:      'bg-emerald-400/10 text-emerald-100 border-emerald-300/20',
  medium:   'bg-amber-400/10  text-amber-100  border-amber-300/20',
  high:     'bg-orange-400/10 text-orange-100 border-orange-300/20',
  critical: 'bg-rose-400/10   text-rose-100   border-rose-300/20',
};

const SEVERITY_DOT_COLORS: Record<SeverityLevel, string> = {
  low:      'bg-emerald-400',
  medium:   'bg-amber-400',
  high:     'bg-orange-400',
  critical: 'bg-rose-400',
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, showDot = true, size = 'sm' }: SeverityBadgeProps) {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClass} ${SEVERITY_STYLES[severity]}`}
    >
      {showDot && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${SEVERITY_DOT_COLORS[severity]}`} />
      )}
      {label}
    </span>
  );
}

// ── Generic label badge ────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 ${className}`}
    >
      {children}
    </span>
  );
}
