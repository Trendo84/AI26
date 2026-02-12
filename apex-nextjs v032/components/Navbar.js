'use client';
import { useTheme, themes } from '@/lib/theme';

export default function Navbar(props) {
  var view = props.view;
  var setView = props.setView;
  var paperBalance = props.paperBalance;
  var tradingMode = props.tradingMode;
  var _theme = useTheme();
  var theme = _theme.theme;
  var setTheme = _theme.setTheme;

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-[100] flex items-center px-4 md:px-6 justify-between"
      style={{ background: 'color-mix(in srgb, var(--bg) 94%, transparent)', borderBottom: '1px solid var(--brd)', backdropFilter: 'blur(16px)' }}>

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={function() { setView('discover'); }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold"
            style={{ background: 'var(--grad)', color: 'var(--bg)', boxShadow: '0 0 16px var(--ac-glow)' }}>◬</div>
          <span className="glow-text font-extrabold text-base tracking-widest uppercase" style={{ color: 'var(--tx)' }}>APEX</span>
        </div>
        <span className="hidden sm:inline text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--pu) 15%, transparent)', color: 'var(--pu)' }}>v0.3.2</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme dots */}
        <div className="hidden sm:flex gap-1.5">
          {Object.entries(themes).map(function(entry) {
            var k = entry[0]; var th = entry[1];
            return (
              <button key={k} onClick={function() { setTheme(k); }} title={th.name}
                className="w-5 h-5 rounded transition-all"
                style={{
                  border: '2px solid ' + (theme === k ? th.dot : 'var(--brd)'),
                  background: th.dot,
                  opacity: theme === k ? 1 : 0.35,
                }} />
            );
          })}
        </div>

        {/* Mode badge */}
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg hidden md:inline" style={{
          background: tradingMode === 'paper' ? 'color-mix(in srgb, var(--ac) 15%, transparent)' : 'color-mix(in srgb, var(--gn) 15%, transparent)',
          color: tradingMode === 'paper' ? 'var(--ac)' : 'var(--gn)',
        }}>{tradingMode === 'paper' ? '📄 PAPER' : '💰 LIVE'}</span>

        {/* Balance */}
        <span className="text-xs font-bold hidden sm:inline" style={{ fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
          {'$' + (paperBalance || 0).toFixed(2)}
        </span>

        {/* Wallet button */}
        <button onClick={function() { setView('wallet'); }} className="btn-primary !py-1.5 !px-4 !text-xs">💳 Wallet</button>

        {/* Settings */}
        <button onClick={function() { setView('settings'); }} className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg transition-all"
          style={{ background: view === 'settings' ? 'var(--ac-dim)' : 'transparent', color: view === 'settings' ? 'var(--ac)' : 'var(--tx3)', border: '1px solid var(--brd)' }}>
          ⚙
        </button>
      </div>
    </nav>
  );
}
