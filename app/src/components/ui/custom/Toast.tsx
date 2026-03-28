// Toast notification system

import { useApp } from '@/store/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[400px]
            animate-in slide-in-from-top-2 fade-in duration-200
            ${toast.type === 'success' ? 'bg-[#0ecb81]' : ''}
            ${toast.type === 'error' ? 'bg-[#f6465d]' : ''}
            ${toast.type === 'info' ? 'bg-[#2b3139] border border-[#474d57]' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#f0b90b] flex-shrink-0" />}
          
          <span className="text-white text-sm font-medium flex-1">{toast.message}</span>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
