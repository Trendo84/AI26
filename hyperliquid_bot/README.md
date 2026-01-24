# 🚀 Hyperliquid AI Trading Bot

An advanced AI-powered scalping trading bot for Hyperliquid DEX with a stunning cyberpunk/matrix-themed web interface.

![Bot Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.10+-blue)

## ✨ Features

- 🤖 **AI-Powered Trading Strategy** - Multiple technical indicators with intelligent weighting
- 📊 **Real-time Dashboard** - Beautiful cyberpunk/matrix/neon themes
- ⚡ **High-Frequency Scalping** - Optimized for 0.5-2% gains per trade
- 🎯 **Advanced Risk Management** - Stop loss, take profit, drawdown protection
- 📈 **Live Analytics** - Win rate, Sharpe ratio, profit factor tracking
- 🔍 **Crypto Screener** - AI-powered trade suggestions with expandable charts
- 🌐 **WebSocket Streaming** - Real-time data updates to dashboard
- 🎨 **Multiple Themes** - Cyberpunk, Matrix, Neon Tokyo styles

## 🎯 Trading Strategy

### Overview
This bot implements a sophisticated **AI-weighted ensemble strategy** combining multiple technical indicators for high-confidence scalping trades. Designed for $100 capital with 10-20x leverage.

### Core Strategy Components

#### 1. **Technical Indicators (Multi-Factor Analysis)**

**RSI (Relative Strength Index)** - 25% Weight
- Oversold (<30): Strong buy signal
- Overbought (>70): Strong sell signal
- Identifies momentum exhaustion points

**EMA Trend Following** - 20% Weight
- EMA 9, 21, 50 alignment for trend confirmation
- Bullish: Price > EMA9 > EMA21 > EMA50
- Bearish: Price < EMA9 < EMA21 < EMA50

**Bollinger Bands** - 15% Weight
- Buy at lower band (support bounce)
- Sell at upper band (resistance rejection)
- Identifies volatility and price extremes

**MACD (Moving Average Convergence Divergence)** - 15% Weight
- Bullish crossover: MACD > Signal
- Bearish crossover: MACD < Signal
- Histogram confirms momentum strength

**Stochastic Oscillator** - 10% Weight
- K line crossing D line for entry timing
- Overbought/oversold confirmation
- Fast-response momentum indicator

**Volume Analysis** - 10% Weight
- Volume surge detection (>1.5x average)
- Confirms breakout validity
- Filters false signals

**Momentum Signals** - 5% Weight
- Short-term (1-bar) and medium-term (5-bar) price changes
- Trend continuation validation

#### 2. **AI Scoring System**

The bot calculates separate **buy_score** and **sell_score** based on:
- Each indicator contributes its weighted score (0-1)
- Scores are summed to create confidence levels
- Minimum threshold: 0.65 (65% confidence)
- After 2+ consecutive losses, threshold increases to 0.75

**Example Trade Signal:**
```
BUY Signal Generated
- RSI: 28 (Oversold) → +0.25
- EMA Trend: Bullish alignment → +0.20
- BB: Price at lower band → +0.15
- MACD: Bullish crossover → +0.15
- Stochastic: K>D, oversold → +0.10
- Volume: 1.8x surge → +0.10
-----------------------------------
Total Buy Score: 0.95 (95% confidence)
✅ EXECUTE LONG TRADE
```

#### 3. **Position Sizing & Leverage**

**For $100 Capital with 15x Leverage:**

```python
Base Position = $100 × 5% = $5 max risk per trade
With 15x Leverage = $5 × 15 = $75 position size
Confidence Adjustment = $75 × confidence (0.65-1.0)

Example:
- 70% confidence signal = $75 × 0.70 = $52.50 position
- 90% confidence signal = $75 × 0.90 = $67.50 position
```

**ATR (Average True Range) Volatility Adjustment:**
- High volatility → Reduce position by 20%
- Protects against slippage and rapid reversals

#### 4. **Risk Management System**

**Stop Loss:** 2.0% per trade
- Long: Triggers if price drops 2% below entry
- Short: Triggers if price rises 2% above entry
- Automatic exit to preserve capital

**Take Profit:** 1.5% per trade
- Target 1.5% gain per scalp
- Multiple small wins compound over time
- Risk/Reward ratio: 1:0.75 (acceptable for 68%+ win rate)

**Maximum Drawdown:** 15%
- Bot pauses if account drops 15% from peak
- Prevents emotional revenge trading
- Forces strategy re-evaluation

**Daily Trade Limit:** 50 trades
- Prevents overtrading
- Reduces exposure to black swan events
- Ensures adequate capital per trade

**Position Size Limit:** 5% of capital
- Maximum $5 risk per trade on $100 account
- Protects against single trade blowup

#### 5. **Anti-Overtrading Protection**

**Consecutive Loss Protection:**
- After 2 losses: Increase confidence threshold by 10%
- After 3 losses: Pause trading for 1 hour
- Prevents revenge trading spiral

**Market Condition Filtering:**
- Avoids trading during extreme volatility (>8% moves)
- Requires minimum 50 data points before first trade
- Ensures adequate market context

### 💡 Why This Strategy Works

1. **Diversified Signal Sources** - Multiple uncorrelated indicators reduce false signals
2. **Confidence-Based Sizing** - Bigger positions on high-confidence trades
3. **Strict Risk Control** - Small losses, consistent wins compound over time
4. **High-Frequency Edge** - Multiple trades per day capture small moves
5. **Adaptive Behavior** - Self-adjusting thresholds based on performance

### 📊 Expected Performance

**Target Metrics:**
- Win Rate: 65-75%
- Average Win: +1.5%
- Average Loss: -2.0%
- Daily Trades: 10-30
- Expected Daily Return: 2-5% (with 15x leverage)
- Maximum Drawdown: <15%

**Monthly Projection (Conservative):**
```
Starting Capital: $100
Daily Return: 3% average
Compounded over 20 trading days
-----------------------------------
Month 1: $100 → $180 (+80%)
Month 2: $180 → $324 (+80%)
Month 3: $324 → $583 (+80%)
```

⚠️ **Risk Warning:** Past performance is not indicative of future results. High leverage amplifies both gains and losses.

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js (for dashboard development)
- Hyperliquid account (testnet or mainnet)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/hyperliquid-bot.git
cd hyperliquid-bot
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your API credentials
```

4. **Configure the bot:**
Edit `config.json` to adjust strategy parameters:
- Leverage (recommended: 10-20x)
- Risk parameters (stop loss, take profit)
- Trading pairs
- Indicators weights

### 🔑 Hyperliquid API Setup

1. Go to https://app.hyperliquid.xyz/API
2. Generate a new API wallet
3. Authorize the API wallet with your main wallet
4. Copy the private key to `.env`

**Important:** Never share your private key or commit it to git!

## 🎮 Usage

### Running the Trading Bot

**Testnet (Recommended for testing):**
```bash
python trading_bot.py --testnet
```

**Live Trading (Use with caution):**
```bash
python trading_bot.py
```

### Starting the Dashboard

1. **Start the WebSocket server:**
```bash
python dashboard_server.py
```

2. **Open the dashboard:**
```bash
# Simply open dashboard.html in your browser
# Or use a local server:
python -m http.server 8000
# Then navigate to http://localhost:8000/dashboard.html
```

### 🎨 Dashboard Features

**Header Controls:**
- Theme selector (Cyberpunk/Matrix/Neon Tokyo)
- Bot start/pause button
- Real-time status indicator

**Main Dashboard:**
- Account balance and P&L
- Win rate and total trades
- Bot status with leverage display

**Trading Chart:**
- Real-time candlestick chart
- Technical indicator overlays
- Trade entry/exit markers

**Signals Panel:**
- Live trading signals as they generate
- Confidence levels
- Price and timing information

**Open Positions:**
- Current positions with P&L
- Entry and current prices
- Leverage and size information

**Analytics Dashboard:**
- Win rate progress bar
- Profit factor indicator
- Sharpe ratio metric
- Maximum drawdown tracking

**Recent Trades:**
- Trade history table
- P&L per trade
- Execution timing

**Crypto Screener:**
- Multiple crypto pairs
- AI-powered long/short suggestions
- Technical indicators (RSI, MACD)
- Expandable mini-charts
- One-click trade execution

## 📁 Project Structure

```
hyperliquid_bot/
├── trading_bot.py           # Main trading engine
├── hyperliquid_api.py       # API integration
├── dashboard_server.py      # WebSocket server
├── dashboard.html           # Web interface
├── config.json             # Bot configuration
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
└── README.md              # This file
```

## ⚙️ Configuration

### config.json Parameters

```json
{
  "trading": {
    "symbol": "BTC-USD",           // Trading pair
    "leverage": 15,                // 10-20x recommended
    "check_interval_seconds": 30,  // How often to check for signals
    "base_position_size": 0.01    // Base position size multiplier
  },
  "strategy": {
    "signal_threshold": 0.65,      // Minimum confidence (65%)
    "rsi_period": 14,
    "rsi_overbought": 70,
    "rsi_oversold": 30,
    // ... other indicator settings
  },
  "risk": {
    "max_drawdown_pct": 15,        // Stop trading at 15% drawdown
    "max_daily_trades": 50,        // Prevent overtrading
    "max_position_size_pct": 5,    // Max 5% risk per trade
    "stop_loss_pct": 2.0,          // 2% stop loss
    "take_profit_pct": 1.5         // 1.5% take profit
  }
}
```

## 🛡️ Safety Features

1. **Simulation Mode** - Test strategies without real money
2. **Stop Loss Protection** - Automatic position closure
3. **Drawdown Circuit Breaker** - Pauses at max drawdown
4. **Anti-Overtrading** - Daily trade limits
5. **Confidence Filtering** - Only high-probability trades
6. **Position Size Limits** - Caps risk per trade

## 📈 Optimization Tips

### Starting with $100

1. **Use 10-15x leverage** (Not 20x initially)
2. **Start with BTC or ETH** (High liquidity, lower spread)
3. **Trade during high volume hours** (Better fills)
4. **Monitor first 20 trades closely**
5. **Adjust stop loss if win rate < 60%**

### Scaling Up

Once you reach $200-300:
- Increase position sizes proportionally
- Add more trading pairs
- Consider lower leverage (10x)
- Implement trailing stops
- Use partial profit taking

## 🤖 AI Features

- **Adaptive Confidence Thresholds** - Adjusts based on recent performance
- **Volume-Weighted Sizing** - Larger positions in high-volume periods
- **Correlation Analysis** - Filters conflicting signals
- **Pattern Recognition** - Identifies recurring profitable setups

## 🔧 Troubleshooting

**Bot not connecting to Hyperliquid:**
- Check API credentials in .env
- Verify API wallet is authorized
- Test with testnet first

**Dashboard not updating:**
- Ensure WebSocket server is running
- Check browser console for errors
- Verify port 8765 is not blocked

**Too many false signals:**
- Increase signal_threshold in config
- Adjust indicator periods
- Add volume filters

## 📚 Resources

- [Hyperliquid Docs](https://hyperliquid.gitbook.io)
- [Python SDK](https://github.com/hyperliquid-dex/hyperliquid-python-sdk)
- [Technical Analysis](https://www.investopedia.com/technical-analysis-4689657)

## ⚠️ Disclaimer

**IMPORTANT RISK DISCLOSURE:**

This trading bot is provided for educational purposes only. Cryptocurrency trading involves substantial risk of loss and is not suitable for every investor. The high degree of leverage can work against you as well as for you. Before deciding to trade cryptocurrencies, you should carefully consider your investment objectives, level of experience, and risk appetite.

**Key Risks:**
- Past performance is not indicative of future results
- High leverage amplifies both gains and losses
- Technical indicators can produce false signals
- Market volatility can cause rapid losses
- Smart contract and exchange risks
- No guarantee of profit

**Recommendations:**
- Start with small amounts you can afford to lose
- Test thoroughly on testnet before live trading
- Never invest money you need for living expenses
- Use proper position sizing and risk management
- Monitor your bot actively, especially initially
- Be prepared to manually intervene if needed

The developers assume no liability for any financial losses incurred through the use of this software.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 💬 Support

- Open an issue on GitHub
- Join our Discord community
- Email: support@yourbot.com

## 🌟 Acknowledgments

- Hyperliquid team for the excellent DEX and API
- Technical analysis community for indicator research
- Open source contributors

---

**Built with ⚡ by passionate traders for passionate traders**

*Remember: The best trade is the one you don't take when conditions aren't right.*
