import React, { useState } from 'react';
import BuyerInterface from './components/BuyerInterface';
import Dashboard from './components/Dashboard';
import { useEscrowContract } from './hooks/useEscrowContract';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/Alert-Dialog';
import { LogOut } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const { 
    connectWallet, 
    disconnectWallet,
    loading, 
    isConnected,
    account 
  } = useEscrowContract();

  const handleConnectWallet = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      setMode('dashboard');
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
        {/* Header Section */}
        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Mobile Layout */}
          <div className="w-full flex flex-col items-center gap-3 sm:hidden">
            {/* Logo */}
            <div className={`${mode === 'buy' || mode === 'dashboard' ? 'flex-shrink-0' : 'hidden'}`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Wallet Section */}
            {isConnected ? (
              <div className="w-full flex gap-2">
                <button 
                  onClick={() => setMode('dashboard')}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {account ? formatAddress(account) : 'Dashboard'}
                </button>
                <button 
                  onClick={() => setShowSignOutDialog(true)}
                  className="px-4 py-2 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex w-full relative justify-between items-center">
            {/* Logo */}
            <div className={`${mode === 'buy' || mode === 'dashboard' ? 'flex-shrink-0' : 'invisible'}`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>

            {/* Wallet Section */}
            {isConnected ? (
              <div className="flex items-center gap-2">
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

export default App;