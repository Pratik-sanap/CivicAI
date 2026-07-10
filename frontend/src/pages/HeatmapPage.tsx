import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, Filter, X, BarChart3, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Activity, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import AppHeader from '../components/layout/AppHeader';
import MapRecenter from '../components/maps/MapRecenter';
import { useUserLocation, FALLBACK_CENTER } from '../hooks/useUserLocation';

interface HeatmapPageProps {
  onBack: () => void;
  onSwitchToAdmin?: () => void;
  onQuickReport?: () => void;
}

interface MapMarker {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'in_review' | 'assigned' | 'resolved';
  department: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
  summary: string;
}

function HeatmapPage({ onBack, onSwitchToAdmin, onQuickReport }: HeatmapPageProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  // Request geolocation immediately on mount
  const { lat, lng, status: geoStatus } = useUserLocation();
  const userCenter: [number, number] =
    lat !== null && lng !== null ? [lat, lng] : FALLBACK_CENTER;

  // Offset sample markers relative to user's location so they always appear nearby
  const offset = useMemo(
    () => ({
      baseLat: userCenter[0],
      baseLng: userCenter[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geoStatus], // only recompute when location resolves
  );

  const markers: MapMarker[] = useMemo(() => [
    { id: 'cmp-1024', title: 'Water overflow near market',    category: 'water_leakage',     severity: 'high',     status: 'in_review', department: 'water_supply', location: 'Ward 7, Market Road',      lat: offset.baseLat + 0.002,  lng: offset.baseLng + 0.003,  date: '2026-07-06', summary: 'Overflow pooling across the curb and causing pedestrians to walk on the road shoulder.' },
    { id: 'cmp-1021', title: 'Broken streetlight at junction', category: 'streetlight',        severity: 'medium',   status: 'assigned',  department: 'electricity',   location: 'School Junction',         lat: offset.baseLat + 0.011,  lng: offset.baseLng - 0.015,  date: '2026-07-05', summary: 'Junction is poorly lit after sunset — residents have flagged visibility concerns.' },
    { id: 'cmp-1016', title: 'Ring road potholes',             category: 'pothole',           severity: 'low',      status: 'resolved',  department: 'road_works',    location: 'Ring Road Sector 4',      lat: offset.baseLat - 0.009,  lng: offset.baseLng + 0.012,  date: '2026-07-03', summary: 'Temporary patching completed. Road team closed the complaint.' },
    { id: 'cmp-1004', title: 'Drain blockage',                 category: 'water_leakage',     severity: 'critical', status: 'submitted', department: 'water_supply',  location: 'Ward 6, Main St',         lat: offset.baseLat + 0.005,  lng: offset.baseLng - 0.006,  date: '2026-07-07', summary: 'Sewer backflow reporting inside lower residential quarters.' },
    { id: 'cmp-1005', title: 'Illegal waste dumping',          category: 'waste_dump',        severity: 'high',     status: 'in_review', department: 'sanitation',    location: 'Ward 3, Garbage Bin Spot B', lat: offset.baseLat - 0.003, lng: offset.baseLng + 0.009,  date: '2026-07-06', summary: 'Unmanaged garbage pile overflowing onto active pedestrian lanes.' },
  ], [offset]);

  const filteredMarkers = markers.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && m.severity !== severityFilter) return false;
    if (deptFilter !== 'all' && m.department !== deptFilter) return false;
    return true;
  });

  // Calculate statistics based on filtered markers
  const totalCount = filteredMarkers.length;
  const criticalCount = filteredMarkers.filter(m => m.severity === 'critical').length;
  const highCount    = filteredMarkers.filter(m => m.severity === 'high').length;
  const mediumCount  = filteredMarkers.filter(m => m.severity === 'medium').length;
  const lowCount     = filteredMarkers.filter(m => m.severity === 'low').length;

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return '#DC2626';
      case 'high':     return '#F59E0B';
      case 'medium':   return '#2563EB';
      case 'low':      return '#16A34A';
      default:         return '#64748B';
    }
  };

  const formatLabel = (str: string) => {
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      <AppHeader
        currentView="dashboard"
        onSwitchToAdmin={onSwitchToAdmin}
        onNewReport={onQuickReport}
        onBack={onBack}
      />

      {/* Main Full-Screen Grid Layout: 80% Map, 20% Sidebar */}
      <div className="flex-grow flex flex-col md:flex-row relative overflow-hidden">
        
        {/* LEFT Panel: Leaflet Map Viewport (80%) */}
        <div className="w-full md:w-[80%] h-full relative overflow-hidden border-r border-slate-200">

          {/* Real Leaflet + OpenStreetMap — no API key needed */}
          <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
              center={userCenter}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />

              {/* Fly to user position once geolocation resolves */}
              <MapRecenter center={userCenter} zoom={14} />

              {/* Marker layer */}
              {filteredMarkers.map(m => (
                <CircleMarker
                  key={m.id}
                  center={[m.lat, m.lng]}
                  radius={selectedMarker?.id === m.id ? 12 : 8}
                  pathOptions={{
                    color: selectedMarker?.id === m.id ? '#ffffff' : '#e2e8f0',
                    weight: selectedMarker?.id === m.id ? 3 : 1.5,
                    fillColor: getSeverityColor(m.severity),
                    fillOpacity: 1,
                  }}
                  eventHandlers={{ click: () => setSelectedMarker(m) }}
                >
                  <Popup>
                    <div className="min-w-[200px] text-xs">
                      <p className="font-bold text-slate-900">{m.title}</p>
                      <p className="text-slate-500 mt-0.5">{m.location}</p>
                      <div className="mt-2 flex gap-1 flex-wrap">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{formatLabel(m.status)}</span>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: getSeverityColor(m.severity) }}>{formatLabel(m.severity)}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Geolocation status badge */}
          <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            {geoStatus === 'loading' && (
              <span className="flex items-center gap-2 rounded-xl bg-white/95 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700 shadow-md">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Locating you…
              </span>
            )}
            {geoStatus === 'success' && (
              <span className="flex items-center gap-2 rounded-xl bg-white/95 border border-green-200 px-4 py-2 text-xs font-semibold text-green-700 shadow-md">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Centred on your location
              </span>
            )}
            {(geoStatus === 'denied' || geoStatus === 'unavailable') && (
              <span className="flex items-center gap-2 rounded-xl bg-white/95 border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 shadow-md">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Location access denied — showing default area
              </span>
            )}
          </div>

          {/* Severity Legend Card */}
          <div className="absolute bottom-6 left-4 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 space-y-2.5 z-[1000]">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Map Legend</p>
            <div className="flex flex-col gap-2">
              {[['#DC2626','Critical'],['#F59E0B','High'],['#2563EB','Medium'],['#16A34A','Low']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM SHEET: Selected Complaint Details (Slides Up) */}
          <AnimatePresence>
            {selectedMarker && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-6 inset-x-6 bg-white border border-slate-200 shadow-lg rounded-2xl p-5 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {formatLabel(selectedMarker.category)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{selectedMarker.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{selectedMarker.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed line-clamp-1">{selectedMarker.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Department Routing</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{formatLabel(selectedMarker.department)}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 hidden md:block" />
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: getSeverityColor(selectedMarker.severity) }}
                  >
                    {formatLabel(selectedMarker.severity)}
                  </span>
                  
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition">
                      Dispatch Crew
                    </button>
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT Panel: Sidebar Filters & Analytics (20%) */}
        <div className="w-full md:w-[20%] h-full bg-white p-5 flex flex-col justify-between overflow-y-auto border-l border-slate-200 flex-shrink-0">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Filter className="h-4.5 w-4.5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Map Controls</h2>
            </div>

            {/* Filter selectors */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="water_leakage">Water Leakage</option>
                  <option value="streetlight">Street Lights</option>
                  <option value="pothole">Roads & Potholes</option>
                  <option value="waste_dump">Waste Disposal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  <option value="water_supply">Water Supply</option>
                  <option value="electricity">Electricity</option>
                  <option value="road_works">Road Works</option>
                  <option value="sanitation">Sanitation</option>
                </select>
              </div>
            </div>

            {/* Analytics Statistics Breakdown */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>Geospatial Metrics</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Active</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Critical</p>
                  <p className="text-xl font-extrabold text-red-600 mt-1">{criticalCount}</p>
                </div>
              </div>

              {/* Progress Bars for Severity distribution */}
              <div className="space-y-2 pt-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Severity Mix</p>
                
                <div className="space-y-1.5">
                  <SeverityProgress label="High" count={highCount} total={totalCount} color="bg-amber-500" />
                  <SeverityProgress label="Medium" count={mediumCount} total={totalCount} color="bg-blue-600" />
                  <SeverityProgress label="Low" count={lowCount} total={totalCount} color="bg-green-600" />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase">
              Official Geospatial Triage Map
            </p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">
              Synchronized in real-time with Gemini AI classification models.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Micro Progress bar component
function SeverityProgress({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="text-xs">
      <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default HeatmapPage;
