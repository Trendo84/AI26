"""
Hyperliquid AI Trading Bot - Main Trading Engine
Implements AI-powered scalping strategy with multiple technical indicators
"""

import os
import json
import time
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
import numpy as np
import pandas as pd
from dataclasses import dataclass
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class TradeSignal:
    """Represents a trading signal"""
    action: str  # 'BUY', 'SELL', 'HOLD'
    confidence: float  # 0-1
    price: float
    size: float
    indicators: Dict
    timestamp: datetime
    

@dataclass
class Position:
    """Current trading position"""
    symbol: str
    side: str  # 'LONG' or 'SHORT'
    entry_price: float
    size: float
    leverage: int
    entry_time: datetime
    unrealized_pnl: float = 0.0
    

class TechnicalIndicators:
    """Calculate technical indicators for trading decisions"""
    
    @staticmethod
    def calculate_rsi(prices: np.ndarray, period: int = 14) -> float:
        """Calculate RSI indicator"""
        deltas = np.diff(prices)
        gain = np.where(deltas > 0, deltas, 0)
        loss = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gain[-period:]) if len(gain) >= period else 0
        avg_loss = np.mean(loss[-period:]) if len(loss) >= period else 0
        
        if avg_loss == 0:
            return 100
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    @staticmethod
    def calculate_ema(prices: np.ndarray, period: int) -> float:
        """Calculate EMA"""
        if len(prices) < period:
            return prices[-1]
        
        multiplier = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = (price - ema) * multiplier + ema
        
        return ema
    
    @staticmethod
    def calculate_bollinger_bands(prices: np.ndarray, period: int = 20, std_dev: float = 2.0):
        """Calculate Bollinger Bands"""
        if len(prices) < period:
            middle = np.mean(prices)
            std = np.std(prices)
        else:
            middle = np.mean(prices[-period:])
            std = np.std(prices[-period:])
        
        upper = middle + (std * std_dev)
        lower = middle - (std * std_dev)
        
        return upper, middle, lower
    
    @staticmethod
    def calculate_macd(prices: np.ndarray):
        """Calculate MACD"""
        ema_12 = TechnicalIndicators.calculate_ema(prices, 12)
        ema_26 = TechnicalIndicators.calculate_ema(prices, 26)
        macd_line = ema_12 - ema_26
        
        # Simple approximation of signal line
        signal_line = macd_line * 0.9
        histogram = macd_line - signal_line
        
        return macd_line, signal_line, histogram
    
    @staticmethod
    def calculate_stochastic(prices: np.ndarray, period: int = 14):
        """Calculate Stochastic Oscillator"""
        if len(prices) < period:
            return 50, 50
        
        recent_prices = prices[-period:]
        high = np.max(recent_prices)
        low = np.min(recent_prices)
        current = prices[-1]
        
        if high == low:
            k = 50
        else:
            k = 100 * (current - low) / (high - low)
        
        d = k * 0.9  # Simplified D line
        
        return k, d
    
    @staticmethod
    def calculate_atr(high: np.ndarray, low: np.ndarray, close: np.ndarray, period: int = 14) -> float:
        """Calculate Average True Range"""
        if len(close) < 2:
            return 0
        
        tr = np.maximum(
            high[-period:] - low[-period:],
            np.abs(high[-period:] - close[-period-1:-1])
        )
        tr = np.maximum(tr, np.abs(low[-period:] - close[-period-1:-1]))
        
        atr = np.mean(tr)
        return atr


class AITradingStrategy:
    """AI-powered trading strategy combining multiple indicators"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.indicators = TechnicalIndicators()
        self.trade_history = []
        self.consecutive_losses = 0
        
    def analyze_market(self, market_data: Dict) -> TradeSignal:
        """
        Analyze market data and generate trading signal
        Uses ensemble of technical indicators with AI-like weighting
        """
        prices = np.array(market_data.get('close', []))
        high = np.array(market_data.get('high', []))
        low = np.array(market_data.get('low', []))
        volume = np.array(market_data.get('volume', []))
        
        if len(prices) < 50:
            return TradeSignal('HOLD', 0.0, prices[-1], 0, {}, datetime.now())
        
        current_price = prices[-1]
        
        # Calculate all indicators
        rsi = self.indicators.calculate_rsi(prices)
        ema_9 = self.indicators.calculate_ema(prices, 9)
        ema_21 = self.indicators.calculate_ema(prices, 21)
        ema_50 = self.indicators.calculate_ema(prices, 50)
        upper_bb, middle_bb, lower_bb = self.indicators.calculate_bollinger_bands(prices)
        macd, signal, histogram = self.indicators.calculate_macd(prices)
        stoch_k, stoch_d = self.indicators.calculate_stochastic(prices)
        atr = self.indicators.calculate_atr(high, low, prices)
        
        # Volume analysis
        avg_volume = np.mean(volume[-20:]) if len(volume) >= 20 else np.mean(volume)
        volume_surge = volume[-1] > avg_volume * 1.5
        
        # Calculate price momentum
        price_change_1 = (prices[-1] - prices[-2]) / prices[-2] * 100 if len(prices) >= 2 else 0
        price_change_5 = (prices[-1] - prices[-6]) / prices[-6] * 100 if len(prices) >= 6 else 0
        
        # AI-weighted scoring system
        buy_score = 0
        sell_score = 0
        
        # RSI signals (25% weight)
        if rsi < 30:
            buy_score += 0.25
        elif rsi > 70:
            sell_score += 0.25
        elif rsi < 40:
            buy_score += 0.15
        elif rsi > 60:
            sell_score += 0.15
        
        # EMA trend signals (20% weight)
        if current_price > ema_9 > ema_21 > ema_50:
            buy_score += 0.20
        elif current_price < ema_9 < ema_21 < ema_50:
            sell_score += 0.20
        
        # Bollinger Bands (15% weight)
        if current_price <= lower_bb:
            buy_score += 0.15
        elif current_price >= upper_bb:
            sell_score += 0.15
        
        # MACD signals (15% weight)
        if macd > signal and histogram > 0:
            buy_score += 0.15
        elif macd < signal and histogram < 0:
            sell_score += 0.15
        
        # Stochastic signals (10% weight)
        if stoch_k < 20 and stoch_k > stoch_d:
            buy_score += 0.10
        elif stoch_k > 80 and stoch_k < stoch_d:
            sell_score += 0.10
        
        # Volume confirmation (10% weight)
        if volume_surge:
            if price_change_1 > 0:
                buy_score += 0.10
            else:
                sell_score += 0.10
        
        # Momentum signals (5% weight)
        if price_change_5 > 1.0:
            buy_score += 0.05
        elif price_change_5 < -1.0:
            sell_score += 0.05
        
        # Determine action based on scores
        confidence = max(buy_score, sell_score)
        threshold = self.config.get('signal_threshold', 0.65)
        
        # Anti-overtrading: require higher confidence after losses
        if self.consecutive_losses >= 2:
            threshold += 0.10
        
        action = 'HOLD'
        if buy_score > sell_score and buy_score >= threshold:
            action = 'BUY'
        elif sell_score > buy_score and sell_score >= threshold:
            action = 'SELL'
        
        # Calculate position size based on confidence and ATR
        base_size = self.config.get('base_position_size', 0.01)
        size = base_size * confidence * (1 if atr < np.mean([atr]) else 0.8)
        
        indicators_data = {
            'rsi': rsi,
            'ema_9': ema_9,
            'ema_21': ema_21,
            'ema_50': ema_50,
            'macd': macd,
            'signal': signal,
            'histogram': histogram,
            'upper_bb': upper_bb,
            'lower_bb': lower_bb,
            'stoch_k': stoch_k,
            'stoch_d': stoch_d,
            'atr': atr,
            'volume_surge': volume_surge,
            'buy_score': buy_score,
            'sell_score': sell_score
        }
        
        signal = TradeSignal(
            action=action,
            confidence=confidence,
            price=current_price,
            size=size,
            indicators=indicators_data,
            timestamp=datetime.now()
        )
        
        logger.info(f"Signal: {action} | Confidence: {confidence:.2%} | Price: ${current_price:.2f}")
        logger.info(f"Scores - Buy: {buy_score:.2f}, Sell: {sell_score:.2f}")
        
        return signal


class RiskManager:
    """Manages risk and position sizing"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.max_drawdown = config.get('max_drawdown_pct', 15)
        self.max_daily_trades = config.get('max_daily_trades', 50)
        self.max_position_size_pct = config.get('max_position_size_pct', 5)
        self.stop_loss_pct = config.get('stop_loss_pct', 2.0)
        self.take_profit_pct = config.get('take_profit_pct', 1.5)
        
        self.daily_trades = 0
        self.peak_balance = 0
        self.current_balance = 0
        
    def should_trade(self, account_balance: float) -> bool:
        """Check if we should execute a trade"""
        # Update balances
        self.current_balance = account_balance
        if account_balance > self.peak_balance:
            self.peak_balance = account_balance
        
        # Check daily trade limit
        if self.daily_trades >= self.max_daily_trades:
            logger.warning("Daily trade limit reached")
            return False
        
        # Check drawdown
        if self.peak_balance > 0:
            drawdown_pct = (self.peak_balance - account_balance) / self.peak_balance * 100
            if drawdown_pct >= self.max_drawdown:
                logger.error(f"Max drawdown reached: {drawdown_pct:.2f}%")
                return False
        
        return True
    
    def calculate_position_size(self, balance: float, leverage: int, confidence: float) -> float:
        """Calculate safe position size"""
        max_risk = balance * (self.max_position_size_pct / 100)
        position_size = max_risk * leverage * confidence
        return position_size
    
    def check_stop_loss(self, position: Position, current_price: float) -> bool:
        """Check if stop loss is hit"""
        if position.side == 'LONG':
            loss_pct = (position.entry_price - current_price) / position.entry_price * 100
        else:
            loss_pct = (current_price - position.entry_price) / position.entry_price * 100
        
        if loss_pct >= self.stop_loss_pct:
            logger.warning(f"Stop loss triggered: {loss_pct:.2f}%")
            return True
        return False
    
    def check_take_profit(self, position: Position, current_price: float) -> bool:
        """Check if take profit is hit"""
        if position.side == 'LONG':
            profit_pct = (current_price - position.entry_price) / position.entry_price * 100
        else:
            profit_pct = (position.entry_price - current_price) / position.entry_price * 100
        
        if profit_pct >= self.take_profit_pct:
            logger.info(f"Take profit triggered: {profit_pct:.2f}%")
            return True
        return False


class HyperliquidBot:
    """Main trading bot orchestrator"""
    
    def __init__(self, config_path: str = 'config.json'):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        self.strategy = AITradingStrategy(self.config['strategy'])
        self.risk_manager = RiskManager(self.config['risk'])
        self.current_position: Optional[Position] = None
        self.is_running = False
        
        # Initialize Hyperliquid connection
        self.api_key = os.getenv('HYPERLIQUID_API_KEY', '')
        self.private_key = os.getenv('HYPERLIQUID_PRIVATE_KEY', '')
        
        logger.info("Hyperliquid Bot initialized")
    
    async def fetch_market_data(self, symbol: str) -> Dict:
        """Fetch real-time market data from Hyperliquid"""
        # Placeholder - implement actual Hyperliquid API calls
        # This would use the hyperliquid-python-sdk
        logger.debug(f"Fetching market data for {symbol}")
        
        # Simulate market data for development
        return {
            'close': np.random.randn(100).cumsum() + 50000,
            'high': np.random.randn(100).cumsum() + 50100,
            'low': np.random.randn(100).cumsum() + 49900,
            'volume': np.random.rand(100) * 1000
        }
    
    async def execute_trade(self, signal: TradeSignal, symbol: str):
        """Execute a trade on Hyperliquid"""
        logger.info(f"Executing {signal.action} trade: {symbol}")
        
        # Check risk management
        account_balance = 100  # Placeholder - get from API
        if not self.risk_manager.should_trade(account_balance):
            return
        
        leverage = self.config['trading']['leverage']
        position_size = self.risk_manager.calculate_position_size(
            account_balance, leverage, signal.confidence
        )
        
        # Place order via Hyperliquid API
        # Placeholder for actual implementation
        logger.info(f"Order: {signal.action} {position_size:.4f} {symbol} @ ${signal.price:.2f}")
        
        # Update position
        if signal.action != 'HOLD':
            self.current_position = Position(
                symbol=symbol,
                side='LONG' if signal.action == 'BUY' else 'SHORT',
                entry_price=signal.price,
                size=position_size,
                leverage=leverage,
                entry_time=datetime.now()
            )
            self.risk_manager.daily_trades += 1
    
    async def monitor_position(self):
        """Monitor current position for stop loss / take profit"""
        if not self.current_position:
            return
        
        symbol = self.current_position.symbol
        market_data = await self.fetch_market_data(symbol)
        current_price = market_data['close'][-1]
        
        # Check exit conditions
        should_exit = False
        reason = ""
        
        if self.risk_manager.check_stop_loss(self.current_position, current_price):
            should_exit = True
            reason = "Stop Loss"
        elif self.risk_manager.check_take_profit(self.current_position, current_price):
            should_exit = True
            reason = "Take Profit"
        
        if should_exit:
            logger.info(f"Closing position: {reason}")
            # Execute close order via API
            self.current_position = None
    
    async def run(self):
        """Main bot loop"""
        self.is_running = True
        symbol = self.config['trading']['symbol']
        check_interval = self.config['trading']['check_interval_seconds']
        
        logger.info(f"Starting bot for {symbol}")
        
        while self.is_running:
            try:
                # Fetch market data
                market_data = await self.fetch_market_data(symbol)
                
                # Generate signal
                signal = self.strategy.analyze_market(market_data)
                
                # Execute trade if signal is strong
                if signal.action != 'HOLD' and not self.current_position:
                    await self.execute_trade(signal, symbol)
                
                # Monitor existing position
                await self.monitor_position()
                
                # Wait before next check
                await asyncio.sleep(check_interval)
                
            except Exception as e:
                logger.error(f"Error in bot loop: {e}")
                await asyncio.sleep(check_interval)
    
    def stop(self):
        """Stop the bot"""
        self.is_running = False
        logger.info("Bot stopped")


if __name__ == "__main__":
    bot = HyperliquidBot()
    asyncio.run(bot.run())
