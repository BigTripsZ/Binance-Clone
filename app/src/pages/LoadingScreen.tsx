import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate('/stay-logged-in');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1d262c]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-8 bg-[#fcd535] rounded animate-loading-bar" />
        <span className="w-2 h-6 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.1s]" />
        <span className="w-2 h-5 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.2s]" />
        <span className="w-2 h-4 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.3s]" />
      </div>
    </div>
  );
}
