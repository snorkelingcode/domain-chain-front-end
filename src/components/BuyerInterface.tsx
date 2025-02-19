import React, { useState } from 'react';
import { useEscrowContract } from '../hooks/useEscrowContract';
import { Alert, AlertDescription } from './alert';
import { 
  ArrowRight, 
  DollarSign, 
  Globe, 
  Wallet,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const BuyerInterface: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [escrowDetails, setEscrowDetails] = useState({
    id: '',
    domain: '',
    price: '',
    seller: '',
    status: 'pending'
  });

  const { 
    connectWallet, 
    contract, 
    signer,
    confirmDomainTransfer,
    releaseFunds 
  } = useEscrowContract();

  const steps = [
    { number: 1, title: 'Review Listing' },
    { number: 2, title: 'Fund Escrow' },
    { number: 3, title: 'Verify Transfer' },
    { number: 4, title: 'Complete Purchase' }
  ];

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');
    try {
      await connectWallet();
      setSuccess('Wallet connected successfully!');
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      // Here you would typically call the contract to fund the escrow
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);
      setSuccess('Escrow funded successfully!');
    } catch (err) {
      setError('Failed to fund escrow. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifyTransfer = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmDomainTransfer(escrowDetails.id);
      setCurrentStep(3);
      setSuccess('Domain transfer verified!');
    } catch (err) {
      setError('Failed to verify domain transfer. Please try again.');
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    try {
      await releaseFunds(escrowDetails.id);
      setCurrentStep(4);
      setSuccess('Purchase completed successfully!');
    } catch (err) {
      setError('Failed to complete purchase. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {step.number}
            </div>
            <span className={`ml-2 ${
              currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <ArrowRight className={`mx-4 ${
                currentStep > step.number ? 'text-blue-600' : 'text-gray-300'
              }`} size={20} />
            )}
          </div>
        ))}
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Domain Listing Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="text-gray-400" size={20} />
                <span className="font-medium">example.com</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="text-gray-400" size={20} />
                <span className="font-medium">2.5 ETH</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Wallet className="text-gray-400" size={20} />
                <span className="text-sm text-gray-600">Seller: 0x1234...5678</span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  Processing...
                </div>
              ) : (
                'Purchase Domain'
              )}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Verify Domain Transfer</h2>
            <Alert>
              <AlertDescription>
                Please verify that the domain has been transferred to your wallet address. 
                Check your domain registrar account for confirmation.
              </AlertDescription>
            </Alert>
            <button
              onClick={handleVerifyTransfer}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Confirm Transfer'}
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Complete Purchase</h2>
            <Alert>
              <AlertDescription>
                The domain transfer has been verified. Click below to complete the purchase 
                and release funds to the seller.
              </AlertDescription>
            </Alert>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Completing...' : 'Complete Purchase'}
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Purchase Complete!</h2>
            <p className="text-gray-600">
              Congratulations! The domain is now yours and the funds have been released to the seller.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInterface;