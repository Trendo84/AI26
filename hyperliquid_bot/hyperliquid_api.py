"""
Hyperliquid API Integration Module
Handles all API calls to Hyperliquid exchange
"""

import os
import time
import hmac
import hashlib
import json
from typing import Dict, List, Optional
from datetime import datetime
import requests
import logging

logger = logging.getLogger(__name__)


class HyperliquidAPI:
    """
    Hyperliquid API client for trading operations
    
    IMPORTANT: For production use, you need to:
    1. Install the official SDK: pip install hyperliquid-python-sdk
    2. Generate API keys from https://app.hyperliquid.xyz/API
    3. Set environment variables: HYPERLIQUID_API_KEY and HYPERLIQUID_PRIVATE_KEY
    
    This is a simplified implementation for demonstration.
    For actual trading, use the official hyperliquid-python-sdk.
    """
    
    def __init__(self, api_url: str, testnet: bool = False):
        self.api_url = api_url
        self.testnet = testnet
        self.api_key = os.getenv('HYPERLIQUID_API_KEY', '')
        self.private_key = os.getenv('HYPERLIQUID_PRIVATE_KEY', '')
        
        if not self.api_key or not self.private_key:
            logger.warning("API credentials not set. Running in simulation mode.")
            self.simulation_mode = True
        else:
            self.simulation_mode = False
            
    def _sign_request(self, params: Dict) -> str:
        """Sign API request with private key"""
        message = json.dumps(params, separators=(',', ':'))
        signature = hmac.new(
            self.private_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def get_user_state(self, address: str) -> Dict:
        """
        Get user account state including positions and balances
        
        Returns:
            Dict with account information
        """
        if self.simulation_mode:
            logger.debug("Simulation mode: Returning mock user state")
            return {
                'assetPositions': [],
                'crossMarginSummary': {
                    'accountValue': '100.0',
                    'totalMarginUsed': '0.0',
                    'totalNtlPos': '0.0',
                    'totalRawUsd': '100.0'
                },
                'marginSummary': {
                    'accountValue': '100.0',
                    'totalMarginUsed': '0.0',
                    'totalNtlPos': '0.0',
                    'totalRawUsd': '100.0'
                },
                'time': int(time.time() * 1000)
            }
        
        endpoint = f"{self.api_url}/info"
        payload = {
            'type': 'clearinghouseState',
            'user': address
        }
        
        try:
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching user state: {e}")
            return {}
    
    def get_market_data(self, symbol: str, interval: str = '1m', limit: int = 100) -> Dict:
        """
        Get OHLCV market data for a symbol
        
        Args:
            symbol: Trading pair (e.g., 'BTC-USD')
            interval: Candle interval (1m, 5m, 15m, 1h, etc.)
            limit: Number of candles to fetch
            
        Returns:
            Dict with OHLCV data
        """
        if self.simulation_mode:
            logger.debug(f"Simulation mode: Generating mock market data for {symbol}")
            import numpy as np
            
            # Generate realistic-looking mock data
            base_price = 50000 if 'BTC' in symbol else 2500
            prices = []
            current = base_price
            
            for _ in range(limit):
                change = np.random.randn() * (base_price * 0.001)
                current += change
                open_price = current
                high_price = current + abs(np.random.randn() * (base_price * 0.002))
                low_price = current - abs(np.random.randn() * (base_price * 0.002))
                close_price = current + np.random.randn() * (base_price * 0.001)
                volume = np.random.rand() * 1000
                
                prices.append({
                    'time': int(time.time() - (limit - len(prices)) * 60),
                    'open': open_price,
                    'high': high_price,
                    'low': low_price,
                    'close': close_price,
                    'volume': volume
                })
                current = close_price
            
            return {
                'close': [p['close'] for p in prices],
                'high': [p['high'] for p in prices],
                'low': [p['low'] for p in prices],
                'open': [p['open'] for p in prices],
                'volume': [p['volume'] for p in prices],
                'time': [p['time'] for p in prices]
            }
        
        # Real API implementation would go here
        endpoint = f"{self.api_url}/info"
        payload = {
            'type': 'candleSnapshot',
            'req': {
                'coin': symbol.split('-')[0],
                'interval': interval,
                'startTime': int(time.time() * 1000) - (limit * 60000),
                'endTime': int(time.time() * 1000)
            }
        }
        
        try:
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Transform to our format
            return {
                'close': [c['c'] for c in data],
                'high': [c['h'] for c in data],
                'low': [c['l'] for c in data],
                'open': [c['o'] for c in data],
                'volume': [c['v'] for c in data],
                'time': [c['t'] for c in data]
            }
        except Exception as e:
            logger.error(f"Error fetching market data: {e}")
            return {}
    
    def get_current_price(self, symbol: str) -> float:
        """Get current market price for a symbol"""
        if self.simulation_mode:
            base_price = 50000 if 'BTC' in symbol else 2500
            import random
            return base_price + random.uniform(-100, 100)
        
        endpoint = f"{self.api_url}/info"
        payload = {
            'type': 'allMids'
        }
        
        try:
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            data = response.json()
            
            coin = symbol.split('-')[0]
            return float(data.get(coin, 0))
        except Exception as e:
            logger.error(f"Error fetching price: {e}")
            return 0.0
    
    def place_order(
        self,
        symbol: str,
        side: str,
        size: float,
        price: Optional[float] = None,
        order_type: str = 'market',
        leverage: int = 1,
        reduce_only: bool = False
    ) -> Dict:
        """
        Place an order on Hyperliquid
        
        Args:
            symbol: Trading pair
            side: 'buy' or 'sell'
            size: Order size in base currency
            price: Limit price (None for market orders)
            order_type: 'market' or 'limit'
            leverage: Leverage multiplier
            reduce_only: If True, order can only reduce position
            
        Returns:
            Order response dict
        """
        if self.simulation_mode:
            logger.info(f"[SIMULATION] Placing {side.upper()} order: {size} {symbol} @ {price or 'MARKET'}")
            return {
                'status': 'ok',
                'response': {
                    'type': 'order',
                    'data': {
                        'statuses': [{'filled': {'totalSz': str(size)}}]
                    }
                },
                'simulation': True
            }
        
        # Real implementation using hyperliquid-python-sdk
        # This is a simplified example
        endpoint = f"{self.api_url}/exchange"
        
        order_request = {
            'coin': symbol.split('-')[0],
            'is_buy': side.lower() == 'buy',
            'sz': str(size),
            'limit_px': str(price) if price else '0',
            'order_type': {'limit' if order_type == 'limit' else 'market': {}},
            'reduce_only': reduce_only
        }
        
        payload = {
            'type': 'order',
            'orders': [order_request],
            'grouping': 'na'
        }
        
        # Sign the request
        signature = self._sign_request(payload)
        
        headers = {
            'X-API-Key': self.api_key,
            'X-Signature': signature
        }
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error placing order: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def cancel_order(self, order_id: str, symbol: str) -> Dict:
        """Cancel an open order"""
        if self.simulation_mode:
            logger.info(f"[SIMULATION] Cancelling order {order_id}")
            return {'status': 'ok', 'simulation': True}
        
        endpoint = f"{self.api_url}/exchange"
        payload = {
            'type': 'cancel',
            'cancels': [{
                'coin': symbol.split('-')[0],
                'o': order_id
            }]
        }
        
        signature = self._sign_request(payload)
        headers = {
            'X-API-Key': self.api_key,
            'X-Signature': signature
        }
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error cancelling order: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def get_open_orders(self, address: str) -> List[Dict]:
        """Get all open orders for an address"""
        if self.simulation_mode:
            return []
        
        endpoint = f"{self.api_url}/info"
        payload = {
            'type': 'openOrders',
            'user': address
        }
        
        try:
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching open orders: {e}")
            return []
    
    def close_position(self, symbol: str, size: float) -> Dict:
        """Close a position by placing an opposite order"""
        # Get current position to determine side
        if self.simulation_mode:
            logger.info(f"[SIMULATION] Closing position: {size} {symbol}")
            return {'status': 'ok', 'simulation': True}
        
        # Implementation would check current position and place opposite order
        # This is simplified
        return self.place_order(
            symbol=symbol,
            side='sell',  # Determine actual side from position
            size=size,
            reduce_only=True
        )


# Example usage for testing
if __name__ == "__main__":
    # Initialize API client
    api = HyperliquidAPI(
        api_url="https://api.hyperliquid.xyz",
        testnet=False
    )
    
    # Get market data
    market_data = api.get_market_data('BTC-USD', interval='1m', limit=100)
    print(f"Fetched {len(market_data['close'])} candles")
    
    # Get current price
    price = api.get_current_price('BTC-USD')
    print(f"Current BTC price: ${price}")
    
    # Place a test order (simulation mode)
    order = api.place_order(
        symbol='BTC-USD',
        side='buy',
        size=0.001,
        order_type='market'
    )
    print(f"Order result: {order}")
