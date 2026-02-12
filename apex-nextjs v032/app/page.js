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
    { id: 'agent', icon: '🧠', label: 'Intelligence' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio' },
  ]},
  { items: [
    { id: 'wallet', icon: '💳', label: 'Wallet' },
    { id: 'watchlist', icon: '👁', label: 'Watchlist' },
    { id: 'health', icon: '🩺', label: 'Health' },
    { id: 'settings', icon: '⚙', label: 'Settings' },
  ]},
];

var mobileNav = [
  { id: 'discover', icon: '◎', label: 'Markets' },
  { id: 'alpha', icon: '⚡', label: 'Alpha' },
  { id: 'portfolio', icon: '📊', label: 'Portfolio' },
  { id: 'wallet', icon: '💳', label: 'Wallet' },
  { id: 'agent', icon: '🧠', label: 'More' },
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
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Settings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Customize your APEX experience</p>
      </div>

      {/* Dashboard Mode Toggle */}
      <div className="card p-5 mb-5 animate-fade">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>🧪 EXPERIMENTAL: DASHBOARD MODE</div>
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--pu) 15%, transparent)', color: 'var(--pu)' }}>BETA</span>
        </div>
        <div className="text-xs mb-4" style={{ color: 'var(--tx2)' }}>Switch between dashboard layouts. Both have full functionality. We are testing which works best.</div>
        <div className="flex gap-3">
          {[
            { id: 'classic', label: 'Classic', desc: 'Original APEX layout with sidebar views', icon: '◎' },
            { id: 'pro', label: 'Pro Dashboard', desc: 'Bloomberg-style all-in-one overview', icon: '📊' },
          ].map(function(m) {
            var isActive = dashMode === m.id;
            return (
              <button key={m.id} onClick={function() { setDashMode(m.id); try { localStorage.setItem('apex_dash_mode', m.id); } catch(e) {} }}
                className="flex-1 rounded-xl p-5 text-left transition-all"
                style={{
                  border: '2px solid ' + (isActive ? 'var(--ac)' : 'var(--brd)'),
                  background: isActive ? 'var(--ac-dim)' : 'var(--bg3)',
                }}>
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: isActive ? 'var(--ac)' : 'var(--tx)' }}>{m.label}</div>
                <div className="text-xs" style={{ color: 'var(--tx3)' }}>{m.desc}</div>
                {isActive && <div className="text-xs font-bold mt-2" style={{ color: 'var(--gn)' }}>✓ Active</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme selector */}
      <div className="card p-5 mb-5 animate-fade" style={{ animationDelay: '0.05s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>🎨 THEME</div>
        <div className="flex gap-3">
          {Object.entries(themes).map(function(entry) {
            var k = entry[0]; var th = entry[1];
            var isActive = theme === k;
            return (
              <button key={k} onClick={function() { setTheme(k); }}
                className="flex-1 rounded-xl p-4 text-center transition-all"
                style={{
                  border: '2px solid ' + (isActive ? th.dot : 'var(--brd)'),
                  background: isActive ? 'color-mix(in srgb, ' + th.dot + ' 10%, var(--bg3))' : 'var(--bg3)',
                }}>
                <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: th.dot, boxShadow: isActive ? '0 0 16px ' + th.dot : 'none' }} />
                <div className="text-sm font-bold" style={{ color: isActive ? th.dot : 'var(--tx2)' }}>{th.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* About */}
      <div className="card p-5 animate-fade" style={{ animationDelay: '0.1s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>ABOUT</div>
        <div className="text-sm" style={{ color: 'var(--tx2)' }}>
          APEX Trading Protocol v0.3.2 — Pre-release
        </div>
        <div className="text-xs mt-2" style={{ color: 'var(--tx4)' }}>
          Bloomberg Terminal for Prediction Markets. Built for traders who demand edge.
        </div>
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
  var _lu = useState(null); var lastUpdated = _lu[0]; var setLastUpdated = _lu[1];
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

  // Render the right view
  function renderView() {
    if (dashMode === 'pro' && view === 'discover') {
      return <ProDashboard key="pro" {...sharedProps} />;
    }
    switch(view) {
      case 'discover': return <DiscoverView key="discover" {...sharedProps} />;
      case 'alpha': return <AlphaView key="alpha" />;
      case 'agent': return <AgentView key="agent" />;
      case 'portfolio': return <PortfolioView key="portfolio" {...sharedProps} />;
      case 'wallet': return <WalletView key="wallet" tradingMode={tradingMode} setTradingMode={setTradingMode} paperBalance={paperBalance} />;
      case 'watchlist': return <WatchlistView key="watchlist" />;
      case 'health': return <HealthView key="health" />;
      case 'settings': return <SettingsView key="settings" dashMode={dashMode} setDashMode={setDashMode} />;
      default: return <DiscoverView key="discover-default" {...sharedProps} />;
    }
  }

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
        {/* ─── Desktop Sidebar ─── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto py-5 px-3" style={{ borderRight: '1px solid var(--brd)' }}>
          <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 120 }}>
            {sideNav.map(function(group, gi) {
              return (
                <div key={gi} className={gi > 0 ? 'mt-4 pt-4' : ''} style={gi > 0 ? { borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' } : {}}>
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
          </div>

          {/* Mode toggle — fixed at bottom of sidebar, ABOVE footer */}
          <div className="sticky bottom-0 pt-3 pb-2" style={{ background: 'var(--bg)', borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 px-2" style={{ color: 'var(--tx4)' }}>MODE</div>
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

        <main className="flex-1 min-w-0 px-4 md:px-7 py-5 pb-32 lg:pb-16">
          {renderView()}
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] flex" style={{
        background: 'color-mix(in srgb, var(--bg) 96%, transparent)',
        borderTop: '1px solid var(--brd)',
        backdropFilter: 'blur(16px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {mobileNav.map(function(item) {
          var isActive = view === item.id;
          return (
            <button key={item.id} onClick={function() { setView(item.id); }}
              className="flex-1 flex flex-col items-center py-2 transition-all"
              style={{ color: isActive ? 'var(--ac)' : 'var(--tx4)', minHeight: 56 }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, marginTop: 2 }}>{item.label}</span>
              {isActive && <span className="w-4 h-0.5 rounded-full mt-1" style={{ background: 'var(--ac)' }} />}
            </button>
          );
        })}
      </nav>

      {/* ─── Desktop Footer ─── */}
      <footer className="hidden lg:flex fixed bottom-0 left-0 right-0 z-[50] px-4 md:px-7 py-2.5 justify-between items-center"
        style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderTop: '1px solid var(--brd)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
        <div className="flex gap-4 md:gap-5" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>
          <span>CLOB <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span>Polygon <span style={{ color: 'var(--gn)' }}>●</span></span>
          <span style={{ color: tradingMode === 'paper' ? 'var(--ac)' : 'var(--gn)', fontWeight: 700 }}>{tradingMode.toUpperCase()}</span>
          <span>${paperBalance.toFixed(2)}</span>
          <span>{dashMode === 'pro' ? '📊 Pro' : '◎ Classic'}</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>APEX v0.3.2 — {clock} AEST</span>
      </footer>
    </div>
  );
}
