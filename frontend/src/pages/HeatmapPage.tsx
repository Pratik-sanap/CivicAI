import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, Filter, X, BarChart3, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Activity, Calendar } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';

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

const initialMarkers: MapMarker[] = [
  { id: 'cmp-1024', title: 'Water overflow near market', category: 'water_leakage', severity: 'high', status: 'in_review', department: 'water_supply', location: 'Ward 7, Market Road', lat: 18.5204, lng: 73.8567, date: '2026-07-06', summary: 'Overflow pooling across the curb and causing pedestrians to walk on the road shoulder.' },
  { id: 'cmp-1021', title: 'Broken streetlight at junction', category: 'streetlight', severity: 'medium', status: 'assigned', department: 'electricity', location: 'School Junction', lat: 18.5309, lng: 73.8421, date: '2026-07-05', summary: 'Junction is poorly lit after sunset — residents have flagged visibility concerns.' },
  { id: 'cmp-1016', title: 'Ring road potholes', category: 'pothole', severity: 'low', status: 'resolved', department: 'road_works', location: 'Ring Road Sector 4', lat: 18.5112, lng: 73.8690, date: '2026-07-03', summary: 'Temporary patching completed. Road team closed the complaint.' },
  { id: 'cmp-1004', title: 'Drain blockage', category: 'water_leakage', severity: 'critical', status: 'submitted', department: 'water_supply', location: 'Ward 6, Main St', lat: 18.5255, lng: 73.8510, date: '2026-07-07', summary: 'Sewer backflow reporting inside lower residential quarters.' },
  { id: 'cmp-1005', title: 'Illegal waste dumping', category: 'waste_dump', severity: 'high', status: 'in_review', department: 'sanitation', location: 'Ward 3, Garbage Bin Spot B', lat: 18.5180, lng: 73.8610, date: '2026-07-06', summary: 'Unmanaged garbage pile overflowing onto active pedestrian lanes.' }
];

function HeatmapPage({ onBack, onSwitchToAdmin, onQuickReport }: HeatmapPageProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'both' | 'markers' | 'heatmap'>('both');

  const filteredMarkers = initialMarkers.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && m.severity !== severityFilter) return false;
    if (deptFilter !== 'all' && m.department !== deptFilter) return false;
    return true;
  });

  // Calculate statistics based on filtered markers
  const totalCount = filteredMarkers.length;
  const criticalCount = filteredMarkers.filter(m => m.severity === 'critical').length;
  const highCount = filteredMarkers.filter(m => m.severity === 'high').length;
  const mediumCount = filteredMarkers.filter(m => m.severity === 'medium').length;
  const lowCount = filteredMarkers.filter(m => m.severity === 'low').length;

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#2563EB';
      case 'low': return '#16A34A';
      default: return '#64748B';
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
        
        {/* LEFT Panel: Map Viewport (80%) */}
        <div className="w-full md:w-[80%] h-full relative bg-slate-100 flex items-center justify-center overflow-hidden border-r border-slate-200">
          
          {/* Custom vector-based city map overlay */}
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-full text-slate-200 opacity-60" preserveAspectRatio="none">
              <defs>
                <pattern id="heatmapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heatmapGrid)" />

              {/* Waterway */}
              <path d="M 0 120 Q 200 170 400 140 T 800 220 L 800 270 Q 600 200 400 200 T 0 170 Z" fill="#DBEAFE" />

              {/* Main Roads grid */}
              <line x1="120" y1="0" x2="120" y2="600" stroke="#E2E8F0" strokeWidth="12" />
              <line x1="320" y1="0" x2="320" y2="600" stroke="#E2E8F0" strokeWidth="16" />
              <line x1="640" y1="0" x2="640" y2="600" stroke="#E2E8F0" strokeWidth="12" />
              <line x1="0" y1="220" x2="800" y2="220" stroke="#E2E8F0" strokeWidth="16" />
              <line x1="0" y1="460" x2="800" y2="460" stroke="#E2E8F0" strokeWidth="12" />

              {/* Parks */}
              <rect x="380" y="260" width="220" height="160" rx="16" fill="#DCFCE7" opacity="0.8" />
            </svg>
          </div>

          {/* Heatmap overlay dots */}
          {viewMode !== 'markers' && (
            <div className="absolute inset-0 pointer-events-none">
              {filteredMarkers.map((m) => (
                <div
                  key={`heat-${m.id}`}
                  className="absolute rounded-full opacity-30 blur-2xl transition-all duration-300"
                  style={{
                    left: `${((m.lng - 73.84) * 8000) % 75 + 10}%`,
                    top: `${((m.lat - 18.5) * 8000) % 75 + 10}%`,
                    width: m.severity === 'critical' ? '140px' : m.severity === 'high' ? '110px' : '80px',
                    height: m.severity === 'critical' ? '140px' : m.severity === 'high' ? '110px' : '80px',
                    backgroundColor: getSeverityColor(m.severity)
                  }}
                />
              ))}
            </div>
          )}

          {/* Interactive Map Pins */}
          {viewMode !== 'heatmap' && (
            <div className="absolute inset-0">
              {filteredMarkers.map((m) => {
                const x = ((m.lng - 73.84) * 8000) % 75 + 10;
                const y = ((m.lat - 18.5) * 8000) % 75 + 10;
                const isSelected = selectedMarker?.id === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarker(m)}
                    className="absolute group flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition hover:scale-110 z-10"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition ${
                        isSelected ? 'bg-slate-900 ring-4 ring-blue-100 text-white' : 'bg-white border-2'
                      }`}
                      style={{ borderColor: getSeverityColor(m.severity) }}
                    >
                      <MapPin className="h-4.5 w-4.5" style={{ color: isSelected ? '#FFF' : getSeverityColor(m.severity) }} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Map Layer Mode Controller */}
          <div className="absolute top-6 left-6 bg-white border border-slate-200 shadow-sm rounded-xl p-1 flex gap-1 z-10">
            {['both', 'markers', 'heatmap'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                  viewMode === mode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Severity Legend Card */}
          <div className="absolute bottom-6 left-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 space-y-2.5 z-10">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Map Legend</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                <span className="text-xs font-bold text-slate-700">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-slate-700">High Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-700">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                <span className="text-xs font-bold text-slate-700">Low Severity</span>
              </div>
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
