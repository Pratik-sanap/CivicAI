import type { AdminChartSlice } from '../../types/adminDashboard';

interface SeverityDistributionProps {
  slices: AdminChartSlice[];
}

function SeverityDistribution({ slices }: SeverityDistributionProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  // Build conic-gradient with gap segments
  let cursor = 0;
  const gradient = slices
    .map((slice) => {
      const startPct = (cursor / total) * 100;
      cursor += slice.value;
      const endPct = (cursor / total) * 100;
      return `${slice.color} ${startPct.toFixed(1)}% ${endPct.toFixed(1)}%`;
    })
    .join(', ');

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:100ms]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
        Severity Distribution
      </p>
      <h2 className="mt-1.5 text-lg font-bold text-[#0F172A]">Complaint severity mix</h2>

      {/* Donut */}
      <div className="mt-6 flex items-center justify-center">
        <div
          className="relative h-52 w-52 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        >
          {/* Inner mask */}
          <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-white shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total
              </p>
              <p className="mt-1.5 text-3xl font-extrabold text-[#0F172A]">{total}</p>
              <p className="text-[10px] text-slate-500 font-semibold">complaints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend with animated progress bars */}
      <div className="mt-6 space-y-3">
        {slices.map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <div key={slice.label} className="group">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-[#334155] transition-colors">
                  <span className="h-2.5 w-2.5 rounded-full ring-2 ring-slate-100" style={{ backgroundColor: slice.color }} />
                  {slice.label}
                </span>
                <span className="font-bold text-[#0F172A]">
                  {slice.value}
                  <span className="ml-1.5 text-[11px] font-semibold text-slate-400">({pct}%)</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: slice.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SeverityDistribution;