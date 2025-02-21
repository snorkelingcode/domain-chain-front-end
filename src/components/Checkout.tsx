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
import { Shield, Check, Copy, ExternalLink } from 'lucide-react';
import type { DomainListing } from '../types/domain';

interface CheckoutProps {
  listing: DomainListing;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ listing, open, onClose, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    transactionHash: '',
    eppCode: '',
    timestamp: ''
  });

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      // Smart contract interaction would go here
      // await escrowContract.purchase(listing.id, { value: ethers.parseEther(listing.price) });
      
      // Simulate successful purchase
      setTimeout(() => {
        setTransactionDetails({
          transactionHash: '0x1234...5678',
          eppCode: 'ABC123XYZ',
          timestamp: new Date().toISOString()
        });
        setPurchaseComplete(true);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Purchase failed:', error);
      setIsProcessing(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (purchaseComplete) {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={24} />
              <AlertDialogTitle>Purchase Successful!</AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <div className="space-y-4">
            {/* Receipt Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Purchase Receipt</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">{listing.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">{listing.price} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(transactionDetails.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Transaction:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">
                      {`${transactionDetails.transactionHash.slice(0, 6)}...${transactionDetails.transactionHash.slice(-4)}`}
                    </span>
                    <button 
                      onClick={() => handleCopyToClipboard(transactionDetails.transactionHash)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy size={16} />
                    </button>
                    <a 
                      href={`https://etherscan.io/tx/${transactionDetails.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Transfer Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Domain Transfer Information</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">New EPP Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{transactionDetails.eppCode}</span>
                      <button 
                        onClick={() => handleCopyToClipboard(transactionDetails.eppCode)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use this EPP code with your domain registrar to complete the transfer
                  </p>
                </div>
                <div className="text-sm space-y-2">
                  <p className="font-medium">Next steps:</p>
                  <ol className="list-decimal ml-4 space-y-1 text-gray-600">
                    <li>Log in to your domain registrar account</li>
                    <li>Initiate the domain transfer process</li>
                    <li>Enter the new EPP code when prompted</li>
                    <li>Confirm the transfer request</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={onConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Return to Listings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Domain Purchase</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to purchase the following domain.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="p-6">
          {/* Domain Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-lg mb-2">{listing.domain}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{listing.price} ETH</span>
              </div>
            </div>
          </div>

          {/* Purchase Steps */}
          <div className="flex items-start justify-center sm:justify-start sm:pl-4 gap-3">
            <div>
              <h4 className="font-medium flex items-center gap-3">
                <Shield className="text-blue-600" size={20} />
                Secure Transfer
              </h4>
              <p className="text-sm text-gray-600">
                Domain transfer is verified before completion
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePurchase}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Processing...' : `Purchase for ${listing.price} ETH`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Checkout;