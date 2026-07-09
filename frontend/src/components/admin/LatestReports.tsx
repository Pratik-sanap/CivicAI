import type { AdminComplaintRow } from '../../types/adminDashboard';

interface LatestReportsProps {
  reports: AdminComplaintRow[];
}

const severityAccent = {
  low: 'text-green-600 font-semibold',
  medium: 'text-blue-600 font-semibold',
  high: 'text-amber-500 font-semibold',
  critical: 'text-red-600 font-semibold',
} as const;

function LatestReports({ reports }: LatestReportsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-rise-in [animation-delay:120ms]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Latest Reports</p>
      <h2 className="mt-2 text-lg font-bold text-[#0F172A]">Newest municipal intake</h2>

      <div className="mt-5 grid gap-4">
        {reports.map((report) => (
          <article key={report.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">{report.reference}</p>
                <p className="mt-1 text-xs font-semibold text-[#334155]">{report.citizen}</p>
              </div>
              <p className={`text-xs ${severityAccent[report.severity]}`}>{report.updatedAt}</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#64748B] font-medium">
              <span className="font-semibold text-[#334155]">{report.category}</span> routed to <span className="font-semibold text-[#334155]">{report.department}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LatestReports;