/**
 * useUserLocation — requests the browser's Geolocation API and returns
 * the user's current coordinates plus a status flag.
 *
 * The hook fires `navigator.geolocation.getCurrentPosition` on mount so the
 * browser permission prompt appears immediately when the hook is first used.
 *
 * Usage:
 *   const { lat, lng, status } = useUserLocation();
 *   // status: 'idle' | 'loading' | 'success' | 'denied' | 'unavailable'
 */
import { useEffect, useState } from 'react';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable';

export interface UserLocation {
  lat: number | null;
  lng: number | null;
  status: LocationStatus;
}

// Fallback coordinates used when geolocation is denied or unavailable.
// Set to a sensible default (Pune, India — change to your city if needed).
export const FALLBACK_CENTER: [number, number] = [18.5204, 73.8567];

export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    lat: null,
    lng: null,
    status: 'idle',
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: null, lng: null, status: 'unavailable' });
      return;
    }

    setLocation((prev) => ({ ...prev, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          status: 'success',
        });
      },
      (error) => {
        const status = error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable';
        setLocation({ lat: null, lng: null, status });
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000, // cache for 60 s
      },
    );
  }, []); // run once on mount

  return location;
}
