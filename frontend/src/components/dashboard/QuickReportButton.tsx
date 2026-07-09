import { Plus } from 'lucide-react';

interface QuickReportButtonProps {
  onClick: () => void;
}

function QuickReportButton({ onClick }: QuickReportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/35 active:scale-[0.97]"
    >
      {/* Animated ring */}
      <span className="absolute inset-0 rounded-full ring-2 ring-white/0 transition-all duration-300 group-hover:ring-white/20" />

      {/* Pulsing orb behind the icon */}
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute h-5 w-5 animate-pulse-ring rounded-full bg-white/30" />
        <Plus className="relative h-4 w-4" strokeWidth={2.5} />
      </span>

      New Report
    </button>
  );
}

export default QuickReportButton;