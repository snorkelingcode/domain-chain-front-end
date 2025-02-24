import React, { useState } from 'react';
import { 
  useAddress, 
  useDisconnect, 
  useConnectionStatus,
  useConnect,
  metamaskWallet,
  coinbaseWallet,
  walletConnect
} from "@thirdweb-dev/react";
import { LogOut, X } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel
} from './ui/Alert-Dialog';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: string) => void;
}

// Wallet selection modal component
const WalletModal: React.FC<WalletModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectWallet 
}) => {
  if (!isOpen) return null;

  // Detect available wallets
  const ethereum = typeof window !== 'undefined' ? window.ethereum : null;
  
  // Check for Brave wallet
  const isBraveWallet = ethereum?.isBraveWallet === true;
  
  // Check for MetaMask
  const isMetaMaskInstalled = ethereum && (
    ethereum.isMetaMask || 
    ethereum.providers?.some((provider: any) => provider.isMetaMask)
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

const WalletButton: React.FC<WalletButtonProps> = ({
  onDashboard,
  onSignOut
}) => {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  
  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  
  const isLoading = connectionStatus === "connecting";
  const isButtonLoading = isLoading || isLocalLoading;

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleSelectWallet = async (walletType: string) => {
    setShowWalletModal(false);
    
    try {
      setIsLocalLoading(true);
      console.log(`Attempting to connect with ${walletType}...`);
      
      let walletConfig: any;

      switch (walletType) {
        case 'metamask':
          walletConfig = metamaskWallet();
          break;
        case 'brave':
          walletConfig = metamaskWallet(); // Use metamaskWallet for Brave
          break;
        case 'coinbase':
          walletConfig = coinbaseWallet();
          break;
        case 'walletconnect':
          walletConfig = walletConnect({
            projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ""
          });
          break;
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      await connect(walletConfig);
    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleSignOut = () => {
    disconnect();
    onSignOut();
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
                  handleSignOut();
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
        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 w-full"
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

export default WalletButton;