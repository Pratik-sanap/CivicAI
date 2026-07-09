import { motion } from 'framer-motion';
import { Sparkles, CalendarDays } from 'lucide-react';

interface CitizenGreetingProps {
  name: string;
  updatedAt: string;
}

function CitizenGreeting({ name, updatedAt }: CitizenGreetingProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm border border-blue-700">
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-2 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        </div>

        {/* Text */}
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {greeting}
            </p>
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">{name}</h2>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">
            Personalized civic assistant dashboard
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600">
        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
        Last Sync: {updatedAt}
      </div>
    </motion.div>
  );
}

export default CitizenGreeting;