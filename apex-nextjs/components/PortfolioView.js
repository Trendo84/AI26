'use client';

export default function PortfolioView({ paperBalance = 10000, trades = [], openTrades = [], closedTrades = [], closeTrade, totalPnl = 0, winCount = 0, tradingMode, resetPaper }) {
  const totalInvested = openTrades.reduce((s, t) => s + t.amount, 0);
  const portfolioValue = paperBalance + totalInvested;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>Portfolio</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--tx3)' }}>
            {tradingMode === 'paper' ? '📄 Paper trading — virtual balance' : '💰 Live trading — real USDC'}
          </p>
        </div>
        {tradingMode === 'paper' && (
          <button onClick={resetPaper} className="btn-ghost !text-xs">↻ Reset Paper Account</button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3.5 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {[
          { l: 'Available', v: `$${paperBalance.toFixed(2)}`, c: 'var(--ac)' },
          { l: 'Invested', v: `$${totalInvested.toFixed(2)}`, c: 'var(--tx)' },
          { l: 'Portfolio', v: `$${portfolioValue.toFixed(2)}`, c: 'var(--tx)' },
          { l: 'Realized P&L', v: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, c: totalPnl >= 0 ? 'var(--gn)' : 'var(--rd)' },
        ].map((s, i) => (
          <div key={i} className="card animate-fade p-5" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)' }}>{s.l}</div>
            <div className="glow-text" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)', color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Open Positions */}
      <div className="card p-5 mb-5 animate-fade" style={{ animationDelay: '0.2s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>
          OPEN POSITIONS ({openTrades.length})
        </div>

        {openTrades.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">📭</div>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--tx2)' }}>No open positions</div>
            <div className="text-xs" style={{ color: 'var(--tx3)' }}>Click any market on the Discover page to place your first trade</div>
          </div>
        ) : (
          <div className="space-y-3">
            {openTrades.map(trade => {
              // Simulate price movement for demo
              const currentPrice = trade.price + (Math.random() - 0.45) * 0.08;
              const unrealizedPnl = (currentPrice - trade.price) * trade.shares * (trade.side === 'YES' ? 1 : -1);
              const pnlPct = ((unrealizedPnl / trade.amount) * 100).toFixed(1);

              return (
                <div key={trade.id} className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4">
                      <div className="text-sm font-bold leading-tight mb-1" style={{ fontFamily: 'var(--font)' }}>
                        {trade.marketQuestion}
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="font-bold px-1.5 py-0.5 rounded" style={{
                          background: `color-mix(in srgb, ${trade.side === 'YES' ? 'var(--gn)' : 'var(--rd)'} 15%, transparent)`,
                          color: trade.side === 'YES' ? 'var(--gn)' : 'var(--rd)',
                        }}>{trade.side}</span>
                        <span style={{ color: 'var(--tx3)' }}>{trade.isPaper ? '📄 Paper' : '💰 Live'}</span>
                        <span style={{ color: 'var(--tx4)' }}>{new Date(trade.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => closeTrade(trade.id, currentPrice)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: 'color-mix(in srgb, var(--rd) 15%, transparent)', color: 'var(--rd)', border: '1px solid color-mix(in srgb, var(--rd) 30%, transparent)' }}
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <div style={{ color: 'var(--tx4)' }}>Shares</div>
                      <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{trade.shares.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--tx4)' }}>Entry</div>
                      <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>{(trade.price * 100).toFixed(1)}¢</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--tx4)' }}>Cost</div>
                      <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>${trade.amount.toFixed(2)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--tx4)' }}>P&L</div>
                      <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: unrealizedPnl >= 0 ? 'var(--gn)' : 'var(--rd)' }}>
                        {unrealizedPnl >= 0 ? '+' : ''}{unrealizedPnl.toFixed(2)} ({pnlPct}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trade History */}
      <div className="card p-5 animate-fade" style={{ animationDelay: '0.3s' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>
          TRADE HISTORY ({closedTrades.length})
        </div>

        {closedTrades.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-xs" style={{ color: 'var(--tx3)' }}>Closed trades will appear here</div>
          </div>
        ) : (
          <div className="space-y-2">
            {closedTrades.slice(0, 20).map(trade => (
              <div key={trade.id} className="flex items-center gap-4 rounded-lg p-3 text-xs" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)' }}>
                <span className="font-bold px-1.5 py-0.5 rounded" style={{
                  background: `color-mix(in srgb, ${trade.side === 'YES' ? 'var(--gn)' : 'var(--rd)'} 15%, transparent)`,
                  color: trade.side === 'YES' ? 'var(--gn)' : 'var(--rd)',
                }}>{trade.side}</span>
                <div className="flex-1 font-bold truncate" style={{ fontFamily: 'var(--font)' }}>{trade.marketQuestion}</div>
                <div style={{ fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>${trade.amount.toFixed(2)}</div>
                <div className="font-bold min-w-[70px] text-right" style={{
                  fontFamily: 'var(--mono)',
                  color: (trade.pnl || 0) >= 0 ? 'var(--gn)' : 'var(--rd)',
                }}>
                  {(trade.pnl || 0) >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                </div>
                <div className="text-xs" style={{ color: 'var(--tx4)' }}>
                  {trade.closedAt ? new Date(trade.closedAt).toLocaleDateString() : '—'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {closedTrades.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--brd)' }}>
            <div className="text-center">
              <div className="text-xs" style={{ color: 'var(--tx4)' }}>Win Rate</div>
              <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--ac)' }}>
                {closedTrades.length > 0 ? ((winCount / closedTrades.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs" style={{ color: 'var(--tx4)' }}>Total Trades</div>
              <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{trades.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs" style={{ color: 'var(--tx4)' }}>Net P&L</div>
              <div className="font-bold" style={{ fontFamily: 'var(--mono)', color: totalPnl >= 0 ? 'var(--gn)' : 'var(--rd)' }}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
