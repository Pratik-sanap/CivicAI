const stats = [
  { value: '25K+', label: 'Issues reported with AI assistance' },
  { value: '92%', label: 'Faster complaint drafting' },
  { value: '18', label: 'Civic issue categories detected' },
  { value: '4.8/5', label: 'Citizen satisfaction score' },
];

const features = [
  {
    title: 'AI Issue Detection',
    description:
      'Upload a photo and let Gemini Vision detect the civic problem, category, and severity in seconds.',
  },
  {
    title: 'Auto Complaint Drafting',
    description:
      'Generate a professional complaint message with the right municipal tone and the proper department.',
  },
  {
    title: 'Live Map Tracking',
    description:
      'Pin reports on an interactive Google Maps heatmap and monitor clusters by neighborhood.',
  },
  {
    title: 'Citizen Status Updates',
    description:
      'Give citizens a clear view of progress, resolution timelines, and evidence-backed updates.',
  },
];

const steps = [
  'Upload a photo of a civic issue.',
  'Gemini Vision classifies the problem and estimates severity.',
  'The platform drafts a complaint and routes it to the right authority.',
  'Municipal officers review, update status, and resolve the issue.',
];

const sdgs = [
  'SDG 11 - Sustainable Cities',
  'SDG 9 - Industry, Innovation and Infrastructure',
  'SDG 16 - Peace, Justice and Strong Institutions',
];

const testimonials = [
  {
    name: 'Aarav Mehta',
    role: 'Citizen',
    quote:
      'I reported a broken streetlight in under a minute. The AI drafted the complaint and showed me where it was logged.',
  },
  {
    name: 'Drishti Shah',
    role: 'Municipal Officer',
    quote:
      'The map view helps our team spot clusters immediately. It makes triage far more efficient than spreadsheets.',
  },
  {
    name: 'Rohan Iyer',
    role: 'Housing Society Manager',
    quote:
      'Residents now know exactly how to raise civic issues with evidence. The workflow feels modern and credible.',
  },
];

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.22),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(8,15,31,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-drift" />
        <div className="absolute right-12 top-40 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl animate-floaty" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl animate-drift" />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 text-lg font-bold text-white shadow-glow">
            C
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide">CivicAI</p>
            <p className="text-xs text-slate-300">Modern Government Technology + AI</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
          <a href="#sdgs" className="transition hover:text-white">SDGs</a>
          <a href="#testimonials" className="transition hover:text-white">Testimonials</a>
        </nav>
        <a
          href="#hero"
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-blue-300/40 hover:bg-white/10"
        >
          Launch Demo
        </a>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <section id="hero" className="grid items-center gap-14 py-10 lg:grid-cols-2 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              AI-powered civic reporting for modern cities
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Turn every civic issue into an actionable report.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
              CivicAI helps citizens upload a photo, detect the issue with Gemini Vision, draft a professional complaint,
              and route it to the right municipal department with map-based tracking.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] hover:shadow-blue-500/40"
              >
                Start Reporting Issues
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">React + Tailwind</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Gemini Vision</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Google Maps Heatmap</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Supabase Ready</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-blue-500/25 blur-2xl" />
            <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(59,130,246,0.06))]" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between rounded-3xl border border-dashed border-blue-300/30 bg-slate-950/60 p-5">
                  <div>
                    <p className="text-sm text-slate-400">Upload Illustration</p>
                    <p className="mt-1 text-lg font-semibold">Drop a civic issue photo</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 text-2xl">
                    ⬆
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Detected Issue</p>
                    <p className="mt-3 text-2xl font-bold text-white">Pothole</p>
                    <p className="mt-2 text-sm text-slate-300">Category: Road Infrastructure</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Severity</p>
                    <p className="mt-3 text-2xl font-bold text-emerald-300">High</p>
                    <p className="mt-2 text-sm text-slate-300">Auto-routed to Road & Works</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Complaint Draft</span>
                    <span>Ready to submit</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    A severe pothole has been detected on the main road near Sector 14. Immediate repair is requested to
                    prevent traffic hazards and ensure public safety.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <div className="h-3 w-3 rounded-full bg-white/40" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">AI Analysis</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Map Pin</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Status Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-10 lg:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">Features</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Everything a civic operations team needs to move faster.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/8">
                <div className="mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400" />
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-10 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">How It Works</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">A simple flow designed for citizens and officers.</h2>
              <p className="mt-4 max-w-xl text-slate-300">
                The MVP keeps the experience frictionless: upload, analyze, draft, route, and resolve. No unnecessary steps.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-900/65 p-5 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-16">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="sdgs" className="py-10 lg:py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-emerald-950/60 p-8 backdrop-blur-xl lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">SDGs</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Aligned with sustainable, accountable, and inclusive city growth.</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              {sdgs.map((sdg) => (
                <span key={sdg} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
                  {sdg}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-10 lg:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Built for real civic stakeholders.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm leading-7 text-slate-200">“{item.quote}”</p>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 bg-slate-950/80 px-6 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-semibold text-white">CivicAI</p>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Modern Government Technology + AI for civic issue reporting, municipal response, and public accountability.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
            <a href="#sdgs" className="transition hover:text-white">SDGs</a>
            <a href="#testimonials" className="transition hover:text-white">Testimonials</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;