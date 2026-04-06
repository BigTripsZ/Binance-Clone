import { useApp } from '@/contexts/AppContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const toastStyles = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      containerClasses: "bg-[#1D252B] border border-green-500/30",
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      containerClasses: "bg-[#1D252B] border border-red-500/30",
    },
    info: {
      icon: <Info className="w-5 h-5 text-[#F0B90B]" />,
      containerClasses: "bg-[#1D252B]",
    },
  };

  const style = toastStyles[toast.type];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md ${style.containerClasses}`}
      >
        {style.icon}
        <span className="text-white text-sm font-medium whitespace-nowrap">{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-3 text-[#848e9c] hover:text-white transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
