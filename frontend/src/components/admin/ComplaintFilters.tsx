import { Building2, CheckCircle, Filter, ShieldAlert } from 'lucide-react';
import type { AdminFilterState } from '../../types/adminDashboard';

interface ComplaintFiltersProps {
  value: AdminFilterState;
  onChange: (value: AdminFilterState) => void;
}

const selectBase =
  'w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-[#334155] outline-none transition focus:border-blue-500 focus:bg-white cursor-pointer';

function ComplaintFilters({ value, onChange }: ComplaintFiltersProps) {
  const isFiltered =
    value.department !== 'all' || value.status !== 'all' || value.severity !== 'all';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:60ms]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Filter className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Filters
            </p>
            <h2 className="text-lg font-bold text-[#0F172A]">Refine the complaint queue</h2>
          </div>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={() => onChange({ department: 'all', status: 'all', severity: 'all' })}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selects */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <FilterField
          label="Department"
          icon={<Building2 className="h-4 w-4 text-slate-400" />}
        >
          <select
            value={value.department}
            onChange={(e) => onChange({ ...value, department: e.target.value })}
            className={selectBase}
          >
            <option value="all">All departments</option>
            <option value="road_works">Road Works</option>
            <option value="sanitation">Sanitation</option>
            <option value="water_supply">Water Supply</option>
            <option value="electricity">Electricity</option>
            <option value="traffic">Traffic</option>
            <option value="public_works">Public Works</option>
            <option value="parks_and_trees">Parks & Trees</option>
            <option value="enforcement">Enforcement</option>
          </select>
        </FilterField>

        <FilterField
          label="Status"
          icon={<CheckCircle className="h-4 w-4 text-slate-400" />}
        >
          <select
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value })}
            className={selectBase}
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
          </select>
        </FilterField>

        <FilterField
          label="Severity"
          icon={<ShieldAlert className="h-4 w-4 text-slate-400" />}
        >
          <select
            value={value.severity}
            onChange={(e) => onChange({ ...value, severity: e.target.value })}
            className={selectBase}
          >
            <option value="all">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </FilterField>
      </div>
    </section>
  );
}

function FilterField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="group space-y-2">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
        {icon}
        {label}
      </span>
      <div className="relative">
        {children}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}

export default ComplaintFilters;