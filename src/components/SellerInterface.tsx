import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck,
  Globe,
  Clock,
  ChevronDown,
  DollarSign,
  AlertCircle
} from 'lucide-react';

import { useEscrowContract } from '../hooks/useEscrowContract';
import { 
  Alert, 
  AlertDescription 
} from './ui/Alerts';

interface SellerInterfaceProps {
  onListingPublished?: () => void;
}

const SellerInterface: React.FC<SellerInterfaceProps> = ({ 
  onListingPublished 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [domainName, setDomainName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('7');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const { 
    requestDomainVerification, 
    listDomain,
    verificationStatuses,
    account
  } = useEscrowContract();

  // Track verification status
  const verificationStatus = verificationStatuses[domainName] || { 
    status: 'not_started' 
  };

  // Wallet connection check
  useEffect(() => {
    if (!account) {
      setCurrentStep(1);
    }
  }, [account]);

  // Handle domain verification
  const handleDomainVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);
    
    try {
      await requestDomainVerification(domainName);
      setCurrentStep(2);
    } catch (error) {
      console.error('Verification failed', error);
      setVerificationError(
        error instanceof Error 
          ? error.message 
          : 'Domain verification failed'
      );
    }
  };

  // Handle domain listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await listDomain(domainName, price);
      setCurrentStep(3);
      onListingPublished?.();
    } catch (error) {
      console.error('Listing creation failed', error);
      setVerificationError(
        error instanceof Error 
          ? error.message 
          : 'Domain listing failed'
      );
    }
  };

  // Render verification status indicator
  const renderVerificationStatusIndicator = () => {
    switch(verificationStatus.status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-2 text-yellow-600">
            <Clock className="animate-spin" />
            <span>Verification in progress...</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <ShieldCheck />
            <span>Domain Verified Successfully!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle />
            <span>Verification Failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const [eppCode, setEppCode] = useState('');

  // Step 1: Domain Verification Initiation
  const renderVerificationStep = () => (
    <form onSubmit={handleDomainVerification} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Domain Name</label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            placeholder="example.com"
            className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">EPP Code</label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={eppCode}
            onChange={(e) => setEppCode(e.target.value)}
            placeholder="Enter your domain's EPP code"
            className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          The EPP code from your current registrar is required to verify ownership
        </p>
      </div>

      {verificationError && (
        <Alert variant="destructive">
          <AlertDescription>{verificationError}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertDescription className="text-blue-600 text-sm">
          <div className="font-medium mb-2">Domain Verification Process:</div>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Enter your domain name and EPP code</li>
            <li>Our platform verifies domain ownership</li>
            <li>Domain is temporarily locked in escrow</li>
            <li>A new EPP code will be generated upon sale</li>
          </ol>
        </AlertDescription>
      </Alert>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Verify Domain
      </button>
    </form>
  );

  // Step 2: Domain Listing Configuration
  const renderListingStep = () => {
    if (verificationStatus.status !== 'verified') {
      return (
        <div className="text-center space-y-4">
          {renderVerificationStatusIndicator()}
          <button 
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Verification
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleCreateListing} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Listed Domain</label>
          <input 
            type="text" 
            value={domainName} 
            readOnly 
            className="w-full p-2 bg-gray-100 border rounded-md" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (ETH)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.001"
              min="0"
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Listing Duration</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md appearance-none bg-white"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Domain Listing
        </button>
      </form>
    );
  };

// Step 3: Listing Confirmation
const renderListingConfirmation = () => (
  <div className="text-center space-y-6">
    <ShieldCheck className="mx-auto text-green-600" size={64} />
    <h2 className="text-2xl font-bold">Domain Successfully Listed</h2>
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="font-medium">{domainName}</p>
      <p className="text-sm text-gray-600">Listed for {price} ETH</p>
    </div>
    <button 
      onClick={() => {
        setCurrentStep(1);
        setDomainName('');
        setPrice('');
        setEppCode(''); // Added this line
      }}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      List Another Domain
    </button>
  </div>
);

  // Render current step
  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: return renderVerificationStep();
      case 2: return renderListingStep();
      case 3: return renderListingConfirmation();
      default: return null;
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-6">
          {[
            { step: 1, label: 'Verify' },
            { step: 2, label: 'List' },
            { step: 3, label: 'Confirm' }
          ].map(({ step, label }) => (
            <div 
              key={step} 
              className="flex flex-col items-center"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {step}
              </div>
              <span className={`
                text-sm mt-1
                ${currentStep >= step 
                  ? 'text-blue-600' 
                  : 'text-gray-500'}
              `}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default SellerInterface;