# APEX Live Trading Implementation - Complete Prompt

**Project:** APEX Trading Protocol v0.3.5  
**Goal:** Enable REAL blockchain trading (currently simulated only)  
**Priority:** CRITICAL  
**Estimated Time:** 2-3 hours

---

## 🔗 Resources

- **Live Site:** http://188.166.51.114
- **GitHub Repo:** https://github.com/Trendo84/AI26
- **Active Folder:** `apex-nextjs v035/`
- **VPS:** 188.166.51.114 (Amsterdam)

---

## 🚨 CRITICAL BUG (Fix First)

**Issue:** TradeModal not receiving wallet prop

**File:** `app/page.js`

**Current (BROKEN):**
```javascript
<TradeModal 
  market={tradeMarket} 
  onClose={function() { setTradeMarket(null); }} 
  onTrade={handleTrade} 
  paperBalance={paperBalance} 
  mode={tradingMode}
/>
```

**Fix:**
```javascript
<TradeModal 
  market={tradeMarket} 
  onClose={function() { setTradeMarket(null); }} 
  onTrade={handleTrade} 
  paperBalance={paperBalance} 
  mode={tradingMode}
  wallet={wallet}  // ← ADD THIS LINE
/>
```

---

## 🎯 IMPLEMENTATION REQUIREMENTS

### 1. Real Balance Fetching (Working)

The `lib/polygon.js` already has working `getBalances()` function:

```javascript
import { getBalances } from '@/lib/polygon';

// This WORKS - returns { pol: 0.05, usdc: 5.09 }
const balance = await getBalances('0x5614C87b9aBaBf881bac5C9D4B22b8D962468b0B');
```

**USDC Balance Confirmed:** $5.09 on Polygon mainnet

---

### 2. Polymarket CLOB Integration

**Network:** Polygon Mainnet  
**Chain ID:** 137  
**USDC Contract:** 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359

**Trading Flow:**
1. Check if user has approved USDC for Polymarket CLOB
2. If not approved, call `approve()` (user signs in MetaMask)
3. Create order object (market, side, size, price)
4. Sign order with user's wallet
5. Submit to Polymarket CLOB API
6. Wait for blockchain confirmation
7. Update UI with transaction hash

**Required Smart Contract Interactions:**

```javascript
// 1. Check USDC allowance
const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
const allowance = await usdc.allowance(userAddress, CLOB_ADDRESS);

// 2. Approve USDC spend (if needed)
if (allowance < tradeAmount) {
  const tx = await usdc.approve(CLOB_ADDRESS, ethers.MaxUint256);
  await tx.wait();
}

// 3. Create and sign order
const order = {
  market: marketId,
  side: 'buy', // or 'sell'
  size: sizeInWei, // USDC amount (6 decimals)
  price: price, // 0-1 range
};
const signedOrder = await signOrder(order, signer);

// 4. Submit to CLOB
const response = await fetch('https://clob.polymarket.com/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(signedOrder),
});
```

---

### 3. TradeModal Component Updates

**File:** `components/TradeModal.js`

**Current State:**
- Shows "Live" label but uses `paperBalance`
- No real blockchain interaction
- Button executes fake trade

**Required Changes:**

```javascript
export default function TradeModal({ 
  market, 
  onClose, 
  onTrade, 
  paperBalance = 10000, 
  mode = 'paper',
  wallet = null  // NEW PROP
}) {
  // Add state for real balance
  const [realBalance, setRealBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  // Fetch real balance when in live mode
  useEffect(() => {
    if (mode === 'live' && wallet?.address) {
      getBalances(wallet.address).then(bal => {
        setRealBalance(bal.usdc);
      });
    }
  }, [mode, wallet]);

  const displayBalance = mode === 'live' 
    ? (realBalance || 0) 
    : paperBalance;

  // Execute trade
  const executeTrade = async () => {
    if (mode === 'paper') {
      // Existing paper trade logic
      onTrade({ market, side, amount });
    } else {
      // NEW: Real blockchain trade
      setIsLoading(true);
      try {
        const result = await executeLiveTrade({
          market,
          side,
          amount,
          signer: wallet.signer
        });
        setTxHash(result.txHash);
        onTrade(result);
      } catch (err) {
        showError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
}
```

---

### 4. NEW FILE: lib/polymarket.js

Create this file for Polymarket integration:

```javascript
import { ethers } from 'ethers';

const CLOB_API = 'https://clob.polymarket.com';
const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const CLOB_ADDRESS = '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982C';

const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

// Check if user has approved USDC for CLOB
export async function checkAllowance(owner, signer) {
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
  const allowance = await usdc.allowance(owner, CLOB_ADDRESS);
  return allowance;
}

// Approve USDC spend
export async function approveUSDC(amount, signer) {
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
  const tx = await usdc.approve(CLOB_ADDRESS, amount);
  return await tx.wait();
}

// Create and sign order
export async function createOrder(market, side, size, price, signer) {
  const order = {
    market,
    side,
    size: ethers.parseUnits(size.toString(), 6), // USDC has 6 decimals
    price: Math.round(price * 100), // Convert to percentage
    feeRateBps: 0,
  };
  
  // Sign order
  const signature = await signer.signMessage(JSON.stringify(order));
  return { ...order, signature };
}

// Submit trade to CLOB
export async function submitTrade(signedOrder) {
  const response = await fetch(`${CLOB_API}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signedOrder),
  });
  
  if (!response.ok) {
    throw new Error(`Trade failed: ${await response.text()}`);
  }
  
  return await response.json();
}

// Execute full trade flow
export async function executeLiveTrade({ market, side, amount, signer }) {
  const address = await signer.getAddress();
  
  // 1. Check allowance
  const allowance = await checkAllowance(address, signer);
  const amountWei = ethers.parseUnits(amount.toString(), 6);
  
  // 2. Approve if needed
  if (allowance < amountWei) {
    console.log('Approving USDC...');
    await approveUSDC(ethers.MaxUint256, signer);
  }
  
  // 3. Create order
  const marketId = market.id || market._raw?.id;
  const price = side === 'yes' ? market.oc[0].p / 100 : market.oc[1].p / 100;
  
  const signedOrder = await createOrder(marketId, 'buy', amount, price, signer);
  
  // 4. Submit trade
  const result = await submitTrade(signedOrder);
  
  return {
    txHash: result.transaction_hash,
    orderId: result.order_id,
    market,
    side,
    amount,
  };
}
```

---

### 5. UI Requirements

**Balance Display:**
```
Paper Mode:  "Available: $10,000.00 (Paper)"
Live Mode:   "Available: $5.09 (Real USDC on Polygon)"
```

**Trade Button:**
```
Paper Mode:  "📄 Execute Paper Trade"
Live Mode:   "💰 Execute Live Trade" (enabled when balance > 0)
```

**Transaction Confirmation:**
- Show "Confirm in MetaMask" while waiting
- Show gas fee estimate
- After confirmation, show:
  - Transaction hash
  - Link to Polygonscan
  - Updated balance

**Error Handling:**
- "Transaction rejected in MetaMask"
- "Insufficient USDC balance (have $X, need $Y)"
- "Need POL for gas fees"
- "Transaction failed - please try again"

---

## 🧪 TESTING CHECKLIST

### Before Deployment:
- [ ] Balance shows $5.09 in live mode
- [ ] Paper trading still works
- [ ] Error handling works

### Real Trading Test:
- [ ] Approve USDC spend (one-time)
- [ ] Execute $1 test trade
- [ ] Transaction confirms on blockchain
- [ ] Shows tx hash
- [ ] Balance updates to $4.09
- [ ] Can view on https://polygonscan.com/tx/{hash}

---

## 📁 FILES TO MODIFY

1. **app/page.js** - Add wallet prop to TradeModal
2. **components/TradeModal.js** - Add live trading logic
3. **lib/polymarket.js** (NEW) - Polymarket integration
4. **package.json** - Add ethers if not present

---

## 🚀 DEPLOYMENT

```bash
# On VPS (188.166.51.114)
cd "/root/apex-trading/apex-nextjs v035"

# Install if new dependencies
npm install

# Build
npm run build

# Deploy
rm -rf /var/www/apex/*
cp -r out/* /var/www/apex/
systemctl restart nginx

# Verify
curl -s http://188.166.51.114 | grep -oE "v0\.[0-9]\.[0-9]"
```

---

## ⚠️ SECURITY NOTES

1. **Never commit the private key**
2. **Test with $1 first, then $5**
3. **Verify transaction on Polygonscan before considering success**
4. **Show gas fees clearly to user**
5. **Require explicit confirmation for all transactions**

---

## 🎯 SUCCESS CRITERIA

- [ ] Live mode shows real USDC balance ($5.09)
- [ ] Can execute real trade on Polymarket
- [ ] Trade deducts USDC from wallet
- [ ] Transaction visible on Polygonscan
- [ ] Shows transaction hash in UI
- [ ] Updates trade history with real tx
- [ ] Error handling for all failure cases

---

## 💡 QUESTIONS?

If Polymarket CLOB API is complex, consider:
1. Direct contract interaction instead of API
2. Using Polymarket's official SDK
3. Simplified market orders only (no limit orders)

---

**Ready to implement!** 🚀
