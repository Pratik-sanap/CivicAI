import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import { NoComplaintsState } from '../common/EmptyState';
import type { DashboardComplaint } from '../../types/dashboard';
import type { ReportStatus, SeverityLevel } from '../../types/report';

interface RecentComplaintsProps {
  complaints: DashboardComplaint[];
  onReport?: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  pothole:            '🕳️',
  garbage:            '🗑️',
  streetlight:        '💡',
  water_leakage:      '💧',
  illegal_parking:    '🚫',
  broken_road:        '🛣️',
  traffic_signal:     '🚦',
  open_drain:         '🌊',
  construction_waste: '🏗️',
  fallen_tree:        '🌳',
  unknown:            '❓',
};

function RecentComplaints({ complaints, onReport }: RecentComplaintsProps) {
  return (
    <section className="gov-card p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Recent Activity
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">Your latest complaints</h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
            {complaints.length} total
          </span>
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
          {complaints.length === 0 ? (
            <NoComplaintsState onReport={onReport} />
          ) : (
            complaints.map((c, i) => (
              <ComplaintRow key={c.id} complaint={c} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

interface ComplaintRowProps {
  complaint: DashboardComplaint;
  index: number;
}

function ComplaintRow({ complaint: c, index }: ComplaintRowProps) {
  const emoji = CATEGORY_EMOJI[c.category] ?? '📋';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF' }}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 cursor-default shadow-sm"
    >
      {/* Icon */}
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-lg shadow-sm">
        {emoji}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition">
            {c.title}
          </p>
          <span className="flex-shrink-0 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.updatedAt}</span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">{c.summary}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-3">
          <StatusBadge   status={c.status as ReportStatus}     size="sm" />
          <SeverityBadge severity={c.severity as SeverityLevel} size="sm" />
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
            <MapPin className="h-3 w-3 text-slate-400" />
            {c.location}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight
        className="h-4 w-4 flex-shrink-0 text-slate-400 self-center transition-all duration-200 group-hover:text-blue-600 group-hover:translate-x-0.5"
      />
    </motion.div>
  );
}

export default RecentComplaints;