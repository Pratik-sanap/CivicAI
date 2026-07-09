import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Inbox,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { AdminMetricCard } from '../../types/adminDashboard';

interface AdminMetricsProps {
  metrics: AdminMetricCard[];
}

const TONE_CONFIG: Record<
  AdminMetricCard['tone'],
  { bg: string; border: string; iconBg: string; iconText: string }
> = {
  cyan:    { bg: 'bg-[#EFF6FF]', border: 'border-l-4 border-l-[#2563EB]', iconBg: 'bg-blue-100',  iconText: 'text-[#2563EB]' },
  emerald: { bg: 'bg-[#F0FDF4]', border: 'border-l-4 border-l-[#16A34A]', iconBg: 'bg-green-100', iconText: 'text-[#16A34A]' },
  amber:   { bg: 'bg-[#FFFBEB]', border: 'border-l-4 border-l-[#F59E0B]', iconBg: 'bg-amber-100', iconText: 'text-[#F59E0B]' },
  rose:    { bg: 'bg-[#FEF2F2]', border: 'border-l-4 border-l-[#DC2626]', iconBg: 'bg-red-100',   iconText: 'text-[#DC2626]' },
};

const METRIC_ICONS: Record<string, typeof Inbox> = {
  'Open Complaints':    Inbox,
  'Resolved This Week': CheckCircle2,
  'Pending Escalations': AlertTriangle,
  'Avg. SLA':           Clock,
};

function isPositive(delta: string): boolean {
  return delta.startsWith('+') || delta.startsWith('-0.');
}

function AdminMetrics({ metrics }: AdminMetricsProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const cfg = TONE_CONFIG[metric.tone];
        const Icon = METRIC_ICONS[metric.label] ?? Inbox;
        const positive = isPositive(metric.delta);

        return (
          <article
            key={metric.label}
            className={[
              'group relative overflow-hidden rounded-2xl border border-slate-200 p-6',
              'transition-all duration-300 cursor-default shadow-sm',
              cfg.bg,
              cfg.border,
              'animate-rise-in',
            ].join(' ')}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {metric.label}
              </p>
              <div className={`rounded-lg p-2 ${cfg.iconBg} ${cfg.iconText}`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
            </div>

            {/* Value */}
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                {metric.value}
              </p>
              <span
                className={[
                  'flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                  positive
                    ? 'text-green-700 bg-green-50 border-green-200'
                    : 'text-red-700 bg-red-50 border-red-200',
                ].join(' ')}
              >
                {positive
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />
                }
                {metric.delta}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs leading-relaxed text-[#334155]">
              {metric.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}

export default AdminMetrics;