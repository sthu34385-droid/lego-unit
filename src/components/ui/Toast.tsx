"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string; href?: string; hrefLabel?: string };

const ToastContext = createContext<{
  toast: (message: string, extra?: { href?: string; hrefLabel?: string }) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, extra?: { href?: string; hrefLabel?: string }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, ...extra }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-hover"
          >
            <div className="flex items-center justify-between gap-3">
              <p>{item.message}</p>
              {item.href ? (
                <a href={item.href} className="shrink-0 font-semibold text-yellow">
                  {item.hrefLabel ?? "View"}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
