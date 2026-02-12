'use client';
import { useState, useEffect, useMemo } from 'react';
import Spark from './Spark';

var battlePairs = [
  {
    title: 'CRYPTO SHOWDOWN',
    left: { name: 'Bitcoin Bulls', ticker: '$BTC', accent: '#f7931a', q: 'Bitcoin Up or Down — Feb 12', pct: 69.5, vol: '$8.2K', icon: '₿' },
    right: { name: 'Ethereum Rise', ticker: '$ETH', accent: '#627eea', q: 'ETH Above $3,200 by Feb 14', pct: 45.2, vol: '$5.1K', icon: 'Ξ' },
  },
  {
    title: 'WEATHER WARS',
    left: { name: 'NYC Cold Snap', ticker: '$NYC', accent: '#00d4ff', q: 'NYC Temp 34-35F Feb 12', pct: 31.5, vol: '$3K', icon: '❄' },
    right: { name: 'Miami Heat', ticker: '$MIA', accent: '#ef4444', q: 'Miami Temp 78-79F Feb 12', pct: 43.5, vol: '$3K', icon: '☀' },
  },
  {
    title: 'CHAMPIONSHIP',
    left: { name: 'UConn Huskies', ticker: '$UCONN', accent: '#3b82f6', q: 'UConn Win Big East?', pct: 68.5, vol: '$9K', icon: '🏀' },
    right: { name: 'Arizona Cats', ticker: '$AZ', accent: '#ef4444', q: 'Arizona Win Big 12?', pct: 26.5, vol: '$6K', icon: '🏀' },
  },
];

function makeSparkData(n, base, v) {
  var r = [];
  for (var i = 0; i < n; i++) r.push(base + Math.sin(i * 0.5) * v + (Math.random() - 0.4) * v * 0.6);
  return r;
}

function FighterCard(props) {
  var f = props.fighter;
  return (
    <div className="flex-1 rounded-xl p-5 relative overflow-hidden transition-all" style={{
      background: 'var(--bg2)',
      border: '1px solid var(--brd)',
      boxShadow: '0 0 20px rgba(' + hexToRgb(f.accent) + ', 0.06)',
    }}>
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, ' + f.accent + ', transparent)', opacity: 0.4 }} />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{
          background: 'rgba(' + hexToRgb(f.accent) + ', 0.1)',
          border: '1px solid rgba(' + hexToRgb(f.accent) + ', 0.2)',
        }}>{f.icon}</div>
        <div>
          <div className="text-sm font-bold" style={{ fontFamily: 'var(--mono)', color: f.accent }}>{f.ticker}</div>
          <div className="text-xs" style={{ color: 'var(--tx3)' }}>{f.name}</div>
        </div>
      </div>

      <div className="text-xs mb-2 truncate" style={{ color: 'var(--tx2)' }}>{f.q}</div>

      {/* Percentage bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{f.pct}%</span>
          <span className="text-xs" style={{ color: 'var(--tx4)' }}>{f.vol} vol</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg4)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: f.pct + '%', background: f.accent, opacity: 0.8 }} />
        </div>
      </div>

      {/* Buy buttons */}
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-md text-xs font-semibold transition-all" style={{
          background: 'rgba(' + hexToRgb('var(--gn)' === 'var(--gn)' ? '#10b981' : '#10b981') + ', 0.1)',
          color: 'var(--gn)', border: '1px solid rgba(16,185,129,0.2)',
        }}>Yes {f.pct.toFixed(0) + 'c'}</button>
        <button className="flex-1 py-2 rounded-md text-xs font-semibold transition-all" style={{
          background: 'rgba(239,68,68,0.08)', color: 'var(--rd)', border: '1px solid rgba(239,68,68,0.15)',
        }}>No {(100 - f.pct).toFixed(0) + 'c'}</button>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  if (!hex || hex.charAt(0) !== '#') return '0,212,255';
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  return r + ',' + g + ',' + b;
}

export default function BattleCards(props) {
  var _idx = useState(0); var idx = _idx[0]; var setIdx = _idx[1];
  var _auto = useState(true); var autoPlay = _auto[0]; var setAutoPlay = _auto[1];
  var pair = battlePairs[idx];
  var sparkL = useMemo(function() { return makeSparkData(30, pair.left.pct, 10); }, [idx]);
  var sparkR = useMemo(function() { return makeSparkData(30, pair.right.pct, 10); }, [idx]);

  useEffect(function() {
    if (!autoPlay) return;
    var iv = setInterval(function() { setIdx(function(p) { return (p + 1) % battlePairs.length; }); }, 8000);
    return function() { clearInterval(iv); };
  }, [autoPlay]);

  function next() { setAutoPlay(false); setIdx(function(p) { return (p + 1) % battlePairs.length; }); }
  function prev() { setAutoPlay(false); setIdx(function(p) { return (p - 1 + battlePairs.length) % battlePairs.length; }); }

  return (
    <div className="card p-5 mb-5 animate-fade">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--tx3)', letterSpacing: '0.08em' }}>Battle Arena</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--tx2)' }}>{pair.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-7 h-7 rounded-md flex items-center justify-center text-xs" style={{ border: '1px solid var(--brd)', color: 'var(--tx3)' }}>&#9664;</button>
          <span className="text-xs" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>{(idx + 1) + '/' + battlePairs.length}</span>
          <button onClick={next} className="w-7 h-7 rounded-md flex items-center justify-center text-xs" style={{ border: '1px solid var(--brd)', color: 'var(--tx3)' }}>&#9654;</button>
        </div>
      </div>

      <div className="battle-flex flex gap-3 items-stretch mb-4">
        <FighterCard fighter={pair.left} />
        <div className="battle-vs-wrap flex items-center justify-center shrink-0" style={{ width: 48 }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--bg)', border: '1px solid var(--brd)', color: 'var(--tx3)', letterSpacing: 1 }}>VS</div>
        </div>
        <FighterCard fighter={pair.right} />
      </div>

      {/* Chart comparison */}
      <div className="rounded-lg p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
        <div className="flex items-center gap-5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: pair.left.accent }} />
            <span className="text-xs font-semibold" style={{ fontFamily: 'var(--mono)', color: pair.left.accent }}>{pair.left.ticker} {pair.left.pct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: pair.right.accent }} />
            <span className="text-xs font-semibold" style={{ fontFamily: 'var(--mono)', color: pair.right.accent }}>{pair.right.ticker} {pair.right.pct}%</span>
          </div>
          <div className="ml-auto flex gap-1">
            {['1h', '1d', '1w'].map(function(t) {
              return <button key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: t === '1h' ? 'var(--ac-dim)' : 'transparent', color: t === '1h' ? 'var(--ac)' : 'var(--tx4)' }}>{t}</button>;
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><Spark data={sparkL} color={pair.left.accent} w={400} h={50} /></div>
          <div className="flex-1"><Spark data={sparkR} color={pair.right.accent} w={400} h={50} /></div>
        </div>
      </div>
    </div>
  );
}
