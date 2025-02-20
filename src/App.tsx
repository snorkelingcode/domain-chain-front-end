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
      <div className="container mx-auto px-1 py-9 space-y-1">
        <div className="flex justify-center items-center h-16 my-2">
          <div className="inline-flex rounded-md shadow-sm mx-auto" role="group">
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