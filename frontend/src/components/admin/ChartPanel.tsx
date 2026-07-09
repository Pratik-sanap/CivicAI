import { useState } from 'react';
import type { AdminChartPoint } from '../../types/adminDashboard';

interface ChartPanelProps {
  title: string;
  subtitle: string;
  points: AdminChartPoint[];
  stroke: string;
}

function ChartPanel({ title, subtitle, points, stroke }: ChartPanelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...points.map((p) => p.value), 1);
  const W = 320;
  const H = 140;
  const PAD = 12;
  const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : W;

  const coords = points.map((p, i) => ({
    x: PAD + i * step,
    y: H - PAD - ((p.value / maxValue) * (H - PAD * 2)),
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const fillPath = `${linePath} L ${coords[coords.length - 1].x} ${H} L ${coords[0].x} ${H} Z`;

  const gradId = `chartFill-${stroke.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:160ms]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
        Analytics
      </p>
      <h2 className="mt-1.5 text-lg font-bold text-[#0F172A]">{title}</h2>
      <p className="mt-1 text-xs text-[#64748B] font-semibold">{subtitle}</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/30 p-4">
        {/* Grid lines */}
        <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal grid */}
          {[0.25, 0.5, 0.75, 1].map((frac) => {
            const y = H - PAD - frac * (H - PAD * 2);
            return (
              <line
                key={frac}
                x1={PAD} x2={W - PAD} y1={y} y2={y}
                stroke="rgba(100, 116, 139, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <path d={fillPath} fill={`url(#${gradId})`} />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {coords.map((c, i) => (
            <g key={i}
               onMouseEnter={() => setHoveredIndex(i)}
               onMouseLeave={() => setHoveredIndex(null)}
               className="cursor-pointer">
              <circle cx={c.x} cy={c.y} r="8" fill="transparent" />
              <circle
                cx={c.x} cy={c.y}
                r={hoveredIndex === i ? 5 : 3.5}
                fill={hoveredIndex === i ? '#fff' : stroke}
                stroke={hoveredIndex === i ? stroke : 'transparent'}
                strokeWidth="2"
                className="transition-all duration-150"
              />
              {hoveredIndex === i && (
                <foreignObject
                  x={c.x - 24} y={c.y - 30}
                  width="48" height="22"
                >
                  <div className="flex items-center justify-center rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
                    {points[i].value}
                  </div>
                </foreignObject>
              )}
            </g>
          ))}
        </svg>

        {/* X labels */}
        <div
          className="mt-2 grid text-center text-[10px] font-bold text-[#64748B] uppercase tracking-wider"
          style={{ gridTemplateColumns: `repeat(${points.length}, 1fr)` }}
        >
          {points.map((p) => (
            <span key={p.label}>{p.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChartPanel;