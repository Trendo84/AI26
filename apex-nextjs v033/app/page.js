'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTheme, themes } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import MatrixRain from '@/components/MatrixRain';
import DiscoverView from '@/components/DiscoverView';
import ProDashboard from '@/components/ProDashboard';
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
    { id: 'agent', icon: '◈', label: 'Intelligence' },
    { id: 'portfolio', icon: '◐', label: 'Portfolio' },
  ]},
  { items: [
    { id: 'wallet', icon: '◑', label: 'Wallet' },
    { id: 'watchlist', icon: '○', label: 'Watchlist' },
    { id: 'health', icon: '◉', label: 'Health' },
    { id: 'settings', icon: '⚙', label: 'Settings' },
  ]},
];

var mobileNav = [
  { id: 'discover', icon: '◎', label: 'Markets' },
  { id: 'alpha', icon: '⚡', label: 'Alpha' },
  { id: 'portfolio', icon: '◐', label: 'Portfolio' },
  { id: 'wallet', icon: '◑', label: 'Wallet' },
  { id: 'agent', icon: '◈', label: 'More' },
];

function SettingsView(props) {
  var dashMode = props.dashMode;
  var setDashMode = props.setDashMode;
  var _theme = useTheme();
  var theme = _theme.theme;
  var setTheme = _theme.setTheme;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ letterSpacing: '-0.02em' }}>Settings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Customize your APEX experience</p>
      </div>

      {/* Dashboard Mode */}
      <div className="card p-5 mb-4 animate-fade">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--tx3)' }}>Dashboard Layout</div>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--pu)', fontSize: 10 }}>BETA</span>
        </div>
        <div className="text-xs mb-4" style={{ color: 'var(--tx3)' }}>Both layouts have full trading functionality.</div>
        <div className="flex gap-3">
          {[
            { id: 'classic', label: 'Classic', desc: 'Sidebar navigation with focused views', icon: '◎' },
            { id: 'pro', label: 'Pro Dashboard', desc: 'All-in-one Bloomberg-style overview', icon: '◐' },
          ].map(function(m) {
            var isActive = dashMode === m.id;
            return (
              <button key={m.id} onClick={function() { setDashMode(m.id); try { localStorage.setItem('apex_dash_mode', m.id); } catch(e) {} }}
                className="flex-1 rounded-lg p-4 text-left transition-all"
                style={{
                  border: '1px solid ' + (isActive ? 'var(--ac)' : 'var(--brd)'),
                  background: isActive ? 'var(--ac-dim)' : 'var(--bg3)',
                }}>
                <div className="text-xl mb-2">{m.icon}</div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: isActive ? 'var(--ac)' : 'var(--tx)' }}>{m.label}</div>
                <div className="text-xs" style={{ color: 'var(--tx3)' }}>{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme */}
      <div className="card p-5 mb-4 animate-fade" style={{ animationDelay: '0.05s' }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--tx3)' }}>Theme</div>
        <div className="flex gap-2">
          {Object.entries(themes).map(function(entry) {
            var k = entry[0]; var th = entry[1];
            var isActive = theme === k;
            return (
              <button key={k} onClick={function() { setTheme(k); }}
                className="flex-1 rounded-lg p-3 text-center transition-all"
                style={{
                  border: '1px solid ' + (isActive ? th.dot : 'var(--brd)'),
                  background: isActive ? 'rgba(' + (k === 'day' ? '0,136,204' : k === 'cyberpunk' ? '252,227,0' : k === 'matrix' ? '0,255,65' : '0,212,255') + ',0.08)' : 'var(--bg3)',
                }}>
                <div className="w-5 h-5 rounded-full mx-auto mb-1.5" style={{ background: th.dot }} />
                <div className="text-xs font-semibold" style={{ color: isActive ? th.dot : 'var(--tx3)' }}>{th.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-5 animate-fade" style={{ animationDelay: '0.1s' }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--tx3)' }}>About</div>
        <div className="text-sm" style={{ color: 'var(--tx2)' }}>APEX Trading Protocol v0.3.3</div>
        <div className="text-xs mt-1" style={{ color: 'var(--tx4)' }}>Bloomberg Terminal for Prediction Markets</div>
      </div>
    </div>
  );
}

export default function Home() {
  var _theme = useTheme();
  var theme = _theme.theme;
  var _v = useState('discover'); var view = _v[0]; var setView = _v[1];
  var _c = useState(''); var clock = _c[0]; var setClock = _c[1];
  var _tm = useState(null); var tradeMarket = _tm[0]; var setTradeMarket = _tm[1];
  var _pb = useState(10000); var paperBalance = _pb[0]; var setPaperBalance = _pb[1];
  var _md = useState('paper'); var tradingMode = _md[0]; var setTradingMode = _md[1];
  var _tr = useState([]); var trades = _tr[0]; var setTrades = _tr[1];
  var _dm = useState('classic'); var dashMode = _dm[0]; var setDashMode = _dm[1];
  var isMatrix = theme === 'matrix';
  var isCyber = theme === 'cyberpunk';

  useEffect(function() {
    var tick = function() { setClock(new Date().toLocaleTimeString('en-AU', { hour12: false })); };
    tick(); var iv = setInterval(tick, 1000);
    return function() { clearInterval(iv); };
  }, []);

  useEffect(function() {
    try {
      var b = localStorage.getItem('apex_paper_balance');
      if (b) setPaperBalance(parseFloat(b));
      var t = localStorage.getItem('apex_trades');
      if (t) setTrades(JSON.parse(t));
      var m = localStorage.getItem('apex_mode');
      if (m) setTradingMode(m);
      var dm = localStorage.getItem('apex_dash_mode');
      if (dm) setDashMode(dm);
    } catch(e) {}
  }, []);

  var persist = useCallback(function(newTrades, newBal) {
    setTrades(newTrades); setPaperBalance(newBal);
    try {
      localStorage.setItem('apex_trades', JSON.stringify(newTrades));
      localStorage.setItem('apex_paper_balance', String(newBal));
    } catch(e) {}
  }, []);

  useEffect(function() {
    try { localStorage.setItem('apex_mode', tradingMode); } catch(e) {}
  }, [tradingMode]);

  var handleTrade = useCallback(function(params) {
    var trade = {
      id: Date.now().toString(), marketId: params.marketId, marketQuestion: params.marketQuestion,
      marketCategory: params.marketCategory, side: params.side, action: 'BUY', amount: params.amount,
      price: params.price, shares: params.amount / params.price,
      isPaper: tradingMode === 'paper', status: 'open', createdAt: new Date().toISOString(),
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

  var openTrades = trades.filter(function(t) { return t.status === 'open'; });
  var closedTrades = trades.filter(function(t) { return t.status === 'closed'; });
  var totalPnl = closedTrades.reduce(function(s, t) { return s + (t.pnl || 0); }, 0);
  var winCount = closedTrades.filter(function(t) { return t.pnl > 0; }).length;

  var sharedProps = {
    onTrade: function(m) { setTradeMarket(m); },
    paperBalance: paperBalance, tradingMode: tradingMode, setTradingMode: setTradingMode,
    trades: trades, openTrades: openTrades, closedTrades: closedTrades,
    closeTrade: closeTrade, totalPnl: totalPnl, winCount: winCount, resetPaper: resetPaper,
  };

  function renderView() {
    if (dashMode === 'pro' && view === 'discover') return <ProDashboard key="pro" {...sharedProps} />;
    switch(view) {
      case 'discover': return <DiscoverView key="d" {...sharedProps} />;
      case 'alpha': return <AlphaView key="a" />;
      case 'agent': return <AgentView key="ag" />;
      case 'portfolio': return <PortfolioView key="p" {...sharedProps} />;
      case 'wallet': return <WalletView key="w" tradingMode={tradingMode} setTradingMode={setTradingMode} paperBalance={paperBalance} />;
      case 'watchlist': return <WatchlistView key="wl" />;
      case 'health': return <HealthView key="h" />;
      case 'settings': return <SettingsView key="s" dashMode={dashMode} setDashMode={setDashMode} />;
      default: return <DiscoverView key="dd" {...sharedProps} />;
    }
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--font)' }}>
      <MatrixRain active={isMatrix} />
      {(isCyber || isMatrix) && <div className="scan-overlay" />}

      <Navbar view={view} setView={setView} paperBalance={paperBalance} tradingMode={tradingMode} setTradingMode={setTradingMode} />
      <Ticker />

      {tradeMarket && (
        <TradeModal market={tradeMarket} onClose={function() { setTradeMarket(null); }} onTrade={handleTrade} paperBalance={paperBalance} mode={tradingMode} />
      )}

      <div className="pt-[82px] relative z-[1] flex min-h-screen">
        {/* ─── Sidebar — CLEAN, no mode toggle ─── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto py-4 px-3" style={{ borderRight: '1px solid var(--brd)' }}>
          {sideNav.map(function(group, gi) {
            return (
              <div key={gi} className={gi > 0 ? 'mt-3 pt-3' : ''} style={gi > 0 ? { borderTop: '1px solid var(--brd)' } : {}}>
                {group.items.map(function(item) {
                  var isActive = view === item.id;
                  return (
                    <button key={item.id} onClick={function() { setView(item.id); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 text-left"
                      style={{
                        background: isActive ? 'var(--ac-dim)' : 'transparent',
                        color: isActive ? 'var(--ac)' : 'var(--tx2)',
                        fontWeight: isActive ? 600 : 400,
                      }}>
                      <span style={{ fontSize: 16, width: 22, textAlign: 'center', opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                      {item.label}
                      {item.id === 'portfolio' && openTrades.length > 0 && (
                        <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: 'var(--ac-dim)', color: 'var(--ac)', fontSize: 10 }}>{openTrades.length}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-6 py-5 pb-32 lg:pb-14">
          {renderView()}
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] flex" style={{
        background: 'color-mix(in srgb, var(--bg) 95%, transparent)',
        borderTop: '1px solid var(--brd)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {mobileNav.map(function(item) {
          var isActive = view === item.id;
          return (
            <button key={item.id} onClick={function() { setView(item.id); }}
              className="flex-1 flex flex-col items-center py-2 transition-all"
              style={{ color: isActive ? 'var(--ac)' : 'var(--tx4)', minHeight: 52 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, marginTop: 2 }}>{item.label}</span>
              {isActive && <span className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: 'var(--ac)' }} />}
            </button>
          );
        })}
      </nav>

      {/* ─── Desktop Footer ─── */}
      <footer className="hidden lg:flex fixed bottom-0 left-0 right-0 z-[50] px-6 py-2 justify-between items-center"
        style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderTop: '1px solid var(--brd)', backdropFilter: 'blur(12px)' }}>
        <div className="flex gap-4" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--tx4)' }}>
          <span>CLOB <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span>Polygon <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span style={{ color: tradingMode === 'paper' ? 'var(--ac)' : 'var(--gn)' }}>{tradingMode.toUpperCase()}</span>
          <span>${paperBalance.toFixed(2)}</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--tx4)' }}>APEX v0.3.3 — {clock} AEST</span>
      </footer>
    </div>
  );
}
