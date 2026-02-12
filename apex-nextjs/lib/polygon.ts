// lib/polygon.ts - Wallet management for APEX v0.2
import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { polygon } from 'viem/chains';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { ethers } from 'ethers';

const USDC_CONTRACT = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // Polygon USDC

// Generate new wallet
export function generateWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  
  return {
    address: account.address,
    privateKey: privateKey,
  };
}

// Encrypt private key for storage
export function encryptPrivateKey(privateKey: string, password: string): string {
  // Simple AES encryption - in production, use proper key management
  const encrypted = ethers.AES.encrypt(privateKey, password).toString();
  return encrypted;
}

// Decrypt private key
export function decryptPrivateKey(encryptedKey: string, password: string): string {
  const decrypted = ethers.AES.decrypt(encryptedKey, password).toString();
  return decrypted;
}

// Get wallet client for transactions
export function getWalletClient(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  return createWalletClient({
    account,
    chain: polygon,
    transport: http('https://polygon-rpc.com'),
  });
}

// Get balances
export async function getBalances(address: string) {
  const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
  
  // POL balance
  const polBalance = await provider.getBalance(address);
  
  // USDC balance
  const usdcContract = new ethers.Contract(
    USDC_CONTRACT,
    ['function balanceOf(address) view returns (uint256)'],
    provider
  );
  const usdcBalance = await usdcContract.balanceOf(address);
  
  return {
    pol: formatEther(polBalance),
    usdc: (Number(usdcBalance) / 1e6).toFixed(6), // USDC has 6 decimals
  };
}

// Request testnet POL from faucet (for testing)
export async function requestTestnetPOL(address: string) {
  // For Mumbai testnet only
  const response = await fetch('https://faucet.polygon.technology/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      network: 'mumbai',
      address: address,
      token: 'maticToken',
    }),
  });
  
  return response.json();
}

// Deposit address QR code URL
export function getDepositQRUrl(address: string, amount?: number) {
  const base = 'ethereum:' + address;
  if (amount) {
    return `${base}?value=${amount}`;
  }
  return base;
}
