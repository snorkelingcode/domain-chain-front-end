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
          <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className={`${mode === 'buy' ? 'flex-shrink-0' : 'hidden'} order-1 sm:order-none`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            
            {/* Center Container for Mobile Layout */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 order-2 sm:order-none">
              {/* Mode Toggle Buttons */}
              <div className="w-full sm:w-auto">
                <div className="flex rounded-md shadow-sm w-full sm:w-auto" role="group">
                  <button 
                    type="button"
                    onClick={() => setMode('buy')}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border ${
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
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border ${
                      mode === 'sell' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                    } rounded-r-lg`}
                  >
                    Sell Domain
                  </button>
                </div>
              </div>

              {/* Connect Wallet Button - Full width on mobile */}
              <button 
                className="w-full sm:w-auto order-3 sm:order-none px-24 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>

            {/* Spacer for desktop layout */}
            <div className="hidden sm:block w-32"></div>
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