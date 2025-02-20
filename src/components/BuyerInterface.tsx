// src/components/BuyerInterface.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useEscrowContract } from '../hooks/useEscrowContract';
import { Alert, AlertDescription } from './alert';
import { 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  LayoutGrid,
  Heart
} from 'lucide-react';
import DomainSearch from './DomainSearch';
import DomainCard from './DomainCard';
import type { DomainListing, SearchFilters, TransferStatus } from '../types/domain';

// Mock listings to simulate backend data
const MOCK_LISTINGS: DomainListing[] = [
  {
    id: '1',
    domain: 'example.com',
    price: '0.5',
    seller: '0x1234567890123456789012345678901234567890',
    createdAt: new Date().toISOString(),
    status: 'active',
    verificationStatus: 'verified',
    priceHistory: [
      { price: '0.4', date: new Date(Date.now() - 86400000).toISOString() },
      { price: '0.5', date: new Date().toISOString() }
    ],
    duration: 7,
    category: 'Technology',
    tld: '.com'
  },
  {
    id: '2',
    domain: 'blockchain.io',
    price: '0.75',
    seller: '0x0987654321098765432109876543210987654321',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'active',
    verificationStatus: 'pending',
    priceHistory: [
      { price: '0.6', date: new Date(Date.now() - 172800000).toISOString() },
      { price: '0.75', date: new Date().toISOString() }
    ],
    duration: 14,
    category: 'Crypto',
    tld: '.io'
  }
];

const BuyerInterface: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    tld: [],
    verificationStatus: [],
    duration: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<DomainListing | null>(null);
  const [listings, setListings] = useState<DomainListing[]>(MOCK_LISTINGS);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [transferStatus, setTransferStatus] = useState<TransferStatus | null>(null);

  const { 
    initiateInstantTransfer, 
    connectWallet, 
    signer 
  } = useEscrowContract();

  // Simulate wallet connection on mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    };

    initializeWallet();
  }, [connectWallet]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleSelectListing = (listing: DomainListing) => {
    setSelectedListing(listing);
    setCurrentStep(1);
  };

  const monitorTransferProgress = (transactionHash: string) => {
    // Simulate transfer progress
    const checkProgress = () => {
      const progress = Math.random() * 100;
      setTransferStatus({
        state: progress < 100 ? 'transferring' : 'completed',
        progress: Math.min(progress, 100)
      });

      if (progress < 100) {
        setTimeout(checkProgress, 1000);
      } else {
        setCurrentStep(4);
        setSuccess('Transfer completed successfully!');
      }
    };

    checkProgress();
  };

  const handlePurchase = async () => {
    if (!selectedListing || !signer) return;
    
    setLoading(true);
    setError('');
    try {
      const buyerAddress = '0x1234567890123456789012345678901234567890';
      
      // Simulate instant transfer
      const receipt = await initiateInstantTransfer({
        domainName: selectedListing.domain,
        price: selectedListing.price,
        seller: selectedListing.seller,
        buyer: buyerAddress
      });

      // Start monitoring progress
      monitorTransferProgress('mock_transaction_hash');
      
      // Update UI
      setCurrentStep(2);
      setSuccess('Transfer initiated!');
    } catch (err: any) {
      setError(err.message || 'Failed to initiate transfer');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = useMemo(() => {
    return listings
      .filter(listing => {
        // Filter by favorites
        if (showFavoritesOnly && !favorites.includes(listing.id)) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery && !listing.domain.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Filter by TLD
        if (filters.tld.length > 0 && !filters.tld.includes(listing.tld || '')) {
          return false;
        }

        // Filter by verification status
        if (filters.verificationStatus.length > 0 && 
            !filters.verificationStatus.includes(listing.verificationStatus)) {
          return false;
        }

        // Filter by price range
        const price = parseFloat(listing.price);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
        
        switch (filters.sortBy) {
          case 'price':
            return (parseFloat(a.price) - parseFloat(b.price)) * multiplier;
          case 'name':
            return a.domain.localeCompare(b.domain) * multiplier;
          case 'date':
          default:
            return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * multiplier;
        }
      });
  }, [listings, searchQuery, filters, favorites, showFavoritesOnly]);

  if (selectedListing) {
    return (
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[
            { number: 1, title: 'Review Listing' },
            { number: 2, title: 'Process Transfer' },
            { number: 3, title: 'Verify Transfer' },
            { number: 4, title: 'Complete Purchase' }
          ].map((step, index) => (
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
              {index < 3 && (
                <ArrowRight className={`mx-4 ${
                  currentStep > step.number ? 'text-blue-600' : 'text-gray-300'
                }`} size={20} />
              )}
            </div>
          ))}
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          <DomainCard 
            listing={selectedListing}
            onSelect={() => setSelectedListing(null)}
            onFavorite={toggleFavorite}
            isFavorite={favorites.includes(selectedListing.id)}
            isDetailed={true}
          />
          
          {currentStep === 1 && (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  Processing...
                </div>
              ) : (
                'Purchase Domain'
              )}
            </button>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Transfer in Progress</h2>
              
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${transferStatus?.progress || 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Transfer Initiated</span>
                  <span>Domain Verification</span>
                  <span>Transfer Complete</span>
                </div>

                <Alert className={transferStatus?.state === 'completed' ? 'bg-green-50' : 'bg-blue-50'}>
                  <AlertDescription>
                    {transferStatus?.state === 'verifying' && 'Verifying domain ownership...'}
                    {transferStatus?.state === 'transferring' && 'Processing domain transfer...'}
                    {transferStatus?.state === 'completed' && 'Transfer completed successfully!'}
                    {transferStatus?.details && <div className="mt-2 text-sm">{transferStatus.details}</div>}
                  </AlertDescription>
                </Alert>

                {transferStatus?.state === 'failed' && (
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Transfer
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Purchase Complete!</h2>
              <p className="text-gray-600">
                Congratulations! The domain is now yours.
              </p>
              <button
                onClick={() => setSelectedListing(null)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Return to Listings
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <DomainSearch 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-2 rounded-lg ${
            showFavoritesOnly ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Heart size={20} />
        </button>
        <button
          onClick={() => setShowFavoritesOnly(false)}
          className={`p-2 rounded-lg ml-2 ${
            !showFavoritesOnly ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      {/* Domain Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <DomainCard
            key={listing.id}
            listing={listing}
            onSelect={handleSelectListing}
            onFavorite={toggleFavorite}
            isFavorite={favorites.includes(listing.id)}
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No domains found matching your criteria
        </div>
      )}
    </div>
  );
};

export default BuyerInterface;// src/components/BuyerInterface.tsx