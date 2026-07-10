/**
 * MapInfoWindow — this component is no longer used.
 *
 * With Leaflet, marker popups are rendered inline inside MapMarkerLayer
 * using react-leaflet's <Popup> component, which works in the normal DOM
 * context (no iframe isolation like Google Maps InfoWindow).
 *
 * This file is kept as a no-op to avoid breaking any future imports.
 */
export default function MapInfoWindow() {
  return null;
}
