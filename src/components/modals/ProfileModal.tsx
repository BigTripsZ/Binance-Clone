import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const navigate = useNavigate();
  const { adminData, logout, showToast } = useApp();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleFeatureClick = (feature: string) => {
    showToast(`${feature} feature restricted`, 'info');
  };

  if (!isOpen) return null;

  const loginIdentifier = sessionStorage.getItem('loginIdentifier') || 'john.doe@email.com';

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel - Exact match to profile.html */}
      <div className="absolute right-0 top-0 h-full w-full max-w-[380px] bg-[#1e2329] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-6 h-6 cursor-pointer z-10 text-[#848e9c] hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Profile Section */}
        <div className="pt-11 px-5 pb-5">
          <div className="flex items-center gap-4">
            {/* Avatar - Default gradient with person shape */}
            <div 
              className="w-14 h-14 rounded-full relative overflow-hidden flex-shrink-0"
              style={{ 
                background: adminData.profilePhoto 
                  ? `url(${adminData.profilePhoto}) center/cover` 
                  : 'linear-gradient(180deg, #e5e7eb 0%, #9ca3af 100%)'
              }}
            >
              {!adminData.profilePhoto && (
                <>
                  <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[#f0b90b] rounded-full"></div>
                  <div 
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '14px solid transparent',
                      borderRight: '14px solid transparent',
                      borderTop: '20px solid #f0b90b'
                    }}
                  ></div>
                </>
              )}
            </div>
            <div className="flex-1">
              <div className="text-[#eaecef] text-lg font-medium tracking-tight mb-1">
                {loginIdentifier}
              </div>
              <div className="text-[#848e9c] text-sm font-normal">
                ID: {adminData.userId}
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {/* Regular/VIP Badge */}
            <div className="px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1 bg-[#2b3139] text-[#eaecef]">
              {adminData.isVip ? 'VIP' : 'Regular User'}
            </div>
            {/* Verification Badge */}
            <div className="px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1 bg-[#fcd535] text-[#1e2329]">
              {adminData.isVerified ? 'Verified' : 'Unverified'}
              <span className="w-3.5 h-3.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </span>
            </div>
            {/* Link X Badge */}
            <div className="px-3 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-1 bg-[#2b3139] text-[#eaecef]">
              Link X
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2b3139 transparent' }}>
          {/* Dashboard */}
          <button onClick={() => handleFeatureClick('Dashboard')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Dashboard</span>
            </div>
          </button>

          {/* Wallet */}
          <button onClick={() => handleFeatureClick('Wallet')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="12" rx="2"/>
                  <line x1="7" y1="10" x2="7.01" y2="10" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Wallet</span>
            </div>
            <div className="w-5 h-5 text-[#848e9c]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </button>

          {/* Assets */}
          <button onClick={() => handleFeatureClick('Assets')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="12" rx="2"/>
                  <line x1="7" y1="10" x2="7.01" y2="10" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Assets</span>
            </div>
          </button>

          {/* Orders */}
          <button onClick={() => handleFeatureClick('Orders')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Orders</span>
            </div>
          </button>

          {/* Account */}
          <button onClick={() => handleFeatureClick('Account')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Account</span>
            </div>
          </button>

          {/* Referral */}
          <button onClick={() => handleFeatureClick('Referral')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Referral</span>
            </div>
          </button>

          {/* Rewards Hub */}
          <button onClick={() => handleFeatureClick('Rewards Hub')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="12" rx="2"/>
                  <path d="M12 10v4"/>
                  <path d="M9 12h6"/>
                  <circle cx="12" cy="12" r="8" strokeDasharray="4 2"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Rewards Hub</span>
              <div className="w-5 h-5 text-[#fcd535] ml-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </button>

          {/* Settings */}
          <button onClick={() => handleFeatureClick('Settings')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Settings</span>
            </div>
          </button>

          {/* Notification */}
          <button onClick={() => handleFeatureClick('Notification')} className="w-full flex items-center justify-between py-3.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
                <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <span className="text-[#eaecef] text-base font-normal tracking-tight">Notification</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#fcd535] text-[#1e2329] text-xs font-semibold flex items-center justify-center">
              5
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#2b3139] mx-4 my-2"></div>

        {/* Log Out Section */}
        <div className="px-4 py-2 pb-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 py-3.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#848e9c]">
              <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <span className="text-[#eaecef] text-base font-normal">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
