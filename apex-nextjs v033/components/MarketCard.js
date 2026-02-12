'use client';
import { useState } from 'react';
import Spark from './Spark';
import { catColor } from '@/lib/data';

export default function MarketCard(props) {
  var m = props.m;
  var delay = props.delay || 0;
  var onTrade = props.onTrade;
  var _b = useState(false); var bookmarked = _b[0]; var setBookmarked = _b[1];

  var volNum = parseFloat((m.vol || '').replace(/[^0-9.]/g, '')) || 0;
  var volUnit = (m.vol || '').includes('K') ? 1000 : (m.vol || '').includes('M') ? 1000000 : 1;
  var isHot = volNum * volUnit > 5000;
  var mainChange = m.oc && m.oc[0] ? m.oc[0].ch : 0;
  var endsNum = parseFloat((m.ends || '').replace(/[^0-9.]/g, '')) || 99;
  var isUrgent = (m.ends || '').includes('h') && endsNum < 6;

  return (
    <div className="card card-lift relative overflow-hidden cursor-pointer animate-fade"
      onClick={function() { if (onTrade) onTrade(m); }}
      style={{ padding: '16px 18px', animationDelay: delay + 's' }}>

      {/* Top bar: category + badges */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-sm" style={{ background: catColor(m.cat) }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: catColor(m.cat) }}>{m.cat}</span>
        {isHot && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--or)', fontSize: 9, fontWeight: 600 }}>HOT</span>}
        {isUrgent && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--rd)', fontSize: 9, fontWeight: 600 }}>ENDING</span>}
        <div className="ml-auto">
          <button onClick={function(e) { e.stopPropagation(); setBookmarked(!bookmarked); }}
            style={{ color: bookmarked ? 'var(--ac)' : 'var(--tx4)', fontSize: 14 }}>
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Question */}
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4, marginBottom: 12, minHeight: 36 }}>
        {m.q}
      </div>

      {/* Sparkline */}
      <div className="mb-3 rounded-md overflow-hidden" style={{ background: 'var(--bg3)' }}>
        <Spark data={m.d} color={mainChange >= 0 ? 'var(--gn)' : 'var(--rd)'} w={300} h={28} showDot />
      </div>

      {/* Outcomes with visual bars */}
      {m.oc.map(function(o, i) {
        return (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs" style={{ color: 'var(--tx2)' }}>{o.l}</span>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{o.p}%</span>
                {o.ch !== 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, fontFamily: 'var(--mono)',
                    color: o.ch > 0 ? 'var(--gn)' : 'var(--rd)',
                  }}>{o.ch > 0 ? '+' : ''}{o.ch.toFixed(1)}</span>
                )}
              </div>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg4)' }}>
              <div className="h-full rounded-full" style={{ width: Math.min(100, o.p) + '%', background: i === 0 ? 'var(--ac)' : 'var(--tx4)', opacity: i === 0 ? 0.7 : 0.4 }} />
            </div>
          </div>
        );
      })}
      {m.more > 0 && <div className="text-xs mt-1" style={{ color: 'var(--tx4)' }}>+{m.more} more</div>}

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--brd)' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>{m.vol}</span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{
          background: isUrgent ? 'rgba(239,68,68,0.08)' : 'var(--bg3)',
          fontSize: 11, fontWeight: 600, fontFamily: 'var(--mono)',
          color: isUrgent ? 'var(--rd)' : 'var(--tx3)',
        }}>{m.ends}</span>
      </div>

      {/* AI Forecast */}
      {m.fc && (
        <div className="mt-2">
          <div className="flex justify-between mb-0.5">
            <span style={{ fontSize: 10, color: 'var(--tx4)' }}>AI Forecast</span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{m.fc}%</span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--bg4)' }}>
            <div className="h-full rounded-full" style={{ width: m.fc + '%', background: 'var(--ac)', opacity: 0.6 }} />
          </div>
        </div>
      )}
    </div>
  );
}
