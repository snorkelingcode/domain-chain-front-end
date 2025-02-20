export interface DomainListing {
  id: string;
  domain: string;
  price: string;
  seller: string;
  createdAt: string;
  status: 'active' | 'pending' | 'sold';
  verificationStatus: 'verified' | 'pending' | 'unverified';
  priceHistory: PriceHistoryItem[];
  duration: number;
  description?: string;
  category?: string;
  tld?: string;
  transferStatus?: TransferStatus;
}

export interface PriceHistoryItem {
  price: string;
  date: string;
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

export interface TransferStatus {
  state: 'initiated' | 'verifying' | 'transferring' | 'completed' | 'failed';
  progress: number;
  details?: string;
  transactionHash?: string;
}