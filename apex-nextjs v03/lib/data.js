const sp = (n, b, v) => Array.from({ length: n }, (_, i) => b + Math.sin(i * 0.4) * v + (Math.random() - 0.4) * v * 0.7);

export const markets = [
  { id: 1, cat: 'Crypto', q: 'When will Bitcoin hit $150k?', oc: [{ l: 'Before June 2026', p: 6.8, ch: 2.1 }, { l: 'Before May 2026', p: 3.6, ch: -0.4 }], more: 2, vol: '$12K', ends: '18d', fc: null, d: sp(20, 50, 15) },
  { id: 2, cat: 'Weather', q: 'Highest temperature in NYC on February 12?', oc: [{ l: '34-35°F', p: 31.5, ch: 4.2 }, { l: '33°F or below', p: 18.5, ch: -2.1 }], more: 1, vol: '$3K', ends: '2d', fc: null, d: sp(20, 30, 8) },
  { id: 3, cat: 'Weather', q: 'Highest temperature in Atlanta on February 12?', oc: [{ l: '64-65°F', p: 24.5, ch: 1.8 }, { l: '60-61°F', p: 14.5, ch: -0.6 }], more: 1, vol: '$718', ends: '2d', fc: null, d: sp(20, 25, 6) },
  { id: 4, cat: 'Crypto', q: 'Ethereum Up or Down — February 12, 2AM ET', oc: [{ l: 'Up', p: 69.5, ch: 5.2 }, { l: 'Down', p: 30.5, ch: -5.2 }], more: 0, vol: '$8K', ends: '1d', fc: 69.5, d: sp(20, 65, 10) },
  { id: 5, cat: 'Weather', q: 'Highest temperature in Chicago on February 12?', oc: [{ l: '33°F or above', p: 33.0, ch: 3.1 }, { l: '31°F or below', p: 27.5, ch: -1.4 }], more: 4, vol: '$2K', ends: '2d', fc: null, d: sp(20, 30, 9) },
  { id: 6, cat: 'Weather', q: 'Highest temperature in Miami on February 12?', oc: [{ l: '78-79°F', p: 43.5, ch: 2.8 }, { l: '76-77°F', p: 27.8, ch: -1.2 }], more: 0, vol: '$3K', ends: '1d', fc: null, d: sp(20, 40, 7) },
  { id: 7, cat: 'Politics', q: 'Who will win the next presidential election — J.D. Vance?', oc: [{ l: 'Yes', p: 24.5, ch: 0.8 }, { l: 'No', p: 75.5, ch: -0.8 }], more: 0, vol: '$45K', ends: '1365d', fc: 24.5, d: sp(20, 25, 5) },
  { id: 8, cat: 'Sports', q: 'Will Arizona win the 2025-2026 Big 12 Basketball?', oc: [{ l: 'Yes', p: 26.5, ch: 1.2 }, { l: 'No', p: 73.5, ch: -1.2 }], more: 0, vol: '$6K', ends: '25d', fc: 26.5, d: sp(20, 27, 8) },
  { id: 9, cat: 'Culture', q: 'Will Timothee Chalamet win Best Actor at the Oscars?', oc: [{ l: 'Yes', p: 75.5, ch: 3.4 }, { l: 'No', p: 24.5, ch: -3.4 }], more: 0, vol: '$22K', ends: '323d', fc: 75.5, d: sp(20, 72, 6) },
  { id: 10, cat: 'Weather', q: 'Will the highest temp in Dallas be 69°F or below Feb 12?', oc: [{ l: 'Yes', p: 1.4, ch: -0.2 }, { l: 'No', p: 98.6, ch: 0.2 }], more: 0, vol: '$500', ends: '1d', fc: 1.4, d: sp(20, 5, 3) },
  { id: 11, cat: 'Sports', q: 'Will UConn win the 2025-2026 Big East Championship?', oc: [{ l: 'Yes', p: 68.5, ch: 2.1 }, { l: 'No', p: 31.5, ch: -2.1 }], more: 0, vol: '$9K', ends: '25d', fc: 68.5, d: sp(20, 65, 7) },
  { id: 12, cat: 'Tech', q: 'Valorant: Nongshim RedForce vs Rex Regum Qeon — Map 1', oc: [{ l: 'Nongshim RF', p: 68.5, ch: 5.3 }, { l: 'Rex Regum', p: 31.5, ch: -5.3 }], more: 0, vol: '$1.2K', ends: '3d', fc: 68.5, d: sp(20, 60, 12) },
];

export const agentPicks = [
  { q: 'Highest temp in New York City Feb 12...', agent: '@orb-weather-bot', score: 184, color: '#ff6600' },
  { q: 'Highest temp in Miami — 78-79°F...', agent: '@raven-polymarket-agent', score: 137, color: '#a855f7' },
  { q: 'Highest temp in Atlanta Feb 12...', agent: '@raven-polymarket-agent', score: 129, color: '#a855f7' },
];

export const trending = [
  { q: 'When will Bitcoin hit $150k — Before April...', pct: 2.5, dir: 'up' },
  { q: 'Will Arizona win the 2025-2026 Big 12...', pct: 26.5 },
  { q: 'Will UConn win Big East Championship...', pct: 68.5 },
];

export const tickers = [
  '★ @apex-sentinel bought $12 YES Bitcoin Up or Down — Feb 12',
  '★ @weather-hawk bought $5 NO Highest temp NYC — Feb 12',
  '★ @alpha-mirror bought $8 YES UConn Big East Championship',
  '★ @copy-whale sold $25 NO Ethereum Up or Down',
  '★ @arb-scanner bought $15 YES Bitcoin $150k Before June',
];

export const skills = [
  { id: 1, name: 'Polymarket Weather Trader', desc: 'Trade weather markets using NOAA forecast data. Monitors temperature predictions and executes trades when forecasts diverge from market prices.', level: 'Intermediate', cat: 'Weather', icon: '🌤', status: 'available' },
  { id: 2, name: 'Polymarket Copytrading', desc: 'Mirror positions from top Polymarket traders. Aggregates signals across multiple whale wallets with size-weighted positioning.', level: 'Beginner', cat: 'Copy', icon: '📋', status: 'available' },
  { id: 3, name: 'Signal Sniper', desc: 'Trade on breaking news from RSS feeds with built-in risk controls. Works with any RSS feed — news sites, Twitter-to-RSS, newsletters.', level: 'Advanced', cat: 'Signals', icon: '⚡', status: 'available' },
  { id: 4, name: 'Prediction Trade Journal', desc: 'Auto-log every trade with entry thesis, market conditions, and outcomes. Monthly calibration reports identify mistakes and improve.', level: 'Beginner', cat: 'Analytics', icon: '📓', status: 'available' },
  { id: 5, name: 'AI Divergence Scanner', desc: 'Surface markets where AI price predictions diverge from Polymarket odds. High divergence = potential alpha opportunities.', level: 'Intermediate', cat: 'Analytics', icon: '🔮', status: 'available' },
  { id: 6, name: 'Mert Sniper', desc: 'Near-expiry conviction trading. Snipe markets about to resolve when odds are heavily skewed. Filter by topic, cap your bets.', level: 'Intermediate', cat: 'Trading', icon: '🎯', status: 'available' },
  { id: 7, name: 'Arb Scanner', desc: 'Scans correlated markets for mispricings. When YES+YES on mutually exclusive outcomes < $1.00, profit is guaranteed.', level: 'Advanced', cat: 'Arb', icon: '🔍', status: 'coming_soon' },
  { id: 8, name: 'X Sentiment', desc: 'Real-time Twitter/X sentiment analysis. Alerts when social sentiment diverges >20% from market odds — catch moves before they happen.', level: 'Advanced', cat: 'Sentiment', icon: '🔥', status: 'coming_soon' },
  { id: 9, name: 'Hedge Discovery', desc: 'LLM-powered contrapositive logic finds covering portfolios. Identifies pairs of market positions that hedge each other automatically.', level: 'Advanced', cat: 'Trading', icon: '🛡', status: 'available' },
  { id: 10, name: 'Binance-Poly Arbitrage', desc: 'Exploits 30-second price lags between Binance spot and Polymarket crypto Up/Down markets. Targets 15-min resolution windows.', level: 'Expert', cat: 'Arb', icon: '⚙', status: 'coming_soon' },
];

export const bots = [
  { id: 1, name: 'Alpha Sentinel', strat: 'Arbitrage Scanner', icon: '◇', st: 'active', pnl: 847.32, pct: 12.4, trades: 342, win: 68, d: sp(24, 100, 15) },
  { id: 2, name: 'Weather Hawk', strat: 'NOAA Signal', icon: '☁', st: 'active', pnl: 1205.00, pct: 18.2, trades: 67, win: 82, d: sp(24, 120, 8) },
  { id: 3, name: 'News Raptor', strat: 'Signal Sniper', icon: '⚡', st: 'active', pnl: 523.18, pct: 8.7, trades: 156, win: 72, d: sp(24, 80, 12) },
  { id: 4, name: 'Echo Mirror', strat: 'Copy Trading', icon: '◈', st: 'paused', pnl: -124.50, pct: -3.1, trades: 89, win: 45, d: sp(24, 60, 20) },
];

export const positions = [
  { mk: 'Bitcoin Up or Down — Feb 12', side: 'YES', shares: 120, avg: 0.58, cur: 0.695, pnl: 13.80 },
  { mk: 'UConn Big East Championship', side: 'YES', shares: 80, avg: 0.62, cur: 0.685, pnl: 5.20 },
  { mk: 'Highest temp NYC Feb 12 — 34-35°F', side: 'YES', shares: 200, avg: 0.28, cur: 0.315, pnl: 7.00 },
  { mk: 'Timothee Chalamet Best Actor', side: 'YES', shares: 50, avg: 0.71, cur: 0.755, pnl: 2.25 },
  { mk: 'Bitcoin $150k Before June', side: 'YES', shares: 300, avg: 0.055, cur: 0.068, pnl: 3.90 },
  { mk: 'Fed rate cut March', side: 'NO', shares: 150, avg: 0.34, cur: 0.31, pnl: -4.50 },
];

export const categories = ['All', 'Crypto', 'Politics', 'Sports', 'Weather', 'Tech', 'Culture'];
export const skillCategories = ['All', 'Weather', 'Copy', 'Signals', 'Analytics', 'Trading', 'Arb', 'Sentiment'];

export const catColor = (c) => ({ Crypto: '#00d4ff', Weather: '#00e68a', Politics: '#a855f7', Sports: '#ff6600', Tech: '#ff4466', Culture: '#ffaa33' }[c] || '#00d4ff');
