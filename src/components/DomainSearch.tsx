// src/components/DomainSearch.tsx
import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import type { SearchFilters } from '../types/domain';

interface DomainSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

const DomainSearch: React.FC<DomainSearchProps> = ({ onSearch, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    tld: [],
    verificationStatus: [],
    duration: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search domains..."
          className="pl-10 w-full p-2 border rounded-lg"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range (ETH)</label>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 p-2 border rounded-lg"
                value={filters.priceRange.min}
                onChange={(e) => handleFilterChange({
                  priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                })}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 p-2 border rounded-lg"
                value={filters.priceRange.max}
                onChange={(e) => handleFilterChange({
                  priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                })}
              />
            </div>
          </div>

          {/* TLD Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Domain Extensions</label>
            <div className="flex flex-wrap gap-2">
              {['.com', '.io', '.eth', '.net'].map((tld) => (
                <button
                  key={tld}
                  className={`px-3 py-1 rounded-full ${
                    filters.tld.includes(tld)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => handleFilterChange({
                    tld: filters.tld.includes(tld)
                      ? filters.tld.filter(t => t !== tld)
                      : [...filters.tld, tld]
                  })}
                >
                  {tld}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Verification Status</label>
            <div className="flex flex-wrap gap-2">
              {['verified', 'pending', 'unverified'].map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full ${
                    filters.verificationStatus.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => handleFilterChange({
                    verificationStatus: filters.verificationStatus.includes(status)
                      ? filters.verificationStatus.filter(s => s !== status)
                      : [...filters.verificationStatus, status]
                  })}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'price' | 'date' | 'name' })}
                className="p-2 border rounded-lg"
              >
                <option value="date">Date Listed</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => handleFilterChange({
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                })}
                className="text-gray-600 hover:text-gray-800"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc size={20} />
                ) : (
                  <SortDesc size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSearch;