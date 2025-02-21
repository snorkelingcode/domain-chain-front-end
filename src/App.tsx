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
      <div className="container mx-auto px-1">
        <div className="flex justify-center items-center h-16 my-8">
          <div className="flex items-center gap-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              className="text-blue-500"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="12" cy="6" r="2" fill="#a7f3d0" />
              <circle cx="6" cy="18" r="2" fill="#a7f3d0" />
              <circle cx="18" cy="18" r="2" fill="#a7f3d0" />
              <path d="M12 8L7 17M12 8L17 17M7 17L17 17" stroke="currentColor" strokeWidth="1.5" />
            </svg>
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