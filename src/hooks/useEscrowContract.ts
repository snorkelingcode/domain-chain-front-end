import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

export const useEscrowContract = () => {
  const { 
    isConnected: wagmiIsConnected, 
    address: wagmiAccount 
  } = useAccount();

  const { 
    connect, 
    isPending: loading,
    error: connectError 
  } = useConnect();

  const { disconnect } = useDisconnect();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connectError) {
      setError(connectError.message || 'Failed to connect wallet');
    } else {
      setError(null);
    }
  }, [connectError]);

  const connectWallet = async () => {
    try {
      connect({
        connector: walletConnect({ 
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID 
        })
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to connect wallet';
      setError(errorMessage);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    connectWallet,
    disconnectWallet,
    loading,
    error,
    isConnected: wagmiIsConnected,
    account: wagmiAccount
  };
};