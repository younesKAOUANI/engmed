import React, { createContext, useContext, useState, useCallback } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle className="w-5 h-5 text-success shrink-0" aria-hidden="true" />,
  error:   <AlertCircle className="w-5 h-5 text-danger  shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" aria-hidden="true" />,
  info:    <Info className="w-5 h-5 text-info shrink-0" aria-hidden="true" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, type = "info", duration = 4000 }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            duration={t.duration}
            onOpenChange={(open) => { if (!open) dismiss(t.id); }}
            className={cn(
              "bg-surface border border-ink-100 shadow-3 rounded-md p-4",
              "flex items-start gap-3 w-80 max-w-[90vw]",
              "data-[state=open]:animate-[toast-in_220ms_ease-out]",
              "data-[state=closed]:animate-[toast-out_140ms_ease-in]"
            )}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              {t.title && (
                <RadixToast.Title className="text-[15px] font-semibold text-ink-900 leading-snug">
                  {t.title}
                </RadixToast.Title>
              )}
              {t.description && (
                <RadixToast.Description className="body-sm text-ink-500 mt-0.5">
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close
              aria-label="Dismiss"
              className="text-ink-300 hover:text-ink-700 transition-colors mt-0.5 shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999] outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
