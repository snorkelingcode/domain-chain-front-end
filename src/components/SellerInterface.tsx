import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Globe, 
  ShieldCheck
} from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { useEscrowContract } from '../hooks/useEscrowContract';

// Define the prop interface
interface SellerInterfaceProps {
  onListingPublished: () => void;
}

const SellerInterface: React.FC<SellerInterfaceProps> = ({ onListingPublished }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [domainName, setDomainName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('7');
  const [eppCode, setEppCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { createEscrow } = useEscrowContract();

  const handleDomainVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate domain verification
    setTimeout(() => {
      setIsVerified(true);
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate escrow creation
      await createEscrow({
        domainName,
        price,
        duration: parseInt(duration, 10)
      });
      setCurrentStep(3);
    } catch (error) {
      console.error('Escrow creation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListingComplete = () => {
    // Call the callback to switch to buy mode and potentially refresh listings
    onListingPublished();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[
          { number: 1, title: 'Verify Domain' },
          { number: 2, title: 'Create Escrow' },
          { number: 3, title: 'Platform Transfer' },
          { number: 4, title: 'Complete Sale' }
        ].map((step, index, steps) => (
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

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && (
          <form onSubmit={handleDomainVerification} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Verify Domain Ownership</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="example.com"
                    className="pl-10 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">EPP/Authorization Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={eppCode}
                    onChange={(e) => setEppCode(e.target.value)}
                    placeholder="Enter EPP code"
                    className="pl-10 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Domain Verification Process:</strong>
                  <ol className="list-decimal ml-4 space-y-2 mt-2">
                    <li>Enter your domain name and EPP code</li>
                    <li>Our platform will verify domain ownership</li>
                    <li>Domain will be temporarily transferred to our escrow platform</li>
                    <li>New EPP code will be generated to prevent unauthorized transfers</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify Domain'}
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleCreateEscrow} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Create Escrow Listing</h2>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4 flex items-center">
              <ShieldCheck className="text-green-600 mr-3" size={24} />
              <span className="text-green-800">Domain Ownership Verified Successfully!</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={domainName}
                    readOnly
                    className="pl-10 w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="pl-10 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Escrow Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="pl-10 w-full p-2 border rounded-lg appearance-none"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Escrow Listing
            </button>
          </form>
        )}

        {currentStep === 3 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Platform Domain Transfer</h2>
            <p className="text-gray-600 mb-6">
              Domain has been securely transferred to our escrow platform
            </p>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <code className="text-sm">
                {domainName}
              </code>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-green-500" size={24} />
                <span className="text-green-600">Verified & Secured</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setCurrentStep(4)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Listing
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Listing Published</h2>
            <p className="text-gray-600 mb-6">
              Your domain is now listed and ready for potential buyers
            </p>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <code className="text-sm">
                https://domain-escrow.com/listing/{domainName}
              </code>
              <button className="text-blue-600 hover:text-blue-800">
                Copy Link
              </button>
            </div>
            <button
              onClick={handleListingComplete}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInterface;