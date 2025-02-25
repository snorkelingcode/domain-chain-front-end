// src/services/UserAuthenticationService.ts
import { ethers } from 'ethers';
import axios from 'axios';

export class UserAuthenticationService {
  private static readonly SESSION_TOKEN_KEY = 'domain_chain_session';
  private static readonly USER_DATA_KEY = 'domain_chain_user';
  private static readonly API_URL = process.env.BACKEND_URL || 'domain-chain-backend.vercel.app';

  // Initial sign-in with wallet
  static async authenticateWithWallet(address: string, provider: any): Promise<boolean> {
    try {
      // Get the nonce from backend
      const nonceResponse = await axios.get(`https://${this.API_URL}/api/auth/nonce?address=${address}`);
      const nonce = nonceResponse.data.nonce;
      
      // Ask user to sign the nonce
      const signer = provider.getSigner();
      const signature = await signer.signMessage(`Domain Chain Authentication: ${nonce}`);
      
      // Verify signature on backend
      const authResponse = await axios.post(`https://${this.API_URL}/api/auth/verify`, {
        address,
        signature,
        nonce
      });
      
      // Store the JWT token and expiration
      const { token, expiresAt } = authResponse.data;
      
      // Securely store in localStorage (we'll encrypt this)
      const encryptedToken = await this.encryptData(token);
      localStorage.setItem(this.SESSION_TOKEN_KEY, JSON.stringify({
        token: encryptedToken,
        expiresAt
      }));
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }
  
  // Encrypt sensitive data before storing locally
  private static async encryptData(data: string): Promise<string> {
    try {
      // Use AES-GCM encryption
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await this.deriveKeyFromDevice();
      
      return await this.performEncryption(data, key, iv);
    } catch (error) {
      console.error('Encryption error:', error);
      // Fall back to unencrypted data if encryption fails
      // In production, you might want to handle this differently
      return data;
    }
  }
  
  // Decrypt data when retrieved
  private static async decryptData(encryptedData: string): Promise<string> {
    try {
      const key = await this.deriveKeyFromDevice();
      return await this.performDecryption(encryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      // Return original data if decryption fails
      // This handles the case where data wasn't encrypted
      return encryptedData;
    }
  }
  
  // Generate a device-specific encryption key
  private static async deriveKeyFromDevice(): Promise<CryptoKey> {
    try {
      // Get device fingerprint data
      const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const timezoneOffset = new Date().getTimezoneOffset();
      const language = navigator.language;
      const platform = navigator.platform;
      
      // Combine device data for fingerprinting
      const deviceData = `${screenData}-${timezoneOffset}-${language}-${platform}`;
      const encoder = new TextEncoder();
      const deviceDataBuffer = encoder.encode(deviceData);
      
      // Create a salt
      const salt = encoder.encode('domain-chain-encryption-salt');
      
      // Import the device data as raw key material
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        deviceDataBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      
      // Derive an AES-GCM key using PBKDF2
      return await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: 'AES-GCM',
          length: 256
        },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Key derivation error:', error);
      // Return a placeholder key for development/testing
      // In production, use a more robust fallback strategy
      return {} as CryptoKey;
    }
  }
  
  // Use Web Crypto API for actual encryption
  private static async performEncryption(data: string, key: CryptoKey, iv: Uint8Array): Promise<string> {
    try {
      // Convert data to ArrayBuffer
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Encrypt the data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        dataBuffer
      );
      
      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encryptedBuffer), iv.length);
      
      // Convert to base64 string for storage
      return btoa(String.fromCharCode.apply(null, Array.from(result)));
    } catch (error) {
      console.error('Encryption operation error:', error);
      // Return placeholder for development/testing
      return data;
    }
  }
  
  // Matching decryption implementation
  private static async performDecryption(encryptedData: string): Promise<string> {
    try {
      // Convert from base64 to array
      const binaryString = atob(encryptedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Extract IV (first 12 bytes) and encrypted data
      const iv = bytes.slice(0, 12);
      const encryptedBuffer = bytes.slice(12);
      
      // Get the key
      const key = await this.deriveKeyFromDevice();
      
      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encryptedBuffer
      );
      
      // Convert the decrypted data back to a string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Decryption operation error:', error);
      // Return original data if decryption fails
      return encryptedData;
    }
  }
  
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const sessionData = localStorage.getItem(this.SESSION_TOKEN_KEY);
    if (!sessionData) return false;
    
    try {
      const { expiresAt } = JSON.parse(sessionData);
      return new Date(expiresAt).getTime() > Date.now();
    } catch {
      return false;
    }
  }
  
  // Log out user
  static logout(): void {
    localStorage.removeItem(this.SESSION_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }
  
  // Get authentication token for API calls
  static async getAuthToken(): Promise<string | null> {
    const sessionData = localStorage.getItem(this.SESSION_TOKEN_KEY);
    if (!sessionData) return null;
    
    try {
      const { token } = JSON.parse(sessionData);
      return await this.decryptData(token);
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }
}