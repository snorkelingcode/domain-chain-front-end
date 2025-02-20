export interface DomainListing {
  id: string;
  domain: string;
  price: string;
  seller?: string;
  createdAt: string;
  status?: 'active' | 'pending' | 'sold';
  tld?: string;
}

export interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  tld: string[];
  sortBy: 'price' | 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}