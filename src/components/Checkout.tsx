import React, { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/Alert-Dialog';
import { Shield, AlertCircle } from 'lucide-react';
import type { DomainListing } from '../types/domain';

interface CheckoutProps {
  listing: DomainListing;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ listing, open, onClose, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      // Smart contract interaction would go here
      // await escrowContract.purchase(listing.id, { value: ethers.parseEther(listing.price) });
      onConfirm();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Domain Purchase</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to purchase the following domain.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-4">
          {/* Domain Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">{listing.domain}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{listing.price} ETH</span>
              </div>
            </div>
          </div>

          {/* Purchase Steps */}
          <div className="space-y-3">
            <div className="flex items-start justify-center gap-3">
              <div>
                <h4 className="font-medium flex items-center gap-3">
                  <Shield className="text-blue-600" size={20} />
                  Secure Transfer
                </h4>
                <p className="text-sm text-gray-600">Domain transfer is verified before completion</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <p className="text-sm text-yellow-800">
              Make sure you have enough ETH in your wallet to cover the domain price plus gas fees.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePurchase}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Processing...' : `Purchase for ${listing.price} ETH`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Checkout;