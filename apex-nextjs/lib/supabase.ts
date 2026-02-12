// lib/supabase.ts - Database client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Wallet {
  id: string;
  user_id: string;
  address: string;
  encrypted_private_key: string;
  balance_usdc: number;
  balance_pol: number;
  is_paper: boolean;
  created_at: string;
}

export interface PaperBalance {
  id: string;
  user_id: string;
  balance_usdc: number;
  total_pnl: number;
}

export interface Trade {
  id: string;
  user_id: string;
  wallet_id?: string;
  market_id: string;
  market_question?: string;
  outcome: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  entry_price?: number;
  exit_price?: number;
  pnl?: number;
  pnl_percent?: number;
  status: 'open' | 'closed' | 'cancelled';
  is_paper: boolean;
  created_at: string;
  closed_at?: string;
  tx_hash?: string;
}

// Paper trading functions
export async function getPaperBalance(userId: string) {
  const { data, error } = await supabase
    .from('paper_balances')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    // Create if doesn't exist
    const { data: newBalance } = await supabase
      .from('paper_balances')
      .insert([{ user_id: userId }])
      .select()
      .single();
    return newBalance as PaperBalance;
  }
  
  return data as PaperBalance;
}

export async function executePaperTrade(
  userId: string,
  trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>
) {
  // Get current balance
  const balance = await getPaperBalance(userId);
  
  // Check if enough balance
  if (balance.balance_usdc < trade.total) {
    throw new Error('Insufficient paper balance');
  }
  
  // Deduct from balance
  const { error: balanceError } = await supabase
    .from('paper_balances')
    .update({ balance_usdc: balance.balance_usdc - trade.total })
    .eq('user_id', userId);
  
  if (balanceError) throw balanceError;
  
  // Create trade
  const { data, error } = await supabase
    .from('trades')
    .insert([{ ...trade, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data as Trade;
}

export async function getOpenPositions(userId: string) {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Trade[];
}

export async function closePosition(
  tradeId: string,
  exitPrice: number,
  pnl: number
) {
  const { error } = await supabase
    .from('trades')
    .update({
      status: 'closed',
      exit_price: exitPrice,
      pnl: pnl,
      closed_at: new Date().toISOString(),
    })
    .eq('id', tradeId);
  
  if (error) throw error;
}

// Wallet functions
export async function createWallet(userId: string, wallet: Partial<Wallet>) {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ ...wallet, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data as Wallet;
}

export async function getWallets(userId: string) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Wallet[];
}
