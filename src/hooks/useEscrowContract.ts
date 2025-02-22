import { useState, useEffect } from 'react';
import { createConfig, http, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, arbitrum, polygon } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi/react';

// Ensure type safety for environment variables
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID in environment variables');
}

// Create wagmi config
export const config = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Domain Chain',
        description: 'Domain Marketplace',
        url: window.location.origin,
        icons: [`${window.location.origin}/logo.png`]
      }
    })
  ],
  transports: {
    [mainnet.id]: http()
  }
});

// Create Web3Modal (if not already created in App.tsx)
createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId || '',
  enableAnalytics: true
});

export const useEscrowContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Wagmi hooks for connection state and actions
  const { 
    isConnected, 
    address: account 
  } = useAccount();

  const { 
    connectAsync, 
    error: connectError 
  } = useConnect();

  const { 
    disconnectAsync 
  } = useDisconnect();

  // Sync error state with connect error
  useEffect(() => {
    if (connectError) {
      setError(connectError.message);
    }
  }, [connectError]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Attempt to connect wallet
      await connectAsync({ connector: config.connectors[0] });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error('Disconnect error', err);
      setError('Failed to disconnect wallet');
    }
  };

  // Mock createEscrow method (replace with actual contract interaction)
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
    createEscrow,
    loading,
    error,
    isConnected,
    account
  };
};