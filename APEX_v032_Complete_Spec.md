# APEX Trading Protocol v0.3.2 - Complete Specification

## 🎯 VISION
**"Bloomberg Terminal for Prediction Markets"**
Professional-grade trading interface that gives retail traders institutional-level edge.

---

## 🚨 CRITICAL FIXES (P0 - Must Fix)

### 1. USE REAL POLYMARKET API (Not Mock Data)

**Current Problem:**
```javascript
// WRONG - Using mock data
import { markets } from '@/lib/data';
// Only shows 12 fake markets
```

**Required Fix:**
```javascript
// CORRECT - Real API fetch
const [markets, setMarkets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=100');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMarkets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchMarkets();
  
  // Auto-refresh every 60 seconds
  const interval = setInterval(fetchMarkets, 60000);
  return () => clearInterval(interval);
}, []);
```

**Why:** Traders need real data, not fake demo data. 100+ real markets, not 12.

---

### 2. WALLET - Proper Manual Flow

**Current:** Auto-generates or broken
**Required Flow:**

```
┌─────────────────────────────────────┐
│         👛 NO WALLET               │
│                                     │
│  Connect a wallet to start         │
│  trading with real money           │
│                                     │
│  [🔐 GENERATE NEW WALLET]          │
│      (big, primary button)         │
│                                     │
│  ───────── OR ─────────            │
│                                     │
│  [🦊 CONNECT METAMASK]             │
│  [🐰 CONNECT RABBY]                │
│  [🔗 CONNECT WALLETCONNECT]        │
│                                     │
└─────────────────────────────────────┘

After GENERATE clicked:
┌─────────────────────────────────────┐
│ ⚠️ CRITICAL: SAVE THESE KEYS       │
│    (red border, warning style)      │
│                                     │
│  APEX cannot recover lost keys.     │
│  If you lose them, funds are GONE.  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Wallet Address              │   │
│  │ 0x1234...abcd  [📋 Copy]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Private Key (HIDDEN)        │   │
│  │ •••••••• [👁 Reveal]       │   │
│  │          [📋 Copy]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ☐ I have copied and saved my      │
│    private key in a secure place   │
│                                     │
│  [CONTINUE TO WALLET]              │
│  (disabled until checkbox checked) │
└─────────────────────────────────────┘

Wallet Dashboard:
┌─────────────────────────────────────┐
│ 💰 WALLET                           │
│                                     │
│ Balance: $0.00 USDC                │
│ Gas: 0.00 POL                      │
│                                     │
│ [QR CODE - big, 200x200px]         │
│ 0x1234...abcd [📋 Copy]            │
│                                     │
│ [EXPORT KEYS] (requires password)  │
│                                     │
│ Transaction History:               │
│ • No transactions yet              │
│                                     │
│ [BUY CRYPTO] [WITHDRAW]            │
└─────────────────────────────────────┘
```

**Key Features:**
- Manual generation only (no auto)
- Checkbox gate (can't proceed without confirming save)
- MetaMask/Rabby/WalletConnect integration
- QR code for deposits (200x200px minimum)
- Export keys with password protection

---

### 3. FIX TRADING MODE TOGGLE OVERLAP

**Problem:** Toggle overlaps with status bar (screenshot provided)
**Solution:**

```css
/* Move toggle up in sidebar, add padding */
.sidebar-content {
  padding-bottom: 100px; /* Prevent overlap */
}

.trading-mode-section {
  position: sticky;
  bottom: 80px; /* Above status bar */
  background: var(--bg2);
  padding: 15px;
  border-top: 1px solid var(--brd);
  z-index: 10;
}

/* Or make it floating */
.trading-mode-floating {
  position: fixed;
  bottom: 100px;
  left: 20px;
  z-index: 100;
  background: var(--bg2);
  border: 1px solid var(--brd);
  border-radius: 12px;
  padding: 10px 15px;
}
```

---

### 4. SYSTEM HEALTH - Accurate Status

**Current:** Showing "Polymarket Gamma is down" when it's up
**Fix:**

```javascript
const checkHealth = async () => {
  const services = [
    { name: 'Polymarket Gamma', url: 'https://gamma-api.polymarket.com/markets?limit=1' },
    { name: 'Polymarket CLOB', url: 'https://clob.polymarket.com/markets' },
    { name: 'Polygon RPC', url: 'https://polygon-rpc.com' },
  ];
  
  const results = await Promise.all(services.map(async (s) => {
    const start = Date.now();
    try {
      const res = await fetch(s.url, { method: 'HEAD' });
      const latency = Date.now() - start;
      return {
        name: s.name,
        status: latency < 500 ? 'healthy' : latency < 2000 ? 'degraded' : 'slow',
        latency: `${latency}ms`,
        icon: latency < 500 ? '🟢' : latency < 2000 ? '🟡' : '🔴'
      };
    } catch {
      return { name: s.name, status: 'down', latency: 'Error', icon: '🔴' };
    }
  }));
  
  return results;
};
```

**Display:**
```
🟢 Polymarket Gamma  ·  45ms
🟢 Polymarket CLOB   ·  38ms  
🟢 Polygon RPC       ·  52ms
```

---

## 🎨 DESIGN IMPROVEMENTS (Trader's Perspective)

### 5. MARKET CARDS - Information Density

**Current:** Basic info
**Trader Needs:**

```
┌─────────────────────────────────────────┐
│ 🔥 HOT  ·  ⏱ 4h 23m  ·  📈 Vol +340%   │
│                                         │
│ When will Bitcoin hit $150k?            │
│                                         │
│ [SPARKLINE - 7 day price history]       │
│                                         │
│ YES ████████████████████░  67.3% ▲ 2.1  │
│ NO  ████████░░░░░░░░░░░░░  32.7% ▼ 1.4  │
│                                         │
│ Vol: $12.4M  ·  Liquidity: $890K       │
│ Spread: 0.5%  ·  AI Confidence: 78%     │
│                                         │
│ [QUICK BUY $10] [QUICK BUY $100]       │
│ [ANALYZE]  [TRADE]  [WATCHLIST]        │
└─────────────────────────────────────────┘
```

**Add to MarketCard:**
- **Visual price bars** (show YES vs NO proportion)
- **Sparkline chart** (mini 7-day history)
- **Volume change** (vs yesterday: +340%)
- **Liquidity indicator** (how much can be traded)
- **Spread** (difference between buy/sell)
- **Quick trade buttons** ($10, $100 instant)
- **HOT badge** for trending markets (>2x volume)
- **Time urgency** for ending soon (< 24h = red)

---

### 6. SIDEBAR - More Intelligence

**Current:** Limited picks
**Trader Needs:**

```
┌─────────────────────────────────────┐
│ 🤖 AGENT PICKS (Top 5)              │
│                                     │
│ 1. BTC $150k YES       78% conf 🔥 │
│    Target: $2.50 → $3.20 (+28%)     │
│                                     │
│ 2. NYC Temp >35°F YES  65% conf    │
│    Weather: Cold snap incoming      │
│                                     │
│ 3. ETH Upgrade NO      82% conf 🔒 │
│    Tech: Delay rumors circulating   │
│                                     │
│ 4. Trump YES           71% conf    │
│    Polls: Recent shift detected     │
│                                     │
│ 5. Oscars Chalamet     88% conf 🔒 │
│    Awards: Industry favorite        │
│                                     │
├─────────────────────────────────────┤
│ 🔥 TRENDING NOW (Top 6)             │
│                                     │
│ Bitcoin $150k     ▲ 45%  🚀 Vol +4x │
│ Trump Deport      ▲ 120% 🚀 Breaking│
│ ETH Upgrade       ▲ 67%  📈 Momentum│
│ Weather NYC       ▲ 89%  🚀 Alert   │
│ Super Bowl MVP    ▲ 34%      Steady │
│ Oscars 2025       ▲ 23%      Watch  │
│                                     │
├─────────────────────────────────────┤
│ ⚡ QUICK STATS                      │
│                                     │
│ Markets: 156 active                 │
│ Volume (24h): $45.2M                │
│ Your PnL Today: +$230 📈            │
│ Open Positions: 3                   │
│                                     │
└─────────────────────────────────────┘
```

**Add:**
- More agent picks (5 instead of 3)
- Confidence percentages
- "Why" explanation for each pick
- Volume multiplier (🚀 = 4x normal)
- Breaking news indicators
- Personal PnL summary
- Quick stats (total markets, volume)

---

### 7. SEARCH - Console Style (Already Done ✅)

The `>_` with glow is working. Just ensure:
- Monospace font (`Courier New`, `Monaco`)
- Blinking cursor animation
- Blue/cyan glow on focus
- Placeholder: `>_ Search 156 markets...`

---

### 8. ALPHA TAB - Trading Edge Center

**Make this the "Pro" section:**

```
┌─────────────────────────────────────────────────────────┐
│ 🤖 AI MARKET SENTIMENT                                  │
│                                                         │
│         BEARISH ◀────●────────────▶ BULLISH            │
│                    Current: 72% 🟢                      │
│                                                         │
│ "AI detects bullish momentum in weather markets         │
│  ahead of predicted cold snap. Crypto showing          │
│  weakness. Political markets stable."                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 🏆 TOP TRADERS THIS WEEK                                │
│                                                         │
│ #1  @CryptoWhale        +$4,230   78% WR   [FOLLOW]   │
│     Strategy: Crypto momentum scalping                  │
│                                                         │
│ #2  @WeatherPro         +$3,890   82% WR   [FOLLOW]   │
│     Strategy: NOAA forecast arbitrage                   │
│                                                         │
│ #3  @ArbitrageKing      +$3,120   71% WR   [FOLLOW]   │
│     Strategy: Cross-venue price gaps                    │
│                                                         │
│ [View Full Leaderboard]  [Copy Top Trader]              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 📊 EDGE INDICATORS                                      │
│                                                         │
│ Volume Spikes      3 markets with 3x+ activity    [→]  │
│ Fear/Greed Index   72 (Greed)                    [→]  │
│ Whale Alerts       $5K+ trade detected in BTC    [→]  │
│ News Sentiment     Bullish on Weather            [→]  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 🎯 AI TOP PICKS                                         │
│                                                         │
│ 1. Weather NYC YES    Target: 31% → 45%   (+14 pts)    │
│    Confidence: 78%  ·  Risk: Medium                     │
│    [ANALYZE]  [TRADE]                                  │
│                                                         │
│ 2. Crypto BTC NO      Target: 93% → 85%   (+8 pts)     │
│    Confidence: 65%  ·  Risk: High                       │
│    [ANALYZE]  [TRADE]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Add:**
- AI sentiment gauge (visual slider)
- Top traders leaderboard with strategies
- Edge indicators (volume, whales, news)
- AI price targets (where AI thinks price will go)
- Follow/copy trader buttons (future feature)

---

### 9. AGENT TAB - APEX Intelligence

**Rebrand from "OpenClaw" to professional system:**

```
┌─────────────────────────────────────────────────────────┐
│ 🤖 APEX INTELLIGENCE AGENTS                             │
│     Autonomous Trading Systems                          │
│                                                         │
│ 🌤️ WEATHER TRADER                              [ACTIVE]│
│    Status: Scanning 15 cities...                        │
│    Last Trade: 2 min ago · Bought NYC YES @ 31.5%       │
│    Today: +$230  ·  4 trades  ·  75% win rate          │
│    [VIEW LOGS]  [CONFIGURE]  [PAUSE]                    │
│                                                         │
│ 📈 CRYPTO SCANNER                                 [IDLE]│
│    Status: Waiting for volatility spike...              │
│    Last Trade: 45 min ago                               │
│    Today: $0  ·  0 trades                              │
│    [VIEW LOGS]  [CONFIGURE]  [ACTIVATE]                 │
│                                                         │
│ ⚡ ARB HUNTER                                 [SCANNING]│
│    Status: Checking 12 markets for gaps...              │
│    Last Trade: 8 min ago · Found 2.3% spread on ETH     │
│    Today: +$89  ·  2 trades                            │
│    [VIEW LOGS]  [CONFIGURE]  [PAUSE]                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 📡 LIVE AGENT FEED                                      │
│                                                         │
│ 2m ago  🌤️ Weather Bot: Bought NYC YES @ 31.5%         │
│ 5m ago  📈 Crypto Bot: Monitoring BTC volatility        │
│ 8m ago  ⚡ Arb Hunter: Found 2.3% spread on ETH        │
│ 12m ago 🌤️ Weather Bot: Scanned Chicago - no action     │
│                                                         │
│ [CLEAR]  [EXPORT LOGS]                                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 🛠️ STRATEGY MARKETPLACE                                 │
│                                                         │
│ Weather Arbitrage      +34%  ·  Medium Risk  ·  245 ⬇  │
│ Crypto Momentum        +28%  ·  High Risk    ·  189 ⬇  │
│ Political Events       +19%  ·  Low Risk     ·  523 ⬇  │
│ Binance-Poly Arb       +42%  ·  High Risk    ·  67 ⬇   │
│                                                         │
│ [INSTALL CUSTOM STRATEGY]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Add:**
- Agent status (Active/Idle/Scanning)
- Real-time feed (like Twitter feed)
- Strategy marketplace with backtests
- Install custom strategy button
- Export logs feature

---

## 📱 MOBILE OPTIMIZATION

### 10. Responsive Design

**Desktop (> 1024px):**
- Sidebar on left (250px)
- 3-column market grid
- Hover effects enabled
- Full sidebar visible

**Tablet (768px - 1024px):**
- Collapsible sidebar
- 2-column market grid
- Touch-friendly

**Mobile (< 768px):**
```
┌─────────────────────────────────────┐
│ ◈ APEX              🔔  ≡          │
├─────────────────────────────────────┤
│                                     │
│ [MARKET CONTENT]                    │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  ◈   |   📊   |   💳   |   ⚡      │
│ Disc  Port  Wallet  Alpha          │
└─────────────────────────────────────┘
```

**Mobile Changes:**
- Bottom navigation bar (4 tabs)
- Swipe between tabs
- Sidebar becomes hamburger menu
- Single column market cards
- Full-screen modals
- Pull-to-refresh
- Touch targets minimum 44px

---

## 🎨 VISUAL POLISH

### 11. Color & Typography

**Colors:**
- Keep dark theme (it's working well)
- Accent: `#00d4ff` (cyan) for primary actions
- Success: `#00ff88` (green) for wins/up
- Danger: `#ff4757` (red) for losses/down
- Warning: `#ffa502` (orange) for alerts
- Text: `#ffffff` (white) primary
- Muted: `#a4b0be` (gray) secondary

**Typography:**
- Headings: Inter or SF Pro Display
- Numbers: JetBrains Mono or SF Mono (tabular)
- Body: Inter or system-ui

### 12. Animations & Micro-interactions

**Add:**
- Skeleton loaders (not just "Loading...")
- Pulse on HOT markets
- Slide-in for sidebar
- Fade for tab switching
- Scale on button press (0.98)
- Sparkline animation on hover

---

## ⚡ PERFORMANCE

### 13. Optimization

**Implement:**
- Debounced search (300ms delay)
- Virtual scrolling for long lists (if >50 markets)
- Image lazy loading
- 60-second auto-refresh
- Manual refresh button
- Cache API responses (5 minutes)

---

## 🧪 TESTING CHECKLIST

Before marking "Internal Test Ready":

- [ ] 100+ real markets load from Polymarket API
- [ ] Search filters work in real-time
- [ ] Categories filter correctly
- [ ] Wallet generates manually (not auto)
- [ ] Key backup modal appears with checkbox gate
- [ ] MetaMask/Rabby connect options work
- [ ] Trading mode toggle doesn't overlap
- [ ] Health check shows accurate status
- [ ] Agent picks shows 5 items with confidence
- [ ] Trending shows 6 items
- [ ] Market cards have sparklines
- [ ] HOT badges appear on trending markets
- [ ] Alpha tab has AI sentiment gauge
- [ ] Mobile view works (bottom nav)
- [ ] No 404 errors on navigation
- [ ] Console has no errors

---

## 🚀 DEPLOYMENT

**Target:** Netlify (current)
**Build:** Static export (`output: 'export'`)
**Check:** All routes work with `_redirects`

---

## SUMMARY

**From a trader's perspective, this app needs:**
1. **Real data** - Not mock/demo markets
2. **Information density** - More data on screen
3. **Visual edge** - Sparklines, price bars, HOT badges
4. **Professional tools** - AI insights, leaderboards, alerts
5. **Speed** - Fast loading, instant search
6. **Trust** - Proper wallet flow, accurate health status
7. **Mobile access** - Trade on the go

**Make it feel like a $10,000/year Bloomberg Terminal, not a $10 hobby project.**

