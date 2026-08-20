import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#00685f] text-white border-[#008378]'
              : toast.type === 'error'
              ? 'bg-[#ba1a1a] text-white border-[#ffdad6]'
              : 'bg-[#0d1c2e] text-white border-[#3d4947]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-[#89f5e7]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-[#ffdad6]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-[#89f5e7]" />}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
