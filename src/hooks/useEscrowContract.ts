import { useState } from 'react';

export const useEscrowContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Mock wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
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

  return {
    connectWallet,
    disconnectWallet,
    loading,
    error,
    isConnected,
    account
  };
};