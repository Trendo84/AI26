// lib/polygon.ts - SECURE Wallet Management
import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { polygon } from 'viem/chains';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const USDC_CONTRACT = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // Polygon USDC

/**
 * Generate a new Polygon wallet with VALID keypair
 * CRITICAL: Private key and address MUST correspond!
 */
export function generateWallet() {
  // Generate cryptographically secure private key
  const privateKey = generatePrivateKey();
  
  // Derive address FROM the private key (CRITICAL!)
  const account = privateKeyToAccount(privateKey);
  
  return {
    privateKey: privateKey,
    address: account.address,
  };
}

/**
 * Encrypt private key using AES-GCM (browser-native)
 * Much more secure than simple XOR
 */
export async function encryptPrivateKey(privateKey: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(privateKey);
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('apex-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Combine IV + encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  // Return as base64
  return btoa(String.fromCharCode(...result));
}

/**
 * Decrypt private key
 */
export async function decryptPrivateKey(encrypted: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  
  // Extract IV (first 12 bytes)
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);
  
  // Derive key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('apex-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );
  
  return new TextDecoder().decode(decrypted);
}

/**
 * Get wallet client for transactions (requires private key)
 */
export function getWalletClient(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  return createWalletClient({
    account,
    chain: polygon,
    transport: http('https://polygon-rpc.com'),
  });
}

/**
 * Get balances from Polygon
 */
export async function getBalances(address: string) {
  const rpcUrl = 'https://polygon-rpc.com';
  const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

  try {
    // POL balance
    const polRes = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'eth_getBalance',
        params: [address, 'latest'],
      }),
    });
    const polData = await polRes.json();
    const polBalance = parseInt(polData.result || '0', 16) / 1e18;

    // USDC balance (ERC20)
    const balanceOfData = '0x70a08231000000000000000000000000' + address.slice(2);
    const usdcRes = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 2, method: 'eth_call',
        params: [{ to: USDC_ADDRESS, data: balanceOfData }, 'latest'],
      }),
    });
    const usdcData = await usdcRes.json();
    const usdcBalance = parseInt(usdcData.result || '0', 16) / 1e6;

    return { pol: polBalance, usdc: usdcBalance };
  } catch (err) {
    console.error('Balance fetch error:', err);
    return { pol: 0, usdc: 0 };
  }
}

/**
 * Export wallet (for withdrawals)
 * User can copy private key to MetaMask or other wallet
 */
export async function exportWallet(encryptedKey: string, password: string) {
  try {
    const privateKey = await decryptPrivateKey(encryptedKey, password);
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    return {
      privateKey,
      address: account.address,
    };
  } catch (error) {
    throw new Error('Invalid password or corrupted wallet data');
  }
}

/**
 * Generate deposit QR code URL
 */
export function getDepositQRUrl(address: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=polygon:${address}`;
}

/**
 * Shorten address for display
 */
export function shortAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

/**
 * Verify that private key corresponds to address
 * Use this to validate wallet integrity
 */
export function verifyWallet(privateKey: string, expectedAddress: string): boolean {
  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    return account.address.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}
