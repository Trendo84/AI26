'use client';
import { useState, useEffect } from 'react';
import MarketCard from './MarketCard';
import Spark from './Spark';

const CATEGORIES = ['All', 'Crypto', 'Politics', 'Sports', 'Weather', 'Tech', 'Culture'];

export default function DiscoverView({ onTrade }) {
  const [markets, setMarkets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100')
      .then(r => r.json())
      .then(data => {
        setMarkets(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = markets;
    
    if (category !== 'All') {
      result = result.filter(m => 
        m.category?.toLowerCase().includes(category.toLowerCase()) ||
        m.marketSlug?.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (search) {
      result = result.filter(m => 
        m.question?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFiltered(result);
  }, [category, search, markets]);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 sticky top-0 z-10" style={{ background: 'var(--bg1)' }}>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              style={{ background: 'var(--bg3)', border: '1px solid var(--brd)', color: 'var(--tx)' }}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2">🔍</span>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--ac)', color: '#000' }}>
              Trending
            </button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--bg3)', color: 'var(--tx2)' }}>
              New
            </button>
            <button className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: 'var(--bg3)', color: 'var(--tx2)' }}>
              Ending Soon
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold uppercase self-center mr-2" style={{ color: 'var(--tx3)' }}>Categories:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: category === cat ? 'var(--ac)' : 'var(--bg3)',
                color: category === cat ? '#000' : 'var(--tx2)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-20">
            <Spark />
            <div className="mt-4" style={{ color: 'var(--tx3)' }}>Loading markets...</div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-xs font-bold uppercase" style={{ color: 'var(--tx3)' }}>
              {filtered.length} Markets Found
            </div>
            
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filtered.map(market => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  onTrade={onTrade}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
