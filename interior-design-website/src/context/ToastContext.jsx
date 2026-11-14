import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  const toast = { success: (m) => push(m, 'success'), error: (m) => push(m, 'error') };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 sm:w-80" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <m.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
              className={`flex items-start gap-3 px-4 py-3 text-sm shadow-xl border ${t.type === 'error' ? 'bg-red-950 text-red-100 border-red-800' : 'bg-forest text-cream border-sage/30'}`}>
              {t.type === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
              <span>{t.message}</span>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
