-- APEX Trading Protocol - Supabase Schema v0.2
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Wallets table (encrypted private keys)
CREATE TABLE wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL UNIQUE,
    encrypted_private_key TEXT NOT NULL, -- AES encrypted
    balance_usdc DECIMAL(18, 6) DEFAULT 0,
    balance_pol DECIMAL(18, 6) DEFAULT 0,
    is_paper BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paper trading balances
CREATE TABLE paper_balances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    balance_usdc DECIMAL(18, 2) DEFAULT 10000.00,
    total_pnl DECIMAL(18, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades (both paper and real)
CREATE TABLE trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    
    -- Market info
    market_id TEXT NOT NULL,
    market_question TEXT,
    outcome TEXT NOT NULL,
    
    -- Trade details
    side TEXT CHECK (side IN ('buy', 'sell')),
    amount DECIMAL(18, 6) NOT NULL,
    price DECIMAL(18, 6) NOT NULL,
    total DECIMAL(18, 6) NOT NULL,
    
    -- P&L tracking
    entry_price DECIMAL(18, 6),
    exit_price DECIMAL(18, 6),
    pnl DECIMAL(18, 6),
    pnl_percent DECIMAL(18, 4),
    
    -- Status
    status TEXT CHECK (status IN ('open', 'closed', 'cancelled')) DEFAULT 'open',
    is_paper BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Polymarket tx hash (for real trades)
    tx_hash TEXT
);

-- Portfolio snapshots (for history)
CREATE TABLE portfolio_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_value DECIMAL(18, 2) NOT NULL,
    cash_balance DECIMAL(18, 2) NOT NULL,
    positions_value DECIMAL(18, 2) NOT NULL,
    snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wallets" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets" ON wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own paper balance" ON paper_balances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own paper balance" ON paper_balances
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_market_id ON trades(market_id);
CREATE INDEX idx_trades_created_at ON trades(created_at);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Functions
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paper_balances_updated_at BEFORE UPDATE ON paper_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
