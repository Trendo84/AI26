'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import MatrixRain from '@/components/MatrixRain';
import DiscoverView from '@/components/DiscoverView';
import AgentView from '@/components/AgentView';
import PortfolioView from '@/components/PortfolioView';
import { WatchlistView, PointsView } from '@/components/OtherViews';
import WalletManager from '@/components/WalletManager';
import HealthView from '@/components/HealthView';
import TradeModal from '@/components/TradeModal';

const sideNav = [
  { items: [
    { id: 'discover', icon: '◎', label: 'Discover' },
    { id: 'agent', icon: '🤖', label: 'OpenClaw' },
    { id: 'portfolio', icon: '📊', label: 'Portfolio' },
    { id: 'watchlist', icon: '👁', label: 'Watchlist' },
  ]},
  { items: [
    { id: 'wallet', icon: '💳', label: 'Wallet' },
    { id: 'points', icon: '◈', label: 'Points' },
    { id: 'health', icon: '🩺', label: 'Health' },
  ]},
  { items: [
    { id: 'alpha', icon: '⚡', label: 'Alpha' },
  ]},
];

const viewMap = { discover: DiscoverView, agent: AgentView, portfolio: PortfolioView, watchlist: WatchlistView, points: PointsView, wallet: WalletManager, health: HealthView, alpha: DiscoverView };

export default function Home() {
  const { theme } = useTheme();
  const [view, setView] = useState('discover');
  const [clock, setClock] = useState('');
  const [tradeMarket, setTradeMarket] = useState(null);
  const [paperBalance, setPaperBalance] = useState(10000);
  const [tradingMode, setTradingMode] = useState('paper');
  const [trades, setTrades] = useState([]);
  const isMatrix = theme === 'matrix';
  const isCyber = theme === 'cyberpunk';

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-AU', { hour12: false }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Load state from localStorage
  useEffect(() => {
    try {
      const b = localStorage.getItem('apex_paper_balance');
      if (b) setPaperBalance(parseFloat(b));
      const t = localStorage.getItem('apex_trades');
      if (t) setTrades(JSON.parse(t));
      const m = localStorage.getItem('apex_mode');
      if (m) setTradingMode(m);
    } catch {}
  }, []);

  const persist = useCallback((newTrades, newBal) => {
    setTrades(newTrades);
    setPaperBalance(newBal);
    try {
      localStorage.setItem('apex_trades', JSON.stringify(newTrades));
      localStorage.setItem('apex_paper_balance', String(newBal));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('apex_mode', tradingMode); } catch {}
  }, [tradingMode]);

  const handleTrade = useCallback(async ({ marketId, marketQuestion, marketCategory, side, amount, price }) => {
    const trade = {
      id: Date.now().toString(),
      marketId, marketQuestion, marketCategory, side,
      action: 'BUY', amount, price,
  
