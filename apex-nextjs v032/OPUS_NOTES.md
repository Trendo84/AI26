# OPUS Notes - v0.3.3\n\n_Add your notes here_\n
This is a design implementation task, not a research task — let me build it directly. Let me read the current files and implement the full visual overhaul.

Now I have the full picture. Let me implement the complete overhaul: new color system, day theme, header toggle, redesigned Battle Cards, improved Spark charts, professional spacing.

Now update theme.js with the day theme:

Now the key fix — move Paper/Live toggle to header, redesign Navbar:

Redesign BattleCards — subtle dark cards, glow borders, no neon solids:

Now upgrade the Spark chart component with better visuals:

Now update page.js — remove mode toggle from sidebar completely (it's in header now):

Now update MarketCard with visual percentage bars and professional spacing:

Update package.json version:

Final audit:

All clean. Let me zip:

**APEX v0.3.3 — Design Overhaul** — 3,227 lines, 34 files

---

## What Changed

### 🔴 #1 Fix: Mode Toggle Overlap → GONE
The Paper/Live toggle is **in the header now** as a pill button, centered between logo and controls. Completely removed from the sidebar. No more overlap, no more collision with the footer. Clean.

### 🎨 #2 Fix: Battle Cards → Subtle & Professional
Before: neon solid backgrounds (`linear-gradient(135deg, #00d4ff, #0066ff)`) that burned your retinas.
Now: **dark card backgrounds** (`var(--bg2)`) with subtle top-accent lines and soft box-shadow glow. Percentage bars instead of giant market cap text. Clean bordered Yes/No buttons. The VS badge is a quiet circle, not a screaming neon ball.

### 🎨 #3 Fix: Color Palette → Unified
Moved from 6+ competing accent colors to a **single cyan accent** (`#00d4ff`) with muted semantic colors:
- Success: `#10b981` (softer green, not neon)
- Danger: `#ef4444` (muted red, not hot pink)
- Warning: `#f59e0b` (warm amber, not bright orange)
- Borders now use `rgba(255,255,255,0.07)` instead of harsh hex values

### ☀️ #4 New: Day Theme
Added `[data-theme="day"]` with proper light mode: white backgrounds, dark text, blue accent (`#0088cc`). Toggle between Dark/Light/Cyber/Matrix in header dots or Settings. Theme persists in localStorage.

### 📊 #5 Fix: Charts Improved
Spark component now uses `viewBox` with `preserveAspectRatio="none"` for proper responsive scaling. Optional last-point dot indicator. Smoother gradient fill with 15% opacity top fading to 0%.

### 📐 #6 Fix: Professional Spacing
- Sidebar: compact `w-52`, `py-2.5 px-3` per item
- Cards: `12px` border-radius (was 14px — too bubbly)
- Buttons: tighter padding, `8px 20px` primary
- Font: Inter as primary, JetBrains Mono for numbers
- Letter spacing: `-0.02em` on headings, `0.05em` on labels

### 🏷️ #7 Fix: MarketCard Redesign
Visual percentage bars under each outcome. HOT badge only shows on >$5K volume. "ENDING" badge for markets closing in <6 hours. Subtle hover border glow instead of heavy box-shadow. AI Forecast bar at 0.5px height.

### 🧹 #8 Fix: Sidebar Clean
Outline-style icons (`◎ ◐ ◑ ○ ◉ ◈`), compact spacing, divider lines between sections. No mode toggle taking up space at the bottom.

---

**Deploy:**
```bash
unzip apex-v033.zip && cd apex-nextjs
npm install && npm run build
git add -A && git commit -m "v0.3.3 design overhaul" && git push
```
