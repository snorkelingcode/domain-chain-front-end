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

// Enhanced wallet button that uses thirdweb hooks
const EnhancedWalletButton: FC<{
  onDashboard: () => void;
  onSignOut: () => void;
}> = ({ onDashboard, onSignOut }) => {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const address = useAddress();
  const connect = useConnect();
  const connectionStatus = useConnectionStatus();
  const isConnecting = connectionStatus === "connecting";

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect(metamaskWallet());
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleSignOut = () => {
    onSignOut();
    setShowSignOutDialog(false);
  };

  // If connected, show address and dashboard button
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

  // If not connected, show connect button
  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      type="button"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

// AppContent with improved wallet connection
const AppContent: FC = () => {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const address = useAddress();
  const disconnect = useDisconnect();

  // If user disconnects while in dashboard mode, switch to buy mode
  if (mode === 'dashboard' && !address) {
    setMode('buy');
  }

  const handleSignOut = () => {
    disconnect();
    setMode('buy');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
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
              <EnhancedWalletButton 
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
              <EnhancedWalletButton 
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

// Updated App component with ThirdwebProvider
const App: FC = () => {
  const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  
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