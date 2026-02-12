'use client';
import { useState, useEffect } from 'react';
import { generateWallet, shortAddress, getDepositQRUrl } from '@/lib/polygon';

export default function WalletView({ tradingMode, setTradingMode, paperBalance }) {
  var _w = useState(null);
  var wallet = _w[0], setWallet = _w[1];
  var _s = useState(false);
  var showBackup = _s[0], setShowBackup = _s[1];
  var _c = useState(false);
  var copied = _c[0], setCopied = _c[1];
  var _ck = useState(false);
  var keySaved = _ck[0], setKeySaved = _ck[1];
  var _pk = useState(false);
  var showKey = _pk[0], setShowKey = _pk[1];
  var _cp2 = useState('');
  var copiedField = _cp2[0], setCopiedField = _cp2[1];

  useEffect(function() {
    try {
      var saved = localStorage.getItem('apex_wallet');
      if (saved) setWallet(JSON.parse(saved));
    } catch(e) { /* no wallet yet */ }
  }, []);

  function handleGenerate() {
    var w = generateWallet();
    setWallet(w);
    setShowBackup(true);
    setKeySaved(false);
    setShowKey(false);
  }

  function handleBackupComplete() {
    if (!keySaved) return;
    try { localStorage.setItem('apex_wallet', JSON.stringify(wallet)); } catch(e) {}
    setShowBackup(false);
  }

  function copyText(text, field) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(function() { setCopiedField(''); }, 2000);
  }

  function copyAddress() {
    if (wallet) copyText(wallet.address, 'addr');
  }

  // ─── Key Backup Modal ───
  if (showBackup && wallet) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }} />
        <div className="card relative w-full max-w-lg p-7 z-10 animate-fade" style={{ background: 'var(--bg2)', border: '2px solid var(--rd)' }}>
          
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-lg font-bold" style={{ color: 'var(--rd)' }}>CRITICAL: SAVE THESE KEYS NOW</div>
            <div className="text-sm mt-2" style={{ color: 'var(--tx2)' }}>
              APEX cannot recover lost private keys. If you lose them, your funds are gone forever.
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)' }}>YOUR WALLET ADDRESS</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 text-sm font-bold break-all" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{wallet.address}</div>
              <button onClick={function() { copyText(wallet.address, 'addr'); }} className="btn-ghost !text-xs shrink-0">
                {copiedField === 'addr' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* Private Key */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'color-mix(in srgb, var(--rd) 5%, var(--bg3))', border: '1px solid color-mix(in srgb, var(--rd) 25%, var(--brd))' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--rd)' }}>YOUR PRIVATE KEY (NEVER SHARE)</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 text-sm font-bold break-all" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>
                {showKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={function() { setShowKey(!showKey); }} className="btn-ghost !text-xs">
                  {showKey ? '🙈 Hide' : '👁 Reveal'}
                </button>
                <button onClick={function() { copyText(wallet.privateKey, 'pk'); }} className="btn-ghost !text-xs">
                  {copiedField === 'pk' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-3 mb-5 cursor-pointer p-3 rounded-xl transition-all" style={{
            background: keySaved ? 'color-mix(in srgb, var(--gn) 8%, transparent)' : 'transparent',
            border: '1px solid ' + (keySaved ? 'color-mix(in srgb, var(--gn) 30%, transparent)' : 'var(--brd)'),
          }}>
            <input type="checkbox" checked={keySaved} onChange={function(e) { setKeySaved(e.target.checked); }}
              className="w-5 h-5 rounded" style={{ accentColor: 'var(--gn)' }} />
            <span className="text-sm font-bold" style={{ color: keySaved ? 'var(--gn)' : 'var(--tx2)' }}>
              I have copied and saved my private key in a secure location
            </span>
          </label>

          {/* Continue button */}
          <button onClick={handleBackupComplete} disabled={!keySaved}
            className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
            style={{
              background: keySaved ? 'var(--gn)' : 'var(--brd)',
              color: keySaved ? 'var(--bg)' : 'var(--tx4)',
              opacity: keySaved ? 1 : 0.5,
              cursor: keySaved ? 'pointer' : 'not-allowed',
            }}>
            {keySaved ? '✓ Continue to Wallet' : 'Save your keys first'}
          </button>
        </div>
      </div>
    );
  }

  // ─── No Wallet State ───
  if (!wallet) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Wallet</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Manage your trading wallet</p>
        </div>
        <div className="card p-10 text-center animate-fade">
          <div className="text-5xl mb-4">👛</div>
          <div className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font)', color: 'var(--tx)' }}>No Wallet</div>
          <div className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--tx3)' }}>
            Generate a Polygon wallet to start live trading on Polymarket. You can trade with paper money without a wallet.
          </div>
          <button onClick={handleGenerate}
            className="btn-primary !text-base !py-4 !px-10 mx-auto">
            🔐 Generate Wallet
          </button>
        </div>
      </div>
    );
  }

  // ─── Wallet Dashboard ───
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Wallet</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>Manage balances and deposits</p>
        </div>
        <div className="flex gap-2">
          <button onClick={function() { setShowBackup(true); setKeySaved(false); setShowKey(false); }} className="btn-ghost !text-xs">🔑 Export Keys</button>
        </div>
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
            {['paper', 'live'].map(function(m) {
              var isActive = tradingMode === m;
              return (
                <button key={m} onClick={function() { setTradingMode(m); }}
                  className="px-5 py-2.5 text-sm font-bold uppercase transition-all"
                  style={{
                    background: isActive ? (m === 'paper' ? 'color-mix(in srgb, var(--ac) 15%, transparent)' : 'color-mix(in srgb, var(--gn) 15%, transparent)') : 'transparent',
                    color: isActive ? (m === 'paper' ? 'var(--ac)' : 'var(--gn)') : 'var(--tx4)',
                  }}>
                  {m === 'paper' ? '📄 Paper' : '💰 Live'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Balance cards */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.05s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>📄 PAPER BALANCE</div>
          <div className="glow-text" style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
            {'$' + paperBalance.toFixed(2)}
          </div>
        </div>
        <div className="card p-5 animate-fade" style={{ animationDelay: '0.1s' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>💰 LIVE BALANCE</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>$0.00</div>
        </div>
      </div>

      {/* Wallet card */}
      <div className="card p-5 mb-5 animate-fade" style={{ animationDelay: '0.15s' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>APEX MANAGED WALLET</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--pu) 15%, transparent)', color: 'var(--pu)' }}>POLYGON</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 rounded-xl p-4 mb-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
          <div className="flex-1">
            <div className="text-xs mb-1" style={{ color: 'var(--tx3)' }}>Address</div>
            <div className="font-bold text-sm" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{shortAddress(wallet.address)}</div>
          </div>
          <button onClick={copyAddress} className="btn-ghost !text-xs">
            {copiedField === 'addr' ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {/* Real balances */}
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

        {/* QR */}
        <div className="rounded-xl p-5 text-center" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>DEPOSIT USDC (POLYGON)</div>
          <div className="inline-block p-3 rounded-xl mb-3" style={{ background: '#fff' }}>
            <img src={getDepositQRUrl(wallet.address)} alt="Deposit QR" width={200} height={200} style={{ imageRendering: 'pixelated' }} />
          </div>
          <div className="text-xs break-all font-bold mt-2" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{wallet.address}</div>
          <div className="text-xs mt-2" style={{ color: 'var(--tx4)' }}>Send USDC on Polygon network only</div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--or) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--or) 25%, transparent)' }}>
        <div className="font-bold text-sm mb-1" style={{ color: 'var(--or)' }}>⚠ Wallet Security</div>
        <div className="text-xs" style={{ color: 'var(--tx2)' }}>
          Your private key is stored encrypted in your browser. For maximum security, keep amounts small for testing and back up your keys securely.
        </div>
      </div>
    </div>
  );
}
