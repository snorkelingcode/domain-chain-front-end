import { useState, type FC, useEffect } from 'react';
import { 
  ThirdwebProvider,
  useAddress, 
  useConnect, 
  useDisconnect, 
  useConnectionStatus,
  metamaskWallet,
  coinbaseWallet,
  walletConnect
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import BuyerInterface from './components/BuyerInterface';
import Dashboard from './components/Dashboard';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel
} from './components/ui/Alert-Dialog';
import { Alert, AlertDescription } from './components/ui/Alerts';
import { LogOut, AlertCircle, X } from 'lucide-react';

// Wallet selection modal component
const WalletModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: string) => void;
}> = ({ isOpen, onClose, onSelectWallet }) => {
  if (!isOpen) return null;

  // Detect available wallets
  const ethereum = typeof window !== 'undefined' ? window.ethereum : null;
  
  // Check for Brave wallet
  const isBraveWallet = ethereum?.isBraveWallet === true;
  
  // Check for MetaMask
  const isMetaMaskInstalled = ethereum && (
    ethereum.isMetaMask || 
    ethereum.providers?.some((provider: { isMetaMask?: boolean }) => provider.isMetaMask)
  );
  
  // Check for Coinbase Wallet
  const isCoinbaseInstalled = ethereum?.isCoinbaseWallet === true;
  
  // List of supported wallets and their details
  const wallets = [
    {
      id: 'brave',
      name: 'Brave Wallet',
      icon: 'https://brave.com/static-assets/images/brave-logo-no-shadow.svg',
      installed: isBraveWallet
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      installed: isMetaMaskInstalled && !isBraveWallet // Don't show both Brave and MetaMask
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'https://www.coinbase.com/assets/mobile/wallet_app_icon-7a2c7078886664c5c74c3933a9bf2e26e52c539bba5882af09e1e3ccd53e4ce7.png',
      installed: isCoinbaseInstalled
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/images/walletconnect-logo.svg',
      installed: true // Always available as a fallback
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
        <div className="space-y-3">
          {wallets.map(wallet => (
            <button
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.id)}
              className="flex items-center w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img 
                src={wallet.icon} 
                alt={`${wallet.name} icon`} 
                className="w-8 h-8 mr-3" 
              />
              <div className="text-left">
                <span className="font-medium">{wallet.name}</span>
                {wallet.installed && (
                  <span className="text-xs text-green-600 block">
                    Detected
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          By connecting a wallet, you agree to Domain Chain's Terms of Service and acknowledge that you have read and understand the privacy policy.
        </div>
      </div>
    </div>
  );
};

interface WalletButtonProps {
  onDashboard: () => void;
  onSignOut: () => void;
}

const WalletButton: FC<WalletButtonProps> = ({
  onDashboard,
  onSignOut
}) => {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const address = useAddress();
  const connect = useConnect();
  const connectionStatus = useConnectionStatus();
  const isLoading = connectionStatus === "connecting";

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleSelectWallet = async (walletType: string) => {
    setShowWalletModal(false);
    
    try {
      setIsLoading(true);
      console.log(`Attempting to connect with ${walletType}...`);
      
      if (walletType === 'metamask') {
        console.log('Connecting to MetaMask...');
        const wallet = metamaskWallet();
        console.log('Created wallet instance:', wallet);
        await connect(wallet);
      } 
      else if (walletType === 'brave') {
        console.log('Connecting to Brave Wallet...');
        
        // Check if we're in Brave browser (alternative method)
        const isBrave = typeof window !== 'undefined' && 
                       window.navigator.userAgent.includes('Brave') && 
                       window.ethereum?.isBraveWallet;
        console.log('Is Brave Browser detected:', isBrave);
        
        // Try connecting directly with metamaskWallet for Brave
        try {
          console.log('Trying to connect with metamaskWallet for Brave...');
          const wallet = metamaskWallet();
          console.log('Created wallet instance:', wallet);
          
          // More detailed logging of window.ethereum
          console.log('window.ethereum:', window.ethereum);
          if (window.ethereum && window.ethereum.providers) {
            console.log('Available providers:', window.ethereum.providers);
          }
          
          await connect(wallet);
          console.log('Connection attempt completed');
        } catch (braveError) {
          console.error('Brave wallet connection error:', braveError);
          
          // Try connecting using window.ethereum directly if available
          if (window.ethereum) {
            console.log('Trying alternative connection method...');
            try {
              // Request accounts directly
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log('Accounts received:', accounts);
              
              // Now try the normal connection
              await connect(metamaskWallet());
            } catch (directError) {
              console.error('Direct connection error:', directError);
              throw directError;
            }
          } else {
            throw braveError;
          }
        }
      } 
      else if (walletType === 'coinbase') {
        console.log('Connecting to Coinbase Wallet...');
        const wallet = coinbaseWallet();
        console.log('Created wallet instance:', wallet);
        await connect(wallet);
      } 
      else if (walletType === 'walletconnect') {
        console.log('Connecting to WalletConnect...');
        const wallet = walletConnect();
        console.log('Created wallet instance:', wallet);
        await connect(wallet);
      }
      
      console.log('Connection process completed');
    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Local state for loading indicator
  const [isLocalLoading, setIsLoading] = useState(false);
  // Combine both loading states
  const isButtonLoading = isLoading || isLocalLoading;

  if (address) {
    return (
      <div className="flex gap-2">
        <button 
          onClick={onDashboard}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          type="button"
        >
          {formatAddress(address)}
        </button>
        <button 
          onClick={() => setShowSignOutDialog(true)}
          className="px-2 py-2 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          type="button"
        >
          <LogOut size={16} />
        </button>

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
                onClick={() => {
                  onSignOut();
                  setShowSignOutDialog(false);
                }}
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

  return (
    <>
      <button 
        onClick={handleConnectWallet}
        disabled={isButtonLoading}
        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        type="button"
      >
        {isButtonLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

const AppContent: FC = () => {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const [error, setError] = useState<string | null>(null);
  const address = useAddress();
  const disconnect = useDisconnect();
  
  // Update mode if user disconnects
  useEffect(() => {
    if (!address && mode === 'dashboard') {
      setMode('buy');
    }
  }, [address, mode]);

  const handleSignOut = () => {
    disconnect();
    setMode('buy');
  };

  const displayError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {error && (
          <div className="absolute top-4 left-0 right-0 z-50 px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Mobile Header */}
          <div className="w-full flex flex-col items-center gap-3 sm:hidden">
            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <div className="absolute top-3 right-2 sm:hidden">
              <WalletButton 
                onDashboard={() => setMode('dashboard')}
                onSignOut={handleSignOut}
              />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex w-full relative justify-center items-center">
            <div className="absolute left-0" />

            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>

            <div className="absolute right-0 flex items-center gap-2">
              <WalletButton 
                onDashboard={() => setMode('dashboard')}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main>
          {mode === 'dashboard' ? (
            <Dashboard onBack={() => setMode('buy')} />
          ) : (
            <BuyerInterface />
          )}
        </main>
      </div>
    </div>
  );
};

const App: FC = () => {
  const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  console.log('Using ThirdWeb Client ID:', clientId);
  
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId={clientId}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect()
      ]}
    >
      <AppContent />
    </ThirdwebProvider>
  );
};

export default App;