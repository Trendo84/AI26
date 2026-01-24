# 🚀 Quick Start Guide

Get your Hyperliquid AI Trading Bot running in 5 minutes!

## Step 1: Prerequisites ✅

**What you need:**
- Python 3.10+ installed
- Git installed
- A Hyperliquid account (testnet or mainnet)

**Check your Python version:**
```bash
python --version
# Should show Python 3.10 or higher
```

## Step 2: Clone & Install 📦

```bash
# Clone the repository
git clone https://github.com/yourusername/hyperliquid-bot.git
cd hyperliquid-bot

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Configure API Keys 🔑

### For Testnet (Recommended First)

1. Go to https://app.hyperliquid-testnet.xyz
2. Connect your wallet
3. Go to Settings → API
4. Generate API keys
5. Copy the private key (shown only once!)

### Create .env file

```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
nano .env
# or
code .env
```

**Add your keys:**
```env
HYPERLIQUID_TESTNET=true
HYPERLIQUID_PRIVATE_KEY=0xyour_private_key_here
HYPERLIQUID_API_KEY=your_api_key_here
SIMULATION_MODE=true
```

## Step 4: Run the Bot 🎮

### Start in Simulation Mode (No Real Trades)

```bash
python main.py --simulation
```

You should see:
```
⚡ HYPERLIQUID AI TRADING BOT
🤖 Status: Initializing...
✅ Setup verification passed
🚀 Bot starting...
```

### Open the Dashboard

1. Open your web browser
2. Navigate to the project folder
3. Open `dashboard.html`

Or run a local server:
```bash
# In a new terminal
cd hyperliquid-bot
python -m http.server 8000

# Then open http://localhost:8000/dashboard.html
```

## Step 5: Monitor & Adjust 📊

### First Hour Checklist

- [ ] Bot is generating signals
- [ ] Dashboard updates in real-time
- [ ] No error messages in terminal
- [ ] Win rate tracking properly
- [ ] Positions show correctly

### Adjust Settings

Edit `config.json`:

```json
{
  "trading": {
    "leverage": 10,  // Start lower, increase gradually
    "check_interval_seconds": 30
  },
  "strategy": {
    "signal_threshold": 0.70  // Start higher (70%), lower later
  },
  "risk": {
    "stop_loss_pct": 2.0,
    "take_profit_pct": 1.5,
    "max_drawdown_pct": 15
  }
}
```

## Common Issues & Fixes 🔧

### "ModuleNotFoundError: No module named X"
```bash
pip install -r requirements.txt --upgrade
```

### "API connection failed"
```bash
# Check your .env file
cat .env

# Verify keys are correct
# Make sure HYPERLIQUID_TESTNET=true for testnet
```

### "Dashboard not updating"
```bash
# Check if WebSocket server is running
# Look for: "WebSocket server starting on localhost:8765"

# Try a different port
python main.py --port 9000
```

### "Too many signals"
```bash
# Increase confidence threshold in config.json
"signal_threshold": 0.75  // Higher = fewer but better signals
```

### "Not enough signals"
```bash
# Lower confidence threshold
"signal_threshold": 0.60  // Lower = more signals (more risk)
```

## Going Live 🔴

### Before Live Trading

1. **Test on testnet for at least 1 week**
2. **Verify win rate > 60%**
3. **Confirm stop losses work**
4. **Check drawdown stays < 15%**

### Switch to Mainnet

1. Generate mainnet API keys at https://app.hyperliquid.xyz/API
2. Update `.env`:
```env
HYPERLIQUID_TESTNET=false
SIMULATION_MODE=false
```
3. **Start with small capital!**
```bash
python main.py
# Confirm with 'YES' when prompted
```

## Best Practices 💡

### Starting Capital

- **$100-200**: Perfect for learning
- **$500-1000**: Good for serious testing
- **$2000+**: Only after proving strategy

### Leverage

- **10x**: Safe starting point
- **15x**: After 2 weeks of success
- **20x**: Only for experienced traders

### Monitoring

- **First 3 days**: Check every 2 hours
- **First week**: Check 3x per day
- **After 1 month**: Can run mostly unattended

### Risk Management

```python
# Golden Rules
1. Never risk more than 5% per trade
2. Stop if drawdown > 15%
3. Take profits regularly
4. Don't increase leverage after losses
5. Keep 50% in stablecoins as backup
```

## Next Steps 📈

### Week 1: Testing
- Run in simulation mode
- Watch signal quality
- Adjust confidence threshold
- Test stop losses

### Week 2: Paper Trading
- Switch to testnet
- Use real market data
- Monitor win rate
- Track all metrics

### Week 3: Optimization
- Fine-tune indicators
- Adjust position sizing
- Optimize timing
- Review all trades

### Week 4: Live Trading
- Start with minimum capital
- 10x leverage maximum
- Monitor actively
- Scale up slowly

## Support & Resources 📚

### Documentation
- `README.md` - Full documentation
- `STRATEGY_ANALYSIS.md` - Strategy deep dive
- `config.json` - All settings explained

### Community
- Discord: [Join here]
- GitHub Issues: [Report bugs]
- Email: support@yourbot.com

### Learning Resources
- [Hyperliquid Docs](https://hyperliquid.gitbook.io)
- [Technical Analysis Guide](https://www.investopedia.com/technical-analysis)
- [Risk Management Course](https://example.com)

## Troubleshooting Commands 🛠️

```bash
# Check logs
tail -f trading_bot.log

# Restart bot
pkill -f main.py
python main.py --testnet

# Test API connection
python hyperliquid_api.py

# Validate config
python -c "import json; json.load(open('config.json'))"

# Check WebSocket
curl http://localhost:8765

# Update dependencies
pip install -r requirements.txt --upgrade
```

## Safety Checklist ✅

Before running live:

- [ ] Tested on testnet for 1+ week
- [ ] Win rate consistently > 60%
- [ ] Stop losses trigger correctly
- [ ] Dashboard shows accurate data
- [ ] API keys are secure
- [ ] .env file is in .gitignore
- [ ] Starting capital is acceptable loss
- [ ] Leverage is set conservatively
- [ ] Phone alerts configured
- [ ] Emergency stop procedure tested

## Quick Commands Reference 📝

```bash
# Start in testnet
python main.py --testnet

# Start in simulation
python main.py --simulation

# Start without dashboard
python main.py --no-dashboard

# Custom config
python main.py --config my_config.json

# Debug mode
python main.py --log-level DEBUG

# Stop bot
Ctrl + C
```

---

**🎉 You're ready to start! Remember: Start small, test thoroughly, and scale gradually.**

**Questions? Check the full README.md or join our Discord community!**

*Good luck and happy trading! 🚀*
