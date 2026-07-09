import type { LucideIcon } from 'lucide-react';
import { FileQuestion, AlertTriangle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'error';
}

/**
 * EmptyState — reusable placeholder for empty lists, error states, and
 * "no results" scenarios.
 */
export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const iconBg = variant === 'error'
    ? 'bg-rose-50 border border-rose-100 text-rose-600'
    : 'bg-blue-50 border border-blue-100 text-blue-600';

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      {/* Icon Wrapper */}
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-sm ${iconBg}`}>
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      
      <div className="max-w-xs space-y-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/** Pre-configured empty state for no complaints / reports. */
export function NoComplaintsState({ onReport }: { onReport?: () => void }) {
  return (
    <EmptyState
      icon={Inbox}
      title="No active complaints"
      description="Submit your first civic issue report to view tracking status logs."
      action={onReport ? { label: 'Create a Report', onClick: onReport } : undefined}
    />
  );
}

/** Pre-configured empty state for filtered results returning nothing. */
export function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="No matching records"
      description="Try broadening or clearing your active dashboard filters."
      action={onClear ? { label: 'Clear Filters', onClick: onClear } : undefined}
    />
  );
}

export default EmptyState;
