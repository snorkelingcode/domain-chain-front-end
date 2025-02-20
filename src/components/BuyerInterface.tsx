import React, { useState, useMemo } from 'react';
import { useEscrowContract } from '../hooks/useEscrowContract';
import { Alert, AlertDescription } from './alert';
import { 
  Heart,
  LayoutGrid
} from 'lucide-react';
import DomainSearch from './DomainSearch';
import DomainCard from './DomainCard';
import type { DomainListing, SearchFilters } from '../types/domain';

// Mock domain listings
const MOCK_LISTINGS: DomainListing[] = [
  {
    id: '1',
    domain: 'example.com',
    price: '0.5',
    createdAt: new Date().toISOString(),
    tld: '.com'
  },
  {
    id: '2',
    domain: 'blockchain.io',
    price: '0.75',
    createdAt: new Date().toISOString(),
    tld: '.io'
  },
  {
    id: '3',
    domain: 'crypto.eth',
    price: '1.2',
    createdAt: new Date().toISOString(),
    tld: '.eth'
  }
];

const BuyerInterface: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [domainName, setDomainName] = useState('');
  
  const [selectedListing, setSelectedListing] = useState<DomainListing | null>(null);
  const [listings] = useState<DomainListing[]>(MOCK_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    tld: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const { connectWallet } = useEscrowContract();

  const handleDomainVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple verification logic
    if (domainName.trim()) {
      setIsVerified(true);
    }
  };

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

  const filteredListings = useMemo(() => {
    return listings
      .filter(listing => {
        // Favorites filter
        if (showFavoritesOnly && !favorites.includes(listing.id)) {
          return false;
        }
        
        // Search query filter
        if (searchQuery && !listing.domain.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // TLD filter
        if (filters.tld.length > 0 && !filters.tld.includes(listing.tld || '')) {
          return false;
        }

        // Price range filter
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

  // Domain verification form
  if (!isVerified) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Domain</h2>
        <form onSubmit={handleDomainVerification} className="space-y-4">
          <div>
            <label htmlFor="domainName" className="block text-sm font-medium mb-2">
              Domain Name
            </label>
            <input
              id="domainName"
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="example.com"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verify Domain
          </button>
        </form>
      </div>
    );
  }

  // Selected listing view
  if (selectedListing) {
    return (
      <div className="space-y-8">
        <DomainCard 
          listing={selectedListing}
          onSelect={() => setSelectedListing(null)}
          onFavorite={toggleFavorite}
          isFavorite={favorites.includes(selectedListing.id)}
          isDetailed={true}
        />
      </div>
    );
  }

  // Main listings view
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
            onSelect={() => setSelectedListing(listing)}
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