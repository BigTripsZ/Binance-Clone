// Validation utilities

export function detectInputType(input: string): 'email' | 'phone' | 'invalid' | 'empty' {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,}$/;

  if (!input || input.trim() === '') return 'empty';
  if (emailRegex.test(input)) return 'email';
  if (phoneRegex.test(input.replace(/\D/g, ''))) return 'phone';
  return 'invalid';
}

export function maskEmail(email: string): string {
  if (!email || email.length < 5) return email;

  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    // Phone number - mask middle digits
    if (email.length > 6) {
      return email.slice(0, 3) + '***' + email.slice(-3);
    }
    return email;
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  if (localPart.length <= 2) {
    return email;
  }

  const firstChar = localPart.charAt(0);
  const lastChar = localPart.charAt(localPart.length - 1);
  return firstChar + '***' + lastChar + domain;
}

export function validatePassword(password: string): boolean {
  return password.length >= 1;
}

export function validateVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function validateCryptoAddress(address: string, network: string): boolean {
  const patterns: Record<string, RegExp> = {
    BTC: /^(1|3|bc1)[a-zA-Z0-9]{25,62}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    BSC: /^0x[a-fA-F0-9]{40}$/,
    TRX: /^T[a-zA-Z0-9]{33}$/,
    SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  };

  const pattern = patterns[network];
  if (!pattern) return address.length > 10;
  return pattern.test(address.trim());
}

export function detectNetworkFromAddress(address: string): string | null {
  const patterns: Record<string, RegExp> = {
    BTC: /^(1|3|bc1)[a-zA-Z0-9]{25,62}$/,
    ETH: /^0x[a-fA-F0-9]{40}$/,
    BSC: /^0x[a-fA-F0-9]{40}$/,
    TRX: /^T[a-zA-Z0-9]{33}$/,
    SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  };

  for (const [network, pattern] of Object.entries(patterns)) {
    if (pattern.test(address.trim())) {
      return network;
    }
  }
  return null;
}

export function generateTransactionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatCountdown(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatCryptoAmount(amount: number, symbol: string): string {
  return `${amount.toFixed(symbol === 'BTC' ? 6 : 4)} ${symbol}`;
}

export function formatFiatAmount(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}
