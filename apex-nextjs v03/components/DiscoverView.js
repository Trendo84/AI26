'use client';
import { useState, useMemo } from 'react';
import MarketCard from './MarketCard';
import Spark from './Spark';
import { markets, agentPicks, trending, categories } from '@/lib/data';

function SideItem({ item, idx }) {
  return (
    <div className="flex gap-2 py-2 animate-fade" style={{ borderBottom: '1px solid color-mix(in srgb, var(--brd) 20%, transparent)', animationDelay: (0.1 + idx * 0.05) + 's' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--tx3)', minWidth: 18 }}>{String(idx + 1).padStart(2, '0')}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs truncate" style={{ color: 'var(--tx2)', lineHeight: 1.3 }}>{item.q}</div>
        {item.agent && <div className="text-xs mt-0.5" style={{ color: item.color || 'var(--ac)', fontSize: 10 }}>{'★ '}{item.agent}{' › '}{item.score}</div>}
      </div>
      {item.pct !== undefined && (
        <span className="shrink-0" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)', color: item.dir === 'up' ? 'var(--gn)' : 'var(--tx2)' }}>
          {item.pct}%{item.dir === 'up' ? ' ▲' : ''}
        </span>
      )}
    </div>
  );
}

function SideSection({ title, items, delay }) {
  return (
    <div className="card animate-fade p-5" style={{ animationDelay: delay + 's' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 12, fontFamily: 'var(--font)' }}>
        {'>'} {title}
      </div>
      {items.map(function(a, i) { return <SideItem key={i} item={a} idx={i} />; })}
    </div>
  );
}

function makeSparkData(n, base, variance) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(base + Math.sin(i * 0.4) * variance + (Math.random() - 0.4) * variance * 0.7);
  }
  return result;
}

export default function DiscoverView({ onTrade }) {
  var quickFilters = ['Trending', 'New', 'Ending Soon'];
  var _s = useState('All');
  var cat = _s[0];
  var setCat = _s[1];
  var _s2 = useState('');
  var search = _s2[0];
  var setSearch = _s2[1];
  var _s3 = useState('Trending');
  var filt = _s3[0];
  var setFilt = _s3[1];

  var filtered = useMemo(function() {
    var m = markets;
    if (cat !== 'All') {
      m = m.filter(function(x) { return x.cat === cat; });
    }
    if (search) {
      m = m.filter(function(x) { return x.q.toLowerCase().includes(search.toLowerCase()); });
    }
    return m;
  }, [cat, search]);

  var sparkData = useMemo(function() { return makeSparkData(30, 65, 12); }, []);

  return (
    <div>
      {/* Search + Quick Filters */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
          {/* Search bar */}
          <div className="flex-1 w-full max-w-lg flex items-center rounded-xl px-4 gap-2"
            style={{ background: 'var(--bg2)', border: '1px solid var(--brd)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--tx3)' }}>{'>_'}</span>
            <input
              value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              placeholder={'Search ' + markets.length + ' markets...'}
              className="flex-1 bg-transparent border-none py-2.5 text-sm"
              style={{ color: 'var(--tx)', fontFamily: 'var(--font)' }}
            />
            {search && (
              <button
                onClick={function() { setSearch(''); }}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ color: 'var(--tx3)', background: 'var(--bg3)' }}
              >ESC</button>
            )}
          </div>

          {/* Quick filter pills */}
          <div className="flex gap-1 flex-wrap">
            <span className="text-xs py-1.5 mr-1 hidden md:inline" style={{ color: 'var(--tx3)' }}>QUICK:</span>
            {quickFilters.map(function(f) {
              var icon = f === 'Trending' ? '⚡ ' : f === 'New' ? '★ ' : '⏱ ';
              var isActive = filt === f;
              return (
                <button
                  key={f}
                  onClick={function() { setFilt(f); }}
                  className="px-3.5 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    border: '1px solid ' + (isActive ? 'var(--ac)' : 'var(--brd)'),
                    background: isActive ? 'var(--ac-dim)' : 'transparent',
                    color: isActive ? 'var(--ac)' : 'var(--tx3)',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font)',
                  }}
                >{icon}{f}</button>
              );
            })}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs font-semibold py-1.5 mr-1" style={{ color: 'var(--tx3)', letterSpacing: 1 }}>CATEGORIES:</span>
          {categories.map(function(c) {
            var isActive = cat === c;
            return (
              <button
                key={c}
                onClick={function() { setCat(c); }}
                className="px-3.5 py-1 rounded-lg text-xs transition-all"
                style={{
                  background: isActive ? 'var(--ac-dim)' : 'transparent',
                  color: isActive ? 'var(--ac)' : 'var(--tx3)',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font)',
                }}
              >{c}</button>
            );
          })}
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="discover-layout grid gap-6" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div>
          {/* Featured Market */}
          <div className="card animate-fade p-6 md:p-7 mb-5" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ background: '#00d4ff' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#00d4ff' }}>FEATURED</span>
            </div>
            <div className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font)', color: 'var(--tx)' }}>
              Ethereum Up or Down — February 12, 2AM ET
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>Forecast</div>
                <div className="glow-text" style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>69.5%</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>Ends in</div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>1d</div>
              </div>
            </div>
            <div className="mt-4">
              <Spark data={sparkData} color="var(--ac)" w={520} h={50} />
            </div>
          </div>

          {/* Market Grid */}
          <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {filtered.map(function(m, i) {
              return <MarketCard key={m.id} m={m} delay={0.05 + i * 0.04} onTrade={onTrade} />;
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--tx3)' }}>
              No markets found matching your filters
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 sidebar-desktop">
          <SideSection title="AGENT_PICKS" items={agentPicks} delay={0.15} />
          <SideSection title="TRENDING" items={trending} delay={0.2} />
        </div>
      </div>
    </div>
  );
}
