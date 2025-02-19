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

  // Mock contract functions for now
  const connectWallet = async () => {
    // Implementation would go here
    return Promise.resolve();
  };

  const confirmDomainTransfer = async () => {
    // Implementation would go here
    return Promise.resolve();
  };

  const releaseFunds = async () => {
    // Implementation would go here
    return Promise.resolve();
  };

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

  if (selectedListing) {
    return (
      <div className="space-y-8">
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

        {/* Detailed View */}
        <div className="space-y-6">
          <DomainCard 
            listing={selectedListing}
            onSelect={() => setSelectedListing(null)}
            onFavorite={toggleFavorite}
            isFavorite={favorites.includes(selectedListing.id)}
            isDetailed={true}
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