import type { AdminChartSlice } from '../../types/adminDashboard';

interface StatusDistributionProps {
  slices: AdminChartSlice[];
}

function StatusDistribution({ slices }: StatusDistributionProps) {
  const total = Math.max(slices.reduce((sum, slice) => sum + slice.value, 0), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:140ms]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Status Distribution</p>
      <h2 className="mt-2 text-lg font-bold text-[#0F172A]">Lifecycle balance across the queue</h2>

      <div className="mt-6 space-y-4">
        {slices.map((slice) => {
          const width = (slice.value / total) * 100;

          return (
            <div key={slice.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#334155]">{slice.label}</span>
                <span className="font-bold text-[#0F172A]">{slice.value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full" style={{ width: `${width}%`, backgroundColor: slice.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatusDistribution;