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
      <div className="container mx-auto px-4">
        {/* Reduced vertical padding and improved responsive layout */}
        <div className="relative flex items-center justify-between py-4">
          {/* Logo with responsive positioning */}
          {mode === 'buy' && (
            <div className="flex-shrink-0 mr-4">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto" // Slightly smaller height
              />
            </div>
          )}
          
          {/* Centered buttons container */}
          <div className={`inline-flex rounded-md shadow-sm ${mode === 'buy' ? 'ml-auto' : ''}`}>
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