# APEX Trading Protocol

AI-Powered Prediction Market Trading Platform — Deploy autonomous AI agents to trade on Polymarket and Kalshi.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (Recommended - 2 minutes)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Import Project"
3. Select your repo → Deploy
4. Done. You get a free `.vercel.app` URL instantly.

**Or deploy with one command:**
```bash
npx vercel
```

## Deploy to Netlify (Alternative)

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Import from Git"
3. Build command: `npm run build` | Publish dir: `out`
4. Deploy

**Or drag-and-drop:**
```bash
npm run build
# Drag the /out folder to netlify.com/drop
```

## Features

### 🔍 Discover
- Live market grid with real-time odds from Polymarket
- Category filtering (Crypto, Politics, Sports, Weather, Tech, Culture)
- Featured market spotlight with sparkline charts
- Agent picks & trending sidebar

### 🤖 Agent (OpenClaw Integration)
- **Overview**: Bot management dashboard with P&L tracking
- **Skills Marketplace**: 10 trading skills (Weather Trader, Copytrading, Signal Sniper, AI Divergence, Hedge Discovery, Arb Scanner, etc.)
- **SDK**: API key management, wallet configuration
- Multiple wallet support: APEX Managed, MetaMask, WalletConnect, BYOW

### 📊 Portfolio
- Active positions table with real-time P&L
- Summary cards (portfolio value, unrealized P&L)
- Mobile-responsive card layout

### 👁 Watchlist
- Bookmarked markets for monitoring

### ◈ Points
- $APEX token balance & earning mechanisms
- Creator rewards, trading rewards, referral bonuses

### 🎨 Themes
- **Apex**: Clean blue/cyan professional
- **Cyberpunk**: Yellow/red with scanlines and glow
- **Matrix**: Green terminal with falling code rain

## Tech Stack

- **Next.js 14** (App Router, Static Export)
- **Tailwind CSS** with CSS custom properties for theming
- **React 18** with hooks
- **Zero external UI libraries** — pure CSS + custom components

## Architecture

```
app/
  layout.js      # Root layout + ThemeProvider
  globals.css    # Tailwind + CSS variables + animations
  page.js        # Main shell with sidebar + view router
components/
  Navbar.js      # Top nav with theme dots, wallet connect
  Ticker.js      # Live trade ticker bar
  MatrixRain.js  # Canvas falling code animation
  Spark.js       # SVG sparkline component
  MarketCard.js  # Reusable market display card
  DiscoverView.js
  AgentView.js   # Skills marketplace + SDK + bot management
  PortfolioView.js
  OtherViews.js  # Watchlist + Points
lib/
  theme.js       # Theme context provider
  data.js        # Mock data + constants
```

## What's Next (Production Roadmap)

### Phase 1: Live Data
- Connect Polymarket Gamma API for real market data
- WebSocket feeds for real-time price updates
- Supabase auth + user accounts

### Phase 2: Trading
- OpenClaw skill installation
- Managed wallet creation (Polygon)
- Paper trading with $APEX virtual currency
- Real USDC trading via Polymarket CLOB API

### Phase 3: AI Alpha
- NOAA weather data integration
- Binance price lag arbitrage
- LLM-powered hedge discovery
- X/Twitter sentiment analysis
- Custom skill builder

### Phase 4: Monetization
- Stripe subscriptions (Free / Pro $39 / Premium $99)
- Strategy marketplace with revenue sharing
- Referral program with $APEX rewards
