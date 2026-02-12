'use client';
import { useState, useEffect } from 'react';
import { tickers } from '@/lib/data';

export default function Ticker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % tickers.length), 3200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="fixed top-14 left-0 right-0 h-7 z-[99] flex items-center overflow-hidden"
      style={{ background: 'color-mix(in srgb, var(--bg2) 94%, transparent)', borderBottom: '1px solid color-mix(in srgb, var(--brd) 60%, transparent)', fontSize: 11 }}>
      <div className="flex items-center gap-2 px-4 shrink-0" style={{ color: 'var(--tx3)' }}>
        <span className="animate-pulse-dot" style={{ color: 'var(--gn)', fontWeight: 700 }}>●</span>
        <span style={{ color: 'var(--tx2)', fontWeight: 500, fontFamily: 'var(--font)' }}>LIVE</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div key={idx} className="animate-slide whitespace-nowrap" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--tx3)' }}>
          {tickers[idx]}
        </div>
      </div>
    </div>
  );
}
