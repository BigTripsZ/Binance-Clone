// Loading animation with 4 animated bars

interface LoadingBarsProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingBars({ color = '#1E2329', size = 'md' }: LoadingBarsProps) {
  const sizeClasses = {
    sm: {
      bar1: 'h-3',
      bar2: 'h-2',
      bar3: 'h-2.5',
      bar4: 'h-2',
      width: 'w-0.5',
      gap: 'gap-0.5',
    },
    md: {
      bar1: 'h-4',
      bar2: 'h-3',
      bar3: 'h-2.5',
      bar4: 'h-2',
      width: 'w-1',
      gap: 'gap-1',
    },
    lg: {
      bar1: 'h-8',
      bar2: 'h-6',
      bar3: 'h-5',
      bar4: 'h-4',
      width: 'w-2',
      gap: 'gap-1.5',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.gap}`}>
      <span
        className={`${sizes.width} ${sizes.bar1} rounded-sm animate-loading-bar`}
        style={{ backgroundColor: color }}
      />
      <span
        className={`${sizes.width} ${sizes.bar2} rounded-sm animate-loading-bar`}
        style={{ backgroundColor: color, animationDelay: '0.1s' }}
      />
      <span
        className={`${sizes.width} ${sizes.bar3} rounded-sm animate-loading-bar`}
        style={{ backgroundColor: color, animationDelay: '0.2s' }}
      />
      <span
        className={`${sizes.width} ${sizes.bar4} rounded-sm animate-loading-bar`}
        style={{ backgroundColor: color, animationDelay: '0.3s' }}
      />
    </div>
  );
}

// Full screen loading overlay
interface LoadingScreenProps {
  isActive: boolean;
}

export function LoadingScreen({ isActive }: LoadingScreenProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1d262c]/60 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-8 bg-[#fcd535] rounded animate-loading-bar" />
        <span className="w-2 h-6 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.1s]" />
        <span className="w-2 h-5 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.2s]" />
        <span className="w-2 h-4 bg-[#fcd535] rounded animate-loading-bar [animation-delay:0.3s]" />
      </div>
    </div>
  );
}
