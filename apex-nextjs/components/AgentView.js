'use client';
import { useState } from 'react';
import Spark from './Spark';
import { bots, skills, skillCategories } from '@/lib/data';

function StatCard({ label, value, sub, isGreen, delay = 0 }) {
  return (
    <div className="card animate-fade p-5" style={{ animationDelay: `${delay}s` }}>
      <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)', fontFamily: 'var(--font)' }}>{label}</div>
      <div className="glow-text" style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{value}</div>
      <div className="text-xs mt-1" style={{ fontFamily: 'var(--mono)', color: isGreen ? 'var(--gn)' : 'var(--tx2)' }}>{sub}</div>
    </div>
  );
}

export default function AgentView() {
  const [tab, setTab] = useState('overview');
  const [skillCat, setSkillCat] = useState('All');
  const [walletType, setWalletType] = useState('managed');

  const filteredSkills = skillCat === 'All' ? skills : skills.filter(s => s.cat === skillCat);
  const tabs = [
    { id: 'overview', label: '◎ Overview' },
    { id: 'skills', label: '◈ Skills' },
    { id: 'sdk', label: '<> SDK' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>OPENCLAW</span>
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>AI Agent Management</h2>
        </div>
        <button className="btn-primary">+ Deploy Agent</button>
      </div>

      {/* Tab bar */}
      <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--brd)', background: 'var(--bg2)' }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className="flex-1 py-2.5 text-sm font-medium transition-all"
            style={{
              background: tab === tb.id ? 'var(--ac-dim)' : 'transparent',
              color: tab === tb.id ? 'var(--ac)' : 'var(--tx3)',
              fontFamily: 'var(--font)', borderRight: '1px solid var(--brd)',
            }}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {tab === 'overview' && (
        <div className="animate-fade">
          {/* Stats */}
          <div className="stats-grid grid gap-3.5 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <StatCard label="Total P&L" value="+$2,451" sub="+18.2% all time" isGreen delay={0} />
            <StatCard label="Active Agents" value="3 / 4" sub="1 paused" delay={0.06} />
            <StatCard label="Win Rate" value="68.4%" sub="654 trades" delay={0.12} />
            <StatCard label="24h Volume" value="$3,847" sub="+12% vs yesterday" isGreen delay={0.18} />
          </div>

          {/* My Agents */}
          <div className="card p-5 mb-6">
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>◈ MY AGENTS</div>
            <div className="main-grid-2 grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {bots.map((b, i) => (
                <div key={b.id} className="card animate-fade p-5" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ background: 'color-mix(in srgb, var(--ac) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)' }}>
                        {b.icon}
                      </div>
                      <div>
                        <div className="font-bold" style={{ fontFamily: 'var(--font)' }}>{b.name}</div>
                        <div className="text-xs" style={{ color: 'var(--tx3)' }}>{b.strat}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase"
                      style={{
                        background: `color-mix(in srgb, ${b.st === 'active' ? 'var(--gn)' : 'var(--or)'} 12%, transparent)`,
                        color: b.st === 'active' ? 'var(--gn)' : 'var(--or)',
                        border: `1px solid color-mix(in srgb, ${b.st === 'active' ? 'var(--gn)' : 'var(--or)'} 25%, transparent)`,
                      }}>
                      {b.st}
                    </span>
                  </div>
                  <Spark data={b.d} color={b.pnl >= 0 ? 'var(--gn)' : 'var(--rd)'} w={300} h={45} />
                  <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 40%, transparent)' }}>
                    {[
                      { l: 'P&L', v: `${b.pnl >= 0 ? '+' : ''}$${b.pnl.toFixed(0)}`, c: b.pnl >= 0 ? 'var(--gn)' : 'var(--rd)' },
                      { l: 'Return', v: `${b.pct >= 0 ? '+' : ''}${b.pct}%`, c: b.pct >= 0 ? 'var(--gn)' : 'var(--rd)' },
                      { l: 'Trades', v: b.trades, c: 'var(--tx2)' },
                      { l: 'Win %', v: `${b.win}%`, c: b.win >= 60 ? 'var(--gn)' : 'var(--or)' },
                    ].map((s, j) => (
                      <div key={j}>
                        <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--tx3)', fontFamily: 'var(--font)' }}>{s.l}</div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'var(--mono)', color: s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Skills Tab ─── */}
      {tab === 'skills' && (
        <div className="animate-fade">
          <div className="flex gap-2 mb-4 flex-wrap">
            {skillCategories.map(c => (
              <button key={c} onClick={() => setSkillCat(c)}
                className="px-3.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: skillCat === c ? 'var(--ac-dim)' : 'transparent',
                  color: skillCat === c ? 'var(--ac)' : 'var(--tx3)',
                  border: skillCat === c ? '1px solid color-mix(in srgb, var(--ac) 40%, transparent)' : '1px solid transparent',
                  fontWeight: skillCat === c ? 600 : 400,
                }}>
                {c}
              </button>
            ))}
          </div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>AVAILABLE ({filteredSkills.length})</div>
          <div className="main-grid-3 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {filteredSkills.map((sk, i) => (
              <div key={sk.id} className="card card-lift animate-fade p-5" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{sk.icon}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      color: sk.status === 'coming_soon' ? 'var(--or)' : sk.level === 'Beginner' ? 'var(--gn)' : sk.level === 'Advanced' || sk.level === 'Expert' ? 'var(--rd)' : 'var(--ac)',
                      background: sk.status === 'coming_soon' ? 'color-mix(in srgb, var(--or) 12%, transparent)' : 'transparent',
                      border: sk.status === 'coming_soon' ? 'none' : `1px solid color-mix(in srgb, ${sk.level === 'Beginner' ? 'var(--gn)' : sk.level === 'Advanced' || sk.level === 'Expert' ? 'var(--rd)' : 'var(--ac)'} 30%, transparent)`,
                    }}>
                    {sk.status === 'coming_soon' ? 'Coming Soon' : `● ${sk.level}`}
                  </span>
                </div>
                <div className="font-bold mb-2" style={{ fontFamily: 'var(--font)', color: 'var(--tx)' }}>{sk.name}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--tx2)' }}>{sk.desc}</div>
                {sk.status === 'available' && (
                  <button className="btn-ghost mt-4 w-full !text-xs">Install Skill</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SDK Tab ─── */}
      {tab === 'sdk' && (
        <div className="animate-fade space-y-5">
          {/* API Keys */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>◈ API KEYS <span className="ml-2 text-xs font-normal" style={{ color: 'var(--tx4)' }}>1 key</span></div>
              <button className="btn-ghost !text-xs">+ New Key</button>
            </div>
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold mr-2" style={{ fontFamily: 'var(--mono)' }}>My-APEX-Wallet</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>ACTIVE</span>
                </div>
                <button className="btn-ghost !text-xs">↻ Regenerate</button>
              </div>
              <div className="text-xs mt-2" style={{ fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>sk_live_f474f64d...... Created 6h ago · Used Just now · 78 requests</div>
            </div>
          </div>

          {/* Agent Wallets */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>◈ AGENT WALLETS</div>
              <span className="text-xs font-bold" style={{ color: 'var(--gn)' }}>✓ READY</span>
            </div>
            <div className="text-xs mb-4" style={{ color: 'var(--tx2)' }}>Configure wallets to enable real trading on Polymarket and Kalshi.</div>

            {/* Wallet type selector */}
            <div className="flex gap-3 mb-5">
              {[{ id: 'managed', label: 'APEX Managed', desc: 'No private keys needed. APEX handles wallet creation and signing.', rec: true },
                { id: 'metamask', label: 'MetaMask', desc: 'Connect your existing MetaMask wallet.' },
                { id: 'walletconnect', label: 'WalletConnect', desc: 'Connect any WalletConnect-compatible wallet.' },
                { id: 'byow', label: 'Bring Your Own', desc: 'Use your own private key.' }
              ].map(w => (
                <button key={w.id} onClick={() => setWalletType(w.id)}
                  className="flex-1 rounded-xl p-4 text-left transition-all"
                  style={{
                    border: `1px solid ${walletType === w.id ? 'var(--ac)' : 'var(--brd)'}`,
                    background: walletType === w.id ? 'var(--ac-dim)' : 'var(--bg3)',
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: walletType === w.id ? 'var(--ac)' : 'var(--tx)', fontFamily: 'var(--font)' }}>{w.label}</span>
                    {w.rec && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>REC</span>}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--tx3)' }}>{w.desc}</div>
                </button>
              ))}
            </div>

            {walletType === 'managed' && (
              <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--ac)' }}>Polymarket</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--pu) 15%, transparent)', color: 'var(--pu)' }}>POLYGON</span>
                </div>
                <div className="text-sm font-bold" style={{ fontFamily: 'var(--mono)', color: 'var(--tx2)' }}>0x7f3a...c9d2</div>
              </div>
            )}

            {/* Trading toggle */}
            <div className="flex justify-between items-center rounded-xl p-4 mb-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div>
                <div className="font-bold text-sm" style={{ fontFamily: 'var(--font)' }}>Real Trading</div>
                <div className="text-xs" style={{ color: 'var(--tx3)' }}>Your agents can execute real trades on Polymarket.</div>
              </div>
              <div className="w-11 h-6 rounded-full cursor-pointer relative" style={{ background: 'var(--gn)' }}>
                <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
              </div>
            </div>

            {/* Limits */}
            <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>TRADING LIMITS</div>
              <div className="flex gap-4 items-center flex-wrap">
                <label className="text-sm" style={{ color: 'var(--tx2)' }}>Max per trade: $
                  <input type="number" defaultValue={100} className="ml-1 w-16 px-2 py-1 rounded text-sm" style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)', fontFamily: 'var(--mono)' }} />
                </label>
                <label className="text-sm" style={{ color: 'var(--tx2)' }}>Daily trades:
                  <input type="number" defaultValue={100} className="ml-1 w-16 px-2 py-1 rounded text-sm" style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)', fontFamily: 'var(--mono)' }} />
                </label>
                <button className="btn-primary !text-xs !py-1.5 !px-4">💾 Save</button>
              </div>
            </div>

            {/* Security warning */}
            <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--or) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--or) 25%, transparent)' }}>
              <div className="font-bold text-sm mb-1" style={{ color: 'var(--or)' }}>⚠ Security for BYOW</div>
              <div className="text-xs" style={{ color: 'var(--tx2)' }}>Store private keys only in your agent&apos;s env vars — never commit them to code or share in chat. Real trades use actual funds. APEX is not responsible for losses.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
