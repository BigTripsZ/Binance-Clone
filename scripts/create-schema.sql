-- Create admin_data table to store admin configuration and settings
CREATE TABLE IF NOT EXISTS admin_data (
  id SERIAL PRIMARY KEY,
  
  -- Authentication
  auth_password VARCHAR(255),
  auth_verification_code VARCHAR(255),
  test_mode BOOLEAN DEFAULT false,
  
  -- Profile
  profile_photo TEXT,
  profile_name VARCHAR(255) DEFAULT 'Crypto Trader',
  user_id VARCHAR(255) DEFAULT '123456789',
  is_vip BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Balance
  crypto_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  crypto_symbol VARCHAR(10) NOT NULL DEFAULT 'BTC',
  fiat_balance DECIMAL(20, 2) NOT NULL DEFAULT 0,
  fiat_symbol VARCHAR(5) NOT NULL DEFAULT '$',
  
  -- Withdrawal Modal
  modal_title_template TEXT,
  modal_scrollable_message TEXT,
  priority_queue_title VARCHAR(255),
  priority_queue_description TEXT,
  network_display_name VARCHAR(255),
  admin_wallet_address VARCHAR(255),
  yellow_warning_text TEXT,
  fee_amount DECIMAL(10, 2),
  countdown_duration INTEGER,
  primary_button_text VARCHAR(255),
  secondary_button_text VARCHAR(255),
  
  -- Pending Page
  pending_title VARCHAR(255),
  pending_message_line1 TEXT,
  pending_message_line2 TEXT,
  pending_message_line3 TEXT,
  pending_ok_button_text VARCHAR(255),
  
  -- Legacy fields for backwards compatibility
  fiat_currency VARCHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(20, 8) DEFAULT 1,
  withdrawal_fee DECIMAL(10, 2) DEFAULT 0,
  min_withdrawal DECIMAL(20, 8) DEFAULT 0.001,
  max_withdrawal DECIMAL(20, 8) DEFAULT 1000,
  withdrawal_enabled BOOLEAN DEFAULT true,
  suspension_enabled BOOLEAN DEFAULT false,
  suspension_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create withdrawal_transactions table to store withdrawal history
CREATE TABLE IF NOT EXISTS withdrawal_transactions (
  id VARCHAR(36) PRIMARY KEY,
  amount DECIMAL(20, 8) NOT NULL,
  crypto_symbol VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  network VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_timestamp ON withdrawal_transactions(timestamp);
