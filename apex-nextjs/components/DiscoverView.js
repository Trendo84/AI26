'use client';
import { useState, useMemo } from 'react';
import MarketCard from './MarketCard';
import Spark from './Spark';
import { markets, agentPicks, trending, categories, catColor } from '@/lib/data';

function SideItem({ item, idx }) {
  return (
    <div className="flex gap-2 py-2 animate-fade" style={{ borderBottom: '1px solid color-mix(in srgb, var(--brd) 20%, transparent)', animationDelay: `${0.1 + idx * 0.05}s` }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--tx3)', minWidth: 18 }}>{String(idx + 1).padStart(2, '0')}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs truncate" style={{ color: 'var(--tx2)', lineHeight: 1.3 }}>{item.q}</div>
        {item.agent && <div className="text-xs mt-0.5" style={{ color: item.color || 'var(--ac)', fontSize: 10 }}>★ {item.agent} › {item.score}</div>}
      </div>
      {item.pct !== undefined && (
        <span className="shrink-0" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)', color: item.dir === 'up' ? 'var(--gn)' : 'var(--tx2)' }}>
          {item.pct}%{item.dir === 'up' ? ' ▲' : ''}
        </span>
      )}
    </div>
  );
}

function SideSection({ title, items, delay = 0 }) {
  return (
    <div className="card animate-fade p-5" style={{ animationDelay: `${delay}s` }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 12, fontFamily: 'var(--font)' }}>
        {'>'} {title}
      </div>
      {items.map((a, i) => <SideItem key={i} item={a} idx={i} />)}
    </div>
  );
}

const sp = (n, b, v) => Array.from({ length: n }, (_, i) => b + Math.sin(i * 0.4) * v + (Math.random() - 0.4) * v * 0.7);

export default function DiscoverView({ onTrade }) {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [filt, setFilt] = useState('Trending');
  const filters = ['Trending', 'New', 'Ending Soon'];

  const filtered = useMemo(() => {
    let m = markets;
    if (cat !== 'All') m = m.filter(x => x.cat === cat);
    if (search) m = m.filter(x => x.q.toLowerCase().includes(search.toLowerCase()));
    return m;
  }, [cat, search]);

  return (
    <div>
      {/* Search + Filters */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
          <div className="flex-1 w-full max-w-lg flex items-center rounded-xl px-4 gap-2"
            style={{ background: 'var(--bg2)', border: '1px solid var(--brd)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--tx3)' }}>{'>_'}</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${markets.length} markets...`}
              className="flex-1 bg-transparent border-none py-2.5 text-sm"
              style={{ color: 'var(--tx)', fontFamily: 'var(--font)' }} />
            {search && <button onClick={() => setSearch('')} className="text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--tx3)', background: 'var(--bg3)' }}>ESC</button>}
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-xs py-1.5 mr-1 hide-mobile" style={{ color: 'var(--tx3)' }}>QUICK:</span>
            {filters.map(f => (
              <button key={f} onClick={() => setFilt(f)}
                className="px-3.5 py-1.5 rounded-full text-xs transition-all"
                style={{
                  border: `1px solid ${filt === f ? 'var(--ac)' : 'var(--brd)'}`,
                  background: filt === f ? 'var(--ac-dim)' : 'transparent',
                  color: filt === f ? 'var(--ac)' : 'var(--tx3)',
                  fontWeight: filt === f ? 600 : 400,
                  fontFamily: 'var(--font)',
                }}>
                {f === 'Trending' ? '⚡ ' : f === 'New' ? '★ ' : '⏱ '}{f}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex gap-1.5 ml-auto items-center">
            {['PM', 'KS'].map(p => (
              <span key={p} className="text-xs px-2.5 py-1 rounded-md font-bold" style={{
                background: `color-mix(in srgb, ${p === 'PM' ? 'var(--ac)' : 'var(--pu)'} 15%, transparent)`,
                color: p === 'PM' ? 'var(--ac)' : 'var(--pu)',
                border: `1px solid color-mix(in srgb, ${p === 'PM' ? 'var(--ac)' : 'var(--pu)'} 25%, transparent)`,
              }}>{p}</span>
            ))}
            <span className="text-xs font-medium mx-1" style={{ color: 'var(--tx2)' }}>SIM</span>
            <span className="text-xs mx-0.5" style={{ color: 'var(--tx3)' }}>All</span>
            <button className="btn-ghost !text-xs !py-1 !px-2.5">☰ Filters</button>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs font-semibold py-1.5 mr-1" style={{ color: 'var(--tx3)', letterSpacing: 1 }}>CATEGORIES:</span>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3.5 py-1 rounded-lg text-xs transition-all"
              style={{
                background: cat === c ? 'var(--ac-dim)' : 'transparent',
                color: cat === c ? 'var(--ac)' : 'var(--tx3)',
                fontWeight: cat === c ? 600 : 400,
                fontFamily: 'var(--font)',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="discover-layout grid gap-6" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div>
          {/* Featured */}
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
            <div className="mt-4"><Spark data={sp(30, 65, 12)} color="var(--ac)" w={520} h={50} /></div>
          </div>

          {/* Market Grid */}
          <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {filtered.map((m, i) => <MarketCard key={m.id} m={m} delay={0.05 + i * 0.04} onTrade={onTrade} />)}
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
