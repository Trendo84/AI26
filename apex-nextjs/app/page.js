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
import WalletManager from '@/components/WalletManager';
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

const viewMap = { discover: DiscoverView, agent: AgentView, portfolio: PortfolioView, watchlist: WatchlistView, points: PointsView, wallet: WalletManager, health: HealthView, alpha: DiscoverView };

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
      marketId, 
      marketQuestion, 
      marketCategory, 
      side,
      action: 'BUY', 
      amount, 
      price,
      shares: amount / price,
      isPaper: true,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    
    const newTrades = [trade, ...trades];
    const newBal = paperBalance - amount;
    persist(newTrades, newBal);
    setTradeMarket(null);
  }, [trades, paperBalance, persist]);

  const handleCloseTrade = useCallback((tradeId, exitPrice) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;
    
    const pnl = (exitPrice - trade.price) * trade.shares * (trade.side === 'YES' ? 1 : -1);
    const updatedTrades = trades.map(t => 
      t.id === tradeId 
        ? { ...t, status: 'closed', exitPrice, pnl, closedAt: new Date().toISOString() }
        : t
    );
    const newBal = paperBalance + (trade.amount + pnl);
    persist(updatedTrades, newBal);
  }, [trades, paperBalance, persist]);

  const CurrentView = viewMap[view] || DiscoverView;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg1)' }}>
      {isMatrix && <MatrixRain />}
      
      <Navbar clock={clock} />
      
      <div className="flex" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside className="w-60 flex flex-col border-r" style={{ borderColor: 'var(--brd)', background: 'var(--bg2)' }}>
          <Ticker />
          
          <div className="flex-1 py-2">
            {sideNav.map((section, sIdx) => (
              <div key={sIdx} className="mb-2">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
                    style={{
                      background: view === item.id ? 'var(--ac)' : 'transparent',
                      color: view === item.id ? '#000' : 'var(--tx)',
                    }}
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t" style={{ borderColor: 'var(--brd)' }}>
            <div className="text-xs mb-2" style={{ color: 'var(--tx3)' }}>Mode</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTradingMode('paper')}
                className="flex-1 py-2 text-xs font-bold rounded"
                style={{
                  background: tradingMode === 'paper' ? 'var(--ac)' : 'var(--bg3)',
                  color: tradingMode === 'paper' ? '#000' : 'var(--tx2)',
                }}
              >
                📄 Paper
              </button>
              <button
                onClick={() => setTradingMode('live')}
                className="flex-1 py-2 text-xs font-bold rounded"
                style={{
                  background: tradingMode === 'live' ? 'var(--gn)' : 'var(--bg3)',
                  color: tradingMode === 'live' ? '#000' : 'var(--tx2)',
                }}
              >
                💰 Live
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {view === 'discover' ? (
            <DiscoverView onTrade={setTradeMarket} />
          ) : view === 'portfolio' ? (
            <PortfolioView 
              trades={trades} 
              paperBalance={paperBalance}
              onCloseTrade={handleCloseTrade}
            />
          ) : view === 'wallet' ? (
            <WalletManager 
              tradingMode={tradingMode}
              setTradingMode={setTradingMode}
              paperBalance={paperBalance}
            />
          ) : (
            <CurrentView />
          )}
        </main>
      </div>

      {/* Trade Modal */}
      <TradeModal 
        market={tradeMarket}
        onClose={() => setTradeMarket(null)}
        onTrade={handleTrade}
        paperBalance={paperBalance}
        mode={tradingMode}
      />
    </div>
  );
}
