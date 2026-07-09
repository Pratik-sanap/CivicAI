import { motion } from 'framer-motion';
import type { DashboardTimelineStep } from '../../types/dashboard';

interface ComplaintStatusTimelineProps {
  steps: DashboardTimelineStep[];
}

const ACCENT: Record<string, { dot: string; text: string; ring: string; count: string }> = {
  cyan:    { dot: 'bg-blue-600',    text: 'text-blue-700',    ring: 'ring-blue-100',    count: 'bg-blue-50 text-blue-700 border-blue-200 border' },
  amber:   { dot: 'bg-amber-500',   text: 'text-amber-700',   ring: 'ring-amber-100',   count: 'bg-amber-50 text-amber-700 border-amber-200 border' },
  rose:    { dot: 'bg-red-500',     text: 'text-red-700',     ring: 'ring-red-100',     count: 'bg-red-50 text-red-700 border-red-200 border' },
  emerald: { dot: 'bg-green-600',   text: 'text-green-700',   ring: 'ring-green-100',   count: 'bg-green-50 text-green-700 border-green-200 border' },
  sky:     { dot: 'bg-blue-500',    text: 'text-blue-700',    ring: 'ring-blue-100',    count: 'bg-blue-50 text-blue-700 border-blue-200 border' },
};

function ComplaintStatusTimeline({ steps }: ComplaintStatusTimelineProps) {
  return (
    <section className="gov-card p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Status Pipeline
      </p>
      <h2 className="mt-1 text-lg font-bold text-slate-900">Complaint lifecycle</h2>

      <ol className="mt-6 space-y-0">
        {steps.map((step, i) => {
          const cfg = ACCENT[step.accent] ?? ACCENT.cyan;
          const isLast = i === steps.length - 1;

          return (
            <motion.li 
              key={step.status} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative flex gap-4"
            >
              {/* Connector line */}
              {!isLast && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="absolute left-[17px] top-[36px] w-[2px] bg-slate-200" 
                />
              )}

              {/* Dot */}
              <div className="relative flex-shrink-0 mt-1">
                <div
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-xl ring-4 transition-transform duration-200 group-hover:scale-105',
                    cfg.dot,
                    cfg.ring,
                  ].join(' ')}
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={`text-sm font-bold ${cfg.text}`}>{step.title}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cfg.count}`}>
                    {step.count}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {step.note}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

export default ComplaintStatusTimeline;