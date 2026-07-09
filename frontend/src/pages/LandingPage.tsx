import { motion } from 'framer-motion';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Map, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Users, 
  MessageSquare,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'report' | 'tracking' | 'admin' | 'heatmap') => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  const stats = [
    { label: 'Total Verified Reports', value: '14,280', detail: 'Submitted by citizens' },
    { label: 'Resolved Tickets', value: '12,940', detail: '90.6% resolution rate' },
    { label: 'Active Departments', value: '14', detail: 'Coordinated response' },
    { label: 'Average Response Time', value: '2.4 hrs', detail: 'Acknowledge to dispatch' },
  ];

  const quickActions = [
    {
      title: 'Citizen Portal',
      desc: 'Access your personalized civic assistant. Track your issues, view recent resolutions, and interact with the local map.',
      cta: 'Open Dashboard',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      action: () => onNavigate('dashboard'),
    },
    {
      title: 'Report a Civic Issue',
      desc: 'Upload a photo of a pothole, street light outage, or waste dump. Gemini AI classifies it instantly and tags coordinates.',
      cta: 'Submit Report',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      action: () => onNavigate('report'),
    },
    {
      title: 'Track Complaint Status',
      desc: 'Enter a complaint receipt ID to view real-time status logs, officer assignment details, and official summaries.',
      cta: 'Track Status',
      icon: <Activity className="h-6 w-6 text-emerald-600" />,
      action: () => onNavigate('tracking'),
    },
    {
      title: 'City Heatmap',
      desc: 'Check live geospatial hotspots of verified civic issues, active maintenance zones, and repair schedules in your ward.',
      cta: 'Open Heatmap',
      icon: <Map className="h-6 w-6 text-blue-600" />,
      action: () => onNavigate('heatmap'),
    },
  ];

  const steps = [
    { n: '01', title: 'Capture & Upload', desc: 'Snap a photo on-site. The portal automatically extracts geotagged metadata and location.' },
    { n: '02', title: 'AI Categorization', desc: 'Gemini analyzes the image to classify category, priority, severity, and department routing.' },
    { n: '03', title: 'Official Dispatch', desc: 'The designated municipality unit reviews the work order and dispatches a field crew.' },
    { n: '04', title: 'Verified Resolution', desc: 'Work is completed and photographed. Citizens receive notifications and ticket closure.' },
  ];

  const capabilities = [
    {
      title: 'Gemini Vision AI Routing',
      desc: 'Instantly identifies infrastructure failure types, assesses damage severity, and forwards requests to public works, sanitation, or electrical departments without human delay.',
      icon: <Sparkles className="h-5 w-5 text-blue-600" />
    },
    {
      title: 'Verifiable Audit Timelines',
      desc: 'Every ticket features a cryptographic timeline tracking officer assignments, ETA adjustments, and visual proof-of-work updates for total transparency.',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    },
    {
      title: 'Dynamic Workload Balancing',
      desc: 'Distributes civic workloads across municipal units automatically, reducing bottlenecked departments and ensuring compliance with SLA timelines.',
      icon: <Activity className="h-5 w-5 text-blue-600" />
    }
  ];

  const testimonials = [
    {
      quote: "CivicAI has completely transformed our response workflows. We reduced response times for water leaks from 12 hours to under 45 minutes.",
      author: "Rajesh Shinde",
      role: "Superintendent Engineer, Water Supply & Sewage",
    },
    {
      quote: "Being able to see exactly when my streetlight complaint was assigned to an electrician gave me confidence that the city is actually listening.",
      author: "Priya Nair",
      role: "Resident, Ward 4",
    },
    {
      quote: "The dashboard gives us immediate operational awareness of where pothole hotspots are developing across the metro ring road sectors.",
      author: "Dr. A. K. Verma",
      role: "Municipal Commissioner",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">CivicAI</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Municipal Governance System
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">Citizen Dashboard</button>
            <button onClick={() => onNavigate('report')} className="hover:text-blue-600 transition">Report Issue</button>
            <button onClick={() => onNavigate('tracking')} className="hover:text-blue-600 transition">Track Status</button>
            <button onClick={() => onNavigate('heatmap')} className="hover:text-blue-600 transition">City Heatmap</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <ShieldCheck className="h-4 w-4" />
              Officer Login
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Report an Issue
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Next-Gen Municipal Governance Platform
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:leading-[1.12] text-gov-hero">
              The trustworthy bridge between citizens and city officials.
            </h1>
            
            <p className="mt-6 text-base leading-relaxed text-slate-500 text-gov-body">
              CivicAI combines instant AI detection, automated routing, and open public tracking to resolve potholes, outages, and hazards quickly, transparently, and accountably.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('report')}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
              >
                Report an Issue
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Access Dashboard
              </button>
            </div>


          </motion.div>

          {/* Right Column: Isometric Smart City Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative flex justify-center w-full"
          >
            <div className="w-full max-w-lg aspect-[5/4] rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm relative overflow-hidden flex items-center justify-center">
              
              {/* Isometric SVG Illustration */}
              <svg viewBox="0 0 500 400" className="w-full h-full text-slate-300">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
                  </linearGradient>
                  <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Grid Lines (Isometric Background) */}
                <path d="M 0 100 L 500 350 M 0 200 L 500 450 M 0 0 L 500 250 M 500 100 L 0 350 M 500 200 L 0 450 M 500 0 L 0 250" stroke="#E2E8F0" strokeWidth="1" strokeOpacity="0.6" />

                {/* Roads */}
                {/* Main Road Left-to-Right */}
                <path d="M 0 180 L 500 330 L 500 370 L 0 220 Z" fill="url(#roadGrad)" />
                {/* Crossing Road Right-to-Left */}
                <path d="M 380 80 L 120 380 L 80 380 L 340 80 Z" fill="url(#roadGrad)" />

                {/* Road Dashed Lines */}
                <path d="M 0 200 L 500 350" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 8" strokeOpacity="0.7" />
                <path d="M 360 90 L 100 380" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 8" strokeOpacity="0.7" />

                {/* Buildings (Prisms) */}
                {/* Building 1: Tall glass office building */}
                {/* Left side */}
                <path d="M 180 120 L 140 140 L 140 60 L 180 40 Z" fill="#94A3B8" />
                {/* Right side */}
                <path d="M 180 120 L 220 100 L 220 20 L 180 40 Z" fill="#64748B" />
                {/* Top */}
                <path d="M 180 40 L 140 60 L 180 80 L 220 60 Z" fill="#CBD5E1" />

                {/* Building 2: Civic Center */}
                {/* Left side */}
                <path d="M 380 200 L 340 220 L 340 160 L 380 140 Z" fill="#94A3B8" />
                {/* Right side */}
                <path d="M 380 200 L 420 180 L 420 120 L 380 140 Z" fill="#475569" />
                {/* Top */}
                <path d="M 380 140 L 340 160 L 380 180 L 420 160 Z" fill="#CBD5E1" />

                {/* Pothole on main road */}
                <ellipse cx="220" cy="270" rx="16" ry="7" fill="#1E293B" />
                <ellipse cx="220" cy="270" rx="12" ry="5" fill="#0F172A" />
                {/* Crack lines */}
                <path d="M 200 270 L 195 273 M 236 270 L 242 268 M 220 277 L 222 284" stroke="#0F172A" strokeWidth="1" />

                {/* Garbage Overflow at the road side */}
                <path d="M 90 240 Q 95 230 105 235 T 120 240 Q 115 250 100 248 Z" fill="#78350F" />
                <path d="M 95 242 Q 100 235 108 238 T 115 242 Z" fill="#B45309" />

                {/* Water Leakage puddle */}
                <ellipse cx="320" cy="300" rx="22" ry="9" fill="url(#waterGrad)" />
                <ellipse cx="320" cy="300" rx="15" ry="6" stroke="#93C5FD" strokeWidth="1" fill="none" strokeOpacity="0.8" />

                {/* Underground Water Pipe System (Civic Infrastructure Focus) */}
                <path d="M 120 380 L 320 300" stroke="#64748B" strokeWidth="6" strokeOpacity="0.35" />
                <path d="M 120 380 L 320 300" stroke="#3B82F6" strokeWidth="3" strokeDasharray="10 15" strokeOpacity="0.7" />
                <circle cx="320" cy="300" r="4" fill="#3B82F6" opacity="0.8" />

                {/* Street Light Outage */}
                {/* Light Pole */}
                <line x1="280" y1="210" x2="280" y2="150" stroke="#475569" strokeWidth="3" />
                {/* Arm */}
                <line x1="280" y1="150" x2="260" y2="160" stroke="#475569" strokeWidth="2.5" />
                {/* Lamp head */}
                <circle cx="260" cy="160" r="4.5" fill="#334155" />
                {/* Blinking Red Error Light Ring */}
                <circle cx="260" cy="160" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

                {/* AI Detection Markers (Pointer rings + connection lines) */}
                {/* Garbage detection */}
                <ellipse cx="105" cy="245" rx="20" ry="9.5" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
                {/* Pothole detection */}
                <ellipse cx="220" cy="270" rx="24" ry="11" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
                {/* Water Leakage detection */}
                <ellipse cx="320" cy="300" rx="28" ry="12.5" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Connection dashed vertical lines to float cards */}
                <line x1="105" y1="245" x2="105" y2="130" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.6" />
                <line x1="220" y1="270" x2="220" y2="300" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.6" />
                <line x1="260" y1="160" x2="260" y2="60" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.6" />
                <line x1="320" y1="300" x2="320" y2="210" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.6" />
              </svg>

              {/* Floating status cards - Card 1: Garbage Overflow */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-[18%] left-[6%] bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex items-center gap-2 max-w-[150px]"
              >
                <div className="h-5 w-5 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-200">
                  <ShieldAlert className="h-3 w-3 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-800 truncate">Garbage Overflow</p>
                  <p className="text-[9px] text-amber-600 font-semibold uppercase tracking-wider">AI Confirmed 94%</p>
                </div>
              </motion.div>

              {/* Floating status cards - Card 2: Street Light Failure */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[8%] right-[10%] bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex items-center gap-2 max-w-[160px]"
              >
                <div className="h-5 w-5 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-200">
                  <Clock className="h-3 w-3 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-800 truncate">Light Outage</p>
                  <p className="text-[9px] text-red-600 font-semibold uppercase tracking-wider">SLA Escalated</p>
                </div>
              </motion.div>

              {/* Floating status cards - Card 3: Pothole Detected */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[24%] left-[28%] bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex items-center gap-2 max-w-[150px]"
              >
                <div className="h-5 w-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-200">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-800 truncate">Road Pothole</p>
                  <p className="text-[9px] text-blue-600 font-semibold uppercase tracking-wider">AI Routed (PWD)</p>
                </div>
              </motion.div>

              {/* Floating status cards - Card 4: Water Leakage */}
              <motion.div 
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.2 }}
                className="absolute bottom-[35%] right-[6%] bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm flex items-center gap-2 max-w-[150px]"
              >
                <div className="h-5 w-5 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-800 truncate">Water Leakage</p>
                  <p className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Job Completed</p>
                </div>
              </motion.div>
              
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Statistics Section ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {stats.map((st) => (
              <div key={st.label} className="pt-6 sm:pt-0">
                <p className="text-4xl font-extrabold text-blue-600 tracking-tight">
                  <AnimatedCounter value={st.value} />
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">{st.label}</p>
                <p className="text-xs text-slate-500 mt-1">{st.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Actions / Services Section ───────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-gov-section">Access Civic Services</h2>
            <p className="mt-3 text-slate-500 text-sm">Select an option below to engage with municipal services, report city concerns, or monitor resolution timelines.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((act) => (
              <div key={act.title} className="gov-card p-6 flex flex-col justify-between hover:border-slate-300 transition duration-200 group">
                <div>
                  <div className="mb-5 inline-flex items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {act.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{act.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{act.desc}</p>
                </div>
                <button
                  onClick={act.action}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition"
                >
                  {act.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How CivicAI Works Section ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-gov-section">How CivicAI Works</h2>
            <p className="mt-3 text-slate-500 text-sm">Four simple, automated steps that connect street-level hazards directly to field resolution teams.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {steps.map((st) => (
              <div key={st.title} className="relative flex flex-col items-center text-center group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-lg mb-5 border border-blue-200 shadow-sm">
                  {st.n}
                </div>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500 px-2">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Capabilities Section ────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-gov-section">Municipal AI Capabilities</h2>
            <p className="mt-3 text-slate-500 text-sm">Powering administrative operations with state-of-the-art vision and routing integrations.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
                  {cap.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{cap.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UN SDG Impact Section ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-gov-section">Global SDG Alignment</h2>
            <p className="mt-3 text-slate-500 text-sm">CivicAI works toward the UN Sustainable Development Goals for inclusive, safe, and resilient cities.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#F97316] text-white font-extrabold text-xl border border-orange-500">
                11
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">SDG 11: Sustainable Cities & Communities</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                  By building direct channels to report municipal decay, road damage, and safety hazard failures, CivicAI makes human settlements inclusive, safe, resilient, and sustainable.
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] text-white font-extrabold text-xl border border-blue-700">
                16
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">SDG 16: Peace, Justice & Strong Institutions</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                  Promotes transparent, responsive governance via public tracking timelines, open maps, and verifiable audit records that secure department accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-gov-section">Field Reports & Testimonials</h2>
            <p className="mt-3 text-slate-500 text-sm">Real impact from citizens and government officers using CivicAI day-to-day.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <p className="text-xs italic leading-relaxed text-slate-600">"{t.quote}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{t.author}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <MapPin className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-white text-base">CivicAI</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Official municipal reporting tool powered by state-of-the-art AI analysis. Created to bridge communication between citizens and city maintenance crews.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">System Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">Citizen Dashboard</button></li>
              <li><button onClick={() => onNavigate('report')} className="hover:text-white transition">Submit Report</button></li>
              <li><button onClick={() => onNavigate('tracking')} className="hover:text-white transition">Track Ticket</button></li>
              <li><button onClick={() => onNavigate('heatmap')} className="hover:text-white transition">City Map</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Administration & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><span>Emergency Dispatch: 311 / 911</span></li>
              <li><span>Email Support: help@municipal.gov</span></li>
              <li><span>Privacy Guidelines & Terms of Service</span></li>
              <li><span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-slate-700">Official Gov Tech</span></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CivicAI. All rights reserved. Government Department of Information and Infrastructure.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
