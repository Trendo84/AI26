'use client';
import { useState } from 'react';
import { useTheme, themes } from '@/lib/theme';

export default function Navbar({ view, setView }) {
  const { theme, setTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'agent', label: 'Agent' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 z-[100] flex items-center px-4 md:px-6 justify-between"
        style={{ background: 'color-mix(in srgb, var(--bg) 94%, transparent)', borderBottom: '1px solid var(--brd)', backdropFilter: 'blur(16px)' }}>

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('discover')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold"
              style={{ background: 'var(--grad)', color: 'var(--bg)', boxShadow: `0 0 16px var(--ac-glow)` }}>◬</div>
            <div>
              <span className="glow-text font-extrabold text-base tracking-widest uppercase" style={{ color: 'var(--tx)' }}>APEX</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-1">
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setView(n.id); setMobileMenu(false); }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: view === n.id ? 'var(--ac-dim)' : 'transparent',
                  color: view === n.id ? 'var(--ac)' : 'var(--tx2)',
                  fontFamily: 'var(--font)',
                }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme dots */}
          <div className="hidden sm:flex gap-1.5">
            {Object.entries(themes).map(([k, th]) => (
              <button key={k} onClick={() => setTheme(k)} title={th.name}
                className="w-4 h-4 md:w-5 md:h-5 rounded transition-all"
                style={{
                  border: `2px solid ${theme === k ? th.dot : 'var(--brd)'}`,
                  background: th.dot,
                  opacity: theme === k ? 1 : 0.35,
                }} />
            ))}
          </div>

          {/* Balance */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: 'color-mix(in srgb, var(--ac) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--ac) 25%, transparent)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac)' }}>◈</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ac)', fontFamily: 'var(--mono)' }}>10,000 $APEX</span>
          </div>

          {/* Connect */}
          <button className="btn-primary !py-1.5 !px-4 !text-xs">+ Connect</button>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1 p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--tx2)' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--tx2)' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: 'var(--tx2)' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[99] pt-14" style={{ background: 'color-mix(in srgb, var(--bg) 98%, transparent)' }}>
          <div className="flex flex-col p-6 gap-2">
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setView(n.id); setMobileMenu(false); }}
                className="px-4 py-3 rounded-lg text-left text-base font-medium"
                style={{
                  background: view === n.id ? 'var(--ac-dim)' : 'transparent',
                  color: view === n.id ? 'var(--ac)' : 'var(--tx2)',
                  fontFamily: 'var(--font)',
                }}>
                {n.label}
              </button>
            ))}
            <div className="flex gap-2 mt-4">
              {Object.entries(themes).map(([k, th]) => (
                <button key={k} onClick={() => setTheme(k)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    border: `1px solid ${theme === k ? th.dot : 'var(--brd)'}`,
                    color: theme === k ? th.dot : 'var(--tx3)',
                    fontFamily: 'var(--font)',
                  }}>
                  {th.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
