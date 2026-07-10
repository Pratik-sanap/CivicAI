import { AlertCircle, Bot, Building2, CheckCircle2, Gauge, Sparkles, Tag } from 'lucide-react';
import { SkeletonPanel } from '../../../components/common/Skeleton';
import type { ImageAnalysisResponse } from '../../../types/analysis';

interface AnalysisPanelProps {
  analysis: ImageAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

const prettyLabel = (v: string) =>
  v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const SEVERITY_BAR: Record<string, string> = {
  low:      'bg-green-600',
  medium:   'bg-blue-600',
  high:     'bg-amber-500',
  critical: 'bg-red-600',
};

const SEVERITY_TEXT: Record<string, string> = {
  low:      'text-green-700',
  medium:   'text-blue-700',
  high:     'text-amber-700',
  critical: 'text-red-700',
};

const SEVERITY_BG: Record<string, string> = {
  low:      'bg-green-50 border-green-200',
  medium:   'bg-blue-50 border-blue-200',
  high:     'bg-amber-50 border-amber-200',
  critical: 'bg-red-50 border-red-200',
};

function AnalysisPanel({ analysis, isLoading, error }: AnalysisPanelProps) {
  const confidence = analysis ? Math.round(analysis.confidence * 100) : 0;

  return (
    <section className="gov-card p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 font-sans">
              Gemini Analysis
            </p>
            <h3 className="text-base font-bold text-slate-900">AI Complaint Summary</h3>
          </div>
        </div>
        {analysis && (
          <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-3 px-4 pt-4">
            <span className="h-4 w-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin" />
            <p className="text-xs font-bold text-blue-600">Analyzing with Gemini Vision…</p>
          </div>
          <SkeletonPanel lines={4} />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-bold text-red-950">Analysis failed</p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysis && !isLoading ? (
        <div className="mt-6 space-y-4">
          {/* Issue + Department row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Tag className="h-4 w-4 text-blue-600" />}
              label="Issue Category"
              value={prettyLabel(analysis.category)}
            />
            <InfoCard
              icon={<Building2 className="h-4 w-4 text-blue-600" />}
              label="Department"
              value={prettyLabel(analysis.department)}
            />
          </div>

          {/* Confidence bar */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-500">
                <Gauge className="h-4 w-4 text-slate-400" />
                AI Confidence
              </span>
              <span className={`font-bold ${SEVERITY_TEXT[analysis.severity] ?? 'text-slate-900'}`}>
                {confidence}%
              </span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${SEVERITY_BAR[analysis.severity] ?? 'bg-blue-600'}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span className={`px-2 py-0.5 rounded border ${SEVERITY_BG[analysis.severity] ?? 'border-slate-200 bg-slate-100'}`}>
                {prettyLabel(analysis.severity)} Severity
              </span>
              <span>Priority: {analysis.priority}</span>
            </div>
          </div>

          {/* Complaint draft */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              Generated Complaint Preview
            </div>
            <p className="mt-3 text-xs leading-relaxed font-semibold text-slate-600">{analysis.professional_complaint}</p>
          </div>

          {/* Impact */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estimated Public Impact
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 font-semibold">{analysis.estimated_impact}</p>
          </div>
        </div>
      ) : !isLoading && !error ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/30">
          <Bot className="mx-auto h-10 w-10 text-slate-400" strokeWidth={1.5} />
          <p className="mt-3 text-sm font-bold text-slate-700">
            Awaiting image upload
          </p>
          <p className="mt-1 text-xs text-slate-500 font-semibold">
            Upload a photo and click Analyze to generate a civic complaint
          </p>
        </div>
      ) : null}
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default AnalysisPanel;
