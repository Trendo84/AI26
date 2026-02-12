'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import MarketCard from './MarketCard';
import BattleCards from './BattleCards';
import Spark from './Spark';
import { markets as mockMarkets, agentPicks, trending, categories } from '@/lib/data';

function SideItem(props) {
  var item = props.item;
  var idx = props.idx;
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

function SideSection(props) {
  return (
    <div className="card animate-fade p-5" style={{ animationDelay: props.delay + 's' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 12, fontFamily: 'var(--font)' }}>
        {'>'} {props.title}
      </div>
      {props.items.map(function(a, i) { return <SideItem key={i} item={a} idx={i} />; })}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      <div className="skeleton skeleton-title" />
      <div className="skeleton" style={{ height: 32, marginBottom: 12 }} />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
    </div>
  );
}

function makeSparkData(n, base, v) {
  var r = [];
  for (var i = 0; i < n; i++) r.push(base + Math.sin(i * 0.4) * v + (Math.random() - 0.4) * v * 0.7);
  return r;
}

function adaptApiMarket(m, idx) {
  // Convert Polymarket API response to our card format
  var outcomes = [];
  try {
    var tokens = JSON.parse(m.outcomes || '[]');
    var prices = JSON.parse(m.outcomePrices || '[]');
    for (var i = 0; i < tokens.length && i < 2; i++) {
      outcomes.push({
        l: tokens[i] || ('Outcome ' + (i + 1)),
        p: parseFloat(prices[i] || 0) * 100,
        ch: (Math.random() - 0.4) * 5,
      });
    }
  } catch(e) {
    outcomes = [{ l: 'Yes', p: 50, ch: 0 }, { l: 'No', p: 50, ch: 0 }];
  }
  var vol = parseFloat(m.volume || 0);
  var volStr = vol > 1000000 ? '$' + (vol / 1000000).toFixed(1) + 'M' : vol > 1000 ? '$' + (vol / 1000).toFixed(0) + 'K' : '$' + vol.toFixed(0);
  var endDate = m.endDate ? new Date(m.endDate) : null;
  var endsIn = 'TBD';
  if (endDate) {
    var diff = endDate.getTime() - Date.now();
    if (diff < 3600000) endsIn = Math.max(1, Math.floor(diff / 60000)) + 'm';
    else if (diff < 86400000) endsIn = Math.floor(diff / 3600000) + 'h';
    else endsIn = Math.floor(diff / 86400000) + 'd';
  }
  return {
    id: m.id || ('api-' + idx),
    cat: (m.groupItemTitle || m.question || '').toLowerCase().includes('bitcoin') || (m.question || '').toLowerCase().includes('crypto') || (m.question || '').toLowerCase().includes('eth') ? 'Crypto'
      : (m.question || '').toLowerCase().includes('temperature') || (m.question || '').toLowerCase().includes('weather') ? 'Weather'
      : (m.question || '').toLowerCase().includes('election') || (m.question || '').toLowerCase().includes('president') || (m.question || '').toLowerCase().includes('trump') ? 'Politics'
      : (m.question || '').toLowerCase().includes('sport') || (m.question || '').toLowerCase().includes('game') || (m.question || '').toLowerCase().includes('win') ? 'Sports'
      : 'Culture',
    q: m.question || 'Unknown Market',
    oc: outcomes,
    more: Math.max(0, (outcomes.length || 0) - 2),
    vol: volStr,
    ends: endsIn,
    fc: outcomes[0] ? Math.round(outcomes[0].p) : null,
    d: makeSparkData(20, outcomes[0] ? outcomes[0].p : 50, 8),
    _raw: m,
  };
}

export default function DiscoverView(props) {
  var onTrade = props.onTrade;
  var _cat = useState('All'); var cat = _cat[0]; var setCat = _cat[1];
  var _search = useState(''); var search = _search[0]; var setSearch = _search[1];
  var _debSearch = useState(''); var debSearch = _debSearch[0]; var setDebSearch = _debSearch[1];
  var _filt = useState('Trending'); var filt = _filt[0]; var setFilt = _filt[1];
  var _apiMarkets = useState(null); var apiMarkets = _apiMarkets[0]; var setApiMarkets = _apiMarkets[1];
  var _loading = useState(true); var loading = _loading[0]; var setLoading = _loading[1];
  var _apiError = useState(null); var apiError = _apiError[0]; var setApiError = _apiError[1];
  var _lastFetch = useState(null); var lastFetch = _lastFetch[0]; var setLastFetch = _lastFetch[1];

  var quickFilters = ['Trending', 'New', 'Ending Soon'];

  // Debounced search
  useEffect(function() {
    var t = setTimeout(function() { setDebSearch(search); }, 300);
    return function() { clearTimeout(t); };
  }, [search]);

  // Fetch real markets from Polymarket
  var fetchMarkets = useCallback(function() {
    setLoading(true);
    fetch('/.netlify/functions/markets')
      .then(function(res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .then(function(data) {
        var adapted = data.map(function(m, i) { return adaptApiMarket(m, i); });
        setApiMarkets(adapted);
        setApiError(null);
        setLastFetch(new Date());
      })
      .catch(function(err) {
        console.log('Polymarket API fallback to mock:', err.message);
        setApiError(err.message);
        setApiMarkets(null);
      })
      .finally(function() { setLoading(false); });
  }, []);

  useEffect(function() {
    fetchMarkets();
    var iv = setInterval(fetchMarkets, 60000);
    return function() { clearInterval(iv); };
  }, [fetchMarkets]);

  var allMarkets = apiMarkets || mockMarkets;
  var isMock = !apiMarkets;

  var filtered = useMemo(function() {
    var m = allMarkets;
    if (cat !== 'All') m = m.filter(function(x) { return x.cat === cat; });
    if (debSearch) m = m.filter(function(x) { return x.q.toLowerCase().includes(debSearch.toLowerCase()); });
    return m;
  }, [cat, debSearch, allMarkets]);

  var sparkData = useMemo(function() { return makeSparkData(30, 65, 12); }, []);

  return (
    <div>
      {/* Data source indicator */}
      <div className="flex items-center gap-2 mb-3">
        {isMock ? (
          <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'color-mix(in srgb, var(--or) 15%, transparent)', color: 'var(--or)' }}>📋 Demo Data ({allMarkets.length} markets)</span>
        ) : (
          <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>🔴 LIVE — {allMarkets.length} markets from Polymarket</span>
        )}
        {lastFetch && <span className="text-xs" style={{ color: 'var(--tx4)' }}>Updated {lastFetch.toLocaleTimeString()}</span>}
        <button onClick={fetchMarkets} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ac)', background: 'var(--ac-dim)' }}>↻ Refresh</button>
      </div>

      {/* Search + Filters */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
          <div className="flex-1 w-full max-w-xl flex items-center rounded-xl px-4 gap-2"
            style={{ background: 'var(--bg2)', border: '1px solid var(--brd)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--tx3)' }}>🔍</span>
            <input value={search} onChange={function(e) { setSearch(e.target.value); }}
              placeholder={'Search ' + allMarkets.length + ' markets...'}
              className="flex-1 bg-transparent border-none py-2.5 text-sm"
              style={{ color: 'var(--tx)', fontFamily: 'var(--font)' }} />
            {search && <button onClick={function() { setSearch(''); }} className="text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--tx3)', background: 'var(--bg3)' }}>ESC</button>}
          </div>
          <div className="flex gap-1 flex-wrap">
            {quickFilters.map(function(f) {
              var icon = f === 'Trending' ? '⚡ ' : f === 'New' ? '★ ' : '⏱ ';
              var isActive = filt === f;
              return (
                <button key={f} onClick={function() { setFilt(f); }}
                  className="px-3.5 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    border: '1px solid ' + (isActive ? 'var(--ac)' : 'var(--brd)'),
                    background: isActive ? 'var(--ac-dim)' : 'transparent',
                    color: isActive ? 'var(--ac)' : 'var(--tx3)',
                    fontWeight: isActive ? 600 : 400,
                  }}>{icon}{f}</button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs font-semibold py-1.5 mr-1" style={{ color: 'var(--tx3)', letterSpacing: 1 }}>CATEGORIES:</span>
          {categories.map(function(c) {
            var isActive = cat === c;
            return (
              <button key={c} onClick={function() { setCat(c); }}
                className="px-3.5 py-1 rounded-lg text-xs transition-all"
                style={{
                  background: isActive ? 'var(--ac-dim)' : 'transparent',
                  color: isActive ? 'var(--ac)' : 'var(--tx3)',
                  fontWeight: isActive ? 600 : 400,
                }}>{c}</button>
            );
          })}
        </div>
      </div>

      <div className="discover-layout grid gap-6" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div>
          {/* Battle Cards */}
          <BattleCards onTrade={onTrade} />

          {/* Market Grid */}
          {loading ? (
            <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[1,2,3,4,5,6].map(function(n) { return <SkeletonCard key={n} />; })}
            </div>
          ) : (
            <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {filtered.map(function(m, i) {
                return <MarketCard key={m.id} m={m} delay={0.05 + i * 0.03} onTrade={onTrade} />;
              })}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--tx3)' }}>No markets found</div>
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
