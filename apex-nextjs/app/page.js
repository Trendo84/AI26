'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import MatrixRain from '@/components/MatrixRain';
import DiscoverView from '@/components/DiscoverView';
import AgentView from '@/components/AgentView';
import PortfolioView from '@/components/PortfolioView';
import { WatchlistView, PointsView } from '@/components/OtherViews';
import WalletView from '@/components/WalletView';
import HealthView from '@/components/HealthView';
import TradeModal from '@/components/TradeModal';

const sideNav = [
  { items: [
    { id: 'discover', icon: '◎', label: 'Discover' },
    { id: 'agent', icon: '🤖', label: 'OpenClaw' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio' },
    { id: 'watchlist', icon: '👁', label: 'Watchlist' },
  ]},
  { items: [
    { id: 'wallet', icon: '💳', label: 'Wallet' },
    { id: 'points', icon: '◈', label: 'Points' },
    { id: 'health', icon: '🩺', label: 'Health' },
  ]},
  { items: [
    { id: 'alpha', icon: '⚡', label: 'Alpha' },
  ]},
];

const viewMap = { discover: DiscoverView, agent: AgentView, portfolio: PortfolioView, watchlist: WatchlistView, points: PointsView, wallet: WalletView, health: HealthView, alpha: DiscoverView };

export default function Home() {
  const { theme } = useTheme();
  const [view, setView] = useState('discover');
  const [clock, setClock] = useState('');
  const [tradeMarket, setTradeMarket] = useState(null);
  const [paperBalance, setPaperBalance] = useState(10000);
  const [tradingMode, setTradingMode] = useState('paper');
  const [trades, setTrades] = useState([]);
  const isMatrix = theme === 'matrix';
  const isCyber = theme === 'cyberpunk';

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-AU', { hour12: false }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Load state from localStorage
  useEffect(() => {
    try {
      const b = localStorage.getItem('apex_paper_balance');
      if (b) setPaperBalance(parseFloat(b));
      const t = localStorage.getItem('apex_trades');
      if (t) setTrades(JSON.parse(t));
      const m = localStorage.getItem('apex_mode');
      if (m) setTradingMode(m);
    } catch {}
  }, []);

  const persist = useCallback((newTrades, newBal) => {
    setTrades(newTrades);
    setPaperBalance(newBal);
    try {
      localStorage.setItem('apex_trades', JSON.stringify(newTrades));
      localStorage.setItem('apex_paper_balance', String(newBal));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('apex_mode', tradingMode); } catch {}
  }, [tradingMode]);

  const handleTrade = useCallback(async ({ marketId, marketQuestion, marketCategory, side, amount, price }) => {
    const trade = {
      id: Date.now().toString(),
      marketId, marketQuestion, marketCategory, side,
      action: 'BUY', amount, price,
      shares: amount / price,
      isPaper: tradingMode === 'paper',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    persist([trade, ...trades], paperBalance - amount);
  }, [trades, paperBalance, tradingMode, persist]);

  const closeTrade = useCallback((tradeId, exitPrice) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;
    const pnl = (exitPrice - trade.price) * trade.shares * (trade.side === 'YES' ? 1 : -1);
    const updated = trades.map(t =>
      t.id === tradeId ? { ...t, status: 'closed', exitPrice, pnl, closedAt: new Date().toISOString() } : t
    );
    persist(updated, paperBalance + trade.amount + pnl);
  }, [trades, paperBalance, persist]);

  const resetPaper = useCallback(() => {
    persist([], 10000);
  }, [persist]);

  const openTrades = trades.filter(t => t.status === 'open');
  const closedTrades = trades.filter(t => t.status === 'closed');
  const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl || 0), 0);
  const winCount = closedTrades.filter(t => t.pnl > 0).length;

  const ViewComponent = viewMap[view] || DiscoverView;
  const sharedProps = { onTrade: (m) => setTradeMarket(m), paperBalance, tradingMode, setTradingMode, trades, openTrades, closedTrades, closeTrade, totalPnl, winCount, resetPaper };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--font)' }}>
      <MatrixRain active={isMatrix} />
      {(isCyber || isMatrix) && <div className="scan-overlay" />}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: theme === 'apex' ? 'radial-gradient(ellipse at 15% 0%,rgba(0,212,255,.05) 0%,transparent 55%),radial-gradient(ellipse at 85% 100%,rgba(0,102,255,.04) 0%,transparent 55%)'
          : theme === 'cyberpunk' ? 'radial-gradient(ellipse at 25% 5%,rgba(252,227,0,.06) 0%,transparent 50%),radial-gradient(ellipse at 75% 95%,rgba(255,0,60,.04) 0%,transparent 50%)'
          : 'radial-gradient(ellipse at 50% 0%,rgba(0,255,65,.04) 0%,transparent 60%)'
      }} />

      <Navbar view={view} setView={setView} paperBalance={paperBalance} tradingMode={tradingMode} setTradingMode={setTradingMode} />
      <Ticker />

      {tradeMarket && (
        <TradeModal market={tradeMarket} onClose={() => setTradeMarket(null)} onTrade={handleTrade} paperBalance={paperBalance} mode={tradingMode} />
      )}

      <div className="pt-[82px] relative z-[1] flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-48 shrink-0 sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto py-4 px-3" style={{ borderRight: '1px solid var(--brd)' }}>
          {sideNav.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-4 pt-4' : ''} style={gi > 0 ? { borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' } : {}}>
              {group.items.map(item => (
                <button key={item.id} onClick={() => setView(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left"
                  style={{ background: view === item.id ? 'var(--ac-dim)' : 'transparent', color: view === item.id ? 'var(--ac)' : 'var(--tx2)', fontWeight: view === item.id ? 600 : 400 }}>
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  {item.label}
                  {item.id === 'portfolio' && openTrades.length > 0 && (
                    <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--ac) 15%, transparent)', color: 'var(--ac)' }}>{openTrades.length}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          {/* Mode toggle */}
          <div className="mt-auto pt-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 px-3" style={{ color: 'var(--tx4)' }}>MODE</div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--brd)' }}>
              {['paper', 'live'].map(m => (
                <button key={m} onClick={() => setTradingMode(m)} className="flex-1 py-2 text-xs font-bold uppercase transition-all"
                  style={{ background: tradingMode === m ? (m === 'paper' ? 'color-mix(in srgb, var(--ac) 15%, transparent)' : 'color-mix(in srgb, var(--gn) 15%, transparent)') : 'transparent', color: tradingMode === m ? (m === 'paper' ? 'var(--ac)' : 'var(--gn)') : 'var(--tx4)' }}>
                  {m === 'paper' ? '📄' : '💰'} {m}
                </button>
              ))}
            </div>
            <div className="text-xs text-center mt-1.5" style={{ color: 'var(--tx4)' }}>{tradingMode === 'paper' ? 'Virtual money' : 'Real USDC'}</div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-7 py-5 pb-24">
          <ViewComponent {...sharedProps} />
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-[50] px-4 md:px-7 py-2.5 flex justify-between items-center"
        style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderTop: '1px solid var(--brd)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
        <div className="flex gap-4 md:gap-5" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>
          <span className="hidden sm:inline">CLOB <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span className="hidden md:inline">Polygon <span style={{ color: 'var(--gn)' }}>●</span> 38ms</span>
          <span>Mode: <span style={{ color: tradingMode === 'paper' ? 'var(--ac)' : 'var(--gn)', fontWeight: 700 }}>{tradingMode.toUpperCase()}</span></span>
          <span>Bal: <span style={{ color: 'var(--ac)', fontWeight: 600 }}>${paperBalance.toFixed(2)}</span></span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>APEX v0.2.0 — {clock} AEST</span>
      </footer>
    </div>
  );
}
