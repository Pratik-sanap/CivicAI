import { MapPin, Plus, ShieldCheck, User } from 'lucide-react';

type AppView = 'admin' | 'dashboard' | 'report' | 'analysis';

interface AppHeaderProps {
  currentView: AppView;
  onSwitchToCitizen?: () => void;
  onSwitchToAdmin?: () => void;
  onNewReport?: () => void;
  onBack?: () => void;
}

/**
 * AppHeader — shared glassmorphism navigation bar across all views.
 * Shows logo, view-mode tabs, and contextual action buttons.
 */
function AppHeader({
  currentView,
  onSwitchToCitizen,
  onSwitchToAdmin,
  onNewReport,
  onBack,
}: AppHeaderProps) {
  const isCitizen = currentView === 'dashboard' || currentView === 'report' || currentView === 'analysis';
  const isAdmin   = currentView === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">CivicAI</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
              Smart Civic Platform
            </p>
          </div>
        </div>

        {/* ── Mode tabs ─────────────────────────────────────────────────── */}
        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 sm:flex">
          <TabButton
            label="Citizen Dashboard"
            icon={<User className="h-3.5 w-3.5" />}
            active={isCitizen}
            onClick={onSwitchToCitizen}
          />
          <TabButton
            label="Officer Portal"
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            active={isAdmin}
            onClick={onSwitchToAdmin}
          />
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Back
            </button>
          )}
          {onNewReport && (
            <button
              type="button"
              onClick={onNewReport}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              New Report
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

// ─── Tab button ────────────────────────────────────────────────────────────────

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}

export default AppHeader;
