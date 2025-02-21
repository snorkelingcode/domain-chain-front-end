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
            {/* Logo - Visible only in buy mode */}
            <div className={`${mode === 'buy' ? 'flex-shrink-0' : 'hidden'} sm:order-1 order-1 w-1/3 flex justify-start`}>
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            
            {/* Center Container for Mode Toggle Buttons */}
            <div className="w-full sm:w-1/3 flex justify-center order-2 sm:order-2">
              <div className="flex rounded-md shadow-sm" role="group">
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

            {/* Wallet Connect Button Container */}
            <div className="w-1/3 flex justify-end order-3 sm:order-3">
              {/* Desktop Wallet Connect Button */}
              <button 
                className="hidden sm:block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>

              {/* Mobile Wallet Connect Button */}
              <button 
                className="sm:hidden w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
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