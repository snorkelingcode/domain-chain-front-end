// src/types/domain.ts
export interface DomainListing {
    id: string;
    domain: string;
    price: string;
    seller: string;
    createdAt: string;
    status: 'active' | 'pending' | 'sold';
    verificationStatus: 'verified' | 'pending' | 'unverified';
    priceHistory: {
      price: string;
      date: string;
    }[];
    duration: number;
    description?: string;
    category?: string;
    tld?: string; // Top Level Domain
  }
  
  export interface SearchFilters {
    priceRange: {
      min: number;
      max: number;
    };
    tld: string[];
    verificationStatus: string[];
    duration: number[];
    sortBy: 'price' | 'date' | 'name';
    sortOrder: 'asc' | 'desc';
  }