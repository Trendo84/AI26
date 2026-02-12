'use client';
import { useState, useEffect, useMemo } from 'react';
import Spark from './Spark';

// Simulated AI picks and leaderboard data
var aiPicks = [
  { q: 'NYC Highest Temp Feb 12 — 34-35°F', side: 'YES', confidence: 87, price: 31.5, aiTarget: 42, edge: '+10.5%', reason: 'NOAA forecast diverges from market price. Cold snap data supports higher bracket.' },
  { q: 'Bitcoin Up or Down — Feb 12 2AM ET', side: 'UP', confidence: 74, price: 69.5, aiTarget: 76, edge: '+6.5%', reason: 'Binance momentum + whale accumulation detected in last 4h.' },
  { q: 'Ethereum Above $3,200 — Feb 14', side: 'YES', confidence: 68, price: 45.2, aiTarget: 58, edge: '+12.8%', reason: 'ETH/BTC ratio strengthening. Options market implies higher vol.' },
];

var leaderboard = [
  { rank: 1, name: '@CryptoWhale', pnl: 4230, winRate: 78, trades: 142, bestTrade: '+$890', streak: 8 },
  { rank: 2, name: '@WeatherPro', pnl: 3890, winRate: 82, trades: 67, bestTrade: '+$1,200', streak: 12 },
  { rank: 3, name: '@ArbitrageKing', pnl: 3120, winRate: 71, trades: 234, bestTrade: '+$560', streak: 5 },
  { rank: 4, name: '@NewsHawk', pnl: 2450, winRate: 65, trades: 89, bestTrade: '+$430', streak: 3 },
  { rank: 5, name: '@DeltaTrader', pnl: 1980, winRate: 69, trades: 156, bestTrade: '+$720', streak: 6 },
];

var volumeSpikes = [
  { q: 'Fed March Rate Decision', spike: '4.2x', vol: '$128K', direction: 'up', category: 'Politics' },
  { q: 'NYC Temperature Feb 12', spike: '3.1x', vol: '$45K', direction: 'up', category: 'Weather' },
  { q: 'Bitcoin $200k Before 2027', spike: '2.8x', vol: '$89K', direction: 'down', category: 'Crypto' },
];

var strategies = [
  { name: 'Weather Arbitrage', ret: '+34%', risk: 'Medium', users: 245, period: '30d', icon: '🌤' },
  { name: 'Crypto Momentum', ret: '+28%', risk: 'High', users: 189, period: '30d', icon: '📈' },
  { name: 'Political Events', ret: '+19%', risk: 'Low', users: 312, period: '30d', icon: '🏛' },
  { name: 'Near-Expiry Sniper', ret: '+41%', risk: 'High', users: 98, period: '30d', icon: '🎯' },
];

var agentLogs = [
  { time: '2 min ago', agent: 'Weather Bot', action: 'Bought NYC YES @ 31.5%', type: 'trade' },
  { time: '5 min ago', agent: 'Crypto Bot', action: 'Sold BTC $150k NO @ 93.5%', type: 'trade' },
  { time: '8 min ago', agent: 'Arb Hunter', action: 'Found 2.3% spread on ETH markets', type: 'scan' },
  { time: '12 min ago', agent: 'Weather Bot', action: 'Scanned 15 markets, no action taken', type: 'scan' },
  { time: '18 min ago', agent: 'News Hawk', action: 'Detected Fed headline, analyzing...', type: 'alert' },
  { time: '25 min ago', agent: 'Crypto Bot', action: 'Bought BTC Up @ 69.5%', type: 'trade' },
];

function makeSparkData(n, base, v) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(base + Math.sin(i * 0.3) * v + (Math.random() - 0.4) * v * 0.5);
  }
  return result;
}

export default function AlphaView() {
  var _s = useState(72);
  var sentiment = _s[0], setSentiment = _s[1];
  var _fg = useState(64);
  var fearGreed = _fg[0], setFearGreed = _fg[1];
  var sparkData = useMemo(function() { return makeSparkData(40, 60, 15); }, []);

  // Simulate slight sentiment drift
  useEffect(function() {
    var iv = setInterval(function() {
      setSentiment(function(prev) { return Math.max(20, Math.min(85, prev + (Math.random() - 0.48) * 3)); });
      setFearGreed(function(prev) { return Math.max(15, Math.min(90, prev + (Math.random() - 0.5) * 2)); });
    }, 5000);
    return function() { clearInterval(iv); };
  }, []);

  var sentimentLabel = sentiment > 65 ? 'BULLISH' : sentiment < 35 ? 'BEARISH' : 'NEUTRAL';
  var sentimentColor = sentiment > 65 ? 'var(--gn)' : sentiment < 35 ? 'var(--rd)' : 'var(--or)';
  var fgLabel = fearGreed > 70 ? 'Extreme Greed' : fearGreed > 55 ? 'Greed' : fearGreed > 45 ? 'Neutral' : fearGreed > 30 ? 'Fear' : 'Extreme Fear';
  var fgColor = fearGreed > 55 ? 'var(--gn)' : fearGreed > 45 ? 'var(--or)' : 'var(--rd)';

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ac)' }}>ALPHA</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--ac) 15%, transparent)', color: 'var(--ac)' }}>EDGE</span>
        </div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Trading Edge Center</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>AI intelligence, market signals, and strategy performance</p>
      </div>

      {/* ─── Top Row: Sentiment + Fear/Greed ─── */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* AI Sentiment */}
        <div className="card p-5 animate-fade">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>🤖 AI MARKET SENTIMENT</div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: sentiment + '%', background: 'linear-gradient(90deg, var(--rd), var(--or), var(--gn))' }} />
              </div>
              <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--tx4)' }}>
                <span>BEARISH</span><span>BULLISH</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold" style={{ fontFamily: 'var(--mono)', color: sentimentColor }}>{Math.round(sentiment)}%</div>
              <div className="text-xs font-bold" style={{ color: sentimentColor }}>{sentimentLabel}</div>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--tx2)' }}>AI detects bullish momentum in weather markets ahead of cold snap. Crypto markets neutral-to-bullish on ETH momentum.</div>
          <div className="mt-3"><Spark data={sparkData} color={sentimentColor} w={400} h={40} /></div>
        </div>

        {/* Fear/Greed */}
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.05s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>📊 PREDICTION MARKET FEAR/GREED</div>
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg3)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={fgColor} strokeWidth="8"
                  strokeDasharray={String(fearGreed * 2.64) + ' ' + String(264 - fearGreed * 2.64)}
                  strokeDashoffset="66" strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-extrabold" style={{ fontFamily: 'var(--mono)', color: fgColor }}>{Math.round(fearGreed)}</div>
                <div className="text-xs font-bold" style={{ color: fgColor }}>{fgLabel}</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--tx3)' }}>Based on volume, volatility, and open interest across 500+ markets</div>
        </div>
      </div>

      {/* ─── AI Top Picks ─── */}
      <div className="card p-5 mb-5 animate-fade" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>🎯 AI TOP PICKS — WHERE AI DISAGREES WITH MARKET</div>
          <span className="text-xs" style={{ color: 'var(--tx4)' }}>Updated 3 min ago</span>
        </div>
        <div className="space-y-3">
          {aiPicks.map(function(pick, i) {
            return (
              <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font)' }}>{pick.q}</div>
                    <div className="text-xs" style={{ color: 'var(--tx3)' }}>{pick.reason}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>
                      {pick.side} {pick.edge}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs mt-2">
                  <span style={{ color: 'var(--tx4)' }}>Market: <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{pick.price}%</span></span>
                  <span style={{ color: 'var(--tx4)' }}>AI Target: <span className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>{pick.aiTarget}%</span></span>
                  <span style={{ color: 'var(--tx4)' }}>Confidence: <span className="font-bold" style={{ fontFamily: 'var(--mono)', color: pick.confidence > 75 ? 'var(--gn)' : 'var(--or)' }}>{pick.confidence}%</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Middle Row: Leaderboard + Volume Spikes ─── */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Leaderboard */}
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.15s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>🏆 THIS WEEK&apos;S TOP TRADERS</div>
          <div className="space-y-2">
            {leaderboard.map(function(t) {
              var medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={t.rank} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                  <span className="text-lg w-8 text-center">{medals[t.rank - 1] || ('#' + t.rank)}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--ac)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--tx4)' }}>{t.trades} trades | Best: {t.bestTrade}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>+${t.pnl.toLocaleString()}</div>
                    <div className="text-xs" style={{ color: 'var(--tx3)' }}>{t.winRate}% WR</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volume Spikes + Agent Feed */}
        <div className="flex flex-col gap-4">
          <div className="card p-5 animate-fade" style={{ animationDelay: '0.2s' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>🔥 VOLUME SPIKE ALERTS</div>
            <div className="space-y-2">
              {volumeSpikes.map(function(v, i) {
                return (
                  <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                    <span className="text-lg font-extrabold" style={{ fontFamily: 'var(--mono)', color: 'var(--or)' }}>{v.spike}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold truncate" style={{ fontFamily: 'var(--font)' }}>{v.q}</div>
                      <div className="text-xs" style={{ color: 'var(--tx4)' }}>{v.category} | {v.vol}</div>
                    </div>
                    <span style={{ color: v.direction === 'up' ? 'var(--gn)' : 'var(--rd)', fontSize: 16 }}>{v.direction === 'up' ? '▲' : '▼'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Agent Feed */}
          <div className="card p-5 animate-fade" style={{ animationDelay: '0.25s' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>📡 LIVE AGENT FEED</div>
            <div className="space-y-2">
              {agentLogs.map(function(log, i) {
                var dotColor = log.type === 'trade' ? 'var(--gn)' : log.type === 'alert' ? 'var(--or)' : 'var(--tx4)';
                return (
                  <div key={i} className="flex gap-2 text-xs" style={{ color: 'var(--tx2)' }}>
                    <span className="shrink-0" style={{ color: dotColor }}>●</span>
                    <span style={{ color: 'var(--tx4)' }}>{log.time}</span>
                    <span className="font-bold" style={{ color: 'var(--ac)' }}>{log.agent}:</span>
                    <span>{log.action}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Strategy Backtests ─── */}
      <div className="card p-5 animate-fade" style={{ animationDelay: '0.3s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>📊 STRATEGY BACKTESTS</div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {strategies.map(function(s, i) {
            var riskColor = s.risk === 'High' ? 'var(--rd)' : s.risk === 'Medium' ? 'var(--or)' : 'var(--gn)';
            return (
              <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font)' }}>{s.name}</div>
                <div className="text-xl font-extrabold mb-1" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>{s.ret}</div>
                <div className="flex gap-2 text-xs">
                  <span style={{ color: riskColor }}>{s.risk}</span>
                  <span style={{ color: 'var(--tx4)' }}>|</span>
                  <span style={{ color: 'var(--tx4)' }}>{s.users} users</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--tx4)' }}>{s.period}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
