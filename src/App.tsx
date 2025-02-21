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
        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Header Container */}
          <div className="w-full flex flex-col sm:flex-row sm:relative sm:justify-between items-center gap-4 sm:gap-0">
            {/* Logo */}
            <div className={`${mode === 'buy' ? 'flex-shrink-0' : 'hidden sm:invisible'} order-1 sm:order-none`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            
            {/* Mode Toggle Buttons - Centered on mobile, absolute on desktop */}
            <div className="order-2 sm:order-none sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  type="button"
                  onClick={() => setMode('buy')}
                  className={`px-3 py-1.5 text-sm font-medium border ${
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
                  className={`px-3 py-1.5 text-sm font-medium border ${
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
              className="order-3 sm:order-none px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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