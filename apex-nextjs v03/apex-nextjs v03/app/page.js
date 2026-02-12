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
import AlphaView from '@/components/AlphaView';
import TradeModal from '@/components/TradeModal';

var sideNav = [
  { items: [
    { id: 'discover', icon: '◎', label: 'Discover' },
    { id: 'alpha', icon: '⚡', label: 'Alpha' },
    { id: 'agent', icon: '🧠', label: 'Intelligence' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio' },
  ]},
  { items: [
    { id: 'wallet', icon: '💳', label: 'Wallet' },
    { id: 'watchlist', icon: '👁', label: 'Watchlist' },
    { id: 'health', icon: '🩺', label: 'Health' },
    { id: 'points', icon: '◈', label: 'Points' },
  ]},
];

var viewMap = {
  discover: DiscoverView, alpha: AlphaView, agent: AgentView,
  portfolio: PortfolioView, watchlist: WatchlistView, wallet: WalletView,
  health: HealthView, points: PointsView,
};

export default function Home() {
  var _theme = useTheme();
  var theme = _theme.theme;
  var _v = useState('discover'); var view = _v[0]; var setView = _v[1];
  var _c = useState(''); var clock = _c[0]; var setClock = _c[1];
  var _tm = useState(null); var tradeMarket = _tm[0]; var setTradeMarket = _tm[1];
  var _pb = useState(10000); var paperBalance = _pb[0]; var setPaperBalance = _pb[1];
  var _md = useState('paper'); var tradingMode = _md[0]; var setTradingMode = _md[1];
  var _tr = useState([]); var trades = _tr[0]; var setTrades = _tr[1];
  var _lu = useState(null); var lastUpdated = _lu[0]; var setLastUpdated = _lu[1];
  var isMatrix = theme === 'matrix';
  var isCyber = theme === 'cyberpunk';

  useEffect(function() {
    var tick = function() { setClock(new Date().toLocaleTimeString('en-AU', { hour12: false })); };
    tick(); var iv = setInterval(tick, 1000);
    return function() { clearInterval(iv); };
  }, []);

  // Load from localStorage
  useEffect(function() {
    try {
      var b = localStorage.getItem('apex_paper_balance');
      if (b) setPaperBalance(parseFloat(b));
      var t = localStorage.getItem('apex_trades');
      if (t) setTrades(JSON.parse(t));
      var m = localStorage.getItem('apex_mode');
      if (m) setTradingMode(m);
    } catch(e) {}
    setLastUpdated(new Date());
  }, []);

  var persist = useCallback(function(newTrades, newBal) {
    setTrades(newTrades); setPaperBalance(newBal);
    try {
      localStorage.setItem('apex_trades', JSON.stringify(newTrades));
      localStorage.setItem('apex_paper_balance', String(newBal));
    } catch(e) {}
    setLastUpdated(new Date());
  }, []);

  useEffect(function() {
    try { localStorage.setItem('apex_mode', tradingMode); } catch(e) {}
  }, [tradingMode]);

  var handleTrade = useCallback(function(params) {
    var trade = {
      id: Date.now().toString(),
      marketId: params.marketId, marketQuestion: params.marketQuestion,
      marketCategory: params.marketCategory, side: params.side,
      action: 'BUY', amount: params.amount, price: params.price,
      shares: params.amount / params.price,
      isPaper: tradingMode === 'paper', status: 'open',
      createdAt: new Date().toISOString(),
    };
    persist([trade].concat(trades), paperBalance - params.amount);
  }, [trades, paperBalance, tradingMode, persist]);

  var closeTrade = useCallback(function(tradeId, exitPrice) {
    var trade = trades.find(function(t) { return t.id === tradeId; });
    if (!trade) return;
    var pnl = (exitPrice - trade.price) * trade.shares * (trade.side === 'YES' ? 1 : -1);
    var updated = trades.map(function(t) {
      if (t.id !== tradeId) return t;
      return Object.assign({}, t, { status: 'closed', exitPrice: exitPrice, pnl: pnl, closedAt: new Date().toISOString() });
    });
    persist(updated, paperBalance + trade.amount + pnl);
  }, [trades, paperBalance, persist]);

  var resetPaper = useCallback(function() { persist([], 10000); }, [persist]);

  var handleRefresh = function() { setLastUpdated(new Date()); };

  var openTrades = trades.filter(function(t) { return t.status === 'open'; });
  var closedTrades = trades.filter(function(t) { return t.status === 'closed'; });
  var totalPnl = closedTrades.reduce(function(s, t) { return s + (t.pnl || 0); }, 0);
  var winCount = closedTrades.filter(function(t) { return t.pnl > 0; }).length;

  var ViewComponent = viewMap[view] || DiscoverView;
  var sharedProps = {
    onTrade: function(m) { setTradeMarket(m); },
    paperBalance: paperBalance, tradingMode: tradingMode, setTradingMode: setTradingMode,
    trades: trades, openTrades: openTrades, closedTrades: closedTrades,
    closeTrade: closeTrade, totalPnl: totalPnl, winCount: winCount, resetPaper: resetPaper,
  };

  var bgGrad = theme === 'apex'
    ? 'radial-gradient(ellipse at 15% 0%,rgba(0,212,255,.05) 0%,transparent 55%),radial-gradient(ellipse at 85% 100%,rgba(0,102,255,.04) 0%,transparent 55%)'
    : theme === 'cyberpunk'
    ? 'radial-gradient(ellipse at 25% 5%,rgba(252,227,0,.06) 0%,transparent 50%),radial-gradient(ellipse at 75% 95%,rgba(255,0,60,.04) 0%,transparent 50%)'
    : 'radial-gradient(ellipse at 50% 0%,rgba(0,255,65,.04) 0%,transparent 60%)';

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--font)' }}>
      <MatrixRain active={isMatrix} />
      {(isCyber || isMatrix) && <div className="scan-overlay" />}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: bgGrad }} />

      <Navbar view={view} setView={setView} paperBalance={paperBalance} tradingMode={tradingMode} setTradingMode={setTradingMode} />
      <Ticker />

      {tradeMarket && (
        <TradeModal market={tradeMarket} onClose={function() { setTradeMarket(null); }} onTrade={handleTrade} paperBalance={paperBalance} mode={tradingMode} />
      )}

      <div className="pt-[82px] relative z-[1] flex min-h-screen">
        {/* ─── Sidebar (bigger targets, bigger text) ─── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto py-5 px-3" style={{ borderRight: '1px solid var(--brd)' }}>
          {sideNav.map(function(group, gi) {
            return (
              <div key={gi} className={gi > 0 ? 'mt-5 pt-5' : ''} style={gi > 0 ? { borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' } : {}}>
                {group.items.map(function(item) {
                  var isActive = view === item.id;
                  return (
                    <button key={item.id} onClick={function() { setView(item.id); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1 text-left"
                      style={{
                        background: isActive ? 'var(--ac-dim)' : 'transparent',
                        color: isActive ? 'var(--ac)' : 'var(--tx2)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 14,
                        border: isActive ? '1px solid color-mix(in srgb, var(--ac) 25%, transparent)' : '1px solid transparent',
                      }}>
                      <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                      {item.label}
                      {item.id === 'portfolio' && openTrades.length > 0 && (
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--ac) 15%, transparent)', color: 'var(--ac)' }}>{openTrades.length}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Mode toggle */}
          <div className="mt-auto pt-5" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 px-4" style={{ color: 'var(--tx4)' }}>TRADING MODE</div>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--brd)' }}>
              {['paper', 'live'].map(function(m) {
                var isActive = tradingMode === m;
                return (
                  <button key={m} onClick={function() { setTradingMode(m); }}
                    className="flex-1 py-2.5 text-xs font-bold uppercase transition-all"
                    style={{
                      background: isActive ? (m === 'paper' ? 'color-mix(in srgb, var(--ac) 15%, transparent)' : 'color-mix(in srgb, var(--gn) 15%, transparent)') : 'transparent',
                      color: isActive ? (m === 'paper' ? 'var(--ac)' : 'var(--gn)') : 'var(--tx4)',
                    }}>
                    {m === 'paper' ? '📄 Paper' : '💰 Live'}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-7 py-5 pb-24">
          <ViewComponent key={view} {...sharedProps} />
        </main>
      </div>

      {/* ─── Footer ─── */}
      <footer className="fixed bottom-0 left-0 right-0 z-[50] px-4 md:px-7 py-2.5 flex justify-between items-center"
        style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderTop: '1px solid var(--brd)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
        <div className="flex gap-4 md:gap-5" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>
          <span className="hidden sm:inline">CLOB <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span className="hidden md:inline">Polygon <span style={{ color: 'var(--gn)' }}>●</span> 38ms</span>
          <span>
            <span style={{ color: tradingMode === 'paper' ? 'var(--ac)' : 'var(--gn)', fontWeight: 700 }}>{tradingMode.toUpperCase()}</span>
          </span>
          <span>
            $<span style={{ color: 'var(--ac)', fontWeight: 600 }}>{paperBalance.toFixed(2)}</span>
          </span>
          {lastUpdated && (
            <span className="hidden md:inline">
              Updated {lastUpdated.toLocaleTimeString('en-AU', { hour12: false })}
              <button onClick={handleRefresh} className="ml-1" style={{ color: 'var(--ac)' }}>↻</button>
            </span>
          )}
        </div>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>APEX v0.3.0 — {clock} AEST</span>
      </footer>
    </div>
  );
}
