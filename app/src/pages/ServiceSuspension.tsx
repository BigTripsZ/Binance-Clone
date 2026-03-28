import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';

export default function ServiceSuspension() {
  const navigate = useNavigate();
  const { adminState, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  async function handleWithdraw() {
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    navigate('/withdrawal');
  }

  function handleLinkClick(linkName: string) {
    showToast(`${linkName} is currently unavailable`, 'info');
  }

  const { balance } = adminState;

  return (
    <div className="min-h-screen flex flex-col bg-[#1D252B] text-white relative overflow-x-hidden">
      
      {/* Top Banner */}
      <div className="w-full bg-[#1D252B] px-4 py-3 flex items-start gap-3 relative">
        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        <div className="flex-1 text-xs leading-relaxed text-gray-200 font-semibold pr-8">
          Service suspended: according to our <span className="font-bold text-white">Terms of Use</span>, we are unable to provide services to users while they are in a restricted country (including restricted IP addresses). Your account and funds are safe. You can only <button onClick={() => handleLinkClick('Withdraw')} className="text-[#f0b90b] underline hover:no-underline font-bold">withdraw your funds</button>; depositing and other product trading services are suspended. For further support, please contact <button onClick={() => handleLinkClick('Customer Service')} className="text-[#f0b90b] underline hover:no-underline font-bold">Customer Service</button>.
        </div>
        <button className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-md text-center space-y-4">
          
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            Service Suspended for<br/>Restricted Countries
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
            We've detected that you are visiting Binance's service from a restricted country. According to our <button onClick={() => handleLinkClick('Terms of Use')} className="text-[#f0b90b] underline hover:no-underline">Terms of Use</button>, we are unable to provide services to users while they are in a restricted country (including restricted IP addresses). Your account and funds are safe. You can only withdraw, but depositing and other product trading services are suspended. For further support, please contact <button onClick={() => handleLinkClick('Customer service')} className="text-[#f0b90b] underline hover:no-underline">Customer service</button>.
          </p>

          {/* Amount Card with Button Inside */}
          <div 
            className="rounded-lg py-5 px-6 text-center mt-8 mb-4 max-w-[320px] mx-auto border border-[#1E2329]"
            style={{ background: '#0B0E11' }}
          >
            <div className="text-xs text-[#848E9C] mb-2 normal-case">Estimated balance</div>
            <div className="text-2xl font-semibold text-white mb-1 tracking-tight">
              {balance.cryptoAmount} {balance.cryptoSymbol}
            </div>
            <div className="text-xs text-[#848E9C] mb-4">
              ≈ {balance.fiatSymbol}{balance.fiatAmount}
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className="w-full bg-[#F0B90B] hover:bg-[#F8D56B] text-black font-semibold py-2.5 px-4 rounded-md transition-colors h-10 flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <LoadingBars color="#1E2329" size="sm" />
              ) : (
                'Withdraw Now'
              )}
            </button>
          </div>

          {/* Appeal Link */}
          <div className="pt-2">
            <button 
              onClick={() => handleLinkClick('Appeal')}
              className="text-[#f0b90b] underline hover:no-underline text-sm font-medium"
            >
              Appeal
            </button>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="w-full py-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#848E9C] border-t border-gray-800/30">
        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          English
        </button>
        <button onClick={() => handleLinkClick('Cookies')} className="hover:text-white transition-colors">Cookies</button>
        <button onClick={() => handleLinkClick('Privacy')} className="hover:text-white transition-colors">Privacy</button>
      </div>
    </div>
  );
}
