import React, { useState } from 'react';
import { 
  ConnectWallet,
  useAddress, 
  useDisconnect, 
  useConnectionStatus
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
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
  onDashboard: () => void;
  onSignOut: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onDashboard,
  onSignOut
}) => {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

  return (
    <ConnectWallet
      theme="light"
      btnTitle="Connect Wallet"
      modalTitle="Connect Your Wallet"
      switchToActiveChain={true}
      modalSize="wide"
    />
  );
};

export default WalletButton;