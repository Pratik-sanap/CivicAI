import { MapPin, Navigation, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { LocationSnapshot } from '../../../types/report';

interface LocationCardProps {
  location: LocationSnapshot | null;
  isLoading: boolean;
  error: string | null;
  onDetectLocation: () => void;
  onClearLocation: () => void;
}

function LocationCard({
  location,
  isLoading,
  error,
  onDetectLocation,
  onClearLocation,
}: LocationCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${location ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/8 text-slate-400'}`}>
            <MapPin className="h-4.5 w-4.5" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
              Geo Location
            </p>
            <h3 className="text-base font-bold text-white">Attach incident location</h3>
          </div>
        </div>

        {location && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Captured
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDetectLocation}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
              Detecting…
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" strokeWidth={2} />
              Use My Location
            </>
          )}
        </button>

        {location && (
          <button
            type="button"
            onClick={onClearLocation}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/14"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Location data / empty */}
      <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4">
        {location ? (
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <p className="font-semibold text-white">Location pinned</p>
            </div>
            <p className="text-slate-300">{location.label}</p>
            <p className="text-xs text-slate-500">
              {location.latitude.toFixed(5)}°N, {location.longitude.toFixed(5)}°E
              {location.accuracy ? ` · ±${Math.round(location.accuracy)}m` : ''}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No location attached. Reports still submit without geo data, but map routing
            works better with it.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-300/20 bg-rose-400/8 px-3.5 py-3 text-sm text-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </section>
  );
}

export default LocationCard;
