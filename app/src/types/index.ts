// Types for Binance Clone Application

export interface AuthState {
  password: string;
  verificationCode: string;
  testMode: boolean;
}

export interface ProfileState {
  photo: string;
  name: string;
  userId: string;
  isVip: boolean;
  isVerified: boolean;
}

export interface BalanceState {
  cryptoAmount: string;
  cryptoSymbol: string;
  fiatAmount: string;
  fiatSymbol: string;
}

export interface WithdrawalModalState {
  titleTemplate: string;
  scrollableMessage: string;
  priorityQueueTitle: string;
  priorityQueueDescription: string;
  networkDisplayName: string;
  adminWalletAddress: string;
  yellowWarningText: string;
  feeAmount: string;
  countdownDuration: number; // in seconds
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface PendingPageState {
  title: string;
  messageLine1: string;
  messageLine2: string;
  countdownDuration: number; // in seconds
  okButtonText: string;
}

export interface AdminState {
  auth: AuthState;
  profile: ProfileState;
  balance: BalanceState;
  withdrawalModal: WithdrawalModalState;
  pendingPage: PendingPageState;
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
  amount: string;
  cryptoSymbol: string;
  address: string;
  network: string;
  timestamp: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
