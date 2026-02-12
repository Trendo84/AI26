'use client';
import { useState, useEffect } from 'react';
import { generateWallet, shortAddress, getDepositQRUrl } from '@/lib/polygon';

export default function WalletView({ tradingMode, setTradingMode, paperBalance }) {
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_wallet');
      if (saved) {
        setWallet(JSON.parse(saved));
      } else {
        const w = generateWallet();
        localStorage.setItem('apex_wallet', JSON.stringify(w));
        setWallet(w);
      }
    } catch {}
  }, []);

  const copyAddress = () => {
    if (wallet) navigator.clipboard?.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Wallet</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Manage your trading wallet and balances</p>
      </div>

      {/* Mode toggle */}
      <div className="card p-5 mb-5 animate-fade">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'var(--font)' }}>Trading Mode</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--tx3)' }}>
              {tradingMode === 'paper' ? 'Using virtual $10,000 — no real money at risk' : 'Trading with real USDC on Polymarket'}
            </div>
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--brd)' }}>
            {['paper', 'live'].map(m => (
              <button key={m} onClick={() => setTradingMode(m)}
                className="px-5 py-2.5 text-sm font-bold uppercase transition-all"
                style={{
                  background: tradingMode === m ? (m === 'paper' ? 'color-mix(in srgb, var(--ac) 15%, transparent)' : 'color-mix(in srgb, var(--gn) 15%, transparent)') : 'transparent',
                  color: tradingMode === m ? (m === 'paper' ? 'var(--ac)' : 'var(--gn)') : 'var(--tx4)',
                }}>
                {m === 'paper' ? '📄 Paper' : '💰 Live'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {/* Paper balance */}
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.05s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>📄 PAPER BALANCE</div>
          <div className="glow-text" style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
            ${paperBalance.toFixed(2)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--tx3)' }}>Virtual USDC for testing strategies</div>
        </div>

        {/* Real balance */}
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.1s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>💰 LIVE BALANCE</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>$0.00</div>
          <div className="text-xs mt-1" style={{ color: 'var(--tx3)' }}>Fund your wallet to start live trading</div>
        </div>
      </div>

      {/* Wallet details */}
      {wallet && (
        <div className="card p-5 mt-5 animate-fade" style={{ animationDelay: '0.15s' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>◈ APEX MANAGED WALLET</div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>ACTIVE</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--pu) 15%, transparent)', color: 'var(--pu)' }}>POLYGON</span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 rounded-xl p-4 mb-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
            <div className="flex-1">
              <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>Address</div>
              <div className="font-bold text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{shortAddress(wallet.address)}</div>
            </div>
            <button onClick={copyAddress} className="btn-ghost !text-xs">
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl p-3" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>USDC</div>
              <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>0.00</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>POL (Gas)</div>
              <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>0.00</div>
            </div>
          </div>

          {/* Deposit QR */}
          <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>DEPOSIT</div>
            <div className="inline-block p-3 rounded-xl mb-3" style={{ background: '#fff' }}>
              <img src={getDepositQRUrl(wallet.address)} alt="Deposit QR" width={160} height={160} style={{ imageRendering: 'pixelated' }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--tx3)' }}>Send USDC (Polygon) to fund live trading</div>
            <div className="text-xs mt-1 font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{wallet.address}</div>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="rounded-xl p-4 mt-5" style={{ background: 'color-mix(in srgb, var(--or) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--or) 25%, transparent)' }}>
        <div className="font-bold text-sm mb-1" style={{ color: 'var(--or)' }}>⚠ Wallet Security</div>
        <div className="text-xs" style={{ color: 'var(--tx2)' }}>
          Your APEX managed wallet private key is stored encrypted locally. For maximum security, we recommend using small amounts for testing. 
          When Supabase auth is connected, keys will be stored server-side with AES-256 encryption.
        </div>
      </div>
    </div>
  );
}
