-- ═══════════════════════════════════════════════════════════
-- APEX Trading Protocol — Database Schema v0.2
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── User Profiles ───
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  trading_mode text default 'paper' check (trading_mode in ('paper', 'live')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Wallets ───
create table if not exists wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  address text not null,
  encrypted_private_key text not null,
  chain text default 'polygon' not null,
  label text default 'APEX Managed',
  wallet_type text default 'managed' check (wallet_type in ('managed', 'imported')),
  usdc_balance numeric default 0,
  pol_balance numeric default 0,
  last_synced_at timestamptz,
  created_at timestamptz default now()
);

-- ─── Paper Balances ───
create table if not exists paper_balances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  balance numeric default 10000.00 not null,
  starting_balance numeric default 10000.00 not null,
  total_pnl numeric default 0,
  total_trades integer default 0,
  win_count integer default 0,
  loss_count integer default 0,
  updated_at timestamptz default now()
);

-- ─── Trades ───
create table if not exists trades (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  market_id text not null,
  market_question text not null,
  market_category text,
  side text not null check (side in ('YES', 'NO')),
  action text not null check (action in ('BUY', 'SELL')),
  amount numeric not null,
  price numeric not null,
  shares numeric not null,
  is_paper boolean default true,
  status text default 'open' check (status in ('open', 'closed', 'cancelled')),
  exit_price numeric,
  pnl numeric,
  closed_at timestamptz,
  created_at timestamptz default now()
);

-- ─── Watchlist ───
create table if not exists watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  market_id text not null,
  market_question text,
  added_at timestamptz default now(),
  unique (user_id, market_id)
);

-- ─── Health Checks (for status dashboard) ───
create table if not exists health_checks (
  id uuid default uuid_generate_v4() primary key,
  service text not null,
  status text default 'unknown' check (status in ('healthy', 'degraded', 'down', 'unknown')),
  latency_ms integer,
  error_message text,
  checked_at timestamptz default now()
);

-- ═══ ROW LEVEL SECURITY ═══
alter table profiles enable row level security;
alter table wallets enable row level security;
alter table paper_balances enable row level security;
alter table trades enable row level security;
alter table watchlist enable row level security;

-- Users can only see/edit their own data
create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users view own wallets" on wallets for select using (auth.uid() = user_id);
create policy "Users insert own wallets" on wallets for insert with check (auth.uid() = user_id);
create policy "Users update own wallets" on wallets for update using (auth.uid() = user_id);

create policy "Users view own paper balance" on paper_balances for select using (auth.uid() = user_id);
create policy "Users manage own paper balance" on paper_balances for all using (auth.uid() = user_id);

create policy "Users view own trades" on trades for select using (auth.uid() = user_id);
create policy "Users insert own trades" on trades for insert with check (auth.uid() = user_id);
create policy "Users update own trades" on trades for update using (auth.uid() = user_id);

create policy "Users view own watchlist" on watchlist for select using (auth.uid() = user_id);
create policy "Users manage own watchlist" on watchlist for all using (auth.uid() = user_id);

-- Health checks readable by all authenticated users
create policy "Authenticated view health" on health_checks for select using (auth.role() = 'authenticated');

-- ═══ AUTO-CREATE PROFILE + PAPER BALANCE ON SIGNUP ═══
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));

  insert into paper_balances (user_id, balance, starting_balance)
  values (new.id, 10000.00, 10000.00);

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ═══ INDEXES ═══
create index if not exists idx_trades_user on trades (user_id, created_at desc);
create index if not exists idx_trades_open on trades (user_id, status) where status = 'open';
create index if not exists idx_wallets_user on wallets (user_id);
create index if not exists idx_watchlist_user on watchlist (user_id);
