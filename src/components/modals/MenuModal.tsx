import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Search, Sun, Moon, Headphones, Download, Globe } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const { showToast } = useApp();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleFeatureClick = (feature: string) => {
    showToast(`Feature restricted: ${feature}`, 'info');
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel - Exact match to menu.html */}
      <div className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-[#1d262c] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-[#2B3139]">
        
        {/* Header: Close Button */}
        <div className="flex justify-end p-3 pt-4 pb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 mb-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-gray-300" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-3 border border-[#2B3139] rounded-xl leading-5 bg-[#1d262c] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 sm:text-sm transition-all"
              placeholder="Coin, Function, Announcement"
            />
          </div>
        </div>

        {/* Scrollable Menu Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-6">
          
          {/* Buy Crypto */}
          <button onClick={() => handleFeatureClick('Buy Crypto')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 10.5C15 10.5 15 9 13.5 9H11.5C10.1193 9 9 10.1193 9 11.5C9 12.8807 10.1193 14 11.5 14H12.5C13.8807 14 15 15.1193 15 16.5C15 17.8807 13.8807 19 12.5 19H10.5C9 19 9 17.5 9 17.5" strokeLinecap="round" />
                  <path d="M12 7V19" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-200">Buy Crypto</span>
            </div>
          </button>

          {/* Markets */}
          <button onClick={() => handleFeatureClick('Markets')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                  <rect x="4" y="10" width="3" height="10" rx="1" />
                  <rect x="10.5" y="3" width="3" height="17" rx="1" />
                  <rect x="17" y="6" width="3" height="14" rx="1" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-gray-200">Markets</span>
            </div>
          </button>

          {/* Accordion: Trade */}
          <div className="mb-1">
            <button onClick={() => toggleAccordion('trade')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <circle cx="9" cy="12" r="7" />
                    <path d="M15 12C15 8.68629 17.2386 6 20 6" strokeLinecap="round" />
                    <path d="M15 12C15 15.3137 17.2386 18 20 18" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-gray-200">Trade</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#F0B90B] shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openAccordion === 'trade' ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </button>
            <div 
              className="accordion-content pl-[3.25rem] pr-4 space-y-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === 'trade' ? '200px' : '0', opacity: openAccordion === 'trade' ? 1 : 0 }}
            >
              <button onClick={() => handleFeatureClick('Convert')} className="block text-sm text-gray-400 hover:text-white py-1">Convert</button>
              <button onClick={() => handleFeatureClick('Spot')} className="block text-sm text-gray-400 hover:text-white py-1">Spot</button>
              <button onClick={() => handleFeatureClick('Margin')} className="block text-sm text-gray-400 hover:text-white py-1">Margin</button>
            </div>
          </div>

          {/* Accordion: Futures */}
          <div className="mb-1">
            <button onClick={() => toggleAccordion('futures')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M3 21L21 3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 3H3V6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 21H21V18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 3L3 21" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-gray-200">Futures</span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openAccordion === 'futures' ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div 
              className="accordion-content pl-[3.25rem] pr-4 space-y-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === 'futures' ? '200px' : '0', opacity: openAccordion === 'futures' ? 1 : 0 }}
            >
              <button onClick={() => handleFeatureClick('USD-M')} className="block text-sm text-gray-400 hover:text-white py-1">USD-M</button>
              <button onClick={() => handleFeatureClick('COIN-M')} className="block text-sm text-gray-400 hover:text-white py-1">COIN-M</button>
            </div>
          </div>

          {/* Accordion: Earn */}
          <div className="mb-1">
            <button onClick={() => toggleAccordion('earn')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7V12L15 15" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-gray-200">Earn</span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openAccordion === 'earn' ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div 
              className="accordion-content pl-[3.25rem] pr-4 space-y-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === 'earn' ? '200px' : '0', opacity: openAccordion === 'earn' ? 1 : 0 }}
            >
              <button onClick={() => handleFeatureClick('Simple Earn')} className="block text-sm text-gray-400 hover:text-white py-1">Simple Earn</button>
              <button onClick={() => handleFeatureClick('DeFi Staking')} className="block text-sm text-gray-400 hover:text-white py-1">DeFi Staking</button>
            </div>
          </div>

          {/* Accordion: Square */}
          <div className="mb-1">
            <button onClick={() => toggleAccordion('square')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" />
                    <path d="M8 7H16" strokeLinecap="round" />
                    <path d="M8 11H16" strokeLinecap="round" />
                    <path d="M8 15H13" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-gray-200">Square</span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openAccordion === 'square' ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div 
              className="accordion-content pl-[3.25rem] pr-4 space-y-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === 'square' ? '200px' : '0', opacity: openAccordion === 'square' ? 1 : 0 }}
            >
              <button onClick={() => handleFeatureClick('Feed')} className="block text-sm text-gray-400 hover:text-white py-1">Feed</button>
              <button onClick={() => handleFeatureClick('Academy')} className="block text-sm text-gray-400 hover:text-white py-1">Academy</button>
            </div>
          </div>

          {/* Accordion: More */}
          <div className="mb-1">
            <button onClick={() => toggleAccordion('more')} className="w-full flex items-center justify-between px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-gray-200">More</span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openAccordion === 'more' ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div 
              className="accordion-content pl-[3.25rem] pr-4 space-y-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === 'more' ? '200px' : '0', opacity: openAccordion === 'more' ? 1 : 0 }}
            >
              <button onClick={() => handleFeatureClick('Launchpad')} className="block text-sm text-gray-400 hover:text-white py-1">Launchpad</button>
              <button onClick={() => handleFeatureClick('Research')} className="block text-sm text-gray-400 hover:text-white py-1">Research</button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#2B3139] my-3 mx-2"></div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-3 py-3.5 mb-1">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 w-6 h-6 flex items-center justify-center">
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
              <span className="text-[15px] font-medium text-gray-200">Theme</span>
            </div>
            
            <div className="flex items-center bg-[#2B3139] rounded-lg p-1 border border-[#474D57]">
              <button onClick={() => handleFeatureClick('Light Theme')} className="p-1.5 rounded text-gray-500 hover:text-gray-300 transition-colors">
                <Sun className="w-5 h-5" />
              </button>
              <button className="p-1.5 rounded bg-[#474D57] text-white shadow-sm">
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 24/7 Chat Support */}
          <button onClick={() => handleFeatureClick('24/7 Chat Support')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="text-gray-400 group-hover:text-gray-200">
              <Headphones className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-medium text-gray-200">24/7 Chat Support</span>
          </button>

          {/* Download */}
          <button onClick={() => handleFeatureClick('Download')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="text-gray-400 group-hover:text-gray-200">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-medium text-gray-200">Download</span>
          </button>

          {/* English */}
          <button onClick={() => handleFeatureClick('Language')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="text-gray-400 group-hover:text-gray-200">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-medium text-gray-200">English</span>
          </button>

          {/* USD */}
          <button onClick={() => handleFeatureClick('Currency')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-[#26333a] rounded-lg transition-colors group text-left">
            <div className="text-gray-400 group-hover:text-gray-200 w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7V17" strokeLinecap="round" />
                <path d="M15 10.5C15 9.67157 14.3284 9 13.5 9H11C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13H13C14.1046 13 15 13.8954 15 15C15 16.1046 14.1046 17 13 17H10.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-gray-200">USD</span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default MenuModal;
