'use client';
import { useState, useEffect } from 'react';

export default function DiscoverView({ onTrade }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=50');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }
        
        setMarkets(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl mb-4">◈</div>
        <div>Loading markets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl mb-4">⚠️</div>
        <div>Error loading markets</div>
        <div className="text-sm mt-2 opacity-60">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded"
          style={{ background: 'var(--ac)', color: '#000' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-sm opacity-60">{markets.length} markets loaded</div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {markets.slice(0, 12).map((market) => (
          <div 
            key={market.id} 
            className="p-4 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}
            onClick={() => onTrade && onTrade(market)}
          >
            <div className="text-xs opacity-60 mb-2 uppercase">{market.category || 'Market'}</div>
            <div className="font-bold text-sm mb-3">{market.question}</div>
            
            {market.outcomes && (
              <div className="flex justify-between text-xs">
                <span>{market.outcomes[0]}: {market.outcomePrices?.[0] || '50%'}</span>
                <span>{market.outcomes[1]}: {market.outcomePrices?.[1] || '50%'}</span>
              </div>
            )}
            
            <div className="mt-3 text-xs opacity-60">
              Vol: ${(market.volumeNum / 1000).toFixed(1)}K
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
