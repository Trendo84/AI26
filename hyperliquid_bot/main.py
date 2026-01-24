#!/usr/bin/env python3
"""
Main Entry Point for Hyperliquid AI Trading Bot
Starts both the trading bot and dashboard server
"""

import asyncio
import argparse
import logging
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from trading_bot import HyperliquidBot
from dashboard_server import DashboardServer
from hyperliquid_api import HyperliquidAPI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('trading_bot.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


def print_banner():
    """Print startup banner"""
    banner = """
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   ⚡ HYPERLIQUID AI TRADING BOT                          ║
    ║                                                           ║
    ║   AI-Powered Scalping Engine with Real-Time Dashboard    ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    
    🤖 Status: Initializing...
    📊 Loading configuration...
    🔗 Connecting to Hyperliquid...
    """
    print(banner)


def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Hyperliquid AI Trading Bot',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run in testnet mode (recommended for testing)
  python main.py --testnet
  
  # Run with custom config
  python main.py --config my_config.json
  
  # Run in simulation mode (no real trades)
  python main.py --simulation
  
  # Run with custom dashboard port
  python main.py --port 9000
        """
    )
    
    parser.add_argument(
        '--testnet',
        action='store_true',
        help='Use Hyperliquid testnet instead of mainnet'
    )
    
    parser.add_argument(
        '--simulation',
        action='store_true',
        help='Run in simulation mode (no real trades)'
    )
    
    parser.add_argument(
        '--config',
        type=str,
        default='config.json',
        help='Path to configuration file (default: config.json)'
    )
    
    parser.add_argument(
        '--port',
        type=int,
        default=8765,
        help='WebSocket server port (default: 8765)'
    )
    
    parser.add_argument(
        '--host',
        type=str,
        default='localhost',
        help='WebSocket server host (default: localhost)'
    )
    
    parser.add_argument(
        '--no-dashboard',
        action='store_true',
        help='Run bot without dashboard server'
    )
    
    parser.add_argument(
        '--log-level',
        type=str,
        choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
        default='INFO',
        help='Logging level (default: INFO)'
    )
    
    return parser.parse_args()


async def run_bot_only(bot):
    """Run trading bot without dashboard"""
    logger.info("Starting trading bot (no dashboard)...")
    try:
        await bot.run()
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
        bot.stop()
    except Exception as e:
        logger.error(f"Fatal error in bot: {e}")
        raise


async def run_bot_with_dashboard(bot, args):
    """Run trading bot with dashboard server"""
    logger.info("Starting trading bot with dashboard...")
    
    # Create dashboard server
    dashboard = DashboardServer(bot, host=args.host, port=args.port)
    
    logger.info(f"Dashboard server starting on {args.host}:{args.port}")
    logger.info(f"Open dashboard.html in your browser to view")
    
    try:
        # Run bot and dashboard concurrently
        await asyncio.gather(
            bot.run(),
            dashboard.start(),
            dashboard.periodic_updates()
        )
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
        bot.stop()
        dashboard.running = False
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        raise


def verify_setup(args):
    """Verify setup and configuration"""
    issues = []
    
    # Check if config file exists
    config_path = Path(args.config)
    if not config_path.exists():
        issues.append(f"Config file not found: {args.config}")
    
    # Check if .env file exists (for production)
    if not args.simulation and not args.testnet:
        env_path = Path('.env')
        if not env_path.exists():
            issues.append("No .env file found. Create one from .env.example")
    
    # Check dashboard HTML exists
    dashboard_path = Path('dashboard.html')
    if not args.no_dashboard and not dashboard_path.exists():
        issues.append("dashboard.html not found")
    
    if issues:
        logger.error("Setup verification failed:")
        for issue in issues:
            logger.error(f"  ❌ {issue}")
        return False
    
    logger.info("✅ Setup verification passed")
    return True


def print_startup_info(args, bot):
    """Print startup information"""
    mode = "SIMULATION" if args.simulation else ("TESTNET" if args.testnet else "LIVE")
    
    info = f"""
    ╔═══════════════════════════════════════════════════════════╗
    ║ Bot Configuration                                         ║
    ╠═══════════════════════════════════════════════════════════╣
    ║ Mode:              {mode:40} ║
    ║ Trading Pair:      {bot.config['trading']['symbol']:40} ║
    ║ Leverage:          {bot.config['trading']['leverage']:2}x{' ' * 38}║
    ║ Signal Threshold:  {bot.config['strategy']['signal_threshold']:.0%}{' ' * 38}║
    ║ Stop Loss:         {bot.config['risk']['stop_loss_pct']:.1%}{' ' * 38}║
    ║ Take Profit:       {bot.config['risk']['take_profit_pct']:.1%}{' ' * 38}║
    ║ Max Drawdown:      {bot.config['risk']['max_drawdown_pct']:.0%}{' ' * 38}║
    ║ Dashboard:         {'Enabled' if not args.no_dashboard else 'Disabled':40} ║
    """
    
    if not args.no_dashboard:
        info += f"║ Dashboard URL:     http://{args.host}:{args.port}{' ' * 20}║\n"
    
    info += """╚═══════════════════════════════════════════════════════════╝
    """
    
    print(info)
    
    if not args.simulation and not args.testnet:
        print("""
    ⚠️  WARNING: LIVE TRADING MODE ⚠️
    
    You are about to start live trading with real money!
    
    - Ensure your stop loss is properly configured
    - Start with small position sizes
    - Monitor the bot actively for the first few hours
    - Be prepared to manually intervene if needed
    
    Press Ctrl+C at any time to stop the bot.
        """)
        
        response = input("Type 'YES' to confirm and start live trading: ")
        if response != 'YES':
            logger.info("Live trading cancelled by user")
            sys.exit(0)
    
    logger.info("🚀 Bot starting in 3 seconds...")
    import time
    time.sleep(3)


async def main():
    """Main entry point"""
    # Parse arguments
    args = parse_arguments()
    
    # Set logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    # Print banner
    print_banner()
    
    # Verify setup
    if not verify_setup(args):
        sys.exit(1)
    
    try:
        # Initialize bot
        logger.info("Initializing trading bot...")
        bot = HyperliquidBot(config_path=args.config)
        
        # Override settings based on args
        if args.simulation:
            logger.info("Running in SIMULATION mode - no real trades will be executed")
            bot.config['api']['testnet'] = True
        elif args.testnet:
            logger.info("Running in TESTNET mode")
            bot.config['api']['testnet'] = True
        
        # Print startup info
        print_startup_info(args, bot)
        
        # Run bot
        if args.no_dashboard:
            await run_bot_only(bot)
        else:
            await run_bot_with_dashboard(bot, args)
            
    except KeyboardInterrupt:
        logger.info("\n👋 Shutting down gracefully...")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
    
    logger.info("✅ Bot stopped successfully")


if __name__ == "__main__":
    # Run the async main function
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)
