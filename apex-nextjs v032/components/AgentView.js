'use client';
import { useState, useEffect } from 'react';
import Spark from './Spark';
import { bots, skills, skillCategories } from '@/lib/data';

var agentFeed = [
  { time: '2m ago', agent: 'Weather Hawk', action: 'Bought NYC YES @ 31.5%', icon: '☁', type: 'trade' },
  { time: '5m ago', agent: 'Alpha Sentinel', action: 'Sold BTC $150k NO @ 93.5%', icon: '◇', type: 'trade' },
  { time: '8m ago', agent: 'Alpha Sentinel', action: 'Found 2.3% spread on ETH', icon: '◇', type: 'scan' },
  { time: '12m ago', agent: 'Weather Hawk', action: 'Scanned 15 markets, no action', icon: '☁', type: 'scan' },
  { time: '18m ago', agent: 'News Raptor', action: 'Fed headline detected, analyzing...', icon: '⚡', type: 'alert' },
  { time: '25m ago', agent: 'Alpha Sentinel', action: 'Bought BTC Up @ 69.5%', icon: '◇', type: 'trade' },
];

function StatCard(props) {
  return (
    <div className="card animate-fade p-5" style={{ animationDelay: props.delay + 's' }}>
      <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--tx3)', fontFamily: 'var(--font)' }}>{props.label}</div>
      <div className="glow-text" style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{props.value}</div>
      <div className="text-xs mt-1" style={{ fontFamily: 'var(--mono)', color: props.isGreen ? 'var(--gn)' : 'var(--tx2)' }}>{props.sub}</div>
    </div>
  );
}

export default function AgentView() {
  var _tab = useState('overview');
  var tab = _tab[0], setTab = _tab[1];
  var _sc = useState('All');
  var skillCat = _sc[0], setSkillCat = _sc[1];
  var _wt = useState('managed');
  var walletType = _wt[0], setWalletType = _wt[1];

  var filteredSkills = skillCat === 'All' ? skills : skills.filter(function(s) { return s.cat === skillCat; });
  var tabs = [
    { id: 'overview', label: '◎ Overview' },
    { id: 'skills', label: '◈ Skills' },
    { id: 'sdk', label: '<> SDK' },
  ];

  return (
    <div>
      {/* Header — Rebranded */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ac)' }}>APEX INTELLIGENCE</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>3 ACTIVE</span>
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font)' }}>AI Agent Management</h2>
        </div>
        <button className="btn-primary">+ Deploy Agent</button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--brd)', background: 'var(--bg2)' }}>
        {tabs.map(function(tb) {
          var isActive = tab === tb.id;
          return (
            <button key={tb.id} onClick={function() { setTab(tb.id); }}
              className="flex-1 py-3 text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--ac-dim)' : 'transparent',
                color: isActive ? 'var(--ac)' : 'var(--tx3)',
                fontFamily: 'var(--font)', borderRight: '1px solid var(--brd)',
              }}>
              {tb.label}
            </button>
          );
        })}
      </div>

      {/* ─── Overview ─── */}
      {tab === 'overview' && (
        <div className="animate-fade">
          {/* Stats */}
          <div className="grid gap-3.5 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <StatCard label="Total P&L" value="+$2,451" sub="+18.2% all time" isGreen delay={0} />
            <StatCard label="Active Agents" value="3 / 4" sub="1 paused" delay={0.06} />
            <StatCard label="Win Rate" value="68.4%" sub="654 trades" delay={0.12} />
            <StatCard label="24h Volume" value="$3,847" sub="+12% vs yesterday" isGreen delay={0.18} />
          </div>

          {/* Agents grid + Live feed side by side */}
          <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 320px' }}>
            {/* Active Agents */}
            <div className="card p-5">
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>🤖 ACTIVE AGENTS</div>
              <div className="space-y-3">
                {bots.map(function(b, i) {
                  var statusColors = { active: 'var(--gn)', paused: 'var(--or)', scanning: 'var(--ac)' };
                  var statusLabels = { active: 'ACTIVE', paused: 'PAUSED', scanning: 'SCANNING' };
                  var stColor = statusColors[b.st] || 'var(--tx4)';
                  return (
                    <div key={b.id} className="rounded-xl p-4 animate-fade" style={{ background: 'var(--bg3)', border: '1px solid var(--brd)', animationDelay: (0.2 + i * 0.06) + 's' }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: 'color-mix(in srgb, var(--ac) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--ac) 25%, transparent)' }}>
                            {b.icon}
                          </div>
                          <div>
                            <div className="font-bold text-sm" style={{ fontFamily: 'var(--font)' }}>{b.name}</div>
                            <div className="text-xs" style={{ color: 'var(--tx3)' }}>{b.strat}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: stColor, boxShadow: '0 0 6px ' + stColor }} />
                          <span className="text-xs font-bold uppercase" style={{ color: stColor }}>{statusLabels[b.st] || b.st}</span>
                        </div>
                      </div>
                      <Spark data={b.d} color={b.pnl >= 0 ? 'var(--gn)' : 'var(--rd)'} w={500} h={40} />
                      <div className="grid grid-cols-4 gap-3 mt-3 pt-3" style={{ borderTop: '1px solid color-mix(in srgb, var(--brd) 40%, transparent)' }}>
                        {[
                          { l: 'P&L', v: (b.pnl >= 0 ? '+' : '') + '$' + b.pnl.toFixed(0), c: b.pnl >= 0 ? 'var(--gn)' : 'var(--rd)' },
                          { l: 'Return', v: (b.pct >= 0 ? '+' : '') + b.pct + '%', c: b.pct >= 0 ? 'var(--gn)' : 'var(--rd)' },
                          { l: 'Trades', v: String(b.trades), c: 'var(--tx2)' },
                          { l: 'Win %', v: b.win + '%', c: b.win >= 60 ? 'var(--gn)' : 'var(--or)' },
                        ].map(function(s, j) {
                          return (
                            <div key={j}>
                              <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--tx4)' }}>{s.l}</div>
                              <div className="text-sm font-bold" style={{ fontFamily: 'var(--mono)', color: s.c }}>{s.v}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-ghost !text-xs flex-1">📋 View Logs</button>
                        <button className="btn-ghost !text-xs flex-1">⚙ Configure</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Feed */}
            <div className="card p-5">
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>📡 LIVE ACTIVITY</div>
              <div className="space-y-3">
                {agentFeed.map(function(log, i) {
                  var dotColor = log.type === 'trade' ? 'var(--gn)' : log.type === 'alert' ? 'var(--or)' : 'var(--tx4)';
                  return (
                    <div key={i} className="flex gap-2.5 text-xs pb-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--brd) 30%, transparent)' }}>
                      <span style={{ fontSize: 16 }}>{log.icon}</span>
                      <div>
                        <div className="flex gap-2 items-center mb-0.5">
                          <span className="font-bold" style={{ color: 'var(--ac)' }}>{log.agent}</span>
                          <span style={{ color: 'var(--tx4)' }}>{log.time}</span>
                        </div>
                        <div style={{ color: log.type === 'trade' ? 'var(--tx)' : 'var(--tx3)' }}>{log.action}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Skills Tab ─── */}
      {tab === 'skills' && (
        <div className="animate-fade">
          <div className="flex gap-2 mb-4 flex-wrap">
            {skillCategories.map(function(c) {
              var isActive = skillCat === c;
              return (
                <button key={c} onClick={function() { setSkillCat(c); }}
                  className="px-4 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background: isActive ? 'var(--ac-dim)' : 'transparent',
                    color: isActive ? 'var(--ac)' : 'var(--tx3)',
                    border: isActive ? '1px solid color-mix(in srgb, var(--ac) 40%, transparent)' : '1px solid transparent',
                    fontWeight: isActive ? 600 : 400,
                  }}>
                  {c}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {filteredSkills.map(function(sk, i) {
              var levelColor = sk.level === 'Beginner' ? 'var(--gn)' : (sk.level === 'Advanced' || sk.level === 'Expert') ? 'var(--rd)' : 'var(--ac)';
              return (
                <div key={sk.id} className="card card-lift animate-fade p-5" style={{ animationDelay: (i * 0.05) + 's' }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">{sk.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{
                      color: sk.status === 'coming_soon' ? 'var(--or)' : levelColor,
                      background: sk.status === 'coming_soon' ? 'color-mix(in srgb, var(--or) 12%, transparent)' : 'transparent',
                      border: sk.status === 'coming_soon' ? 'none' : '1px solid color-mix(in srgb, ' + levelColor + ' 30%, transparent)',
                    }}>
                      {sk.status === 'coming_soon' ? 'Coming Soon' : sk.level}
                    </span>
                  </div>
                  <div className="font-bold mb-2" style={{ fontFamily: 'var(--font)', color: 'var(--tx)' }}>{sk.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--tx2)' }}>{sk.desc}</div>
                  {sk.status === 'available' && (
                    <button className="btn-ghost mt-4 w-full !text-xs">Install Strategy</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SDK Tab ─── */}
      {tab === 'sdk' && (
        <div className="animate-fade space-y-5">
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--tx3)' }}>◈ API KEYS</div>
              <button className="btn-ghost !text-xs">+ New Key</button>
            </div>
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold mr-2" style={{ fontFamily: 'var(--mono)' }}>My-APEX-Key</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--gn) 15%, transparent)', color: 'var(--gn)' }}>ACTIVE</span>
                </div>
                <button className="btn-ghost !text-xs">Regenerate</button>
              </div>
              <div className="text-xs mt-2" style={{ fontFamily: 'var(--mono)', color: 'var(--tx3)' }}>sk_live_f474f64d...... Created 6h ago | 78 requests</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--tx3)' }}>◈ AGENT WALLETS</div>
            <div className="text-xs mb-4" style={{ color: 'var(--tx2)' }}>Configure wallets to enable real trading. Go to the Wallet tab to generate or manage your wallet.</div>
            <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--brd)', background: 'var(--bg3)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--tx3)' }}>TRADING LIMITS</div>
              <div className="flex gap-4 items-center flex-wrap">
                <label className="text-sm" style={{ color: 'var(--tx2)' }}>Max per trade: $
                  <input type="number" defaultValue={100} className="ml-1 w-16 px-2 py-1.5 rounded text-sm" style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)', fontFamily: 'var(--mono)' }} />
                </label>
                <label className="text-sm" style={{ color: 'var(--tx2)' }}>Daily limit:
                  <input type="number" defaultValue={500} className="ml-1 w-16 px-2 py-1.5 rounded text-sm" style={{ background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--tx)', fontFamily: 'var(--mono)' }} />
                </label>
                <button className="btn-primary !text-xs !py-2 !px-5">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
