'use client';
import { useState, useEffect, useMemo } from 'react';
import Spark from './Spark';

var battlePairs = [
  {
    title: 'CRYPTO SHOWDOWN',
    left: { name: 'BITCOIN BULLS', ticker: '$BTC', color: '#f7931a', grad: 'linear-gradient(135deg, #f7931a, #ff6b00)', symbol: '₿', q: 'Bitcoin Up or Down — Feb 12', pct: 69.5, mc: '$8.2K', icon: '🐂' },
    right: { name: 'ETHEREUM RISE', ticker: '$ETH', color: '#627eea', grad: 'linear-gradient(135deg, #627eea, #3b4fc4)', symbol: 'Ξ', q: 'ETH Above $3,200 by Feb 14', pct: 45.2, mc: '$5.1K', icon: '🔷' },
  },
  {
    title: 'WEATHER WARS',
    left: { name: 'NYC COLD SNAP', ticker: '$NYC', color: '#00d4ff', grad: 'linear-gradient(135deg, #00d4ff, #0066ff)', symbol: '❄', q: 'NYC Temp 34-35°F Feb 12', pct: 31.5, mc: '$3K', icon: '🌨' },
    right: { name: 'MIAMI HEAT', ticker: '$MIA', color: '#ff4466', grad: 'linear-gradient(135deg, #ff4466, #ff0033)', symbol: '☀', q: 'Miami Temp 78-79°F Feb 12', pct: 43.5, mc: '$3K', icon: '🔥' },
  },
  {
    title: 'CHAMPIONSHIP CLASH',
    left: { name: 'UCONN HUSKIES', ticker: '$UCONN', color: '#002868', grad: 'linear-gradient(135deg, #002868, #0044aa)', symbol: '🐺', q: 'UConn Win Big East?', pct: 68.5, mc: '$9K', icon: '🏀' },
    right: { name: 'ARIZONA CATS', ticker: '$AZ', color: '#cc0033', grad: 'linear-gradient(135deg, #cc0033, #990022)', symbol: '🐱', q: 'Arizona Win Big 12?', pct: 26.5, mc: '$6K', icon: '🏀' },
  },
];

function makeSparkData(n, base, v) {
  var r = [];
  for (var i = 0; i < n; i++) r.push(base + Math.sin(i * 0.5) * v + (Math.random() - 0.4) * v * 0.6);
  return r;
}

function FighterCard(props) {
  var f = props.fighter;
  var side = props.side;
  var isLeft = side === 'left';
  return (
    <div className="flex-1 relative overflow-hidden rounded-2xl" style={{
      background: f.grad,
      border: '2px solid ' + f.color,
      minHeight: 280,
    }}>
      {/* BG pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 200">
        <defs>
          <pattern id={'grid-' + f.ticker} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={'url(#grid-' + f.ticker + ')'} />
      </svg>

      {/* Fighter icon */}
      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="text-5xl mb-2" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>{f.icon}</div>
        <div className="text-2xl font-extrabold tracking-wider mb-1" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{f.ticker}</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-80" style={{ color: '#fff' }}>{f.name}</div>
        <div className="mt-auto">
          <div className="text-xs opacity-70 mb-1" style={{ color: '#fff' }}>Market Cap</div>
          <div className="text-lg font-extrabold" style={{ color: '#fff', textShadow: '0 0 12px rgba(255,255,255,0.3)' }}>{f.mc} MC</div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-2.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,230,138,0.2)', color: '#00e68a', border: '1px solid rgba(0,230,138,0.3)' }}>
              Yes {f.pct.toFixed(1) + '¢'}
            </button>
            <button className="flex-1 py-2.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,68,102,0.2)', color: '#ff4466', border: '1px solid rgba(255,68,102,0.3)' }}>
              No {(100 - f.pct).toFixed(1) + '¢'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BattleCards(props) {
  var onTrade = props.onTrade;
  var _idx = useState(0);
  var idx = _idx[0]; var setIdx = _idx[1];
  var _auto = useState(true);
  var autoPlay = _auto[0]; var setAutoPlay = _auto[1];

  var pair = battlePairs[idx];
  var sparkL = useMemo(function() { return makeSparkData(30, pair.left.pct, 10); }, [idx]);
  var sparkR = useMemo(function() { return makeSparkData(30, pair.right.pct, 10); }, [idx]);

  useEffect(function() {
    if (!autoPlay) return;
    var iv = setInterval(function() {
      setIdx(function(prev) { return (prev + 1) % battlePairs.length; });
    }, 8000);
    return function() { clearInterval(iv); };
  }, [autoPlay]);

  function next() { setAutoPlay(false); setIdx(function(p) { return (p + 1) % battlePairs.length; }); }
  function prev() { setAutoPlay(false); setIdx(function(p) { return (p - 1 + battlePairs.length) % battlePairs.length; }); }

  return (
    <div className="card p-5 mb-5 animate-fade">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--rd)' }}>⚔ BATTLE CARDS</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded animate-pulse-dot" style={{ background: 'color-mix(in srgb, var(--rd) 15%, transparent)', color: 'var(--rd)' }}>LIVE</span>
          </div>
          <div className="text-sm font-bold mt-1" style={{ color: 'var(--tx2)' }}>{pair.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="btn-ghost !py-1.5 !px-3 !text-sm">◀</button>
          <span className="text-xs" style={{ fontFamily: 'var(--mono)', color: 'var(--tx4)' }}>{(idx + 1) + '/' + battlePairs.length}</span>
          <button onClick={next} className="btn-ghost !py-1.5 !px-3 !text-sm">▶</button>
        </div>
      </div>

      {/* VS Layout */}
      <div className="flex gap-4 items-stretch mb-4">
        <FighterCard fighter={pair.left} side="left" />

        {/* VS Badge */}
        <div className="flex flex-col items-center justify-center shrink-0" style={{ width: 60 }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-extrabold"
            style={{ background: 'var(--bg)', border: '3px solid var(--brd)', color: 'var(--rd)', boxShadow: '0 0 20px rgba(255,68,102,0.3)', letterSpacing: 2 }}>
            VS
          </div>
        </div>

        <FighterCard fighter={pair.right} side="right" />
      </div>

      {/* Price chart comparison */}
      <div className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
        <div className="flex items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: pair.left.color }} />
            <span className="text-xs font-bold" style={{ color: pair.left.color }}>{pair.left.ticker}</span>
            <span className="text-sm font-extrabold" style={{ fontFamily: 'var(--mono)', color: pair.left.color }}>{pair.left.pct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: pair.right.color }} />
            <span className="text-xs font-bold" style={{ color: pair.right.color }}>{pair.right.ticker}</span>
            <span className="text-sm font-extrabold" style={{ fontFamily: 'var(--mono)', color: pair.right.color }}>{pair.right.pct}%</span>
          </div>
          <div className="ml-auto flex gap-1">
            {['1h', '3h', '1d', '1w'].map(function(t) {
              return <button key={t} className="text-xs px-2 py-1 rounded" style={{ background: t === '1h' ? 'var(--ac-dim)' : 'transparent', color: t === '1h' ? 'var(--ac)' : 'var(--tx4)' }}>{t}</button>;
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><Spark data={sparkL} color={pair.left.color} w={400} h={60} /></div>
          <div className="flex-1"><Spark data={sparkR} color={pair.right.color} w={400} h={60} /></div>
        </div>
      </div>
    </div>
  );
}
