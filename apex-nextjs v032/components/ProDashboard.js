'use client';
import { useState, useMemo } from 'react';
import Spark from './Spark';
import MarketCard from './MarketCard';
import BattleCards from './BattleCards';
import { markets, agentPicks, trending, bots, categories, catColor } from '@/lib/data';

function makeSparkData(n, base, v) {
  var r = [];
  for (var i = 0; i < n; i++) r.push(base + Math.sin(i * 0.3) * v + (Math.random() - 0.4) * v * 0.5);
  return r;
}

function ProStatCard(props) {
  var isUp = props.change > 0;
  return (
    <div className="rounded-2xl p-5 animate-fade" style={{
      background: 'linear-gradient(135deg, var(--bg3), var(--bg2))',
      border: '1px solid var(--brd)',
      animationDelay: props.delay + 's',
    }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl">{props.icon}</span>
        {props.change !== undefined && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
            background: isUp ? 'rgba(0,230,138,0.12)' : 'rgba(255,68,102,0.12)',
            color: isUp ? 'var(--gn)' : 'var(--rd)',
          }}>{isUp ? '▲' : '▼'} {Math.abs(props.change)}%</span>
        )}
      </div>
      <div className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{props.value}</div>
      <div className="text-xs" style={{ color: 'var(--tx3)' }}>{props.label}</div>
    </div>
  );
}

export default function ProDashboard(props) {
  var onTrade = props.onTrade;
  var paperBalance = props.paperBalance || 10000;
  var openTrades = props.openTrades || [];
  var closedTrades = props.closedTrades || [];
  var totalPnl = props.totalPnl || 0;
  var tradingMode = props.tradingMode || 'paper';
  var _cat = useState('All');
  var cat = _cat[0]; var setCat = _cat[1];
  var _search = useState('');
  var search = _search[0]; var setSearch = _search[1];
  var _tab = useState('overview');
  var tab = _tab[0]; var setTab = _tab[1];

  var portfolioData = useMemo(function() { return makeSparkData(40, paperBalance, paperBalance * 0.05); }, [paperBalance]);
  var invested = openTrades.reduce(function(s, t) { return s + (t.amount || 0); }, 0);
  var winRate = closedTrades.length > 0 ? Math.round((closedTrades.filter(function(t) { return t.pnl > 0; }).length / closedTrades.length) * 100) : 0;

  var filtered = useMemo(function() {
    var m = markets;
    if (cat !== 'All') m = m.filter(function(x) { return x.cat === cat; });
    if (search) m = m.filter(function(x) { return x.q.toLowerCase().includes(search.toLowerCase()); });
    return m;
  }, [cat, search]);

  return (
    <div>
      {/* Hero banner with gradient */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden animate-fade" style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.06), rgba(168,85,247,0.04))',
        border: '1px solid color-mix(in srgb, var(--ac) 20%, var(--brd))',
      }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, var(--ac), transparent)', filter: 'blur(60px)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'var(--ac-dim)', color: 'var(--ac)' }}>PRO DASHBOARD</span>
            <span className="text-xs" style={{ color: 'var(--tx4)' }}>v0.3.2</span>
          </div>
          <div className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--font)' }}>
            {'Welcome back '}
            <span style={{ color: 'var(--ac)' }}>Trader</span> 👋
          </div>
          <div className="text-sm" style={{ color: 'var(--tx3)' }}>Your assets are performing well today. Keep it up!</div>
        </div>
      </div>

      {/* Stats row — inspired by E8 Markets */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <ProStatCard icon="💰" value={'$' + paperBalance.toFixed(2)} label="Portfolio Balance" change={2.5} delay={0} />
        <ProStatCard icon="📈" value={'$' + invested.toFixed(2)} label="Invested" change={invested > 0 ? 5.2 : 0} delay={0.05} />
        <ProStatCard icon="🏆" value={winRate + '%'} label="Win Rate" delay={0.1} />
        <ProStatCard icon="📊" value={String(openTrades.length)} label="Open Positions" delay={0.15} />
        <ProStatCard icon="💎" value={(totalPnl >= 0 ? '+$' : '-$') + Math.abs(totalPnl).toFixed(2)} label="Realized P&L" change={totalPnl > 0 ? 12 : totalPnl < 0 ? -8 : undefined} delay={0.2} />
      </div>

      {/* Main content: Chart + Allocation side by side */}
      <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Portfolio chart */}
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>PORTFOLIO VALUE</div>
              <div className="text-2xl font-extrabold mt-1" style={{ fontFamily: 'var(--mono)' }}>
                {'$' + paperBalance.toFixed(2)}
                <span className="text-sm ml-2" style={{ color: 'var(--gn)' }}>+2.5%</span>
              </div>
            </div>
            <div className="flex gap-1">
              {['1D', '1W', '1M', '6M', '1Y'].map(function(p) {
                return <button key={p} className="text-xs px-3 py-1.5 rounded-lg" style={{
                  background: p === '1W' ? 'var(--ac-dim)' : 'transparent',
                  color: p === '1W' ? 'var(--ac)' : 'var(--tx4)',
                  fontWeight: p === '1W' ? 700 : 400,
                }}>{p}</button>;
              })}
            </div>
          </div>
          <Spark data={portfolioData} color="var(--ac)" w={700} h={180} />
        </div>

        {/* Right column: allocation + agents */}
        <div className="flex flex-col gap-4">
          {/* Category allocation donut */}
          <div className="card p-5 animate-fade" style={{ animationDelay: '0.2s' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>MARKET ALLOCATION</div>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg3)" strokeWidth="12" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#00d4ff" strokeWidth="12" strokeDasharray="72 167" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#00e68a" strokeWidth="12" strokeDasharray="48 191" strokeDashoffset="-72" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" strokeWidth="12" strokeDasharray="36 203" strokeDashoffset="-120" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ff6600" strokeWidth="12" strokeDasharray="24 215" strokeDashoffset="-156" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-extrabold" style={{ fontFamily: 'var(--mono)' }}>12</div>
                  <div className="text-xs" style={{ color: 'var(--tx4)' }}>Markets</div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { name: 'Crypto', pct: 35, color: '#00d4ff' },
                  { name: 'Weather', pct: 30, color: '#00e68a' },
                  { name: 'Politics', pct: 20, color: '#a855f7' },
                  { name: 'Sports', pct: 15, color: '#ff6600' },
                ].map(function(a) {
                  return (
                    <div key={a.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
                      <span className="flex-1" style={{ color: 'var(--tx2)' }}>{a.name}</span>
                      <span className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{a.pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active agents mini */}
          <div className="card p-5 animate-fade" style={{ animationDelay: '0.25s' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>🤖 ACTIVE AGENTS</div>
            <div className="space-y-2">
              {bots.slice(0, 3).map(function(b) {
                return (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg3)' }}>
                    <span className="text-lg">{b.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{b.name}</div>
                      <div className="text-xs" style={{ color: 'var(--tx4)' }}>{b.strat}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold" style={{ fontFamily: 'var(--mono)', color: b.pnl >= 0 ? 'var(--gn)' : 'var(--rd)' }}>
                        {(b.pnl >= 0 ? '+' : '') + '$' + b.pnl.toFixed(0)}
                      </div>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: b.st === 'active' ? 'var(--gn)' : 'var(--or)', boxShadow: '0 0 4px ' + (b.st === 'active' ? 'var(--gn)' : 'var(--or)') }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Cards */}
      <BattleCards onTrade={onTrade} />

      {/* Tab bar for markets */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1 rounded-xl overflow-hidden" style={{ border: '1px solid var(--brd)', background: 'var(--bg2)' }}>
          {[{ id: 'overview', label: '📊 Markets' }, { id: 'trending', label: '🔥 Trending' }, { id: 'agents', label: '🤖 Agent Picks' }].map(function(t) {
            var isActive = tab === t.id;
            return (
              <button key={t.id} onClick={function() { setTab(t.id); }}
                className="px-4 py-2.5 text-xs font-bold transition-all"
                style={{
                  background: isActive ? 'var(--ac-dim)' : 'transparent',
                  color: isActive ? 'var(--ac)' : 'var(--tx3)',
                }}>{t.label}</button>
            );
          })}
        </div>
        <div className="flex-1 max-w-md">
          <div className="flex items-center rounded-xl px-4 gap-2" style={{ background: 'var(--bg2)', border: '1px solid var(--brd)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--tx3)' }}>🔍</span>
            <input value={search} onChange={function(e) { setSearch(e.target.value); }}
              placeholder="Search markets..."
              className="flex-1 bg-transparent border-none py-2.5 text-sm"
              style={{ color: 'var(--tx)', fontFamily: 'var(--font)' }} />
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(function(c) {
            var isActive = cat === c;
            return (
              <button key={c} onClick={function() { setCat(c); }}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: isActive ? 'var(--ac-dim)' : 'transparent',
                  color: isActive ? 'var(--ac)' : 'var(--tx3)',
                  fontWeight: isActive ? 600 : 400,
                }}>{c}</button>
            );
          })}
        </div>
      </div>

      {/* Market grid */}
      <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filtered.map(function(m, i) {
          return <MarketCard key={m.id} m={m} delay={0.05 + i * 0.03} onTrade={onTrade} />;
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--tx3)' }}>No markets match your search</div>
      )}
    </div>
  );
}
