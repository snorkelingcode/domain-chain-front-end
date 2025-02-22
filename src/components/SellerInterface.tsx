import React, { useState } from 'react';
import { 
  ArrowRight,
  ChevronDown, 
  Clock, 
  DollarSign, 
  Globe, 
  ShieldCheck
} from 'lucide-react';

import { useEscrowContract } from '../hooks/useEscrowContract';
import { Alert, AlertDescription } from '../components/ui/Alerts';

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
  const [isVerified, setIsVerified] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  const { createEscrow } = useEscrowContract();

  const handleDomainVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
    onListingPublished();
  };

  // Logo component to be reused across steps
  const LogoComponent = () => (
    <img 
      src="/LogoHeader_Transparent_5972X_1080Y.png" 
      alt="Domain Chain Logo" 
      className="h-8 sm:h-12 w-auto"
    />
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Progress Steps */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex justify-between mb-6">
          <div className="grid grid-cols-4 w-full gap-1 sm:gap-4">
            {[
              { number: 1, title: 'Verify' },
              { number: 2, title: 'Escrow' },
              { number: 3, title: 'Transfer' },
              { number: 4, title: 'Complete' }
            ].map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                  currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  <span className="text-xs sm:text-sm">{step.number}</span>
                </div>
                <span className={`mt-1 text-xs sm:text-sm text-center ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          {currentStep === 1 && (
            <form onSubmit={handleDomainVerification} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Verify Domain Ownership</h2>
                <LogoComponent />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Domain Name</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      placeholder="example.com"
                      className="pl-10 w-full p-2 border rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">EPP/Authorization Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={eppCode}
                      onChange={(e) => setEppCode(e.target.value)}
                      placeholder="Enter EPP code"
                      className="pl-10 w-full p-2 border rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-100">
                  <AlertDescription className="text-blue-600 text-sm">
                    <div className="font-medium mb-2">Domain Verification Process:</div>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Enter your domain name and EPP code</li>
                      <li>Our platform will verify domain ownership</li>
                      <li>Domain will be temporarily transferred to our escrow platform</li>
                      <li>New EPP code will be generated to prevent unauthorized transfers</li>
                    </ol>
                    <p className="mt-2 text-red-600 text-sm font-medium">
                      WARNING: Once you verify your domain, the platform will change your EPP code while in escrow. 
                      You may cancel your listing at any time for the new EPP code.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm font-medium"
              >
                {loading ? 'Verifying...' : 'Verify Domain'}
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleCreateEscrow} className="space-y-6 relative">
              {/* Position logo in top right for step 2 */}
              <div className="absolute top-0 right-0">
                <LogoComponent />
              </div>

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
            <div className="text-center py-8 relative">
              {/* Center logo above text for step 3 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <LogoComponent />
              </div>

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
            <div className="text-center py-8 relative">
              {/* Center logo above text for step 4 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <LogoComponent />
              </div>

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
    </div>
  );
};

export default SellerInterface;