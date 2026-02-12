# APEX Trading Protocol v0.3 - Feature Specification

## Executive Summary
Building on v0.2 success, v0.3 focuses on: manual wallet control, unique Alpha trading edge features, APEX-branded intelligence agents, and UI/UX polish.

---

## 1. 🔐 WALLET - Manual Generation (Priority: CRITICAL)

### Current Issue
Wallet auto-generates on page load. Users need control and key backup flow.

### Required Changes

#### Empty State
```
┌─────────────────────────────┐
│                             │
│      👛 No Wallet          │
│                             │
│  Generate a wallet to      │
│  start live trading        │
│                             │
│  [ GENERATE WALLET ]       │
│      (big, prominent)      │
│                             │
└─────────────────────────────┘
```

#### Key Backup Modal (After Generation)
**Popup/Modal with red warning styling:**

```
⚠️ CRITICAL: SAVE THESE KEYS NOW

APEX cannot recover lost private keys. 
If you lose them, your funds are gone forever.

┌──────────────────────────────────┐
│ Your Wallet Address              │
│ 0x1234...abcd                    │
│ [📋 Copy]                        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Your Private Key (NEVER SHARE)  │
│ 0x5678...efgh                    │
│ [📋 Copy]  [👁 Reveal]           │
└──────────────────────────────────┘

☐ I have copied and saved my private key in a secure location

[Continue to Wallet] (disabled until checked)
```

#### Wallet Dashboard (After Backup)
- Show balances (USDC + POL)
- QR code for deposits (bigger, 200x200px)
- Transaction history table (last 10 txs)
- Withdraw form: Address input + Amount + Submit
- Export keys button (requires password re-entry)

---

## 2. ⚡ ALPHA TAB - Trading Edge Center

### Current Issue
Alpha opens same as Discover. Needs unique value proposition.

### Vision
"Bloomberg Terminal for Prediction Markets"

### Features

#### A) AI Market Intelligence
```
┌─────────────────────────────────────────┐
│ 🤖 AI MARKET SENTIMENT                  │
│                                         │
│  BEARISH ◀────●────────────▶ BULLISH   │
│            Current: 72%                 │
│                                         │
│ "AI detects bullish momentum in        │
│  weather markets ahead of cold snap"    │
└─────────────────────────────────────────┘
```

**Components:**
- Sentiment gauge (0-100%, animated)
- AI Top 3 Picks (markets AI recommends today)
- AI vs Market Disagreement (where AI sees value)
- Confidence score for each prediction

#### B) Leaderboard - Top Traders
```
┌─────────────────────────────────────────┐
│ 🏆 THIS WEEK'S TOP TRADERS              │
│                                         │
│ #1  @CryptoWhale    +$4,230   78% WR   │
│ #2  @WeatherPro     +$3,890   82% WR   │
│ #3  @ArbitrageKing  +$3,120   71% WR   │
│                                         │
│ [View Full Leaderboard]                 │
│ [Copy Trade] (future feature)           │
└─────────────────────────────────────────┘
```

**Show:** Rank, Username, Total PnL, Win Rate, Best Single Trade

#### C) Market Edge Indicators
- **Volume Spikes**: Markets with 3x normal activity
- **Fear/Greed Index**: Overall prediction market sentiment
- **News Sentiment**: Real-time headline analysis
- **Whale Alerts**: Big trades ($1000+) detected

#### D) Strategy Performance
```
┌─────────────────────────────────────────┐
│ 📊 STRATEGY BACKTESTS                   │
│                                         │
│ Weather Arbitrage     +34%  (30 days)   │
│ Crypto Momentum       +28%  (30 days)   │
│ Political Events      +19%  (30 days)   │
│                                         │
│ Risk: Medium | Users: 245               │
└─────────────────────────────────────────┘
```

---

## 3. 🧠 OPENCLAW TAB → "APEX INTELLIGENCE"

### Rebranding
- Rename "OpenClaw" → "APEX Intelligence"
- Make it feel like our proprietary tech, not generic

### Features

#### Active Agents Dashboard
```
┌─────────────────────────────────────────┐
│ 🤖 APEX INTELLIGENCE AGENTS             │
│                                         │
│ 🌤️ WEATHER TRADER          [ACTIVE]    │
│    Last trade: 2 min ago                │
│    Today: +$230 | 4 trades              │
│    [View Logs] [Configure]              │
│                                         │
│ 📈 CRYPTO SCANNER          [IDLE]       │
│    Waiting for opportunity...           │
│    [View Logs] [Configure]              │
│                                         │
│ ⚡ ARB HUNTER              [SCANNING]   │
│    Checking 12 markets...               │
│    Today: +$89 | 2 trades               │
└─────────────────────────────────────────┘
```

#### Strategy Marketplace
- Grid of available strategies
- Each shows: Icon, Name, Backtested Return, Risk Level, Active Users
- "Install Strategy" button
- "Create Custom Strategy" (advanced users)

#### Live Agent Feed (Real-time)
```
Recent Activity:
• 2 min ago - Weather Bot: Bought NYC YES @ 31.5%
• 5 min ago - Crypto Bot: Sold BTC $150k NO @ 93.5%
• 8 min ago - Arb Hunter: Found 2.3% spread on ETH
• 12 min ago - Weather Bot: Scanned 15 markets, no action
```

---

## 4. 🎨 UI/UX IMPROVEMENTS

### Navigation Sidebar
- **Bigger icons** (24px → 32px)
- **Bigger text** (14px → 16px)
- **More prominent active state** (solid fill vs just color change)
- **Add tooltips** on hover for each menu item

### Market Cards (Discover)
- **Sparkline chart**: 7-day price history mini-chart
- **Hot badge**: Flame icon for markets with 2x volume spike
- **Time indicator**: "Ends in 4h 23m" (countdown style)
- **Better colors**: Green/red arrows for price changes (not just text)

### Search & Filters
- **Move search to top center**, make it wider (60% width)
- **Category chips**: Make them look like removable tags (with X)
- **Quick filters**: "Trending 🔥