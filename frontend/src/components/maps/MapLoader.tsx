import type { ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_LIBRARIES } from '../../services/googleMaps/mapConfig';

interface MapLoaderProps {
  apiKey: string;
  children: ReactNode;
}

/**
 * MapLoader — wraps `useJsApiLoader` and provides a consistent loading /
 * no-key state so every map consumer gets the same UX without repeating
 * the loader logic.
 */
function MapLoader({ apiKey, children }: MapLoaderProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_LIBRARIES,
  });

  if (!apiKey) {
    return (
      <MapPlaceholder
        eyebrow="Google Maps"
        title="Configure your API key"
        body="Create a frontend/.env file with VITE_GOOGLE_MAPS_API_KEY to render
              the live map, clustered markers, and heatmap."
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[26rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/80">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <svg
            className="h-8 w-8 animate-spin text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm text-slate-400">Loading map…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Internal skeleton placeholder ────────────────────────────────────────────

interface MapPlaceholderProps {
  eyebrow: string;
  title: string;
  body: string;
}

function MapPlaceholder({ eyebrow, title, body }: MapPlaceholderProps) {
  return (
    <div className="flex h-[26rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-6 text-center">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
      </div>
    </div>
  );
}

export default MapLoader;
