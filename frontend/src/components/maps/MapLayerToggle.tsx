export type LayerMode = 'markers' | 'heatmap' | 'both';

interface MapLayerToggleProps {
  value: LayerMode;
  onChange: (mode: LayerMode) => void;
}

const OPTIONS: { mode: LayerMode; label: string }[] = [
  { mode: 'markers', label: 'Markers' },
  { mode: 'heatmap', label: 'Heatmap' },
  { mode: 'both',    label: 'Both' },
];

/**
 * MapLayerToggle — pill-button group that controls which map layer(s)
 * are visible. Purely presentational: receives `value` and emits
 * `onChange`. No internal state.
 */
function MapLayerToggle({ value, onChange }: MapLayerToggleProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
      role="group"
      aria-label="Map layer selection"
    >
      {OPTIONS.map(({ mode, label }) => {
        const isActive = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-pressed={isActive}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-white/8 hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default MapLayerToggle;
