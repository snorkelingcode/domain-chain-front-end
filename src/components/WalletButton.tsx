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

// Custom CSS for wallet button
const walletButtonStyles = {
  // Base button styles
  connectButton: {
    backgroundColor: "#2563eb", // Blue-600
    color: "white",
    borderRadius: "0.5rem",
    fontWeight: "500",
    fontSize: "0.875rem",
    height: "40px", // Reduced height
    padding: "0 1rem",
    width: "100%", // Full width on mobile
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#1d4ed8" // Blue-700 on hover
    }
  },
  // Connected state button styles
  detailsButton: {
    backgroundColor: "#2563eb", // Blue-600
    color: "white",
    borderRadius: "0.5rem",
    fontWeight: "500",
    fontSize: "0.875rem",
    height: "40px", // Reduced height
    padding: "0 1rem",
    width: "100%", // Full width on mobile
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#1d4ed8" // Blue-700 on hover
    }
  }
};

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
      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={onDashboard}
          className="px-4 py-2 h-10 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none"
          type="button"
        >
          {formatAddress(address)}
        </button>
        <button 
          onClick={() => setShowSignOutDialog(true)}
          className="px-2 py-2 h-10 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
    <div className="w-full sm:w-auto">
      <ConnectWallet
        theme="light"
        btnTitle="Connect Wallet"
        modalTitle="Connect Your Wallet"
        switchToActiveChain={true}
        modalSize="wide"
        className="!h-10 !bg-blue-600 hover:!bg-blue-700 !text-white !font-medium !text-sm !rounded-lg !w-full sm:!w-auto !transition-colors"
      />
    </div>
  );
};

export default WalletButton;