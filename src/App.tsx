import React, { useState } from 'react';
import BuyerInterface from './components/BuyerInterface';
import SellerInterface from './components/SellerInterface';

function App() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [newListingTrigger, setNewListingTrigger] = useState(0);

  const handleListingPublished = () => {
    setMode('buy');
    setNewListingTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Mobile Layout */}
          <div className="w-full flex flex-col items-center gap-3 sm:hidden">
            {/* Logo */}
            <div className={`${mode === 'buy' ? 'flex-shrink-0' : 'hidden'}`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Mode Toggle Buttons */}
            <div className="w-full">
              <div className="flex rounded-md shadow-sm w-full" role="group">
                <button 
                  type="button"
                  onClick={() => setMode('buy')}
                  className={`flex-1 px-4 py-2 text-sm font-medium border ${
                    mode === 'buy' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                  } rounded-l-lg`}
                >
                  Buy Domain
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('sell')}
                  className={`flex-1 px-4 py-2 text-sm font-medium border ${
                    mode === 'sell' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                  } rounded-r-lg`}
                >
                  Sell Domain
                </button>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button 
              className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex w-full relative justify-between items-center">
            {/* Logo */}
            <div className={mode === 'buy' ? 'flex-shrink-0' : 'invisible'}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Mode Toggle Buttons */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  type="button"
                  onClick={() => setMode('buy')}
                  className={`px-4 py-2 text-sm font-medium border ${
                    mode === 'buy' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                  } rounded-l-lg`}
                >
                  Buy Domain
                </button>
                <button 
                  type="button"
                  onClick={() => setMode('sell')}
                  className={`px-4 py-2 text-sm font-medium border ${
                    mode === 'sell' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                  } rounded-r-lg`}
                >
                  Sell Domain
                </button>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button 
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        
        {mode === 'buy' ? (
          <BuyerInterface key={newListingTrigger} />
        ) : (
          <SellerInterface onListingPublished={handleListingPublished} />
        )}
      </div>
    </div>
  );
}

export default App;