'use client';
import { positions } from '@/lib/data';

export default function PortfolioView() {
  const summ = [
    { l: 'Portfolio Value', v: '$4,827.32', s: '+$451.00 today' },
    { l: 'Open Positions', v: '6', s: '5 profitable' },
    { l: 'Unrealized P&L', v: '+$27.65', s: '+3.2%' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Portfolio</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Your active positions and P&L tracking</p>
      </div>

      {/* Summary */}
      <div className="stats-grid grid gap-3.5 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {summ.map((s, i) => (
          <div key={i} className="card animate-fade p-5" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)' }}>{s.l}</div>
            <div className="glow-text" style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{s.v}</div>
            <div className="text-xs mt-1" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Positions table */}
      <div className="card animate-fade p-5" style={{ animationDelay: '0.2s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>ACTIVE POSITIONS</div>

        {/* Desktop header */}
        <div className="hidden md:grid gap-3 px-3 py-2 mb-1" style={{ gridTemplateColumns: '2fr 60px 80px 80px 80px 90px', fontSize: 10, color: 'var(--tx4)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
          <span>Market</span><span>Side</span><span className="text-right">Shares</span>
          <span className="text-right">Avg</span><span className="text-right">Current</span><span className="text-right">P&L</span>
        </div>

        {/* Desktop rows */}
        {positions.map((p, i) => (
          <div key={i}>
            {/* Desktop */}
            <div className="hidden md:grid gap-3 p-3 rounded-lg items-center animate-fade"
              style={{ gridTemplateColumns: '2fr 60px 80px 80px 80px 90px', background: i % 2 === 0 ? 'color-mix(in srgb, var(--bg3) 40%, transparent)' : 'transparent', animationDelay: `${0.25 + i * 0.05}s` }}>
              <span className="text-sm font-medium truncate" style={{ color: 'var(--tx)' }}>{p.mk}</span>
              <span className="text-xs font-bold text-center px-2 py-0.5 rounded"
                style={{ background: `color-mix(in srgb, ${p.side === 'YES' ? 'var(--gn)' : 'var(--rd)'} 12%, transparent)`, color: p.side === 'YES' ? 'var(--gn)' : 'var(--rd)' }}>
                {p.side}
              </span>
              <span className="text-right text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{p.shares}</span>
              <span className="text-right text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>${p.avg.toFixed(3)}</span>
              <span className="text-right text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>${p.cur.toFixed(3)}</span>
              <span className="text-right text-sm font-bold" style={{ fontFamily: 'var(--mono)', color: p.pnl >= 0 ? 'var(--gn)' : 'var(--rd)' }}>
                {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
              </span>
            </div>
            {/* Mobile */}
            <div className="md:hidden card p-4 mb-2 animate-fade" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--tx)' }}>{p.mk}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: `color-mix(in srgb, ${p.side === 'YES' ? 'var(--gn)' : 'var(--rd)'} 12%, transparent)`, color: p.side === 'YES' ? 'var(--gn)' : 'var(--rd)' }}>
                  {p.side}
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: 'var(--tx3)' }}>
                <span>{p.shares} shares @ ${p.avg.toFixed(3)}</span>
                <span className="font-bold" style={{ color: p.pnl >= 0 ? 'var(--gn)' : 'var(--rd)' }}>
                  {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
