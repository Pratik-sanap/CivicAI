import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number;
  dismissing?: boolean;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id' | 'dismissing'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const toast = useCallback(
    (options: Omit<Toast, 'id' | 'dismissing'>) => {
      const id = Math.random().toString(36).slice(2);
      const duration = options.duration ?? 4500;

      setToasts((prev) => [...prev, { ...options, id }]);

      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const success = useCallback((title: string, message?: string) => toast({ variant: 'success', title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ variant: 'error',   title, message, duration: 6000 }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ variant: 'warning', title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ variant: 'info',    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Stack ─────────────────────────────────────────────────────────────────────

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
      style={{ width: '360px', maxWidth: 'calc(100vw - 2rem)' }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Item ──────────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: ReactNode; border: string; glow: string; iconColor: string; bar: string }
> = {
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    border: 'border-emerald-400/30',
    glow: 'shadow-[0_8px_32px_rgba(16,185,129,0.25)]',
    iconColor: 'text-emerald-400',
    bar: 'bg-emerald-400',
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    border: 'border-rose-400/30',
    glow: 'shadow-[0_8px_32px_rgba(244,63,94,0.25)]',
    iconColor: 'text-rose-400',
    bar: 'bg-rose-400',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    border: 'border-amber-400/30',
    glow: 'shadow-[0_8px_32px_rgba(245,158,11,0.25)]',
    iconColor: 'text-amber-400',
    bar: 'bg-amber-400',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    border: 'border-cyan-400/30',
    glow: 'shadow-[0_8px_32px_rgba(34,211,238,0.25)]',
    iconColor: 'text-cyan-400',
    bar: 'bg-cyan-400',
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const cfg = VARIANT_CONFIG[toast.variant];
  const duration = toast.duration ?? 4500;

  return (
    <div
      role="alert"
      className={[
        'pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl',
        'bg-slate-950/90',
        cfg.border,
        cfg.glow,
        toast.dismissing ? 'animate-toast-out' : 'animate-toast-in',
      ].join(' ')}
      style={{ animationFillMode: 'both' }}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4">
        <span className={`mt-0.5 flex-shrink-0 ${cfg.iconColor}`}>{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-white/8 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${cfg.bar} opacity-60`}
        style={{
          animation: `progress-bar ${duration}ms linear both`,
        }}
      />
    </div>
  );
}

export default ToastProvider;
