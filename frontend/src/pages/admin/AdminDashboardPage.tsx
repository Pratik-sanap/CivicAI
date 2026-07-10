import { useMemo, useState } from 'react';
import { ShieldCheck, BarChart3, ListFilter, Map, Users, ArrowLeftRight, Settings, Plus, FileText } from 'lucide-react';

import AdminMetrics from '../../components/admin/AdminMetrics';
import ChartPanel from '../../components/admin/ChartPanel';
import ComplaintFilters from '../../components/admin/ComplaintFilters';
import ComplaintTable from '../../components/admin/ComplaintTable';
import ComplaintsMap from '../../components/admin/ComplaintsMap';
import LatestReports from '../../components/admin/LatestReports';
import SeverityDistribution from '../../components/admin/SeverityDistribution';
import StatusDistribution from '../../components/admin/StatusDistribution';
import AppHeader from '../../components/layout/AppHeader';
import type { AdminChartPoint, AdminChartSlice, AdminComplaintRow, AdminFilterState, AdminMapComplaint, AdminMetricCard } from '../../types/adminDashboard';

interface AdminDashboardPageProps {
  onQuickReport: () => void;
  onSwitchToCitizen: () => void;
}

const metrics: AdminMetricCard[] = [
  {
    label: 'Open Complaints',
    value: '126',
    delta: '+14 today',
    tone: 'cyan',
    description: 'Reports waiting for assignment, verification, or field action.',
  },
  {
    label: 'Resolved This Week',
    value: '84',
    delta: '+18%',
    tone: 'emerald',
    description: 'Closed reports with officer confirmation and cleanup completion.',
  },
  {
    label: 'Pending Escalations',
    value: '23',
    delta: '5 urgent',
    tone: 'amber',
    description: 'High-priority complaints needing oversight or inter-department routing.',
  },
  {
    label: 'Avg. SLA',
    value: '4.1h',
    delta: '-0.6h',
    tone: 'rose',
    description: 'Average response time from intake to first operational acknowledgement.',
  },
];

const complaints: AdminComplaintRow[] = [
  {
    id: 'rep-3001',
    reference: 'CMP-3001',
    citizen: 'Ananya Sharma',
    category: 'pothole',
    department: 'road_works',
    status: 'submitted',
    severity: 'high',
    location: 'Ward 4, Ring Road',
    updatedAt: '8 min ago',
  },
  {
    id: 'rep-3002',
    reference: 'CMP-3002',
    citizen: 'Rohit Kumar',
    category: 'garbage',
    department: 'sanitation',
    status: 'in_review',
    severity: 'medium',
    location: 'Ward 9, Market Lane',
    updatedAt: '22 min ago',
  },
  {
    id: 'rep-3003',
    reference: 'CMP-3003',
    citizen: 'Fatima Khan',
    category: 'streetlight',
    department: 'electricity',
    status: 'assigned',
    severity: 'critical',
    location: 'Ward 2, School Junction',
    updatedAt: '35 min ago',
  },
  {
    id: 'rep-3004',
    reference: 'CMP-3004',
    citizen: 'Meera Iyer',
    category: 'water_leakage',
    department: 'water_supply',
    status: 'resolved',
    severity: 'low',
    location: 'Ward 6, Lake View Road',
    updatedAt: '1h ago',
  },
];

const initialFilters: AdminFilterState = {
  department: 'all',
  status: 'all',
  severity: 'all',
};

const severitySlices: AdminChartSlice[] = [
  { label: 'Low', value: 31, color: '#16A34A' },
  { label: 'Medium', value: 42, color: '#2563EB' },
  { label: 'High', value: 38, color: '#F59E0B' },
  { label: 'Critical', value: 15, color: '#DC2626' },
];

const statusSlices: AdminChartSlice[] = [
  { label: 'Submitted', value: 39, color: '#2563EB' },
  { label: 'In Review', value: 34, color: '#F59E0B' },
  { label: 'Assigned', value: 27, color: '#64748B' },
  { label: 'Resolved', value: 26, color: '#16A34A' },
];

const activityPoints: AdminChartPoint[] = [
  { label: 'Mon', value: 18 },
  { label: 'Mon', value: 24 },
  { label: 'Tue', value: 24 },
  { label: 'Wed', value: 20 },
  { label: 'Thu', value: 29 },
  { label: 'Fri', value: 34 },
];

const resolutionPoints: AdminChartPoint[] = [
  { label: 'Mon', value: 11 },
  { label: 'Tue', value: 16 },
  { label: 'Wed', value: 14 },
  { label: 'Thu', value: 21 },
  { label: 'Fri', value: 27 },
];

import { useUserLocation, FALLBACK_CENTER } from '../../hooks/useUserLocation';

const mapSeeds: AdminMapComplaint[] = [
  {
    id: 'map-seed-1',
    reference: 'CMP-3001',
    citizen: 'Ananya Sharma',
    category: 'pothole',
    department: 'road_works',
    status: 'submitted',
    severity: 'high',
    location: 'Ward 4, Ring Road',
    summary: 'Large pothole cluster requiring immediate patching and traffic diversion.',
    updatedAt: '8 min ago',
    latitude: 28.6182,
    longitude: 77.2149,
  },
  {
    id: 'map-seed-2',
    reference: 'CMP-3002',
    citizen: 'Rohit Kumar',
    category: 'garbage',
    department: 'sanitation',
    status: 'in_review',
    severity: 'medium',
    location: 'Ward 9, Market Lane',
    summary: 'Overflowing waste collection point generating odor and road obstruction.',
    updatedAt: '22 min ago',
    latitude: 28.6078,
    longitude: 77.2194,
  },
  {
    id: 'map-seed-3',
    reference: 'CMP-3003',
    citizen: 'Fatima Khan',
    category: 'streetlight',
    department: 'electricity',
    status: 'assigned',
    severity: 'critical',
    location: 'Ward 2, School Junction',
    summary: 'Critical lighting outage on a busy junction near the school gate.',
    updatedAt: '35 min ago',
    latitude: 28.6211,
    longitude: 77.2023,
  },
  {
    id: 'map-seed-4',
    reference: 'CMP-3004',
    citizen: 'Meera Iyer',
    category: 'water_leakage',
    department: 'water_supply',
    status: 'resolved',
    severity: 'low',
    location: 'Ward 6, Lake View Road',
    summary: 'Leakage at the roadside valve has been repaired and normalized.',
    updatedAt: '1h ago',
    latitude: 28.6039,
    longitude: 77.2067,
  },
  {
    id: 'map-seed-5',
    reference: 'CMP-3005',
    citizen: 'Naveen Singh',
    category: 'open_drain',
    department: 'public_works',
    status: 'in_review',
    severity: 'high',
    location: 'Ward 11, Canal Street',
    summary: 'Open drain segments increasing safety risk during evening traffic.',
    updatedAt: '2h ago',
    latitude: 28.6126,
    longitude: 77.2243,
  },
  {
    id: 'map-seed-6',
    reference: 'CMP-3006',
    citizen: 'Sana Patel',
    category: 'illegal_parking',
    department: 'enforcement',
    status: 'assigned',
    severity: 'medium',
    location: 'Ward 3, Metro Exit',
    summary: 'Repeated obstruction outside the metro exit requiring enforcement action.',
    updatedAt: '3h ago',
    latitude: 28.6314,
    longitude: 77.1986,
  },
];

const buildMapComplaints = (baseLat: number, baseLng: number) =>
  Array.from({ length: 180 }, (_, index) => {
    const seed = mapSeeds[index % mapSeeds.length];
    const ring = Math.floor(index / mapSeeds.length);
    const angle = (index * 137.508 * Math.PI) / 180;
    const spread = 0.0015 + ring * 0.0002;

    // Delhi center is ~28.6139, 77.209. Offset from Delhi:
    const latOffset = seed.latitude - 28.6139;
    const lngOffset = seed.longitude - 77.209;

    return {
      ...seed,
      id: `${seed.id}-${index}`,
      reference: `CMP-${3001 + index}`,
      latitude: baseLat + latOffset + Math.cos(angle) * spread,
      longitude: baseLng + lngOffset + Math.sin(angle) * spread,
      updatedAt: `${(index % 12) + 1} min ago`,
      location: `${seed.location} Cluster ${ring + 1}`,
      summary: `${seed.summary} Report ${index + 1}.`,
    };
  });

function AdminDashboardPage({ onQuickReport, onSwitchToCitizen }: AdminDashboardPageProps) {
  const [filters, setFilters] = useState<AdminFilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState('overview');

  const { lat, lng } = useUserLocation();
  const baseLat = lat !== null ? lat : FALLBACK_CENTER[0];
  const baseLng = lng !== null ? lng : FALLBACK_CENTER[1];

  const mapComplaints = useMemo(() => buildMapComplaints(baseLat, baseLng), [baseLat, baseLng]);

  const filteredComplaints = complaints.filter((complaint) => {
    const departmentMatch = filters.department === 'all' || complaint.department === filters.department;
    const statusMatch = filters.status === 'all' || complaint.status === filters.status;
    const severityMatch = filters.severity === 'all' || complaint.severity === filters.severity;

    return departmentMatch && statusMatch && severityMatch;
  });

  const filteredLatestReports = filteredComplaints.slice(0, 3);

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'complaints', label: 'Complaints', icon: <ListFilter className="h-4 w-4" /> },
    { id: 'hotspots', label: 'Map Hotspots', icon: <Map className="h-4 w-4" /> },
    { id: 'workload', label: 'Departments', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#0f172a] font-sans flex flex-col">
      {/* Top Banner Header */}
      <AppHeader
        currentView="admin"
        onSwitchToCitizen={onSwitchToCitizen}
        onNewReport={onQuickReport}
      />

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 space-y-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
            <span className="font-bold text-[#0f172a] text-sm tracking-tight">Admin Console</span>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                  activeTab === link.id
                    ? 'bg-[#EBF2FF] text-[#2563EB] font-bold'
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0f172a]'
                }`}
              >
                <span className={activeTab === link.id ? 'text-[#2563EB]' : 'text-[#64748B]'}>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100 space-y-1">
            <button
              onClick={onSwitchToCitizen}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 hover:text-[#0f172a] transition"
            >
              <ArrowLeftRight className="h-4 w-4 text-[#64748B]" />
              Citizen Portal
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-rise-in">
              <AdminMetrics metrics={metrics} />

              <ComplaintFilters value={filters} onChange={setFilters} />

              {/* CENTERPIECE LAYOUT: Map is highlighted, Table is secondary */}
              <section className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-6">
                  {/* Map centerpiece */}
                  <ComplaintsMap complaints={mapComplaints} />
                </div>
                
                <div className="space-y-6">
                  {/* Critical alerts sidebar */}
                  <LatestReports reports={filteredLatestReports} />
                  {/* Severity workload */}
                  <SeverityDistribution slices={severitySlices} />
                </div>
              </section>

              {/* Secondary complaint log list */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">System Complaint Registry</h3>
                  <span className="text-xs text-slate-500 font-semibold">Active Records</span>
                </div>
                <ComplaintTable rows={filteredComplaints} />
              </section>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-6 animate-rise-in">
              <ComplaintFilters value={filters} onChange={setFilters} />
              <ComplaintTable rows={filteredComplaints} />
            </div>
          )}

          {activeTab === 'hotspots' && (
            <div className="animate-rise-in">
              <ComplaintsMap complaints={mapComplaints} />
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="space-y-6 animate-rise-in">
              <div className="grid gap-6 md:grid-cols-2">
                <SeverityDistribution slices={severitySlices} />
                <StatusDistribution slices={statusSlices} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <ChartPanel title="Complaint volume trend" subtitle="Daily intake across the last five business days." points={activityPoints} stroke="#2563EB" />
                <ChartPanel title="Resolution trend" subtitle="Daily closures showing operational throughput." points={resolutionPoints} stroke="#16A34A" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;