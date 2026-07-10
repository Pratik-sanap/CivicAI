import { useState } from 'react';

import LandingPage from './pages/LandingPage';
import CitizenDashboardPage from './pages/citizen/CitizenDashboardPage';
import ReportIssuePage from './pages/citizen/ReportIssuePage';
import AIAnalysisPage from './pages/citizen/AIAnalysisPage';
import ComplaintTrackingPage from './pages/citizen/ComplaintTrackingPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import HeatmapPage from './pages/HeatmapPage';
import { ToastProvider } from './components/common/Toast';
import { useUserLocation } from './hooks/useUserLocation';
import type { ImageAnalysisResponse } from './types/analysis';
import type { LocationSnapshot } from './types/report';

interface AnalysisSession {
  imagePreviewUrl: string;
  imageName: string;
  imageBase64: string;
  mimeType: string;
  notes?: string;
  location?: LocationSnapshot | null;
  analysis: ImageAnalysisResponse;
}

type ViewState = 'landing' | 'dashboard' | 'report' | 'analysis' | 'tracking' | 'admin' | 'heatmap';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [analysisSession, setAnalysisSession] = useState<AnalysisSession | null>(null);

  /**
   * Request geolocation immediately when the app first mounts so the browser
   * permission prompt appears right away — before the user navigates to any
   * map page. The resolved coordinates are available in the hook's return value
   * and are also consumed by ComplaintsMap / HeatmapPage via their own calls
   * to the same hook (the OS caches the result so no duplicate prompt is shown).
   */
  useUserLocation();

  const handleNavigate = (targetView: ViewState) => {
    setAnalysisSession(null);
    setView(targetView);
  };

  return (
    <ToastProvider>
      {view === 'landing' ? (
        <LandingPage onNavigate={handleNavigate} />
      ) : view === 'analysis' && analysisSession ? (
        <AIAnalysisPage
          session={analysisSession}
          onSubmitComplaint={async () => handleNavigate('dashboard')}
          onAnalyzeAgain={() => handleNavigate('report')}
          onBack={() => handleNavigate('dashboard')}
          onSwitchToAdmin={() => handleNavigate('admin')}
        />
      ) : view === 'report' ? (
        <ReportIssuePage
          onOpenAnalysis={(session) => {
            setAnalysisSession(session);
            setView('analysis');
          }}
          onBackToDashboard={() => handleNavigate('dashboard')}
          onSwitchToAdmin={() => handleNavigate('admin')}
        />
      ) : view === 'dashboard' ? (
        <CitizenDashboardPage
          onQuickReport={() => handleNavigate('report')}
          onSwitchToAdmin={() => handleNavigate('admin')}
          onNavigate={handleNavigate}
        />
      ) : view === 'tracking' ? (
        <ComplaintTrackingPage
          onBack={() => handleNavigate('landing')}
          onSwitchToAdmin={() => handleNavigate('admin')}
          onQuickReport={() => handleNavigate('report')}
        />
      ) : view === 'heatmap' ? (
        <HeatmapPage
          onBack={() => handleNavigate('landing')}
          onSwitchToAdmin={() => handleNavigate('admin')}
          onQuickReport={() => handleNavigate('report')}
        />
      ) : (
        <AdminDashboardPage
          onQuickReport={() => handleNavigate('report')}
          onSwitchToCitizen={() => handleNavigate('dashboard')}
        />
      )}
    </ToastProvider>
  );
}

export default App;
