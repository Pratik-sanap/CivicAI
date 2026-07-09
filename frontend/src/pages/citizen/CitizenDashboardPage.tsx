import { motion } from 'framer-motion';
import CitizenGreeting from '../../components/dashboard/CitizenGreeting';
import ComplaintStatusTimeline from '../../components/dashboard/ComplaintStatusTimeline';
import NearbyIssuesMap from '../../components/dashboard/NearbyIssuesMap';
import RecentComplaints from '../../components/dashboard/RecentComplaints';
import StatisticsCards from '../../components/dashboard/StatisticsCards';
import AppHeader from '../../components/layout/AppHeader';
import type { DashboardComplaint, DashboardMapMarker, DashboardStatCard, DashboardTimelineStep } from '../../types/dashboard';

interface CitizenDashboardPageProps {
  onQuickReport: () => void;
  onSwitchToAdmin?: () => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'report' | 'tracking' | 'admin' | 'heatmap') => void;
}

const dashboardStats: DashboardStatCard[] = [
  { label: 'Open Complaints',  value: '18', change: '+3 this week', tone: 'cyan',    detail: 'Active issues awaiting city action and field verification.' },
  { label: 'In Review',        value: '7',  change: '2 escalated',  tone: 'amber',   detail: 'Reports being assigned to the correct department.' },
  { label: 'Resolved',         value: '41', change: '+12 this month', tone: 'emerald', detail: 'Closed complaints with officer confirmation.' },
  { label: 'Avg. Response',    value: '3.2h', change: '-28%',       tone: 'rose',    detail: 'Average time to first municipal acknowledgement.' },
];

const recentComplaints: DashboardComplaint[] = [
  { id: 'cmp-1024', title: 'Water overflow near the community market', category: 'water_leakage', status: 'in_review', department: 'water_supply', location: 'Ward 7, Market Road', updatedAt: '15 min ago', severity: 'high', summary: 'Overflow pooling across the curb and causing pedestrians to walk on the road shoulder.' },
  { id: 'cmp-1021', title: 'Broken streetlight at the school junction', category: 'streetlight', status: 'assigned', department: 'electricity', location: 'School Junction', updatedAt: '42 min ago', severity: 'medium', summary: 'Junction is poorly lit after sunset — residents have flagged visibility concerns.' },
  { id: 'cmp-1016', title: 'Pothole cluster on the ring road', category: 'pothole', status: 'resolved', department: 'road_works', location: 'Ring Road Sector 4', updatedAt: '2h ago', severity: 'low', summary: 'Temporary patching completed. Road team closed the complaint.' },
];

const timelineSteps: DashboardTimelineStep[] = [
  { title: 'Submitted',    status: 'submitted', count: 24, note: 'Citizens upload photos and location in under a minute.',              accent: 'cyan'    },
  { title: 'Under Review', status: 'in_review', count: 11, note: 'Reports verified for accuracy and routed to correct department.', accent: 'amber'   },
  { title: 'Assigned',     status: 'assigned',  count: 8,  note: 'Work orders issued to field officers or contractors.',               accent: 'rose'    },
  { title: 'Resolved',     status: 'resolved',  count: 41, note: 'Closed issues visible here for accountability tracking.',             accent: 'emerald' },
];

const mapMarkers: DashboardMapMarker[] = [
  { id: 'mk-01', title: 'Market overflow',        location: 'Ward 7', left: 28, top: 32, severity: 'high',     status: 'in_review' },
  { id: 'mk-02', title: 'School junction light',  location: 'Ward 4', left: 60, top: 22, severity: 'medium',   status: 'assigned'  },
  { id: 'mk-03', title: 'Ring road potholes',     location: 'Ward 9', left: 72, top: 68, severity: 'low',      status: 'resolved'  },
  { id: 'mk-04', title: 'Drain blockage',         location: 'Ward 6', left: 40, top: 66, severity: 'critical', status: 'submitted' },
];

function CitizenDashboardPage({ onQuickReport, onSwitchToAdmin, onNavigate }: CitizenDashboardPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <AppHeader
        currentView="dashboard"
        onSwitchToAdmin={onSwitchToAdmin}
        onNewReport={onQuickReport}
        onBack={() => onNavigate('landing')}
      />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-16 pt-8 lg:px-8">
        <CitizenGreeting name="Citizen User" updatedAt="Just now" />
        <StatisticsCards cards={dashboardStats} />

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <RecentComplaints complaints={recentComplaints} onReport={onQuickReport} />
          <ComplaintStatusTimeline steps={timelineSteps} />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <NearbyIssuesMap markers={mapMarkers} />

          <div className="space-y-6">
            {/* Quick actions */}
            <motion.div 
              whileHover={{ y: -4, borderColor: '#CBD5E1', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.04)' }}
              className="gov-card p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Quick Actions
              </p>
              <h3 className="mt-1.5 text-base font-bold text-slate-900">Report and monitor</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Submit a new issue, review complaints, and watch how the city routes hotspots.
              </p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={onQuickReport}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-4 text-left transition duration-200 group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">Create a new report →</p>
                  <p className="mt-1 text-[10px] text-slate-500">Upload photos, add notes, and analyze the issue with Gemini.</p>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('tracking')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-4 text-left transition duration-200 group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">Track existing complaint →</p>
                  <p className="mt-1 text-[10px] text-slate-500">Search by ticket ID to view status progress and actions taken.</p>
                </button>
              </div>
            </motion.div>

            {/* System health */}
            <motion.div 
              whileHover={{ y: -4, borderColor: '#CBD5E1', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.04)' }}
              className="gov-card p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                System Status
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Backend',  status: 'Online' },
                  { label: 'Gemini',   status: 'Ready'  },
                  { label: 'Maps',     status: 'Active' },
                ].map(({ label, status }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
                    <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-green-600 shadow-sm animate-pulse" />
                    <p className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">{label}</p>
                    <p className="mt-1 text-xs font-bold text-slate-900">{status}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CitizenDashboardPage;