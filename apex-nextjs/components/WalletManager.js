// components/WalletManager.js - Full wallet management with manual generation
'use client';
import { useState, useEffect } from 'react';
import { generateWallet, encryptPrivateKey, decryptPrivateKey, getBalances, shortAddress, getDepositQRUrl, exportWallet, verifyWallet } from '@/lib/polygon';

export default function WalletManager({ tradingMode, setTradingMode, paperBalance }) {
  const [wallet, setWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [password, setPassword] = useState('');
  const [exportData, setExportData] = useState(null);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [balances, setBalances] = useState({ usdc: 0, pol: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('apex_wallet');
    if (saved) {
      try {
        setWallet(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (wallet?.address) {
      getBalances(wallet.address).then(setBalances);
    }
  }, [wallet]);

  const generateNewWallet = () => {
    if (!confirm('Generate new wallet? Save your current private key first if you have funds!')) return;
    
    const w = generateWallet();
    localStorage.setItem('apex_wallet', JSON.stringify(w));
    setWallet(w);
    setExportData(null);
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyPrivateKey = () => {
    if (exportData?.privateKey) {
      navigator.clipboard.writeText(exportData.privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    if (!password) {
      alert('Please enter a password to encrypt your private key');
      return;
    }
    
    const encrypted = encryptPrivateKey(wallet.privateKey, password);
    const result = exportWallet(encrypted, password);
    
    if (result.success) {
      setExportData(result);
    } else {
      alert('Export failed: ' + result.error);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAddress || !withdrawAmount) {
      alert('Please enter withdrawal address and amount');
      return;
    }
    
    if (!withdrawAddress.startsWith('0x') || withdrawAddress.length !== 42) {
      alert('Invalid Polygon address');
      return;
    }
    
    alert(`Withdrawal initiated:\nTo: ${shortAddress(withdrawAddress)}\nAmount: $${withdrawAmount} USDC\n\nNote: Real withdrawal requires blockchain transaction signing.`);
  };

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="card p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-sm">Trading Mode</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--tx3)' }}>
              {tradingMode === 'paper' ? 'Virtual money for testing' : 'Real USDC on Polygon'}
            </div>
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--brd)' }}>
            {['paper', 'live'].map(m => (
              <button key={m} onClick={() => setTradingMode(m)}
                className="px-4 py-2 text-sm font-bold uppercase transition-all"
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

      {/* Balances */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card p-5">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)' }}>📄 PAPER BALANCE</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
            ${paperBalance?.toFixed(2) || '0.00'}
          </div>
        </div>
        
        <div className="card p-5">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)' }}>💰 LIVE BALANCE</div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>
            ${balances.usdc.toFixed(2)}
          </div>
          <div className="text-xs" style={{ color: 'var(--tx3)' }}>{balances.pol.toFixed(4)} POL</div>
        </div>
      </div>

      {/* Wallet Section */}
      {!wallet ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">👛</div>
          <div className="font-bold text-lg mb-2">No Wallet</div>
          <div className="text-sm mb-4" style={{ color: 'var(--tx3)' }}>Generate a wallet to start live trading</div>
          <button onClick={generateNewWallet} className="btn-primary px-6 py-3">
            Generate Wallet
          </button>
        </div>
      ) : (
        <>
          {/* Wallet Details */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>◈ YOUR WALLET</div>
              <div className="flex gap-2">
                <button onClick={copyAddress} className="btn-ghost !text-xs">
                  {copied ? '✓ Copied' : '📋 Copy Address'}
                </button>
                <button onClick={generateNewWallet} className="btn-ghost !text-xs text-red-400">
                  🔄 New
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>Address</div>
              <div className="font-bold text-sm break-all" style={{ fontFamily: 'var(--mono)' }}>{wallet.address}</div>
            </div>

            {/* QR Code */}
            <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--tx3)' }}>DEPOSIT QR</div>
              <div className="inline-block p-3 rounded-xl bg-white">
                <img src={getDepositQRUrl(wallet.address)} alt="QR" width={160} height={160} />
              </div>
              <div className="text-xs mt-3" style={{ color: 'var(--tx3)' }}>Send USDC (Polygon network only)</div>
            </div>
          </div>

          {/* Export / Withdraw Section */}
          <div className="card p-5">
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>🔐 EXPORT / WITHDRAW</div>
            
            {/* Export Private Key */}
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-sm font-bold mb-2">Export Private Key</div>
              <div className="text-xs mb-2" style={{ color: 'var(--tx3)' }}>Save this to access your wallet in MetaMask</div>
              
              {!exportData ? (
                <>
                  <input
                    type="password"
                    placeholder="Set encryption password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-2 p-2 rounded text-sm"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)' }}
                  />
                  <button onClick={handleExport} className="btn-ghost !text-xs w-full">
                    🔓 Reveal Private Key
                  </button>
                </>
              ) : (
                <div className="p-3 rounded" style={{ background: 'color-mix(in srgb, var(--rd) 10%, transparent)', border: '1px solid var(--rd)' }}>
                  <div className="text-xs font-bold mb-1" style={{ color: 'var(--rd)' }}>⚠️ NEVER SHARE THIS</div>
                  <div className="text-xs break-all font-mono mb-2" style={{ color: 'var(--tx)' }}>{exportData.privateKey}</div>
                  <button onClick={copyPrivateKey} className="btn-ghost !text-xs w-full">
                    {copied ? '✓ Copied!' : '📋 Copy Private Key'}
                  </button>
                </div>
              )}
            </div>

            {/* Withdraw */}
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-sm font-bold mb-2">Withdraw USDC</div>
              <input
                type="text"
                placeholder="Destination address (0x...)"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="w-full mb-2 p-2 rounded text-sm"
                style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)' }}
              />
              <input
                type="number"
                placeholder="Amount (USDC)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full mb-2 p-2 rounded text-sm"
                style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)' }}
              />
              <button onClick={handleWithdraw} className="btn-primary !text-xs w-full">
                🚀 Withdraw
              </button>
            </div>
          </div>

          {/* Security Warning */}
          <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--or) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--or) 25%, transparent)' }}>
            <div className="font-bold text-sm mb-1" style={{ color: 'var(--or)' }}>⚠️ Security</div>
            <div className="text-xs" style={{ color: 'var(--tx2)' }}>
              • Never share your private key with anyone<br/>
              • Save your private key in a secure password manager<br/>
              • APEX cannot recover lost private keys<br/>
              • Start with small amounts for testing
            </div>
          </div>
        </>
      )}
    </div>
  );
}
