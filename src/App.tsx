import React, { useState } from 'react';
import BuyerInterface from './components/BuyerInterface';
import SellerInterface from './components/SellerInterface';

function App() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [newListingTrigger, setNewListingTrigger] = useState(0);

  // Logo visibility state
  const showHeaderLogo = mode === 'buy';

  const handleListingPublished = () => {
    setMode('buy');
    setNewListingTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-1">
        <div className="relative flex justify-center items-center py-8">
          {/* Logo only shown in buy mode */}
          {showHeaderLogo && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>
          )}
          
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