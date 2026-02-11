'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import MatrixRain from '@/components/MatrixRain';
import DiscoverView from '@/components/DiscoverView';
import AgentView from '@/components/AgentView';
import PortfolioView from '@/components/PortfolioView';
import { WatchlistView, PointsView } from '@/components/OtherViews';

const sideNav = [
  { section: null, items: [
    { id: 'discover', icon: '◎', label: 'Getting Started' },
    { id: 'agent', icon: '🤖', label: 'OpenClaw' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio' },
    { id: 'watchlist', icon: '👁', label: 'Watchlist' },
  ]},
  { section: null, items: [
    { id: 'markets', icon: '📈', label: 'My Markets' },
    { id: 'points', icon: '◈', label: 'Points' },
  ]},
  { section: null, items: [
    { id: 'alpha', icon: '⚡', label: 'Alpha' },
  ]},
];

const views = {
  discover: DiscoverView,
  agent: AgentView,
  portfolio: PortfolioView,
  watchlist: WatchlistView,
  points: PointsView,
  markets: DiscoverView,
  alpha: DiscoverView,
};

export default function Home() {
  const { theme } = useTheme();
  const [view, setView] = useState('discover');
  const [clock, setClock] = useState('');
  const isMatrix = theme === 'matrix';
  const isCyber = theme === 'cyberpunk';

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-AU', { hour12: false }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const ViewComponent = views[view] || DiscoverView;

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--font)' }}>
      {/* Background effects */}
      <MatrixRain active={isMatrix} />
      {(isCyber || isMatrix) && <div className="scan-overlay" />}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: theme === 'apex'
          ? 'radial-gradient(ellipse at 15% 0%, rgba(0,212,255,.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(0,102,255,.04) 0%, transparent 55%)'
          : theme === 'cyberpunk'
          ? 'radial-gradient(ellipse at 25% 5%, rgba(252,227,0,.06) 0%, transparent 50%), radial-gradient(ellipse at 75% 95%, rgba(255,0,60,.04) 0%, transparent 50%)'
          : 'radial-gradient(ellipse at 50% 0%, rgba(0,255,65,.04) 0%, transparent 60%)'
      }} />

      {/* Nav + Ticker */}
      <Navbar view={view} setView={setView} />
      <Ticker />

      {/* Main layout: Sidebar + Content */}
      <div className="pt-[82px] relative z-[1] flex min-h-screen">
        {/* Left Sidebar - desktop only */}
        <aside className="hidden lg:flex flex-col w-48 shrink-0 sticky top-[82px] h-[calc(100vh-82px)] overflow-y-auto py-4 px-3"
          style={{ borderRight: '1px solid var(--brd)' }}>
          {sideNav.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-4 pt-4' : ''} style={gi > 0 ? { borderTop: '1px solid color-mix(in srgb, var(--brd) 50%, transparent)' } : {}}>
              {group.items.map(item => (
                <button key={item.id} onClick={() => setView(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left"
                  style={{
                    background: view === item.id ? 'var(--ac-dim)' : 'transparent',
                    color: view === item.id ? 'var(--ac)' : 'var(--tx2)',
                    fontWeight: view === item.id ? 600 : 400,
                    fontFamily: 'var(--font)',
                  }}>
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 px-4 md:px-7 py-5 pb-24">
          <ViewComponent />
        </main>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-[50] px-4 md:px-7 py-2.5 flex justify-between items-center"
        style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)', borderTop: '1px solid var(--brd)', backdropFilter: 'blur(12px)', fontSize: 10 }}>
        <div className="flex gap-4 md:gap-5" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>
          <span className="hidden sm:inline">Polymarket CLOB <span style={{ color: 'var(--gn)' }}>●</span> Connected</span>
          <span className="hidden md:inline">Polygon <span style={{ color: 'var(--gn)' }}>●</span> 38ms</span>
          <span>WebSocket <span style={{ color: 'var(--gn)' }}>●</span> Active</span>
          <span className="hidden sm:inline">Agents <span style={{ color: 'var(--gn)' }}>●</span> 3 running</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>
          APEX v0.1.0 — {clock} AEST
        </span>
      </footer>
    </div>
  );
}
