/**
 * Application entry point.
 *
 * Mounts the React app into #root.
 * Leaflet CSS is imported globally here so all map components
 * (react-leaflet, leaflet.heat) render correctly without per-component imports.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css'; // Required for Leaflet tile layer and marker icons
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);