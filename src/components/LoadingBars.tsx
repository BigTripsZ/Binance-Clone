interface LoadingBarsProps {
  className?: string;
  barClassName?: string;
  color?: string;
}

export function LoadingBars({ className = '', barClassName = '', color = 'bg-[#1E2329]' }: LoadingBarsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`w-1 ${color} rounded-sm animate-[loading-bar_0.6s_ease-in-out_infinite] h-4 ${barClassName}`}></span>
      <span className={`w-1 ${color} rounded-sm animate-[loading-bar_0.6s_ease-in-out_infinite_0.1s] h-3 ${barClassName}`}></span>
      <span className={`w-1 ${color} rounded-sm animate-[loading-bar_0.6s_ease-in-out_infinite_0.2s] h-2.5 ${barClassName}`}></span>
      <span className={`w-1 ${color} rounded-sm animate-[loading-bar_0.6s_ease-in-out_infinite_0.3s] h-2 ${barClassName}`}></span>
    </div>
  );
}

export function FullScreenLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1D252B]/60 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <span className="w-2 bg-[#FCD535] rounded animate-[loading-bar_0.6s_ease-in-out_infinite] h-8"></span>
        <span className="w-2 bg-[#FCD535] rounded animate-[loading-bar_0.6s_ease-in-out_infinite_0.1s] h-6"></span>
        <span className="w-2 bg-[#FCD535] rounded animate-[loading-bar_0.6s_ease-in-out_infinite_0.2s] h-5"></span>
        <span className="w-2 bg-[#FCD535] rounded animate-[loading-bar_0.6s_ease-in-out_infinite_0.3s] h-4"></span>
      </div>
    </div>
  );
}

export default LoadingBars;
