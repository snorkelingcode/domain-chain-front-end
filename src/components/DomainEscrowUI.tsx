import React, { useState } from 'react';
import { Alert, AlertDescription } from '../components/alert';
import { 
  ArrowRight, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Globe, 
  Link,
  Wallet,
  Loader 
} from 'lucide-react';

const DomainEscrowUI: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mode, setMode] = useState<'sell' | 'buy'>('sell');
  const [domainName, setDomainName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [duration, setDuration] = useState<string>('7');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const steps = [
    { number: 1, title: 'Create Escrow' },
    { number: 2, title: 'Await Buyer' },
    { number: 3, title: 'Transfer Domain' },
    { number: 4, title: 'Complete Sale' }
  ];

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Simulated wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
    setLoading(false);
  };

  const handleCreateEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setMode('sell')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'sell' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Sell Domain
        </button>
        <button
          onClick={() => setMode('buy')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'buy' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Buy Domain
        </button>
      </div>

      {/* Wallet Connection */}
      {!isWalletConnected && (
        <div className="flex justify-end mb-4">
          <button
            onClick={connectWallet}
            disabled={loading}
            className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Wallet size={20} />
            )}
            <span>Connect Wallet</span>
          </button>
        </div>
      )}

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

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && mode === 'sell' && (
          <form onSubmit={handleCreateEscrow} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Create Domain Escrow</h2>
            
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

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Link size={16} className="mr-1" />
                View transfer instructions
              </button>
              
              {showInstructions && (
                <Alert className="mt-4">
                  <AlertDescription>
                    <ol className="list-decimal ml-4 space-y-2">
                      <li>Ensure your domain is unlocked at your current registrar</li>
                      <li>Obtain the authorization code (EPP code)</li>
                      <li>Verify domain ownership through DNS settings</li>
                      <li>Prepare for domain transfer once escrow is funded</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Escrow
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Awaiting Buyer</h2>
            <p className="text-gray-600 mb-6">
              Share your escrow listing link with potential buyers
            </p>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <code className="text-sm">
                https://domain-escrow.com/listing/{domainName}
              </code>
              <button className="text-blue-600 hover:text-blue-800">
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainEscrowUI;