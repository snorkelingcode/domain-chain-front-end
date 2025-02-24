// WalletButton.tsx - A standalone component you can import in App.tsx
import React, { useState } from 'react';
import { useAddress, useConnect, useDisconnect, useConnectionStatus } from "@thirdweb-dev/react";
import { metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
import { LogOut } from 'lucide-react';
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

interface WalletButtonProps {
  address?: string;
  onConnect: () => void;
  onDashboard: () => void;
  onSignOut: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onDashboard,
  onSignOut
}) => {
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
      // Try MetaMask first
      await connect(metamaskWallet());
    } catch (error) {
      console.error("Connection failed:", error);
      try {
        // Try Coinbase Wallet as fallback
        await connect(coinbaseWallet());
      } catch (secondError) {
        console.error("Second connection attempt failed:", secondError);
        try {
          // Try WalletConnect as last resort
          await connect(walletConnect());
        } catch (thirdError) {
          console.error("All connection attempts failed:", thirdError);
        }
      }
    }
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

export default WalletButton;