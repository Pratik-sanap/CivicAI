import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Bot, Check, Loader2 } from 'lucide-react';

import AnalysisPanel from '../../components/forms/report-issue/AnalysisPanel';
import LocationCard from '../../components/forms/report-issue/LocationCard';
import NotesField from '../../components/forms/report-issue/NotesField';
import UploadDropzone from '../../components/forms/report-issue/UploadDropzone';
import AppHeader from '../../components/layout/AppHeader';
import { useToast } from '../../components/common/Toast';
import { analyzeImageIssue } from '../../services/reportApi';
import type { ImageAnalysisResponse } from '../../types/analysis';
import type { LocationSnapshot, ReportIssueFormValues } from '../../types/report';
import { fileToDataUrl } from '../../utils/image';

interface ReportIssuePageProps {
  onOpenAnalysis?: (session: {
    imagePreviewUrl: string;
    imageName: string;
    imageBase64: string;
    mimeType: string;
    notes?: string;
    location?: LocationSnapshot | null;
    analysis: ImageAnalysisResponse;
  }) => void;
  onBackToDashboard?: () => void;
  onSwitchToAdmin?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unable to analyze the report right now. Please try again.';
}

const WORKFLOW_STEPS = [
  { n: '1', text: 'Upload a photo or capture one with the camera button.' },
  { n: '2', text: 'Attach your current location so the report is geotagged on the map.' },
  { n: '3', text: 'Click Analyze & Upload — Gemini Vision generates the professional complaint.' },
];

const ANALYSIS_STEPS = [
  'Upload Complete',
  'Analyzing Image...',
  'Detecting Issue...',
  'Estimating Severity...',
  'Identifying Department...',
  'Generating Complaint...',
  'Completed'
];

function ReportIssuePage({ onOpenAnalysis, onBackToDashboard, onSwitchToAdmin }: ReportIssuePageProps) {
  const { success, error: toastError } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReportIssueFormValues>({
    defaultValues: { notes: '' },
  });

  const [file, setFile]                   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]       = useState<string | null>(null);
  const [location, setLocation]           = useState<LocationSnapshot | null>(null);
  const [isLocating, setIsLocating]       = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [analysis, setAnalysis]           = useState<ImageAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Progressive analysis animation states
  const [activeStep, setActiveStep]       = useState<number>(-1);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelected = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toastError('Invalid file type', 'Please upload a JPEG, PNG, HEIC, or WebP image.');
      return;
    }
    setFile(f);
    setAnalysis(null);
    setAnalysisError(null);
  };

  const handleClearFile = () => { setFile(null); setAnalysis(null); setAnalysisError(null); };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }
    setLocationError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          label:    `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        });
        setIsLocating(false);
        success('Location captured', 'Your current coordinates have been attached.');
      },
      (err) => {
        setLocationError(err.message || 'Unable to fetch your current location.');
        setIsLocating(false);
        toastError('Location error', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const clearLocation = () => { setLocation(null); setLocationError(null); };

  const onSubmit = async (values: ReportIssueFormValues) => {
    if (!file) {
      toastError('No image selected', 'Please upload a civic issue photo before analyzing.');
      setAnalysisError('Please upload a civic issue image before analyzing.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setActiveStep(0); // Start progressive sequence

      const locationContext = location ? `Current location: ${location.label}.` : '';
      const combined = [values.notes.trim(), locationContext].filter(Boolean).join(' ');

      // Trigger Gemini API and file loading in background
      const apiPromise = Promise.all([
        analyzeImageIssue(file, combined || undefined),
        fileToDataUrl(file),
      ]);

      // Set up stepper timer
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < 5) {
          stepIndex += 1;
          setActiveStep(stepIndex);
        } else {
          clearInterval(interval);
        }
      }, 700);

      // Wait for both API response and step progress
      const [apiResults] = await Promise.all([
        apiPromise,
        new Promise((resolve) => {
          const checkProgress = setInterval(() => {
            if (stepIndex >= 5) {
              clearInterval(checkProgress);
              resolve(true);
            }
          }, 100);
        })
      ]);

      const [createdAnalysis, imageDataUrl] = apiResults;

      // Final Step: Completed
      setActiveStep(6);
      clearInterval(interval);

      // Delay briefly to allow user to see "Completed" check
      setTimeout(() => {
        setAnalysis(createdAnalysis);
        reset({ notes: '' });
        setIsAnalyzing(false);
        onOpenAnalysis?.({
          imagePreviewUrl: imageDataUrl,
          imageName:       file.name,
          imageBase64:     imageDataUrl,
          mimeType:        file.type,
          notes:           values.notes.trim() || undefined,
          location,
          analysis:        createdAnalysis,
        });
      }, 800);

    } catch (err) {
      const msg = getErrorMessage(err);
      setAnalysisError(msg);
      toastError('Analysis failed', msg);
      setIsAnalyzing(false);
      setActiveStep(-1);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AppHeader
        currentView="report"
        onSwitchToAdmin={onSwitchToAdmin}
        onSwitchToCitizen={onBackToDashboard}
        onBack={onBackToDashboard}
      />

      <main className="relative mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        
        {/* Progressive Analysis Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-50/90 backdrop-blur-md z-30 flex items-center justify-center p-6 rounded-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-lg space-y-6 text-center"
              >
                {previewUrl && (
                  <div className="relative mx-auto h-36 w-52 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <img src={previewUrl} className="h-full w-full object-cover" alt="Uploading evidence" />
                    <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
                  </div>
                )}
                
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600 animate-bounce" />
                    Gemini Vision AI Engine
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Processing civic evidence metadata and location tags</p>
                </div>

                {/* Steps List */}
                <div className="text-left space-y-3 pt-2 max-w-xs mx-auto">
                  {ANALYSIS_STEPS.map((step, idx) => {
                    const isDone = activeStep > idx;
                    const isActive = activeStep === idx;
                    return (
                      <motion.div 
                        key={step} 
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: isDone || isActive ? 1 : 0.3 }}
                        className="flex items-center gap-3"
                      >
                        {isDone ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </div>
                        ) : isActive ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full text-blue-600">
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300 ml-1.5" />
                        )}
                        <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT column */}
        <div className="space-y-6">
          <UploadDropzone
            file={file}
            previewUrl={previewUrl}
            onFileSelected={handleFileSelected}
            onClear={handleClearFile}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <LocationCard
              location={location}
              isLoading={isLocating}
              error={locationError}
              onDetectLocation={detectLocation}
              onClearLocation={clearLocation}
            />
            <NotesField
              label="Optional notes"
              helperText="Add landmarks, urgency level, or extra context to help municipal officers."
              error={errors.notes?.message}
              registration={register('notes', { maxLength: { value: 500, message: 'Max 500 characters.' } })}
              placeholder="e.g. The pothole is near the school bus stop and causes motorcycles to swerve."
            />
          </div>

          {/* Submit card */}
          <div className="gov-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Submission Portal
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Analyze and generate complaint
                </h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Gemini Vision AI
              </span>
            </div>

            <form className="mt-6 flex flex-wrap gap-3" onSubmit={handleSubmit(onSubmit)}>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75 transition duration-200"
              >
                <Bot className="h-4 w-4" />
                Analyze & Upload
              </button>
              <button
                type="button"
                onClick={() => { handleClearFile(); clearLocation(); reset({ notes: '' }); }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Form
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">
          <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} error={analysisError} />

          {/* Workflow steps */}
          <div className="gov-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              System Instructions
            </p>
            <div className="mt-5 space-y-3">
              {WORKFLOW_STEPS.map(({ n, text }) => (
                <div
                  key={n}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs font-medium text-slate-600 shadow-sm"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600">
                    {n}
                  </span>
                  <p className="leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportIssuePage;
