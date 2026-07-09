import { ArrowUpDown } from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import { NoComplaintsState } from '../common/EmptyState';
import type { AdminComplaintRow } from '../../types/adminDashboard';
import type { ReportStatus, SeverityLevel } from '../../types/report';

interface ComplaintTableProps {
  rows: AdminComplaintRow[];
}

const prettyLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

function ComplaintTable({ rows }: ComplaintTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:80ms]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Complaint Queue
          </p>
          <h2 className="mt-1.5 text-lg font-bold text-[#0F172A]">
            Municipal operations view
          </h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#64748B]">
          {rows.length} record{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table Container */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        {rows.length === 0 ? (
          <div className="bg-white">
            <NoComplaintsState />
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-slate-200 text-left relative">
              <thead className="sticky top-0 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-slate-200 z-10">
                <tr>
                  {['Reference', 'Citizen', 'Category', 'Department', 'Status', 'Severity', 'Location', 'Updated'].map(
                    (col) => (
                      <th key={col} className="px-4 py-3 bg-slate-50">
                        <span className="inline-flex items-center gap-1.5">
                          {col}
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        </span>
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-[#334155]">
                {rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`group cursor-default transition-colors duration-150 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    } hover:bg-blue-50/50`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#2563EB]">
                      {row.reference}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#0F172A]">{row.citizen}</td>
                    <td className="px-4 py-3.5 text-[#334155]">{prettyLabel(row.category)}</td>
                    <td className="px-4 py-3.5 text-[#334155]">{prettyLabel(row.department)}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status as ReportStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <SeverityBadge severity={row.severity as SeverityLevel} />
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B]">{row.location}</td>
                    <td className="px-4 py-3.5 text-xs text-[#64748B]">{row.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ComplaintTable;