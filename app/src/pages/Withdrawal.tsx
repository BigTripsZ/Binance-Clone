import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { LoadingBars } from '@/components/ui/custom/LoadingBars';
import { CountdownTimer } from '@/components/ui/custom/CountdownTimer';
import { ArrowDown, User, Menu, ArrowUp, ChevronDown, X, Search, Globe, Moon, Copy, Check, Info } from 'lucide-react';

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
  { id: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'USDT', name: 'TetherUS', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { id: 'BNB', name: 'BNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  { id: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: 'XRP', name: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  { id: 'USDC', name: 'USD Coin', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { id: 'ADA', name: 'Cardano', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { id: 'DOGE', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  { id: 'TRX', name: 'TRON', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
];

const networks: Network[] = [
  { id: 'BTC', name: 'Bitcoin', fee: '0.000015', time: '≈ 30 mins' },
  { id: 'BSC', name: 'BNB Smart Chain (BEP20)', fee: '0.0001', time: '≈ 3 mins' },
  { id: 'ETH', name: 'Ethereum (ERC20)', fee: '0.001', time: '≈ 5 mins' },
  { id: 'TRC20', name: 'Tron (TRC20)', fee: '0.001', time: '≈ 1 min' },
  { id: 'SOL', name: 'Solana', fee: '0.000005', time: '≈ 1 min' },
  { id: 'ARB', name: 'Arbitrum One', fee: '0.0001', time: '≈ 2 mins' },
  { id: 'OP', name: 'Optimism', fee: '0.0001', time: '≈ 2 mins' },
  { id: 'MATIC', name: 'Polygon', fee: '0.0001', time: '≈ 3 mins' },
];

const addressPatterns: Record<string, RegExp> = {
  BTC: /^(1|3|bc1)[a-zA-Z0-9]{25,62}$/,
  ETH: /^0x[a-fA-F0-9]{40}$/,
  BSC: /^0x[a-fA-F0-9]{40}$/,
  TRX: /^T[a-zA-Z0-9]{33}$/,
  SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
};

export default function Withdrawal() {
  const navigate = useNavigate();
  const { adminState, showToast, setWithdrawalTransaction } = useApp();
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [coinSearch, setCoinSearch] = useState('');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    trade: false,
    futures: false,
    earn: false,
    square: false,
    more: false,
  });
  const addressRef = useRef<HTMLTextAreaElement>(null);

  function toggleAccordion(id: string) {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  const { balance, profile, withdrawalModal } = adminState;
  const availableBalance = parseFloat(balance.cryptoAmount) || 0;

  // Auto-detect network from address
  useEffect(() => {
    if (!address) return;
    
    for (const [key, regex] of Object.entries(addressPatterns)) {
      if (regex.test(address.trim())) {
        const detected = networks.find(n => n.id === key);
        if (detected && !selectedNetwork) {
          setSelectedNetwork(detected);
        }
        break;
      }
    }
  }, [address, selectedNetwork]);

  function handleAddressInput(val: string) {
    setAddress(val);
    // Auto-resize textarea
    if (addressRef.current) {
      addressRef.current.style.height = 'auto';
      addressRef.current.style.height = Math.max(52, addressRef.current.scrollHeight) + 'px';
    }
  }

  function handleAmountInput(val: string) {
    setAmount(val);
  }

  function setMaxAmount() {
    setAmount(availableBalance.toFixed(6));
  }

  function isFormValid(): boolean {
    const amt = parseFloat(amount) || 0;
    return address.length > 10 && amt > 0 && amt <= availableBalance && selectedNetwork !== null;
  }

  function calculateReceiveAmount(): string {
    const amt = parseFloat(amount) || 0;
    const fee = amt * 0.002; // 0.2% fee
    return Math.max(0, amt - fee).toFixed(6);
  }

  function calculateNetworkFee(): string {
    const amt = parseFloat(amount) || 0;
    return (amt * 0.002).toFixed(6);
  }

  async function handleWithdraw() {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsLoading(false);
    setShowWithdrawModal(true);
  }

  function confirmWithdrawal() {
    // Save transaction
    const transaction = {
      id: 'TX' + Date.now().toString(36).toUpperCase(),
      amount: amount,
      cryptoSymbol: selectedCoin.id,
      address: address,
      network: selectedNetwork?.id || '',
      timestamp: Date.now(),
    };
    
    setWithdrawalTransaction(transaction);
    setShowWithdrawModal(false);
    navigate('/pending');
  }

  async function copyWalletAddress() {
    try {
      await navigator.clipboard.writeText(withdrawalModal.adminWalletAddress);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = withdrawalModal.adminWalletAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    
    setCopied(true);
    showToast('Address copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleProfileAction(action: string) {
    if (action === 'logout') {
      navigate('/');
    } else {
      showToast(`${action} is currently unavailable`, 'info');
    }
    setShowProfileModal(false);
  }

  const filteredCoins = coins.filter(c => 
    c.id.toLowerCase().includes(coinSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(coinSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1D252B] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-[#1D252B]">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/source/logo.png" alt="Binance" className="h-8 w-auto" />
          <button 
            onClick={() => showToast('Deposit is currently unavailable', 'info')}
            className="bg-[#f0b90b] text-[#1D252B] rounded-md font-semibold flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm hover:bg-[#f8d12f] transition-colors"
          >
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Deposit</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="w-7 h-7 sm:w-8 sm:h-8 border border-[#474d57] rounded-full flex items-center justify-center text-white hover:border-[#f0b90b] hover:text-[#f0b90b] transition-colors"
          >
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={() => setShowMenuModal(true)}
            className="text-white p-1 hover:text-[#f0b90b] transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Subheader */}
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
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white border border-white rounded flex items-center justify-center transform rotate-45">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1D252B] transform -rotate-45" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm sm:text-base mb-2 text-white">Select coin</h3>
            <button 
              onClick={() => setShowCoinModal(true)}
              className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <img src={selectedCoin.icon} alt={selectedCoin.id} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
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
            <div className={`w-4 h-4 sm:w-5 sm:h-5 border rounded flex items-center justify-center transform rotate-45 ${address.length > 10 ? 'bg-white border-white' : 'border-white/30'}`}>
              {address.length > 10 ? (
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1D252B] transform -rotate-45" />
              ) : (
                <span className="text-[8px] sm:text-[10px] font-bold text-white/50 transform -rotate-45">2</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm sm:text-base mb-2 ${address.length > 10 ? 'text-white' : 'text-white/40'}`}>Withdraw to</h3>
            
            <div className="flex gap-3 sm:gap-4 mb-2 sm:mb-3 border-b border-[#474d57]/30">
              <button className="pb-2 text-sm sm:text-base font-bold text-white border-b-2 border-[#f0b90b] relative -mb-[1px]">Address</button>
              <button 
                onClick={() => showToast('Binance user transfer is unavailable', 'info')}
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
                className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 pr-10 text-xs sm:text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50 text-white placeholder-[#5e6673] min-h-[52px] sm:min-h-[60px] overflow-hidden"
              />
              <button 
                onClick={() => showToast('Address book is unavailable', 'info')}
                className="absolute right-2 sm:right-3 top-3 sm:top-4 text-[#848e9c]"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
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

            {address.length > 10 && (
              <div className="text-xs sm:text-sm text-[#848e9c] leading-relaxed">
                Please note that withdrawal fees have been adjusted in due of the recent increase in activities on the {selectedCoin.id} network.
              </div>
            )}
          </div>
        </div>

        {/* Step 3 - Withdraw Amount */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 sm:w-5 sm:h-5 border rounded flex items-center justify-center transform rotate-45 ${parseFloat(amount) > 0 ? 'bg-white border-white' : 'border-white/30'}`}>
              {parseFloat(amount) > 0 ? (
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1D252B] transform -rotate-45" />
              ) : (
                <span className="text-[8px] sm:text-[10px] font-bold text-white/50 transform -rotate-45">3</span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-sm sm:text-base mb-2 ${parseFloat(amount) > 0 ? 'text-white' : 'text-white/40'}`}>Withdraw amount</h3>

            <div className="relative mb-2 sm:mb-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountInput(e.target.value)}
                placeholder="Minimal 0.00012"
                className="w-full bg-[#2b3139] rounded-lg p-3 sm:p-4 pr-20 sm:pr-24 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50 text-white placeholder-[#5e6673]"
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

            {parseFloat(amount) > 0 && (
              <>
                {/* Fee Info */}
                <div className="mb-2 sm:mb-3 bg-[#2b2a1a] rounded-lg p-3 sm:p-4 relative">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#f0b90b] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#f0b90b] text-xs">i</span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[#848e9c] leading-relaxed">
                        {selectedCoin.id} fees may increase during network congestion. Binance gains no benefit. Tap the gas icon below to view estimated transaction costs.
                      </p>
                      <button 
                        onClick={() => showToast('Learn more is unavailable', 'info')}
                        className="text-[#0ecb81] text-xs sm:text-sm mt-1 font-medium"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {parseFloat(amount) > availableBalance && (
                  <div className="text-[#f6465d] text-xs sm:text-sm mb-2">
                    Please enter an amount no higher than your available balance.
                  </div>
                )}

                {/* Test Warning */}
                <div className="text-xs sm:text-sm text-[#848e9c] mb-2 sm:mb-3 leading-relaxed">
                  This address hasn't been used recently. To avoid errors, we recommend making a <span className="text-[#f0b90b]">test withdrawal</span> with the minimum amount first.
                </div>
              </>
            )}

            <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-[#848e9c]">Available Withdraw</span>
                <span className="font-medium">{availableBalance.toFixed(4)} {selectedCoin.id}</span>
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

            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-1 mb-1 text-[#848e9c] text-xs sm:text-sm">
                <span>Receive amount</span>
                <ArrowUp className="w-3 h-3 rotate-90" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1">{calculateReceiveAmount()} {selectedCoin.id}</div>
              <div className="text-[#848e9c] text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                Network Fee <span>{calculateNetworkFee()}</span> {selectedCoin.id}
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!isFormValid() || isLoading}
              className={`w-full font-bold py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all flex items-center justify-center ${
                isFormValid()
                  ? 'bg-[#f0b90b] text-[#1D252B] hover:bg-[#fcd535]'
                  : 'bg-[#f0b90b]/30 text-white/50 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <LoadingBars color="#1E2329" size="sm" />
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
              onClick={() => showToast('Language selection is unavailable', 'info')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <Globe className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-white font-medium text-sm sm:text-base">English</span>
            </button>
            <button 
              onClick={() => showToast('Currency selection is unavailable', 'info')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
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
              onClick={() => showToast('Theme toggle is unavailable', 'info')}
              className="w-10 h-5 sm:w-12 sm:h-6 bg-[#2b3139] rounded-full relative flex items-center px-1 transition-colors"
            >
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full absolute right-1 flex items-center justify-center">
                <Moon className="text-[#1D252B] w-2.5 h-2.5" />
              </div>
            </button>
          </div>
        </div>

        <div className="border-t border-[#474d57]/30 mb-3 sm:mb-4" />

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
            onClick={() => showToast('Cookie preferences is unavailable', 'info')}
            className="text-[#848e9c] text-xs sm:text-sm hover:text-white transition-colors"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848e9c] w-4 h-4" />
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
              {filteredCoins.map(coin => (
                <div
                  key={coin.id}
                  onClick={() => {
                    setSelectedCoin(coin);
                    setShowCoinModal(false);
                  }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <img src={coin.icon} alt={coin.id} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
                  <div>
                    <div className="font-bold text-sm sm:text-base">{coin.id}</div>
                    <div className="text-[#848e9c] text-xs sm:text-sm">{coin.name}</div>
                  </div>
                </div>
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
              {networks.map(network => (
                <div
                  key={network.id}
                  onClick={() => {
                    setSelectedNetwork(network);
                    setShowNetworkModal(false);
                  }}
                  className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-sm sm:text-base">{network.id}</div>
                    <div className="text-[#848e9c] text-xs sm:text-sm">{network.name}</div>
                  </div>
                  <div className="text-right text-xs sm:text-sm text-[#848e9c]">
                    <div>Arrival time {network.time}</div>
                    <div>fee {network.fee} {selectedCoin.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-[#1e2329] w-full max-w-[340px] sm:max-w-[400px] rounded-2xl shadow-2xl mx-4 overflow-hidden animate-fade-in">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-white transition-colors p-1 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center p-5 sm:p-6 pt-6 sm:pt-8">
              
              {/* Warning Icon */}
              <div className="mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#fcd535] flex items-center justify-center bg-transparent">
                  <span className="text-[#fcd535] text-xl sm:text-2xl font-bold leading-none mt-0.5">!</span>
                </div>
              </div>

              {/* Title with Amount */}
              <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center px-2 tracking-tight leading-snug">
                {(() => {
                  const amountStr = `${parseFloat(amount).toFixed(3)} ${selectedCoin.id}`;
                  const parts = withdrawalModal.titleTemplate.split('[AMOUNT]');
                  return (
                    <>
                      {parts[0]}
                      <span className="text-[#f6465d]">{amountStr}</span>
                      {parts[1]}
                    </>
                  );
                })()}
              </h2>

              {/* Scrollable Content */}
              <div className="w-full mb-5 sm:mb-6 relative">
                <div className="h-[80px] sm:h-[100px] overflow-y-auto custom-scrollbar pr-2">
                  <p className="text-gray-400 text-center text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                    {withdrawalModal.scrollableMessage}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-[#1e2329] to-transparent pointer-events-none" />
              </div>

              {/* Priority Queue Section */}
              <div className="w-full mb-5 sm:mb-6 space-y-3 sm:space-y-4 border-t border-[#474d57]/30 pt-4 sm:pt-5">
                
                {/* Priority Queue Header */}
                <div className="text-center">
                  <span className="text-[#f0b90b] text-sm sm:text-base font-semibold tracking-wide block mb-2">
                    {withdrawalModal.priorityQueueTitle}
                  </span>
                  <p className="text-white text-sm font-normal leading-relaxed">
                    {withdrawalModal.priorityQueueDescription}
                  </p>
                </div>

                {/* Network */}
                <div className="flex justify-between items-start pt-2">
                  <span className="text-[#848e9c] text-xs sm:text-sm font-normal">Network</span>
                  <span className="text-white text-xs sm:text-sm font-medium text-right">{withdrawalModal.networkDisplayName}</span>
                </div>

                {/* Fee amount */}
                <div className="flex justify-between items-center">
                  <span className="text-[#848e9c] text-xs sm:text-sm font-normal">Fee amount</span>
                  <span className="text-[#f0b90b] text-xs sm:text-sm font-semibold">{withdrawalModal.feeAmount} {selectedCoin.id}</span>
                </div>

                {/* Address Box */}
                <div 
                  className="bg-[#2b3139] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 border border-transparent hover:bg-[#363d47] hover:border-[#f0b90b] transition-all cursor-pointer active:scale-[0.98]"
                  onClick={copyWalletAddress}
                >
                  <span className="text-white text-xs sm:text-sm font-mono break-all leading-relaxed flex-1">
                    {withdrawalModal.adminWalletAddress}
                  </span>
                  <div className="flex-shrink-0 relative">
                    {copied ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#0ecb81]" />
                    ) : (
                      <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-[#f0b90b]" />
                    )}
                  </div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Info className="text-[#f0b90b] w-4 h-4 animate-pulse-timer" />
                  <CountdownTimer 
                    duration={withdrawalModal.countdownDuration}
                    className="text-[#f0b90b] text-xs sm:text-sm font-mono font-semibold tracking-wider animate-pulse-timer"
                  />
                </div>

              </div>

              {/* Buttons */}
              <button 
                onClick={confirmWithdrawal}
                className="w-full bg-[#fcd535] hover:bg-[#f0b90b] text-gray-900 font-bold py-3 sm:py-3.5 rounded-lg transition-colors duration-200 mb-3 shadow-lg text-sm sm:text-base tracking-wide"
              >
                {withdrawalModal.primaryButtonText}
              </button>

              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-[#fcd535] hover:text-[#f0b90b] text-sm font-medium transition-colors py-2"
              >
                {withdrawalModal.secondaryButtonText}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[70]">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowProfileModal(false)} 
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#1e2329] animate-slide-in-right flex flex-col">
            {/* Close Button */}
            <div className="flex justify-end p-3 pt-4 pb-2">
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-[#848e9c] hover:text-white transition-colors p-1"
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="px-5 pt-2 pb-5">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 relative overflow-hidden flex-shrink-0">
                  {profile.photo ? (
                    <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[#f0b90b] rounded-full" />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#f0b90b]" />
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#eaecef] text-lg font-medium truncate">
                    {sessionStorage.getItem('loginIdentifier') || profile.name}
                  </div>
                  <div className="text-[#848e9c] text-sm">ID: {profile.userId}</div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <div className="px-3 py-1.5 rounded-md bg-[#2b3139] text-[#eaecef] text-sm font-medium flex items-center gap-1">
                  {profile.isVip ? 'VIP' : 'Regular User'}
                </div>
                <div className="px-3 py-1.5 rounded-md bg-[#fcd535] text-[#1e2329] text-sm font-medium flex items-center gap-1">
                  {profile.isVerified ? 'Verified' : 'Unverified'}
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-1.5 rounded-md bg-[#2b3139] text-[#eaecef] text-sm font-medium">
                  Link X
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {/* Dashboard */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Dashboard</span>
                </div>
              </button>

              {/* Wallet */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <rect x="3" y="6" width="18" height="12" rx="2"/>
                      <line x1="7" y1="10" x2="7.01" y2="10" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Wallet</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#848e9c]" />
              </button>

              {/* Assets */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <rect x="3" y="6" width="18" height="12" rx="2"/>
                      <line x1="7" y1="10" x2="7.01" y2="10" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Assets</span>
                </div>
              </button>

              {/* Orders */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <line x1="8" y1="6" x2="21" y2="6"/>
                      <line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/>
                      <line x1="3" y1="6" x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/>
                      <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Orders</span>
                </div>
              </button>

              {/* Account */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Account</span>
                </div>
              </button>

              {/* Referral */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Referral</span>
                </div>
              </button>

              {/* Rewards Hub */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <rect x="3" y="6" width="18" height="12" rx="2"/>
                      <path d="M12 10v4"/>
                      <path d="M9 12h6"/>
                      <circle cx="12" cy="12" r="8" strokeDasharray="4 2"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Rewards Hub</span>
                </div>
                <div className="text-[#fcd535]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </button>

              {/* Settings */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Settings</span>
                </div>
              </button>

              {/* Notification */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Notification</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#fcd535] text-[#1e2329] text-xs font-semibold flex items-center justify-center">
                  5
                </div>
              </button>

              {/* Divider */}
              <div className="h-px bg-[#2b3139] my-3 mx-2" />

              {/* Log Out */}
              <button 
                onClick={() => handleProfileAction('logout')}
                className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
              >
                <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-[#eaecef]">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[70]">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowMenuModal(false)} 
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-[#1d262c] flex flex-col shadow-2xl animate-slide-in-right border-l border-[#2B3139]">
            {/* Close Button */}
            <div className="flex justify-end p-3 pt-4 pb-2">
              <button 
                onClick={() => setShowMenuModal(false)} 
                className="text-[#848e9c] hover:text-white transition-colors p-1"
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-2 mb-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#848e9c] group-focus-within:text-[#eaecef]" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-3 border border-[#2B3139] rounded-xl leading-5 bg-[#1d262c] text-[#eaecef] placeholder-[#5e6673] focus:outline-none focus:border-[#f0b90b]/50 focus:ring-1 focus:ring-[#f0b90b]/50 sm:text-sm transition-all"
                  placeholder="Coin, Function, Announcement"
                />
              </div>
            </div>

            {/* Scrollable Menu Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-6">
              {/* Buy Crypto */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M15 10.5C15 10.5 15 9 13.5 9H11.5C10.1193 9 9 10.1193 9 11.5C9 12.8807 10.1193 14 11.5 14H12.5C13.8807 14 15 15.1193 15 16.5C15 17.8807 13.8807 19 12.5 19H10.5C9 19 9 17.5 9 17.5" strokeLinecap="round" />
                      <path d="M12 7V19" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Buy Crypto</span>
                </div>
              </button>

              {/* Markets */}
              <button className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <rect x="4" y="10" width="3" height="10" rx="1" />
                      <rect x="10.5" y="3" width="3" height="17" rx="1" />
                      <rect x="17" y="6" width="3" height="14" rx="1" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Markets</span>
                </div>
              </button>

              {/* Trade Accordion */}
              <div className="mb-1">
                <button 
                  onClick={() => toggleAccordion('trade')} 
                  className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                        <circle cx="9" cy="12" r="7" />
                        <path d="M15 12C15 8.68629 17.2386 6 20 6" strokeLinecap="round" />
                        <path d="M15 12C15 15.3137 17.2386 18 20 18" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#eaecef]">Trade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F0B90B] shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                    <ChevronDown className={`w-4 h-4 text-[#848e9c] transition-transform duration-300 ${openAccordions.trade ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`pl-[3.25rem] pr-4 space-y-1 overflow-hidden transition-all duration-300 ${openAccordions.trade ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Convert</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Spot</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Margin</a>
                </div>
              </div>

              {/* Futures Accordion */}
              <div className="mb-1">
                <button 
                  onClick={() => toggleAccordion('futures')} 
                  className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                        <path d="M3 21L21 3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 3H3V6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 21H21V18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 3L3 21" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#eaecef]">Futures</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#848e9c] transition-transform duration-300 ${openAccordions.futures ? 'rotate-180' : ''}`} />
                </button>
                <div className={`pl-[3.25rem] pr-4 space-y-1 overflow-hidden transition-all duration-300 ${openAccordions.futures ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">USD-M</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">COIN-M</a>
                </div>
              </div>

              {/* Earn Accordion */}
              <div className="mb-1">
                <button 
                  onClick={() => toggleAccordion('earn')} 
                  className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7V12L15 15" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#eaecef]">Earn</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#848e9c] transition-transform duration-300 ${openAccordions.earn ? 'rotate-180' : ''}`} />
                </button>
                <div className={`pl-[3.25rem] pr-4 space-y-1 overflow-hidden transition-all duration-300 ${openAccordions.earn ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Simple Earn</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">DeFi Staking</a>
                </div>
              </div>

              {/* Square Accordion */}
              <div className="mb-1">
                <button 
                  onClick={() => toggleAccordion('square')} 
                  className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                        <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" />
                        <path d="M8 7H16" strokeLinecap="round" />
                        <path d="M8 11H16" strokeLinecap="round" />
                        <path d="M8 15H13" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#eaecef]">Square</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#848e9c] transition-transform duration-300 ${openAccordions.square ? 'rotate-180' : ''}`} />
                </button>
                <div className={`pl-[3.25rem] pr-4 space-y-1 overflow-hidden transition-all duration-300 ${openAccordions.square ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Feed</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Academy</a>
                </div>
              </div>

              {/* More Accordion */}
              <div className="mb-1">
                <button 
                  onClick={() => toggleAccordion('more')} 
                  className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#eaecef]">More</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#848e9c] transition-transform duration-300 ${openAccordions.more ? 'rotate-180' : ''}`} />
                </button>
                <div className={`pl-[3.25rem] pr-4 space-y-1 overflow-hidden transition-all duration-300 ${openAccordions.more ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Launchpad</a>
                  <a href="#" className="block text-sm text-[#848e9c] hover:text-white py-2">Research</a>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#2B3139] my-3 mx-2" />

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-3.5 mb-1">
                <div className="flex items-center gap-4">
                  <div className="text-[#848e9c] w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 12H21" />
                      <path d="M12 3V21" />
                      <path d="M7 7L7 7.01" strokeWidth="2" strokeLinecap="round" />
                      <path d="M17 17L17 17.01" strokeWidth="2" strokeLinecap="round" />
                      <path d="M17 7L17 7.01" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 17L7 17.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#eaecef]">Theme</span>
                </div>
                <div className="flex items-center bg-[#2B3139] rounded-lg p-1 border border-[#474D57]">
                  <button className="p-1.5 rounded text-[#848e9c] hover:text-[#eaecef] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded bg-[#474D57] text-white shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 24/7 Chat Support */}
              <button className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="text-[#848e9c] group-hover:text-[#eaecef]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-[#eaecef]">24/7 Chat Support</span>
              </button>

              {/* Download */}
              <button className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="text-[#848e9c] group-hover:text-[#eaecef]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-[#eaecef]">Download</span>
              </button>

              {/* English */}
              <button className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="text-[#848e9c] group-hover:text-[#eaecef]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-[#eaecef]">English</span>
              </button>

              {/* USD */}
              <button className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
                <div className="text-[#848e9c] group-hover:text-[#eaecef] w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7V17" strokeLinecap="round" />
                    <path d="M15 10.5C15 9.67157 14.3284 9 13.5 9H11C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13H13C14.1046 13 15 13.8954 15 15C15 16.1046 14.1046 17 13 17H10.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-[#eaecef]">USD</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
