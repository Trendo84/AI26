import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// ─── Auth ───
export async function signUp(email, password) {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email, password) {
  if (!supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Paper Balance ───
export async function getPaperBalance(userId) {
  if (!supabase) return { balance: 10000, total_pnl: 0, total_trades: 0, win_count: 0, loss_count: 0 };
  const { data, error } = await supabase
    .from('paper_balances')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error || !data) return { balance: 10000, total_pnl: 0, total_trades: 0, win_count: 0, loss_count: 0 };
  return data;
}

export async function updatePaperBalance(userId, newBalance) {
  if (!supabase) return;
  await supabase
    .from('paper_balances')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}

// ─── Paper Trading ───
export async function executePaperTrade({ userId, marketId, marketQuestion, marketCategory, side, amount, price }) {
  if (!supabase) return { success: true, trade: { id: 'demo', shares: amount / price } };
  
  const shares = amount / price;
  
  // Insert trade
  const { data: trade, error: tradeErr } = await supabase
    .from('trades')
    .insert({
      user_id: userId,
      market_id: marketId,
      market_question: marketQuestion,
      market_category: marketCategory,
      side,
      action: 'BUY',
      amount,
      price,
      shares,
      is_paper: true,
      status: 'open',
    })
    .select()
    .single();

  if (tradeErr) return { success: false, error: tradeErr.message };

  // Deduct from paper balance
  const bal = await getPaperBalance(userId);
  await supabase
    .from('paper_balances')
    .update({
      balance: bal.balance - amount,
      total_trades: (bal.total_trades || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return { success: true, trade };
}

export async function closePaperTrade(userId, tradeId, exitPrice) {
  if (!supabase) return { success: true };
  
  // Get original trade
  const { data: trade } = await supabase
    .from('trades')
    .select('*')
    .eq('id', tradeId)
    .single();

  if (!trade) return { success: false, error: 'Trade not found' };

  const pnl = (exitPrice - trade.price) * trade.shares * (trade.side === 'YES' ? 1 : -1);
  const returnAmount = trade.amount + pnl;

  // Close trade
  await supabase
    .from('trades')
    .update({
      status: 'closed',
      exit_price: exitPrice,
      pnl,
      closed_at: new Date().toISOString(),
    })
    .eq('id', tradeId);

  // Return funds + PnL to paper balance
  const bal = await getPaperBalance(userId);
  await supabase
    .from('paper_balances')
    .update({
      balance: bal.balance + returnAmount,
      total_pnl: (bal.total_pnl || 0) + pnl,
      ...(pnl >= 0 ? { win_count: (bal.win_count || 0) + 1 } : { loss_count: (bal.loss_count || 0) + 1 }),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return { success: true, pnl };
}

export async function getOpenPositions(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getTradeHistory(userId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

// ─── Wallets ───
export async function createWalletRecord(userId, address, encryptedKey) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('wallets')
    .insert({
      user_id: userId,
      address,
      encrypted_private_key: encryptedKey,
      chain: 'polygon',
      wallet_type: 'managed',
    })
    .select()
    .single();
  return data;
}

export async function getUserWallet(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .eq('wallet_type', 'managed')
    .single();
  return data;
}

// ─── Profile ───
export async function getProfile(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updateTradingMode(userId, mode) {
  if (!supabase) return;
  await supabase
    .from('profiles')
    .update({ trading_mode: mode, updated_at: new Date().toISOString() })
    .eq('id', userId);
}
