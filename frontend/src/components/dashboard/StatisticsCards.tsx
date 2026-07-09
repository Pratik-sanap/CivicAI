import { motion } from 'framer-motion';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  FolderOpen,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStatCard } from '../../types/dashboard';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface StatisticsCardsProps {
  cards: DashboardStatCard[];
}

type Tone = DashboardStatCard['tone'];

const TONE_CONFIG: Record<
  Tone,
  { bg: string; border: string; iconBg: string; iconText: string; textVal: string }
> = {
  cyan:    { bg: 'bg-white', border: 'border-slate-200', iconBg: 'bg-blue-50',    iconText: 'text-blue-600',    textVal: 'text-slate-900' },
  emerald: { bg: 'bg-white', border: 'border-slate-200', iconBg: 'bg-green-50',   iconText: 'text-green-600',   textVal: 'text-slate-900' },
  amber:   { bg: 'bg-white', border: 'border-slate-200', iconBg: 'bg-amber-50',   iconText: 'text-amber-600',   textVal: 'text-slate-900' },
  rose:    { bg: 'bg-white', border: 'border-slate-200', iconBg: 'bg-rose-50',    iconText: 'text-rose-600',    textVal: 'text-slate-900' },
};

const CARD_ICONS: Record<string, typeof Clock> = {
  'Open Complaints':  FolderOpen,
  'In Review':        AlertOctagon,
  'Resolved':         CheckCircle2,
  'Avg. Response':    Clock,
};

function StatisticsCards({ cards }: StatisticsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const cfg  = TONE_CONFIG[card.tone];
        const Icon = CARD_ICONS[card.label] ?? Clock;
        const isUp = card.change.startsWith('+') || card.change.includes('this') || card.change.includes('-');

        // Determinate positive or negative trend color
        const isImprovement = card.label === 'Avg. Response' 
          ? card.change.startsWith('-') // Red response time reduction is good!
          : card.change.startsWith('+'); // Increase in resolved is good!

        return (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -4, borderColor: '#CBD5E1', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.04), 0 4px 6px -2px rgba(15, 23, 42, 0.04)' }}
            className={[
              'group relative overflow-hidden rounded-2xl border p-5 bg-white cursor-default',
              cfg.border,
            ].join(' ')}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.label}
              </p>
              <div className={`rounded-xl p-2 border border-slate-100 ${cfg.iconBg} ${cfg.iconText}`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
            </div>

            {/* Value row */}
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                <AnimatedCounter value={card.value} />
              </p>
              <span
                className={[
                  'flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                  isImprovement 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-amber-700 bg-amber-50 border-amber-200',
                ].join(' ')}
              >
                {isImprovement
                  ? <TrendingUp   className="h-3.5 w-3.5" />
                  : <TrendingDown className="h-3.5 w-3.5" />
                }
                {card.change}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3.5 text-xs leading-relaxed text-slate-500">
              {card.detail}
            </p>
          </motion.article>
        );
      })}
    </section>
  );
}

export default StatisticsCards;