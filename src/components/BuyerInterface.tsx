import React, { useState, useMemo } from 'react';
import { 
  Heart,
  LayoutGrid
} from 'lucide-react';
import DomainSearch from './DomainSearch';
import DomainCard from './DomainCard';
import type { DomainListing, SearchFilters } from '../types/domain';

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
    tld: '.com',
    description: 'A versatile domain for tech enthusiasts'
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
    tld: '.io',
    description: 'Premium blockchain-related domain'
  }
];

const BuyerInterface: React.FC = () => {
  const [selectedListing, setSelectedListing] = useState<DomainListing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    tld: [],
    verificationStatus: [],
    duration: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

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
    return MOCK_LISTINGS
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
  }, [MOCK_LISTINGS, searchQuery, filters, favorites, showFavoritesOnly]);

  // Selected listing view
  if (selectedListing) {
    return (
      <div className="container mx-auto px-4 py-4">
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
    <div className="container mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
      <div className="flex flex-col items-center">
        {/* Search and Controls Container */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="w-full flex-1">
            <DomainSearch 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* View Controls */}
          <div className="flex items-center space-x-2">
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
              className={`p-2 rounded-lg ${
                !showFavoritesOnly ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
  
        {/* Domain Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 w-full">
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
    </div>
  );
};

export default BuyerInterface;