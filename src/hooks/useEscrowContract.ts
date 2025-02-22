import { useState } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (accounts: string[]) => void) => void;
      removeListener: (eventName: string, handler: (accounts: string[]) => void) => void;
      selectedAddress: string | null;
      chainId: string;
    };
  }
}

interface VerificationStatus {
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  timestamp?: number;
  details?: string;
}

export const useEscrowContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, VerificationStatus>>({});

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('Failed to connect wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const mockAccount = '0x1234567890123456789012345678901234567890';
      setAccount(mockAccount);
      setIsConnected(true);
      return { account: mockAccount };
    } catch (err) {
      setError('Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const requestDomainVerification = async (domainName: string) => {
    setLoading(true);
    try {
      // Mock verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update verification status
      setVerificationStatuses(prev => ({
        ...prev,
        [domainName]: {
          status: 'verified',
          timestamp: Date.now(),
          details: 'Domain ownership verified'
        }
      }));

      return { account };
    } catch (err) {
      setError('Failed to verify domain');
      setVerificationStatuses(prev => ({
        ...prev,
        [domainName]: {
          status: 'failed',
          timestamp: Date.now(),
          details: err instanceof Error ? err.message : 'Verification failed'
        }
      }));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listDomain = async (domainName: string, price: string) => {
    setLoading(true);
    try {
      // Mock listing process
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError('Failed to list domain');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    requestDomainVerification,
    listDomain,
    loading,
    error,
    isConnected,
    account,
    verificationStatuses
  };
};