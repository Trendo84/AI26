"""
WebSocket Server for Real-time Trading Dashboard Updates
Streams live trading data to the web interface
"""

import asyncio
import json
import websockets
from datetime import datetime
from typing import Set
import logging

logger = logging.getLogger(__name__)


class DashboardServer:
    """WebSocket server for streaming trading data to dashboard"""
    
    def __init__(self, trading_bot, host: str = 'localhost', port: int = 8765):
        self.bot = trading_bot
        self.host = host
        self.port = port
        self.clients: Set[websockets.WebSocketServerProtocol] = set()
        self.running = False
        
    async def register(self, websocket):
        """Register a new client"""
        self.clients.add(websocket)
        logger.info(f"Client connected. Total clients: {len(self.clients)}")
        
        # Send initial state
        await self.send_initial_state(websocket)
        
    async def unregister(self, websocket):
        """Unregister a client"""
        self.clients.remove(websocket)
        logger.info(f"Client disconnected. Total clients: {len(self.clients)}")
        
    async def send_initial_state(self, websocket):
        """Send initial bot state to newly connected client"""
        state = {
            'type': 'initial_state',
            'data': {
                'bot_status': 'active' if self.bot.is_running else 'stopped',
                'account_balance': 100.0,  # Get from bot
                'positions': [],
                'recent_trades': [],
                'config': self.bot.config
            },
            'timestamp': datetime.now().isoformat()
        }
        await websocket.send(json.dumps(state))
        
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        if self.clients:
            message_json = json.dumps(message)
            await asyncio.gather(
                *[client.send(message_json) for client in self.clients],
                return_exceptions=True
            )
            
    async def send_trade_signal(self, signal):
        """Broadcast new trading signal"""
        message = {
            'type': 'signal',
            'data': {
                'action': signal.action,
                'symbol': 'BTC-USD',  # Get from signal
                'price': signal.price,
                'confidence': signal.confidence,
                'indicators': signal.indicators,
                'timestamp': signal.timestamp.isoformat()
            }
        }
        await self.broadcast(message)
        
    async def send_position_update(self, position):
        """Broadcast position update"""
        message = {
            'type': 'position_update',
            'data': {
                'symbol': position.symbol,
                'side': position.side,
                'entry_price': position.entry_price,
                'current_price': position.entry_price,  # Update with actual
                'size': position.size,
                'leverage': position.leverage,
                'unrealized_pnl': position.unrealized_pnl,
                'timestamp': datetime.now().isoformat()
            }
        }
        await self.broadcast(message)
        
    async def send_trade_executed(self, trade_info):
        """Broadcast trade execution"""
        message = {
            'type': 'trade_executed',
            'data': trade_info
        }
        await self.broadcast(message)
        
    async def send_account_update(self, balance, pnl):
        """Broadcast account balance update"""
        message = {
            'type': 'account_update',
            'data': {
                'balance': balance,
                'total_pnl': pnl,
                'timestamp': datetime.now().isoformat()
            }
        }
        await self.broadcast(message)
        
    async def send_market_data(self, symbol, data):
        """Broadcast market data update"""
        message = {
            'type': 'market_data',
            'data': {
                'symbol': symbol,
                'price': data['close'][-1] if len(data['close']) > 0 else 0,
                'volume': data['volume'][-1] if len(data['volume']) > 0 else 0,
                'timestamp': datetime.now().isoformat()
            }
        }
        await self.broadcast(message)
        
    async def handle_client_message(self, websocket, message):
        """Handle incoming messages from clients"""
        try:
            data = json.loads(message)
            msg_type = data.get('type')
            
            if msg_type == 'start_bot':
                # Start trading bot
                logger.info("Client requested bot start")
                # self.bot.start()
                await websocket.send(json.dumps({
                    'type': 'bot_status',
                    'data': {'status': 'started'}
                }))
                
            elif msg_type == 'stop_bot':
                # Stop trading bot
                logger.info("Client requested bot stop")
                # self.bot.stop()
                await websocket.send(json.dumps({
                    'type': 'bot_status',
                    'data': {'status': 'stopped'}
                }))
                
            elif msg_type == 'update_config':
                # Update bot configuration
                config_updates = data.get('config', {})
                logger.info(f"Client requested config update: {config_updates}")
                # Update bot config
                await websocket.send(json.dumps({
                    'type': 'config_updated',
                    'data': {'success': True}
                }))
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {message}")
        except Exception as e:
            logger.error(f"Error handling client message: {e}")
            
    async def handler(self, websocket, path):
        """Handle WebSocket connections"""
        await self.register(websocket)
        try:
            async for message in websocket:
                await self.handle_client_message(websocket, message)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)
            
    async def start(self):
        """Start the WebSocket server"""
        self.running = True
        logger.info(f"Starting WebSocket server on {self.host}:{self.port}")
        
        async with websockets.serve(self.handler, self.host, self.port):
            await asyncio.Future()  # Run forever
            
    async def periodic_updates(self):
        """Send periodic updates to all clients"""
        while self.running:
            try:
                # Send periodic heartbeat and status updates
                if self.clients:
                    await self.broadcast({
                        'type': 'heartbeat',
                        'timestamp': datetime.now().isoformat()
                    })
                    
                await asyncio.sleep(30)  # Update every 30 seconds
                
            except Exception as e:
                logger.error(f"Error in periodic updates: {e}")
                await asyncio.sleep(30)


async def run_dashboard_server(bot):
    """Run the dashboard server"""
    server = DashboardServer(bot)
    
    # Run server and periodic updates concurrently
    await asyncio.gather(
        server.start(),
        server.periodic_updates()
    )


if __name__ == "__main__":
    from trading_bot import HyperliquidBot
    
    bot = HyperliquidBot()
    asyncio.run(run_dashboard_server(bot))
