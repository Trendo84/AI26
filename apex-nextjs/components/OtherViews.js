'use client';
import MarketCard from './MarketCard';
import { markets } from '@/lib/data';

export function WatchlistView() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Watchlist</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Markets you&apos;re tracking for opportunities</p>
      </div>
      <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {markets.slice(0, 6).map((m, i) => <MarketCard key={m.id} m={m} delay={0.05 + i * 0.05} />)}
      </div>
      {markets.slice(0, 6).length === 0 && (
        <div className="text-center py-20 card rounded-xl">
          <div className="text-lg mb-2" style={{ color: 'var(--tx3)' }}>No bookmarked markets yet</div>
          <div className="text-sm" style={{ color: 'var(--tx4)' }}>Click ☆ on any market card to add it to your watchlist</div>
        </div>
      )}
    </div>
  );
}

export function PointsView() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Points</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Your $APEX balance and transaction history</p>
      </div>
      {/* Balance */}
      <div className="card p-6 mb-5">
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>BALANCE</div>
        <div className="flex justify-between items-end">
          <div className="glow-text" style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
            10,000.00 <span className="text-base font-semibold" style={{ color: 'var(--tx2)' }}>$APEX</span>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--tx3)' }}>Lifetime earned</div>
            <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>10,000.00 $APEX</div>
          </div>
        </div>
      </div>
      {/* How to earn */}
      <div className="card p-6 mb-5">
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>HOW TO EARN $APEX</div>
        <div className="main-grid-3 grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { icon: '◈', title: 'Create Markets', desc: 'Earn 2% fee share on all trades in markets you create.', points: '+500' },
            { icon: '⚡', title: 'Active Trading', desc: 'Earn points for every trade executed on the platform.', points: '+10/trade' },
            { icon: '★', title: 'Refer Friends', desc: 'Earn 1,000 $APEX for every friend who joins and trades.', points: '+1,000' },
          ].map((e, i) => (
            <div key={i} className="rounded-xl p-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div className="text-2xl mb-2">{e.icon}</div>
              <div className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font)' }}>{e.title}</div>
              <div className="text-xs mb-2" style={{ color: 'var(--tx3)' }}>{e.desc}</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>{e.points}</span>
            </div>
          ))}
        </div>
      </div>
      {/* History */}
      <div className="card p-6">
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>HISTORY</div>
        <div className="text-center py-10" style={{ color: 'var(--tx4)' }}>No transactions yet</div>
      </div>
    </div>
  );
}
