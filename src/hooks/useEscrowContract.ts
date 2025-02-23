import { useState, useEffect } from 'react';
import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum, polygon } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi';

// Ensure type safety for environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.error('Missing WalletConnect Project ID');
}

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, arbitrum, polygon],
  connectors: [
    walletConnect({ 
      projectId: projectId || '',
      metadata: {
        name: 'Domain Chain',
        description: 'Domain Marketplace',
        url: 'https://domainchain.com',
        icons: ['https://yourdomain.com/logo.png']
      }
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http()
  }
});

// Create Web3Modal
const web3modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId || '',
  enableAnalytics: true
});

export const useEscrowContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Setup event listeners for connection state
    const unsubscribe = config.subscribe(
      (state) => {
        const address = state.address;
        const isConnected = state.isConnected;

        setIsConnected(!!isConnected);
        setAccount(address || null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Open WalletConnect modal
      web3modal.open();
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

  const disconnectWallet = () => {
    try {
      config.disconnect();
      setIsConnected(false);
      setAccount(null);
    } catch (err) {
      console.error('Disconnect error', err);
    }
  };

  // Mock createEscrow method (you'll replace this with actual contract interaction)
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