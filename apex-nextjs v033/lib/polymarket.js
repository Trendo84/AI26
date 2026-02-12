// Polymarket Gamma API — public, no auth needed
const GAMMA_BASE = 'https://gamma-api.polymarket.com';

export async function fetchMarkets({ limit = 20, category, active = true, order = 'volume24hr', ascending = false } = {}) {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      active: String(active),
      order,
      ascending: String(ascending),
      closed: 'false',
    });
    if (category) params.set('tag', category);

    const res = await fetch(`${GAMMA_BASE}/markets?${params}`, {
      next: { revalidate: 30 }, // Cache for 30s in Next.js
    });
    if (!res.ok) throw new Error(`Gamma API ${res.status}`);
    const data = await res.json();

    return data.map(m => ({
      id: m.conditionId || m.id,
      slug: m.slug,
      question: m.question,
      category: m.tags?.[0] || 'Other',
      image: m.image,
      endDate: m.endDate,
      volume: m.volume || 0,
      volume24hr: m.volume24hr || 0,
      liquidity: m.liquidity || 0,
      outcomes: (m.outcomes || ['Yes', 'No']).map((name, i) => ({
        name,
        price: m.outcomePrices ? parseFloat(m.outcomePrices[i]) : 0.5,
      })),
      active: m.active,
      closed: m.closed,
      resolvedBy: m.resolvedBy,
    }));
  } catch (err) {
    console.error('Polymarket fetch error:', err);
    return [];
  }
}

export async function fetchMarket(conditionId) {
  try {
    const res = await fetch(`${GAMMA_BASE}/markets/${conditionId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchEvents({ limit = 10, active = true } = {}) {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      active: String(active),
      closed: 'false',
      order: 'volume24hr',
      ascending: 'false',
    });
    const res = await fetch(`${GAMMA_BASE}/events?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Format helpers
export function formatVolume(vol) {
  if (!vol) return '$0';
  const n = parseFloat(vol);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatPrice(price) {
  if (!price && price !== 0) return '0¢';
  const pct = parseFloat(price) * 100;
  return `${pct.toFixed(1)}%`;
}

export function timeUntil(dateStr) {
  if (!dateStr) return '—';
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d`;
  return `${hours}h`;
}
