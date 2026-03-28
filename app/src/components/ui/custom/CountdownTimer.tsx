// Countdown timer component

import { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  className?: string;
  showDays?: boolean;
}

export function CountdownTimer({ 
  duration, 
  onComplete, 
  className = '',
  showDays = true 
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onComplete]);

  const formatTime = useCallback(() => {
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (showDays) {
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, [timeRemaining, showDays]);

  return (
    <span className={`font-mono ${className}`}>
      {formatTime()}
    </span>
  );
}
