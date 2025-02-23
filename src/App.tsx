import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import BuyerInterface from './components/BuyerInterface';
import Dashboard from './components/Dashboard';
import { useEscrowContract, config } from './hooks/useEscrowContract';
import { config as appConfig } from './config';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/Alert-Dialog';
import { Alert, AlertDescription } from './components/ui/Alerts';
import { LogOut, AlertCircle } from 'lucide-react';

// Create a client
const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: appConfig.walletConnect.projectId,
  enableAnalytics: true
});

function AppContent() {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const { 
    connectWallet, 
    disconnectWallet,
    loading, 
    error,
    isConnected,
    account 
  } = useEscrowContract();

  const handleConnectWallet = async () => {
    try {
      if (!isConnected) {
        await connectWallet();
      } else {
        setMode('dashboard');
      }
    } catch (connectionError) {
      console.error('Wallet connection failed', connectionError);
    }
  };

  const handleSignOut = () => {
    disconnectWallet();
    setMode('buy');
    setShowSignOutDialog(false);
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Error Alert */}
        {error && (
          <div className="absolute top-4 left-0 right-0 z-50 px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Mobile Layout */}
          <div className="w-full flex flex-col items-center gap-3 sm:hidden">
            {/* Centered Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Wallet Section */}
            <div className="absolute top-3 right-2 sm:hidden">
              {isConnected ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMode('dashboard')}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {account ? formatAddress(account) : 'Dashboard'}
                  </button>
                  <button 
                    onClick={() => setShowSignOutDialog(true)}
                    className="px-2 py-2 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex w-full relative justify-center items-center">
            {/* Placeholder for left side balance */}
            <div className="absolute left-0">
              {/* This div keeps the wallet section in place */}
            </div>

            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>

            {/* Wallet Section */}
            <div className="absolute right-0 flex items-center gap-2">
              {isConnected ? (
                <>
                  <button 
                    onClick={() => setMode('dashboard')}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {account ? formatAddress(account) : 'Dashboard'}
                  </button>
                  <button 
                    onClick={() => setShowSignOutDialog(true)}
                    className="p-2 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        {mode === 'dashboard' ? (
          <Dashboard onBack={() => setMode('buy')} />
        ) : (
          <BuyerInterface />
        )}
      </div>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSignOutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;