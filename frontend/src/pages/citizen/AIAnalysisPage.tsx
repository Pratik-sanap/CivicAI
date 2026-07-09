import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Building2, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Tag, 
  XCircle,
  FileText,
  AlertTriangle,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import AppHeader from '../../components/layout/AppHeader';
import { useToast } from '../../components/common/Toast';
import { SeverityBadge } from '../../components/common/Badge';
import { submitReport } from '../../services/reportApi';
import type { ImageAnalysisResponse } from '../../types/analysis';
import type { ReportCreatePayload } from '../../types/report';

interface AnalysisSession {
  imagePreviewUrl: string;
  imageName:       string;
  imageBase64:     string;
  mimeType:        string;
  notes?:          string;
  location?: {
    latitude:  number;
    longitude: number;
    address?:  string | null;
    ward?:     string | null;
  } | null;
  analysis: ImageAnalysisResponse;
}

interface AIAnalysisPageProps {
  session:           AnalysisSession;
  onSubmitComplaint: () => Promise<void>;
  onAnalyzeAgain:    () => void;
  onBack:            () => void;
  onSwitchToAdmin?:  () => void;
}

const prettyLabel = (v: string) =>
  v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// Custom Typed Text component for ChatGPT feel
function TypedText({ text, speed = 8, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && <span className="typing-cursor" />}
    </span>
  );
}

// SVG Circular Progress Ring
function ConfidenceRing({ confidence }: { confidence: number }) {
  const radius = 34;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#E2E8F0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#2563EB"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-extrabold text-slate-900">{confidence}%</span>
    </div>
  );
}

function AIAnalysisPage({ session, onSubmitComplaint, onAnalyzeAgain, onBack, onSwitchToAdmin }: AIAnalysisPageProps) {
  const { success, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [ticketId] = useState(() => `CIV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);

  // Control sequential typing states
  const [isReasoningComplete, setIsReasoningComplete] = useState(false);

  const { imagePreviewUrl, imageName, analysis } = session;
  const confidence = Math.round(analysis.confidence * 100);

  const handleSubmitComplaint = async () => {
    try {
      setIsSubmitting(true);
      const payload: ReportCreatePayload = {
        image_base64: session.imageBase64,
        mime_type:    session.mimeType,
        notes:        session.notes,
        location:     session.location
          ? {
              latitude:  session.location.latitude,
              longitude: session.location.longitude,
              address:   session.location.address ?? undefined,
              ward:      session.location.ward    ?? undefined,
            }
          : undefined,
      };
      await submitReport(payload);
      setSubmitted(true);
      success('Complaint submitted!', 'Your report has been registered in the municipal database.');
    } catch (err) {
      toastError('Submission failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        <AppHeader
          currentView="analysis"
          onSwitchToAdmin={onSwitchToAdmin}
          onSwitchToCitizen={onBack}
          onBack={onBack}
        />
        
        <main className="flex-grow flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-lg text-center space-y-6"
          >
            {/* Animated Check */}
            <div className="mx-auto h-16 w-16 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-9 w-9 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Complaint Filed Successfully</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
                Your report has been verified, geotagged, and registered in the city registry queue.
              </p>
            </div>

            {/* Receipt container */}
            <div className="border border-dashed border-slate-200 rounded-2xl p-5 text-left bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Official Registry Receipt</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">AI Routing Confirmed</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket Reference</p>
                  <p className="text-slate-900 font-bold mt-0.5">{ticketId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Department</p>
                  <p className="text-slate-900 font-bold mt-0.5">{prettyLabel(analysis.department)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Response Limit</p>
                  <p className="text-amber-700 font-bold mt-0.5">24 Hours (High Priority)</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Intake Date</p>
                  <p className="text-slate-900 font-bold mt-0.5">
                    {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 font-semibold leading-relaxed">
                A field officer will inspect the location coordinates to verify repair status. You can monitor progress in the Citizen Portal using the Ticket ID.
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onSubmitComplaint}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm transition duration-200"
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition duration-200 bg-white"
              >
                Print Receipt
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Mocked reasoning if missing from analysis API payload
  const reasoningText = (analysis as any).reasoning || `Detected a ${prettyLabel(analysis.category).toLowerCase()} with ${analysis.severity} severity rating. The damage is located within public limits and presents immediate risks to road/pedestrian safety. Automated routing dispatch is recommended for the ${prettyLabel(analysis.department)}.`;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AppHeader
        currentView="analysis"
        onSwitchToAdmin={onSwitchToAdmin}
        onSwitchToCitizen={onBack}
        onBack={onBack}
      />

      <main className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 grid gap-8 lg:grid-cols-2">

        {/* LEFT — Image Preview Panel */}
        <section className="space-y-6">
          <div className="gov-card p-6 shadow-sm overflow-hidden flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Uploaded Evidence
                  </p>
                </div>
                <SeverityBadge severity={analysis.severity as any} size="md" />
              </div>
              
              <h2 className="text-base font-bold text-slate-900 truncate">{imageName}</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Location: {session.location?.address ?? `${session.location?.latitude.toFixed(5)}, ${session.location?.longitude.toFixed(5)}`}
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 shadow-sm relative">
                <img
                  src={imagePreviewUrl}
                  alt={imageName}
                  className="h-80 w-full object-cover"
                />
              </div>
            </div>

            {session.notes && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Citizen Notes</p>
                <p className="text-xs text-slate-600 mt-1 font-semibold leading-relaxed">{session.notes}</p>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT — ChatGPT Inspired AI Analysis */}
        <section className="flex flex-col space-y-6">
          
          {/* Chat Window Style Container */}
          <div className="gov-card p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* User Mock Message */}
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 max-w-md">
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    Analyze this photo, estimate details, routing department, severity and draft a municipal complaint.
                  </p>
                </div>
              </div>

              {/* Gemini Chat Assistant Message */}
              <div className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm border border-blue-700">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                
                <div className="flex-1 space-y-5 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Gemini Vision AI Response
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                      <ConfidenceRing confidence={confidence} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Confidence</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">High Certainty</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                      <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{prettyLabel(analysis.department)}</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">SLA Dispatch: 24/7 Crew</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                      <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <AlertTriangle className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority / SLA</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">SLA: {analysis.priority === 'high' || analysis.priority === 'critical' ? '24 Hours' : '72 Hours'}</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Clock className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Resolution</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">2-3 Business Days</p>
                        <p className="text-[9px] text-green-600 font-semibold mt-0.5">High Performance SLA</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning (Typed progressive text) */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Reasoning</p>
                    <div className="text-xs leading-relaxed text-slate-600 font-semibold bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <TypedText 
                        text={reasoningText} 
                        speed={8}
                        onComplete={() => setIsReasoningComplete(true)} 
                      />
                    </div>
                  </div>

                  {/* Generated Complaint (Typed after reasoning completes) */}
                  {isReasoningComplete && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3 w-3 text-blue-600" />
                        Generated Complaint Letter
                      </p>
                      <div className="text-xs leading-relaxed text-slate-600 font-semibold bg-blue-50/40 border border-blue-100 p-4 rounded-xl">
                        <TypedText text={analysis.complaint} speed={6} />
                      </div>
                    </motion.div>
                  )}

                  {/* Estimated Impact */}
                  {isReasoningComplete && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Impact</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">{analysis.impact}</p>
                    </motion.div>
                  )}

                </div>
              </div>

            </div>

            {/* Sticky Actions panel at bottom of chat */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSubmitComplaint}
                disabled={isSubmitting || submitted}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75 transition duration-200"
              >
                {submitted ? (
                  <><CheckCircle2 className="h-4 w-4" />Complaint Submitted!</>
                ) : isSubmitting ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Submitting…</>
                ) : (
                  <><Send className="h-4 w-4" />File Official Complaint</>
                )}
              </button>
              <button
                type="button"
                onClick={onAnalyzeAgain}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition duration-200"
              >
                <XCircle className="h-4 w-4 text-slate-400" />
                Discard
              </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default AIAnalysisPage;
