import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setItems((list) => [...list, { id, message, type }]);
      setTimeout(() => dismiss(id), type === "error" ? 7000 : 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,380px)] flex-col gap-2" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} role="status" className="animate-fade-in pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-pop">
            {t.type === "error" ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
            )}
            <p className="flex-1 text-[14px] leading-snug text-ink">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-ink-3 hover:text-ink" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
