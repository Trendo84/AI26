'use client';
import { useState } from 'react';
import Spark from './Spark';
import { catColor } from '@/lib/data';

export default function MarketCard({ m, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      className="card card-lift relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding: '18px 20px', animationDelay: `${delay}s` }}
    >
      {/* Category + bookmark */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: catColor(m.cat) }}>
          <span className="inline-block w-2 h-2 rounded-sm" style={{ background: catColor(m.cat) }} />
          {m.cat}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="transition-colors text-base"
          style={{ color: bookmarked ? 'var(--ac)' : 'var(--tx3)' }}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      {/* Question */}
      <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4, marginBottom: 14, minHeight: 38 }}>
        {m.q}
      </div>

      {/* Outcomes */}
      {m.oc.map((o, i) => (
        <div key={i} className="flex justify-between items-center py-1.5" style={{ borderTop: i > 0 ? '1px solid var(--brd)' : 'none', opacity: 0.4 + (1 - i * 0.15) }}>
          <span className="text-xs truncate pr-2" style={{ color: 'var(--tx2)', flex: 1 }}>{o.l}</span>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{o.p}%</span>
            {o.ch !== 0 && (
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--mono)', color: o.ch > 0 ? 'var(--gn)' : 'var(--rd)' }}>
                {o.ch > 0 ? '▲' : '▼'}{Math.abs(o.ch).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      ))}
      {m.more > 0 && <div className="text-xs mt-1" style={{ color: 'var(--tx3)' }}>+{m.more} more outcomes</div>}

      {/* Footer */}
      <div className="flex justify-between items-center mt-3.5 pt-2.5" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 30%, transparent)' }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>{m.vol} vol</span>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Ends in</span>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{m.ends}</span>
        </div>
      </div>

      {/* Forecast */}
      {m.fc && (
        <div className="mt-2.5">
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Forecast</span>
            <span className="glow-text" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{m.fc}%</span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--brd)' }}>
            <div className="h-full rounded-full" style={{ width: `${m.fc}%`, background: 'var(--grad)' }} />
          </div>
        </div>
      )}

      {/* Hover sparkline */}
      {hov && (
        <div className="absolute bottom-0 left-0 right-0 h-9 opacity-25 pointer-events-none">
          <Spark data={m.d} color="var(--ac)" w={320} h={36} />
        </div>
      )}
    </div>
  );
}
