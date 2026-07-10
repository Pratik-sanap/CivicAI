/**
 * MapLoader — with Leaflet there is no async SDK to wait for.
 * Leaflet CSS is imported globally in main.tsx.
 * This component is a transparent wrapper kept for API compatibility.
 */
import type { ReactNode } from 'react';

interface MapLoaderProps {
  children: ReactNode;
}

function MapLoader({ children }: MapLoaderProps) {
  return <>{children}</>;
}

export default MapLoader;
