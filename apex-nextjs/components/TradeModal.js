'use client';
import { useState } from 'react';

export default function TradeModal({ market, onClose, onTrade, paperBalance = 10000, mode = 'paper' }) {
  const [side, setSide] = useState('YES');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('input'); // input → review → success
  const [loading, setLoading] = useState(false);

  if (!market) return null;

  const price = side === 'YES'
    ? (market.outcomes?.[0]?.price || market.oc?.[0]?.p / 100 || 0.5)
    : (market.outcomes?.[1]?.price || market.oc?.[1]?.p / 100 || 0.5);

  const amountNum = parseFloat(amount) || 0;
  const shares = amountNum / price;
  const potentialPayout = shares * 1; // Each share pays $1 if correct
  const potentialProfit = potentialPayout - amountNum;
  const returnPct = amountNum > 0 ? ((potentialProfit / amountNum) * 100).toFixed(1) : 0;
  const canAfford = amountNum <= paperBalance && amountNum > 0;

  const handleConfirm = async () => {
    if (!canAfford) return;
    setLoading(true);
    try {
      await onTrade({
        marketId: market.id || market.slug,
        marketQuestion: market.question || market.q,
        marketCategory: market.category || market.cat,
        side,
        amount: amountNum,
        price,
      });
      setStep('success');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />

      <div className="card relative w-full max-w-md p-6 animate-fade z-10" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg2)', border: '1px solid var(--brd)' }}>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--tx3)' }}>
              {mode === 'paper' ? '📄 PAPER TRADE' : '💰 LIVE TRADE'}
            </div>
            <div className="text-sm font-bold leading-tight" style={{ color: 'var(--tx)', fontFamily: 'var(--font)' }}>
              {market.question || market.q}
            </div>
          </div>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--tx3)' }}>✕</button>
        </div>

        {step === 'input' && (
          <>
            {/* Side selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['YES', 'NO'].map(s => (
                <button key={s} onClick={() => setSide(s)}
                  className="py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: side === s
                      ? `color-mix(in srgb, ${s === 'YES' ? 'var(--gn)' : 'var(--rd)'} 15%, transparent)`
                      : 'var(--bg3)',
                    color: side === s ? (s === 'YES' ? 'var(--gn)' : 'var(--rd)') : 'var(--tx3)',
                    border: `2px solid ${side === s ? (s === 'YES' ? 'var(--gn)' : 'var(--rd)') : 'var(--brd)'}`,
                  }}>
                  {s} — {((s === 'YES' ? market.outcomes?.[0]?.price || market.oc?.[0]?.p / 100 : market.outcomes?.[1]?.price || market.oc?.[1]?.p / 100) * 100).toFixed(1)}¢
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--tx3)' }}>Amount (USDC)</label>
              <div className="flex items-center rounded-xl px-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                <span className="text-sm font-bold mr-2" style={{ color: 'var(--tx3)' }}>$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" min="0" step="0.01"
                  className="flex-1 bg-transparent py-3 text-lg font-bold"
                  style={{ color: 'var(--tx)', fontFamily: 'var(--mono)', border: 'none' }} />
              </div>
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {[5, 10, 25, 50, 100].map(a => (
                  <button key={a} onClick={() => setAmount(String(a))}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'var(--bg3)', color: 'var(--tx3)', border: '1px solid var(--brd)' }}>
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            {/* Balance info */}
            <div className="flex justify-between text-xs mb-4 px-1" style={{ color: 'var(--tx3)' }}>
              <span>Available: <span style={{ color: 'var(--tx2)', fontFamily: 'var(--mono)', fontWeight: 600 }}>${paperBalance.toFixed(2)}</span></span>
              <span>{mode === 'paper' ? '📄 Paper' : '💰 Live'}</span>
            </div>

            {/* Preview */}
            {amountNum > 0 && (
              <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--tx3)' }}>Shares</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--tx3)' }}>Avg price</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{(price * 100).toFixed(1)}¢</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--tx3)' }}>Potential payout</span>
                  <span className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>${potentialPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--tx3)' }}>Potential return</span>
                  <span className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>+{returnPct}%</span>
                </div>
              </div>
            )}

            {/* Buy button */}
            <button onClick={() => amountNum > 0 && canAfford && setStep('review')}
              disabled={!canAfford || amountNum <= 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
              style={{
                background: canAfford && amountNum > 0 ? (side === 'YES' ? 'var(--gn)' : 'var(--rd)') : 'var(--brd)',
                color: canAfford && amountNum > 0 ? 'var(--bg)' : 'var(--tx4)',
                opacity: canAfford && amountNum > 0 ? 1 : 0.5,
              }}>
              {amountNum <= 0 ? 'Enter amount' : !canAfford ? 'Insufficient balance' : `Review Buy ${side}`}
            </button>
          </>
        )}

        {step === 'review' && (
          <>
            <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
              <div className="text-center mb-3">
                <div className="text-3xl font-extrabold" style={{ fontFamily: 'var(--mono)', color: side === 'YES' ? 'var(--gn)' : 'var(--rd)' }}>
                  Buy {side}
                </div>
                <div className="text-lg font-bold mt-1" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>${amountNum.toFixed(2)}</div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span style={{ color: 'var(--tx3)' }}>Shares</span><span style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{shares.toFixed(4)}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--tx3)' }}>Price per share</span><span style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{(price * 100).toFixed(1)}¢</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--tx3)' }}>Max payout</span><span className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--gn)' }}>${potentialPayout.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('input')} className="btn-ghost flex-1">← Back</button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: side === 'YES' ? 'var(--gn)' : 'var(--rd)', color: 'var(--bg)' }}>
                {loading ? '⏳ Executing...' : '✓ Confirm Trade'}
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-lg font-bold mb-1" style={{ color: 'var(--gn)' }}>Trade Executed!</div>
            <div className="text-sm mb-1" style={{ color: 'var(--tx2)' }}>
              Bought {shares.toFixed(2)} {side} shares for ${amountNum.toFixed(2)}
            </div>
            <div className="text-xs mb-4" style={{ color: 'var(--tx3)' }}>
              {mode === 'paper' ? 'Paper trade — no real money used' : 'Live trade on Polymarket'}
            </div>
            <button onClick={onClose} className="btn-primary w-full">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
