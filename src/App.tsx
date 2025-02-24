import { useState, type FC } from 'react';
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
import { LogOut, AlertCircle } from 'lucide-react';

interface WalletButtonProps {
  address?: string;
  isLoading: boolean;
  onConnect: () => void;
  onDashboard: () => void;
  onSignOut: () => void;
}

const WalletButton: FC<WalletButtonProps> = ({
  address,
  isLoading,
  onConnect,
  onDashboard,
  onSignOut
}) => {
  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
          onClick={onSignOut}
          className="px-2 py-2 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          type="button"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={onConnect}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      type="button"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

const AppContent: FC = () => {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout. Please try again.')), 30000);
    });

    try {
      await Promise.race([
        (async () => {
          if (!address) {
            const ethereum = (window as any).ethereum;
            const nav = navigator as any;
            const isBrave = nav.brave && await nav.brave.isBrave();
            
            if (isBrave) {
              if (ethereum?.isBraveWallet) {
                await connect(metamaskWallet({
                  recommended: true,
                  shimDisconnect: true
                } as any));
              } else if (ethereum?.isMetaMask) {
                await connect(metamaskWallet());
              } else {
                setError('Please enable your wallet in Brave or install MetaMask');
                return;
              }
            } else {
              await connect(metamaskWallet());
            }
          } else {
            setMode('dashboard');
          }
        })(),
        timeoutPromise
      ]);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = () => {
    disconnect();
    setMode('buy');
    setShowSignOutDialog(false);
  };

  const isLoading = connectionStatus === "connecting" || isConnecting;

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
                address={address}
                isLoading={isLoading}
                onConnect={handleConnectWallet}
                onDashboard={() => setMode('dashboard')}
                onSignOut={() => setShowSignOutDialog(true)}
              />
            </div>
          </div>

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
                address={address}
                isLoading={isLoading}
                onConnect={handleConnectWallet}
                onDashboard={() => setMode('dashboard')}
                onSignOut={() => setShowSignOutDialog(true)}
              />
            </div>
          </div>
        </div>
        
        <main>
          {mode === 'dashboard' ? (
            <Dashboard onBack={() => setMode('buy')} />
          ) : (
            <BuyerInterface />
          )}
        </main>
      </div>

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
};

const App: FC = () => {
  const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  console.log("Client ID:", clientId);

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