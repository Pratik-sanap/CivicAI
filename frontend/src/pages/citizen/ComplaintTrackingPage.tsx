import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Printer, Download, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import AppHeader from '../../components/layout/AppHeader';

interface ComplaintTrackingPageProps {
  onBack: () => void;
  onSwitchToAdmin?: () => void;
  onQuickReport?: () => void;
}

interface ComplaintDetail {
  id: string;
  title: string;
  category: string;
  status: 'submitted' | 'in_review' | 'assigned' | 'resolved';
  department: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  officialNotes: { date: string; officer: string; comment: string }[];
}

const mockComplaints: Record<string, ComplaintDetail> = {
  'cmp-1024': {
    id: 'cmp-1024',
    title: 'Water overflow near the community market',
    category: 'Water Leakage',
    status: 'in_review',
    department: 'Water Supply & Sewage Department',
    location: 'Ward 7, Market Road (18.5204, 73.8567)',
    createdAt: 'July 6, 2026, 10:30 AM',
    updatedAt: 'July 7, 2026, 09:15 AM',
    severity: 'high',
    summary: 'Water pipe burst causing heavy overflow pooling across the curb and flooding nearby vendors.',
    officialNotes: [
      { date: 'July 7, 2026, 09:15 AM', officer: 'M. Shinde (Asst. Engineer)', comment: 'Site inspection scheduled. Requesting flow shutdown from sector valve A-4.' },
      { date: 'July 6, 2026, 02:40 PM', officer: 'System AI Router', comment: 'Complaint verified and assigned to Water Supply Dept workflow.' }
    ]
  },
  'cmp-1021': {
    id: 'cmp-1021',
    title: 'Broken streetlight at the school junction',
    category: 'Street Light Outage',
    status: 'assigned',
    department: 'Electricity & Public Lighting Division',
    location: 'School Junction, Ward 4 (18.5309, 73.8421)',
    createdAt: 'July 5, 2026, 08:00 PM',
    updatedAt: 'July 6, 2026, 11:00 AM',
    severity: 'medium',
    summary: 'The main sodium light bulb is shattered. Junction is completely dark after sunset.',
    officialNotes: [
      { date: 'July 6, 2026, 11:00 AM', officer: 'R. Kadam (Lineman Unit 3)', comment: 'Work order issued. Replacement bulb and ladder truck dispatched for schedule tomorrow.' },
      { date: 'July 5, 2026, 08:05 PM', officer: 'System AI Router', comment: 'Geotagged image analysis confirmed streetlight bulb damage.' }
    ]
  },
  'cmp-1016': {
    id: 'cmp-1016',
    title: 'Pothole cluster on the ring road',
    category: 'Roads & Potholes',
    status: 'resolved',
    department: 'Municipal Road Works Agency',
    location: 'Ring Road Sector 4, Ward 9 (18.5112, 73.8690)',
    createdAt: 'July 3, 2026, 09:00 AM',
    updatedAt: 'July 4, 2026, 04:30 PM',
    severity: 'low',
    summary: 'Three consecutive deep potholes causing vehicle damage and sudden braking.',
    officialNotes: [
      { date: 'July 4, 2026, 04:30 PM', officer: 'A. Joshi (Road Inspector)', comment: 'Cold-mix asphalt patch applied. Potholes filled, compacted, and traffic flow normal. Photos uploaded to server. Closing complaint.' },
      { date: 'July 3, 2026, 10:15 AM', officer: 'Road Works Desk', comment: 'Engineer scheduled for patrol patch work.' }
    ]
  }
};

function ComplaintTrackingPage({ onBack, onSwitchToAdmin, onQuickReport }: ComplaintTrackingPageProps) {
  const [searchId, setSearchId] = useState('');
  const [activeComplaint, setActiveComplaint] = useState<ComplaintDetail | null>(mockComplaints['cmp-1024']);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    if (!query) return;

    const matched = Object.keys(mockComplaints).find(k => k.toLowerCase() === query);
    if (matched) {
      setActiveComplaint(mockComplaints[matched]);
      setErrorMsg('');
    } else {
      setActiveComplaint(null);
      setErrorMsg('No complaint found with that ID. Try searching: cmp-1024, cmp-1021, or cmp-1016.');
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 0;
      case 'in_review': return 1;
      case 'assigned': return 2;
      case 'resolved': return 3;
      default: return 0;
    }
  };

  const currentStep = activeComplaint ? getStatusStepIndex(activeComplaint.status) : 0;

  const steps = [
    { label: 'Submitted', desc: 'Received & Geotagged' },
    { label: 'Under Review', desc: 'AI Triage & Route' },
    { label: 'Assigned', desc: 'Field Dispatched' },
    { label: 'Resolved', desc: 'Closed & Verified' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      <AppHeader
        currentView="dashboard"
        onSwitchToAdmin={onSwitchToAdmin}
        onNewReport={onQuickReport}
        onBack={onBack}
      />

      <main className="mx-auto max-w-4xl px-6 pb-16 pt-8 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Citizen Lookup
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">Track Complaint Status</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Enter your complaint receipt number below to check real-time progress updates.</p>
        </div>

        {/* Search bar card */}
        <div className="gov-card p-6 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. cmp-1024, cmp-1021, cmp-1016)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-bold focus:border-blue-500 focus:bg-white focus:outline-none transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition duration-200"
            >
              Search Registry
            </button>
          </form>
          {errorMsg && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errorMsg}
            </div>
          )}
        </div>

        {activeComplaint ? (
          <div className="space-y-8 animate-rise-in">
            {/* Header info */}
            <div className="gov-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {activeComplaint.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ID: {activeComplaint.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2.5">{activeComplaint.title}</h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {activeComplaint.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition shadow-sm bg-white"
                    title="Print Receipt"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition shadow-sm bg-white"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Visual Progress Bar */}
              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">Resolution Pipeline Stage</p>
                <div className="relative px-2">
                  
                  {/* Progress Line */}
                  <div className="absolute top-5.5 left-8 right-8 h-1 bg-slate-200 -z-10 rounded-full" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 90}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute top-5.5 left-8 h-1 bg-blue-600 -z-10 rounded-full"
                  />

                  <div className="grid grid-cols-4">
                    {steps.map((st, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={st.label} className="flex flex-col items-center text-center">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.35, delay: idx * 0.1 }}
                            className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCurrent
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-4 ring-blue-100'
                                : isCompleted
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-xs font-extrabold">{idx + 1}</span>
                            )}
                          </motion.div>
                          <p className={`mt-3 text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-900'}`}>{st.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-semibold hidden sm:block">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Details panel */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {/* Summary */}
                <div className="gov-card p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">Complaint Details</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary Report</p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1.5 bg-slate-50 border border-slate-200/50 p-4 rounded-xl">{activeComplaint.summary}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted Date</p>
                        <p className="text-xs text-slate-900 font-bold mt-1">{activeComplaint.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</p>
                        <p className="text-xs text-slate-900 font-bold mt-1">{activeComplaint.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking timeline logs */}
                <div className="gov-card p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">Official Action Log</h3>
                  <div className="mt-5 space-y-5">
                    {activeComplaint.officialNotes.map((note, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex-shrink-0">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900">{note.officer}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{note.date}</p>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/40 leading-relaxed">{note.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department meta info */}
              <div className="space-y-6 col-span-1">
                <div className="gov-card p-5 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Department</p>
                  <div className="mt-3 flex items-start gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{activeComplaint.department}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Official Routing Unit</p>
                    </div>
                  </div>
                </div>

                <div className="gov-card p-5 bg-blue-50/50 border border-blue-200 shadow-sm">
                  <h4 className="text-xs font-bold text-blue-900">Need Assistance?</h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed mt-1.5">If you have additional comments or the issue persists after resolution, contact the assigned department or create a follow-up ticket.</p>
                  <button className="mt-4 w-full bg-white border border-blue-200 rounded-xl py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition shadow-sm">
                    Contact Department
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="gov-card p-12 text-center shadow-sm">
            <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-slate-900">Search for a complaint</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Enter a valid complaint number to inspect its resolution steps, assigned units, and timelines.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ComplaintTrackingPage;
