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

const SellerInterface: React.FC<SellerInterfaceProps> = ({ onListingPublished }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [domainName, setDomainName] = useState('');
  const [eppCode, setEppCode] = useState('');
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

  // Step 1: Domain Verification Initiation
  const renderVerificationStep = () => (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Verify Domain Ownership</h2>
        <img 
          src="/LogoHeader_Transparent_5972X_1080Y.png" 
          alt="Domain Chain Logo" 
          className="h-16 w-auto"
        />
      </div>

      <form onSubmit={handleDomainVerification} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="example.com"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">EPP/Authorization Code</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={eppCode}
              onChange={(e) => setEppCode(e.target.value)}
              placeholder="Enter EPP code"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 space-y-2">
          <h3 className="text-sm font-medium text-blue-900">Domain Verification Process:</h3>
          <ol className="text-sm text-blue-700 ml-4 space-y-1">
            <li>Enter your domain name and EPP code</li>
            <li>Our platform will verify domain ownership</li>
            <li>Domain will be temporarily transferred to our escrow platform</li>
            <li>New EPP code will be generated to prevent unauthorized transfers</li>
          </ol>
          <p className="text-sm text-red-600 mt-2">
            WARNING: Once you verify your domain, the platform will change your EPP code while in escrow. You may cancel
            your listing at any time for the new EPP code.
          </p>
        </div>

        {verificationError && (
          <Alert variant="destructive">
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Verify Domain
        </button>
      </form>
    </div>
  );

  // Step 2: Domain Listing Configuration
  const renderListingStep = () => {
    if (verificationStatus.status !== 'verified') {
      return (
        <div className="text-center space-y-4">
          {renderVerificationStatusIndicator()}
          <button 
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to Verification
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">List Your Domain</h2>
          <img 
            src="/LogoHeader_Transparent_5972X_1080Y.png" 
            alt="Domain Chain Logo" 
            className="h-16 w-auto"
          />
        </div>

        <form onSubmit={handleCreateListing} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listed Domain</label>
            <input 
              type="text" 
              value={domainName} 
              readOnly 
              className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETH)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Duration</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md appearance-none bg-white"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Create Domain Listing
          </button>
        </form>
      </div>
    );
  };

  // Step 3: Listing Confirmation
  const renderListingConfirmation = () => (
    <div className="w-full max-w-xl mx-auto text-center space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Listing Confirmed</h2>
        <img 
          src="/LogoHeader_Transparent_5972X_1080Y.png" 
          alt="Domain Chain Logo" 
          className="h-16 w-auto"
        />
      </div>

      <ShieldCheck className="mx-auto text-green-600" size={64} />
      <h2 className="text-2xl font-bold">Domain Successfully Listed</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="font-medium text-lg">{domainName}</p>
        <p className="text-gray-600 mt-2">Listed for {price} ETH</p>
        <p className="text-gray-600">Duration: {duration} days</p>
      </div>
      
      <button 
        onClick={() => {
          setCurrentStep(1);
          setDomainName('');
          setPrice('');
          setEppCode('');
        }}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        List Another Domain
      </button>
    </div>
  );

  // Progress steps
  const steps = [
    { number: 1, label: 'Verify' },
    { number: 2, label: 'Escrow' },
    { number: 3, label: 'Transfer' },
    { number: 4, label: 'Complete' }
  ];

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center gap-16 mb-12">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
              ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step.number}
            </div>
            <span className={`text-sm ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {renderCurrentStep()}
    </div>
  );
};

export default SellerInterface;