import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// The site's own dialogs and messages, used instead of the browser's
// alert() and confirm() boxes (which show the web address and look foreign).
//
//   const { confirm, toast } = useNotify();
//   if (await confirm({ title: 'Cancel booking?', message: '…', confirmLabel: 'Cancel booking', tone: 'danger' })) …
//   toast('Saved.', { type: 'success' });

const NotifyContext = createContext(null);

export function useNotify() {
  return useContext(NotifyContext);
}

function ConfirmDialog({ request, onAnswer }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onAnswer(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onAnswer]);

  const danger = request.tone === 'danger';
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => onAnswer(false)}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notify-title"
        aria-describedby="notify-message"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-7"
      >
        <h2 id="notify-title" className="text-xl font-bold text-brand-dark mb-2">{request.title}</h2>
        {request.message && <p id="notify-message" className="text-sm text-brand-dark/70 leading-relaxed whitespace-pre-line">{request.message}</p>}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => onAnswer(false)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-brand-dark hover:bg-black/5 transition-colors"
          >
            {request.cancelLabel ?? 'Go back'}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onAnswer(true)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${danger ? 'bg-[#E02424] text-white hover:bg-[#C81E1E]' : 'bg-brand-dark text-white hover:bg-black'}`}
          >
            {request.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

const TOAST_STYLES = {
  success: { icon: CheckCircle, className: 'text-green-700' },
  error: { icon: XCircle, className: 'text-[#E02424]' },
  info: { icon: Info, className: 'text-brand-brown' },
};

export function NotifyProvider({ children }) {
  const [request, setRequest] = useState(null);
  const [toasts, setToasts] = useState([]);
  const resolver = useRef(null);
  const nextId = useRef(1);

  const confirm = useCallback((options) => new Promise((resolve) => {
    resolver.current = resolve;
    setRequest(options);
  }), []);

  const answer = useCallback((value) => {
    resolver.current?.(value);
    resolver.current = null;
    setRequest(null);
  }, []);

  const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const toast = useCallback((message, { type = 'success', duration = 5000 } = {}) => {
    const id = nextId.current++;
    setToasts(prev => [...prev, { id, message, type }]);
    // Errors stay until closed; other messages fade on their own.
    if (type !== 'error') setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <NotifyContext.Provider value={{ confirm, toast }}>
      {children}
      {request && <ConfirmDialog request={request} onAnswer={answer} />}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[210] flex flex-col gap-2 items-stretch sm:items-end pointer-events-none">
        {toasts.map((t) => {
          const { icon: Icon, className } = TOAST_STYLES[t.type] ?? TOAST_STYLES.info;
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto w-full sm:w-96 bg-white border border-[#E8E2D9] shadow-xl rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in"
            >
              <Icon size={18} className={`${className} shrink-0 mt-0.5`} />
              <p className="flex-1 text-sm text-brand-dark">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-brand-dark/40 hover:text-brand-dark">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotifyContext.Provider>
  );
}
