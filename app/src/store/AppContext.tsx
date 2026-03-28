// Global state management for Binance Clone

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AdminState, UserSession, WithdrawalTransaction, ToastMessage } from '@/types';
import {
  getAdminState,
  saveAdminState,
  getUserSession,
  saveUserSession,
  clearUserSession,
  getWithdrawalTransaction,
  saveWithdrawalTransaction,
  clearWithdrawalTransaction,
  exportAllData,
  importAllData,
  resetAllData,
  defaultAdminState,
  defaultUserSession,
} from './storage';

interface AppContextType {
  // Admin state
  adminState: AdminState;
  updateAdminState: (updates: Partial<AdminState>) => void;
  updateAuth: (updates: Partial<AdminState['auth']>) => void;
  updateProfile: (updates: Partial<AdminState['profile']>) => void;
  updateBalance: (updates: Partial<AdminState['balance']>) => void;
  updateWithdrawalModal: (updates: Partial<AdminState['withdrawalModal']>) => void;
  updatePendingPage: (updates: Partial<AdminState['pendingPage']>) => void;
  
  // User session
  userSession: UserSession;
  login: (identifier: string, stayLoggedIn?: boolean) => void;
  logout: () => void;
  
  // Withdrawal transaction
  withdrawalTransaction: WithdrawalTransaction | null;
  setWithdrawalTransaction: (transaction: WithdrawalTransaction | null) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Data management
  exportAllData: () => string;
  importAllData: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Admin state
  const [adminState, setAdminState] = useState<AdminState>(defaultAdminState);
  
  // User session
  const [userSession, setUserSession] = useState<UserSession>(defaultUserSession);
  
  // Withdrawal transaction
  const [withdrawalTransaction, setWithdrawalTransactionState] = useState<WithdrawalTransaction | null>(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setAdminState(getAdminState());
    setUserSession(getUserSession());
    setWithdrawalTransactionState(getWithdrawalTransaction());
  }, []);

  // Update admin state
  const updateAdminState = useCallback((updates: Partial<AdminState>) => {
    setAdminState(prev => {
      const newState = { ...prev, ...updates };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Update auth settings
  const updateAuth = useCallback((updates: Partial<AdminState['auth']>) => {
    setAdminState(prev => {
      const newState = { ...prev, auth: { ...prev.auth, ...updates } };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Update profile settings
  const updateProfile = useCallback((updates: Partial<AdminState['profile']>) => {
    setAdminState(prev => {
      const newState = { ...prev, profile: { ...prev.profile, ...updates } };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Update balance settings
  const updateBalance = useCallback((updates: Partial<AdminState['balance']>) => {
    setAdminState(prev => {
      const newState = { ...prev, balance: { ...prev.balance, ...updates } };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Update withdrawal modal settings
  const updateWithdrawalModal = useCallback((updates: Partial<AdminState['withdrawalModal']>) => {
    setAdminState(prev => {
      const newState = { ...prev, withdrawalModal: { ...prev.withdrawalModal, ...updates } };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Update pending page settings
  const updatePendingPage = useCallback((updates: Partial<AdminState['pendingPage']>) => {
    setAdminState(prev => {
      const newState = { ...prev, pendingPage: { ...prev.pendingPage, ...updates } };
      saveAdminState(newState);
      return newState;
    });
  }, []);

  // Login
  const login = useCallback((identifier: string, stayLoggedIn = false) => {
    const sessionExpiry = stayLoggedIn 
      ? Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days
      : Date.now() + 24 * 60 * 60 * 1000; // 1 day
    
    const newSession: UserSession = {
      isLoggedIn: true,
      loginIdentifier: identifier,
      stayLoggedIn,
      sessionExpiry,
    };
    
    setUserSession(newSession);
    saveUserSession(newSession);
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUserSession(defaultUserSession);
    clearUserSession();
  }, []);

  // Set withdrawal transaction
  const setWithdrawalTransaction = useCallback((transaction: WithdrawalTransaction | null) => {
    setWithdrawalTransactionState(transaction);
    if (transaction) {
      saveWithdrawalTransaction(transaction);
    } else {
      clearWithdrawalTransaction();
    }
  }, []);

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Remove toast
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Data management functions
  const handleExportAllData = useCallback(() => {
    return exportAllData();
  }, []);

  const handleImportAllData = useCallback((jsonString: string) => {
    const success = importAllData(jsonString);
    if (success) {
      // Reload data after import
      setAdminState(getAdminState());
      setUserSession(getUserSession());
      setWithdrawalTransactionState(getWithdrawalTransaction());
    }
    return success;
  }, []);

  const handleResetAllData = useCallback(() => {
    resetAllData();
    setAdminState(defaultAdminState);
    setUserSession(defaultUserSession);
    setWithdrawalTransactionState(null);
  }, []);

  const value: AppContextType = {
    adminState,
    updateAdminState,
    updateAuth,
    updateProfile,
    updateBalance,
    updateWithdrawalModal,
    updatePendingPage,
    userSession,
    login,
    logout,
    withdrawalTransaction,
    setWithdrawalTransaction,
    toasts,
    showToast,
    removeToast,
    isLoading,
    setIsLoading,
    exportAllData: handleExportAllData,
    importAllData: handleImportAllData,
    resetAllData: handleResetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
