'use client';
import { useTheme, themes } from '@/lib/theme';

export default function Navbar(props) {
  var view = props.view;
  var setView = props.setView;
  var paperBalance = props.paperBalance || 0;
  var tradingMode = props.tradingMode || 'paper';
  var setTradingMode = props.setTradingMode;
  var _theme = useTheme();
  var theme = _theme.theme;
  var setTheme = _theme.setTheme;

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-[100] flex items-center px-4 md:px-6 justify-between"
      style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)', borderBottom: '1px solid var(--brd)', backdropFilter: 'blur(20px)' }}>

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={function() { setView('discover'); }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-extrabold"
            style={{ background: 'var(--grad)', color: 'var(--bg)' }}>A</div>
          <span className="font-bold text-sm tracking-wider uppercase" style={{ color: 'var(--tx)', letterSpacing: '0.1em' }}>APEX</span>
        </div>
        <span className="hidden md:inline text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--tx3)', border: '1px solid var(--brd)', fontSize: 10 }}>v0.3.3</span>
      </div>

      {/* Center: Paper/Live Toggle (THE FIX — moved from sidebar) */}
      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--brd)', background: 'var(--bg2)' }}>
        {['paper', 'live'].map(function(m) {
          var isActive = tradingMode === m;
          return (
            <button key={m} onClick={function() { if (setTradingMode) setTradingMode(m); }}
              className="px-4 py-1.5 text-xs font-semibold uppercase transition-all"
              style={{
                background: isActive ? (m === 'paper' ? 'var(--ac-dim)' : 'rgba(16,185,129,0.1)') : 'transparent',
                color: isActive ? (m === 'paper' ? 'var(--ac)' : 'var(--gn)') : 'var(--tx4)',
                letterSpacing: '0.05em',
              }}>
              {m === 'paper' ? '📄 Paper' : '💰 Live'}
            </button>
          );
        })}
      </div>

      {/* Right: Balance + Controls */}
      <div className="flex items-center gap-2">
        {/* Theme dots */}
        <div className="hidden md:flex gap-1">
          {Object.entries(themes).map(function(entry) {
            var k = entry[0]; var th = entry[1];
            return (
              <button key={k} onClick={function() { setTheme(k); }} title={th.name}
                className="w-4 h-4 rounded-full transition-all"
                style={{
                  border: '2px solid ' + (theme === k ? th.dot : 'transparent'),
                  background: th.dot,
                  opacity: theme === k ? 1 : 0.3,
                }} />
            );
          })}
        </div>

        {/* Balance pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md"
          style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ac)', fontFamily: 'var(--mono)' }}>
            {'$' + paperBalance.toFixed(2)}
          </span>
        </div>

        {/* Wallet */}
        <button onClick={function() { setView('wallet'); }}
          className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
          style={{ background: 'var(--grad)', color: 'var(--bg)' }}>
          Wallet
        </button>

        {/* Settings gear */}
        <button onClick={function() { setView('settings'); }}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-md transition-all"
          style={{ color: view === 'settings' ? 'var(--ac)' : 'var(--tx3)', border: '1px solid var(--brd)' }}>
          ⚙
        </button>
      </div>
    </nav>
  );
}
