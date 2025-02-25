// services/CryptoService.ts
export class CryptoService {
    private static readonly SALT = 'domain-chain-salt';
    private static readonly IV_LENGTH = 12;
    
    // Generate encryption key from password and device fingerprint
    static async generateKey(password: string, deviceFingerprint: string): Promise<CryptoKey> {
      // Combine password with device fingerprint
      const combinedKey = password + deviceFingerprint;
      
      // Convert to ArrayBuffer
      const encoder = new TextEncoder();
      const keyMaterial = encoder.encode(combinedKey);
      
      // Derive key using PBKDF2
      const salt = encoder.encode(this.SALT);
      const importedKey = await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      
      // Generate AES-GCM key
      return window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        importedKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }
    
    // Encrypt data
    static async encrypt(data: string, key: CryptoKey): Promise<string> {
      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      // Encode data
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
      
      // Encrypt the data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encodedData
      );
      
      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      encryptedArray.set(iv);
      encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
      
      // Convert to base64
      return this.arrayBufferToBase64(encryptedArray);
    }
    
    // Decrypt data
    static async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
      try {
        // Convert from base64
        const encryptedArray = this.base64ToArrayBuffer(encryptedData);
        
        // Extract IV and encrypted data
        const iv = encryptedArray.slice(0, this.IV_LENGTH);
        const encryptedBuffer = encryptedArray.slice(this.IV_LENGTH);
        
        // Decrypt the data
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv
          },
          key,
          encryptedBuffer
        );
        
        // Decode the result
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
      } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
      }
    }
    
    // Generate device fingerprint
    static async generateDeviceFingerprint(): Promise<string> {
      // Collect various device data for fingerprinting
      const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const timezoneOffset = new Date().getTimezoneOffset();
      const language = navigator.language;
      const platform = navigator.platform;
      const userAgent = navigator.userAgent;
      
      // Combine data
      const rawFingerprint = [
        screenData,
        timezoneOffset,
        language,
        platform,
        userAgent
      ].join('|');
      
      // Hash the fingerprint
      const encoder = new TextEncoder();
      const data = encoder.encode(rawFingerprint);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      
      // Convert to hex string
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    
    // Convert ArrayBuffer to base64
    private static arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
    
    // Convert base64 to ArrayBuffer
    private static base64ToArrayBuffer(base64: string): Uint8Array {
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  }