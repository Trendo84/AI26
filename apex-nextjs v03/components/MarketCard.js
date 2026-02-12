'use client';
import { useState } from 'react';
import Spark from './Spark';
import { catColor } from '@/lib/data';

export default function MarketCard(props) {
  var m = props.m;
  var delay = props.delay || 0;
  var onTrade = props.onTrade;
  var _b = useState(false);
  var bookmarked = _b[0], setBookmarked = _b[1];

  // Determine if "hot" (high volume)
  var volNum = parseFloat((m.vol || '').replace(/[^0-9.]/g, '')) || 0;
  var volUnit = (m.vol || '').includes('K') ? 1000 : (m.vol || '').includes('M') ? 1000000 : 1;
  var isHot = volNum * volUnit > 5000;

  // Price change magnitude for coloring
  var mainChange = m.oc && m.oc[0] ? m.oc[0].ch : 0;

  return (
    <div
      className="card card-lift relative overflow-hidden cursor-pointer"
      onClick={function() { if (onTrade) onTrade(m); }}
      style={{ padding: '18px 20px', animationDelay: delay + 's' }}
    >
      {/* Category + badges + bookmark */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: catColor(m.cat) }}>
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: catColor(m.cat) }} />
            {m.cat}
          </div>
          {isHot && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--or) 15%, transparent)', color: 'var(--or)', fontSize: 10 }}>
              🔥 HOT
            </span>
          )}
        </div>
        <button
          onClick={function(e) { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="transition-colors text-lg p-1"
          style={{ color: bookmarked ? 'var(--ac)' : 'var(--tx3)' }}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      {/* Question */}
      <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4, marginBottom: 14, minHeight: 38 }}>
        {m.q}
      </div>

      {/* Always-visible sparkline */}
      <div className="mb-3 rounded-lg overflow-hidden" style={{ background: 'color-mix(in srgb, var(--bg3) 50%, transparent)' }}>
        <Spark data={m.d} color={mainChange >= 0 ? 'var(--gn)' : 'var(--rd)'} w={320} h={32} />
      </div>

      {/* Outcomes */}
      {m.oc.map(function(o, i) {
        return (
          <div key={i} className="flex justify-between items-center py-1.5" style={{ borderTop: i > 0 ? '1px solid var(--brd)' : 'none' }}>
            <span className="text-xs truncate pr-2" style={{ color: 'var(--tx2)', flex: 1 }}>{o.l}</span>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{o.p}%</span>
              {o.ch !== 0 && (
                <span className="flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded" style={{
                  fontFamily: 'var(--mono)',
                  color: o.ch > 0 ? 'var(--gn)' : 'var(--rd)',
                  background: o.ch > 0 ? 'color-mix(in srgb, var(--gn) 10%, transparent)' : 'color-mix(in srgb, var(--rd) 10%, transparent)',
                }}>
                  {o.ch > 0 ? '▲' : '▼'} {Math.abs(o.ch).toFixed(1)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      {m.more > 0 && <div className="text-xs mt-1" style={{ color: 'var(--tx3)' }}>+{m.more} more outcomes</div>}

      {/* Footer: Volume + Time */}
      <div className="flex justify-between items-center mt-3.5 pt-2.5" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 30%, transparent)' }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>{m.vol} vol</span>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'color-mix(in srgb, var(--ac) 8%, transparent)' }}>
          <span style={{ fontSize: 11, color: 'var(--tx4)' }}>⏱</span>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{m.ends}</span>
        </div>
      </div>

      {/* Forecast bar */}
      {m.fc && (
        <div className="mt-2.5">
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>AI Forecast</span>
            <span className="glow-text" style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{m.fc}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--brd)' }}>
            <div className="h-full rounded-full" style={{ width: m.fc + '%', background: 'var(--grad)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
