import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingOverlayProps {
  show: boolean;
  onComplete?: () => void;
  redirectTo?: string;
  duration?: number;
}

export function LoadingOverlay({ show, onComplete, redirectTo, duration = 2000 }: LoadingOverlayProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else if (redirectTo) {
          navigate(redirectTo);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, navigate, redirectTo, onComplete, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: 'rgba(29, 38, 44, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <style>{`
        @keyframes loading-bar {
          0%, 100% { 
            transform: scaleY(1); 
          }
          50% { 
            transform: scaleY(0.4); 
          }
        }

        .loading-bars {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .loading-bar {
          width: 8px;
          background-color: #FCD535;
          border-radius: 4px;
          animation: loading-bar 0.6s ease-in-out infinite;
        }

        .loading-bar-1 {
          height: 32px;
        }

        .loading-bar-2 {
          height: 24px;
          animation-delay: 0.1s;
        }

        .loading-bar-3 {
          height: 20px;
          animation-delay: 0.2s;
        }

        .loading-bar-4 {
          height: 16px;
          animation-delay: 0.3s;
        }
      `}</style>
      <div className="loading-bars">
        <span className="loading-bar loading-bar-1"></span>
        <span className="loading-bar loading-bar-2"></span>
        <span className="loading-bar loading-bar-3"></span>
        <span className="loading-bar loading-bar-4"></span>
      </div>
    </div>
  );
}

// Legacy page component for backward compatibility
export function LoadingScreen() {
  return <LoadingOverlay show={true} redirectTo="/stay-logged-in" />;
}

export default LoadingScreen;
