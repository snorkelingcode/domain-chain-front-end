// src/components/DomainSearch.tsx
import React, { useState, useCallback } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import type { SearchFilters } from '../types/domain';
import { debounce } from 'lodash';

interface DomainSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

const TLD_OPTIONS = ['.com', '.io', '.eth', '.net', '.org', '.xyz'];
const VERIFICATION_OPTIONS = ['verified', 'pending', 'unverified'];

const DomainSearch: React.FC<DomainSearchProps> = ({ onSearch, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    tld: [],
    verificationStatus: [],
    duration: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    // Convert empty string to 0, otherwise parse as float
    const numericValue = value === '' ? 0 : parseFloat(value);
    
    handleFilterChange({
      priceRange: {
        ...filters.priceRange,
        [type]: numericValue
      }
    });
  };

  const toggleTld = (tld: string) => {
    const newTlds = filters.tld.includes(tld)
      ? filters.tld.filter(t => t !== tld)
      : [...filters.tld, tld];
    handleFilterChange({ tld: newTlds });
  };

  const toggleVerificationStatus = (status: string) => {
    const newStatuses = filters.verificationStatus.includes(status)
      ? filters.verificationStatus.filter(s => s !== status)
      : [...filters.verificationStatus, status];
    handleFilterChange({ verificationStatus: newStatuses });
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      priceRange: { min: 0, max: 100 },
      tld: [],
      verificationStatus: [],
      duration: [],
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          value={searchValue}
          placeholder="Search domains..."
          className="pl-10 pr-24 w-full p-2 border rounded-lg"
          onChange={handleSearchChange}
        />
        <div className="absolute right-3 top-2 flex items-center space-x-2">
          {searchValue && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-lg space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range (ETH)</label>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 p-2 border rounded-lg"
                value={filters.priceRange.min || ''}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                min="0"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 p-2 border rounded-lg"
                value={filters.priceRange.max || ''}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* TLD Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Domain Extensions</label>
            <div className="flex flex-wrap gap-2">
              {TLD_OPTIONS.map((tld) => (
                <button
                  key={tld}
                  className={`px-3 py-1 rounded-full ${
                    filters.tld.includes(tld)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleTld(tld)}
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
              {VERIFICATION_OPTIONS.map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full ${
                    filters.verificationStatus.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleVerificationStatus(status)}
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
                onChange={(e) => handleFilterChange({ 
                  sortBy: e.target.value as 'price' | 'date' | 'name' 
                })}
                className="p-2 border rounded-lg flex-1"
              >
                <option value="date">Date Listed</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => handleFilterChange({
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                })}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                title={filters.sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc size={20} />
                ) : (
                  <SortDesc size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="pt-4 border-t">
            <button
              onClick={resetFilters}
              className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSearch;