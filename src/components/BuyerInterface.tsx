import React, { useState, useEffect } from 'react';
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
import type { DomainListing, SearchFilters } from '../types/domain';

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
  const [listings, setListings] = useState<DomainListing[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { 
    connectWallet, 
    contract, 
    signer,
    confirmDomainTransfer,
    releaseFunds 
  } = useEscrowContract();

  // Simulated data fetching
  useEffect(() => {
    const fetchListings = async () => {
      // In a real app, this would fetch from your contract
      const mockListings: DomainListing[] = [
        {
          id: '1',
          domain: 'example.com',
          price: '2.5',
          seller: '0x1234...5678',
          createdAt: new Date().toISOString(),
          status: 'active',
          verificationStatus: 'verified',
          priceHistory: [
            { price: '3.0', date: '2024-01-01' },
            { price: '2.8', date: '2024-02-01' },
            { price: '2.5', date: '2024-03-01' }
          ],
          duration: 14,
          description: 'Premium domain name',
          category: 'Technology',
          tld: '.com'
        },
        {
          id: '2',
          domain: 'crypto.io',
          price: '5.0',
          seller: '0x5678...9012',
          createdAt: new Date().toISOString(),
          status: 'active',
          verificationStatus: 'pending',
          priceHistory: [
            { price: '6.0', date: '2024-01-01' },
            { price: '5.5', date: '2024-02-01' },
            { price: '5.0', date: '2024-03-01' }
          ],
          duration: 30,
          description: 'Perfect for crypto projects',
          category: 'Crypto',
          tld: '.io'
        }
      ];
      setListings(mockListings);
    };

    fetchListings();
  }, []);

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

  const filteredListings = listings
    .filter(listing => {
      if (showFavoritesOnly && !favorites.includes(listing.id)) {
        return false;
      }
      
      if (searchQuery && !listing.domain.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (filters.tld.length > 0 && !filters.tld.includes(listing.tld || '')) {
        return false;
      }

      if (filters.verificationStatus.length > 0 && 
          !filters.verificationStatus.includes(listing.verificationStatus)) {
        return false;
      }

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

  const handlePurchase = async () => {
    if (!selectedListing) return;
    
    setLoading(true);
    setError('');
    try {
      // Here you would typically call the contract to fund the escrow
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);
      setSuccess('Escrow funded successfully!');
    } catch (err) {
      setError('Failed to fund escrow. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifyTransfer = async () => {
    if (!selectedListing) return;

    setLoading(true);
    setError('');
    try {
      await confirmDomainTransfer(selectedListing.id);
      setCurrentStep(3);
      setSuccess('Domain transfer verified!');
    } catch (err) {
      setError('Failed to verify domain transfer. Please try again.');
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!selectedListing) return;

    setLoading(true);
    setError('');
    try {
      await releaseFunds(selectedListing.id);
      setCurrentStep(4);
      setSuccess('Purchase completed successfully!');
    } catch (err) {
      setError('Failed to complete purchase. Please try again.');
    }
    setLoading(false);
  };

  if (selectedListing) {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setSelectedListing(null)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to listings
        </button>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[
            { number: 1, title: 'Review Listing' },
            { number: 2, title: 'Fund Escrow' },
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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Purchase Flow */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Confirm Purchase</h2>
              <DomainCard 
                listing={selectedListing}
                onSelect={() => {}}
                onFavorite={toggleFavorite}
                isFavorite={favorites.includes(selectedListing.id)}
              />
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2" size={20} />
                    Processing...
                  </div>
                ) : (
                  'Purchase Domain'
                )}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Verify Domain Transfer</h2>
              <Alert>
                <AlertDescription>
                  Please verify that the domain has been transferred to your wallet address. 
                  Check your domain registrar account for confirmation.
                </AlertDescription>
              </Alert>
              <button
                onClick={handleVerifyTransfer}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Confirm Transfer'}
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Complete Purchase</h2>
              <Alert>
                <AlertDescription>
                  The domain transfer has been verified. Click below to complete the purchase 
                  and release funds to the seller.
                </AlertDescription>
              </Alert>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Completing...' : 'Complete Purchase'}
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Purchase Complete!</h2>
              <p className="text-gray-600">
                Congratulations! The domain is now yours and the funds have been released to the seller.
              </p>
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

export default BuyerInterface;