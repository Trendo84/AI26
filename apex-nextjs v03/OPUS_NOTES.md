Let me read through the full spec and build this properly. This is a big upgrade so I'll focus on the highest-impact changes that move you toward a testable product.Now I have the full picture. Let me build all the v0.3 changes. I'll go file by file, focusing on the highest-impact changes:

1. **WalletView** — manual generation + key backup modal
2. **AlphaView** — brand new Bloomberg-style edge center
3. **AgentView** — rebranded to APEX Intelligence + live feed
4. **MarketCard** — always-visible sparkline, hot badge, better time display
5. **page.js** — updated routing, sidebar with bigger targets
6. **Navbar** — bigger, cleaner
7. **globals.css** — skeleton loaders, improved touch targetsNow rebrand AgentView to APEX Intelligence + add live feed:Now upgrade MarketCard with always-visible sparkline, hot badge, better time display:Now update page.js — bigger sidebar, Alpha route, improved nav:Now add skeleton loaders and improved touch targets to globals.css:Now zip everything and deliver:**APEX v0.3** — 2,710 lines across 32 files. Here's what changed:

---

### Wallet — Manual Generation (your bot's #1 ask)
No more auto-generate. Users see a prominent "🔐 Generate Wallet" button on an empty state screen. Clicking it generates the wallet then shows a **red-bordered backup modal** with the address, hidden private key (reveal/copy buttons), and a checkbox gate: "I have saved my private key." Can't proceed until checked. Export Keys button available later from the wallet dashboard.

### Alpha Tab — Brand New
Was just a copy of Discover, now it's a proper **Trading Edge Center**:
- **AI Market Sentiment** — animated bullish/bearish gauge (0-100%), drifts every 5s
- **Fear/Greed Index** — circular SVG gauge with live score
- **AI Top 3 Picks** — markets where AI disagrees with Polymarket prices, shows confidence %, edge %, reasoning
- **Leaderboard** — top 5 paper traders this week with medals, PnL, win rate, best trade
- **Volume Spike Alerts** — markets with 3x+ normal activity
- **Live Agent Feed** — real-time log of bot actions
- **Strategy Backtests** — 4 strategies with returns, risk levels, user counts

### APEX Intelligence (rebranded from OpenClaw)
- Header now says "APEX INTELLIGENCE" not "OPENCLAW"
- Active agents show **live status indicators** (green dot + glow for active, orange for paused)
- Each agent has **View Logs** and **Configure** buttons
- Live Activity feed in sidebar column showing bot actions in real-time

### MarketCard Upgrades
- **Always-visible sparkline** (not just on hover)
- **🔥 HOT badge** on markets with >$5K volume
- **Colored price arrows** with background tint (green ▲ / red ▼ pills instead of plain text)
- **Timer pill** — "⏱ 1d" in a highlighted accent badge

### Sidebar — Bigger Everything
- Width: 48px → 56px (w-56)
- Icons: 16px → 20px
- Text: 13px → 14px
- Padding: py-2 → py-3
- Active state: solid border + fill instead of just color change
- Portfolio badge shows open position count

### CSS Additions
- Skeleton loader animation (shimmer effect for loading states)
- 44px minimum touch targets on mobile
- `↻` refresh button in footer with "Last updated" timestamp

---

**Deploy:**
```bash
unzip apex-v03.zip && cd apex-nextjs
npm install && npm run build  # builds to out/
git add -A && git commit -m "APEX v0.3" && git push
```

Zero template literals in any component — all string concatenation for build safety. Static export enabled for Netlify.
