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

  // Add mock createEscrow method
  const createEscrow = async ({
    domainName,
    price,
    duration
  }: {
    domainName: string;
    price: string;
    duration: number;
  }) => {
    setLoading(true);
    try {
      // Simulate escrow creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Creating escrow for ${domainName} at ${price} ETH for ${duration} days`);
      return {
        success: true,
        transactionHash: '0x1234...',
        escrowId: '123'
      };
    } catch (err) {
      setError('Failed to create escrow');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    createEscrow, // Add this to the returned object
    loading,
    error,
    isConnected,
    account
  };
};