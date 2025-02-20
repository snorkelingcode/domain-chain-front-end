// src/components/DomainCard.tsx
import React from 'react';
import { 
  Globe, 
  DollarSign, 
  Clock, 
  Heart,
  ChartLine,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DomainListing } from '../types/domain';

interface DomainCardProps {
  listing: DomainListing;
  onSelect: (listing: DomainListing) => void;
  onFavorite: (id: string) => void;
  isFavorite: boolean;
  isDetailed?: boolean;
}

const DomainCard: React.FC<DomainCardProps> = ({ 
  listing, 
  onSelect, 
  onFavorite,
  isFavorite,
  isDetailed = false
}) => {
  const getVerificationIcon = () => {
    switch (listing.verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center" title="Domain Verified">
            <ShieldCheck className="text-green-500" size={20} />
            {isDetailed && <span className="ml-2 text-green-500">Verified</span>}
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center" title="Verification Pending">
            <Shield className="text-yellow-500" size={20} />
            {isDetailed && <span className="ml-2 text-yellow-500">Pending Verification</span>}
          </div>
        );
      case 'unverified':
        return (
          <div className="flex items-center" title="Domain Unverified">
            <ShieldAlert className="text-red-500" size={20} />
            {isDetailed && <span className="ml-2 text-red-500">Unverified</span>}
          </div>
        );
    }
  };

  const formatDomainName = (domain: string) => {
    const parts = domain.split('.');
    if (parts.length < 2) return domain;
    
    return (
      <span>
        {parts.slice(0, -1).join('.')}
        <span className="text-gray-400">.{parts[parts.length - 1]}</span>
      </span>
    );
  };

  const renderPriceHistory = () => {
    if (!isDetailed || !listing.priceHistory?.length) return null;

    return (
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <ChartLine size={20} className="text-gray-400 mr-2" />
          <h4 className="font-medium">Price History</h4>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={listing.priceHistory}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis 
                dataKey="price"
                tick={{ fontSize: 12 }}
                tickFormatter={(price) => `${price} ETH`}
              />
              <Tooltip 
                formatter={(value) => `${value} ETH`}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderDetailedInfo = () => {
    if (!isDetailed) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-sm text-gray-500 mb-1">Listed</h5>
            <p className="font-medium">
              {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-sm text-gray-500 mb-1">Category</h5>
            <p className="font-medium">{listing.category || 'General'}</p>
          </div>
        </div>

        {listing.description && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-sm text-gray-500 mb-1">Description</h5>
            <p className="text-sm">{listing.description}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <a 
            href={`https://${listing.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            Visit Domain
          </a>
          <div className="text-sm text-gray-500">
            ID: {listing.id.slice(0, 8)}...
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow ${
      isDetailed ? 'w-full' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="text-gray-400" size={20} />
          <h3 className="text-lg font-medium">
            {formatDomainName(listing.domain)}
          </h3>
          {getVerificationIcon()}
        </div>
        <div className="flex items-center space-x-2">
          {isDetailed && (
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => onSelect(listing)}
            >
              ← Back to listings
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(listing.id);
            }}
            className={`p-2 rounded-full ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:bg-gray-100`}
          >
            <Heart fill={isFavorite ? 'currentColor' : 'none'} size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-gray-400" size={20} />
            <span className="font-medium">{listing.price} ETH</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="text-gray-400" size={20} />
          <span className="text-sm text-gray-600">
            {listing.duration} days escrow period
          </span>
        </div>
      </div>

      {renderPriceHistory()}
      {renderDetailedInfo()}

      {!isDetailed && (
        <button
          onClick={() => onSelect(listing)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          View Details
        </button>
      )}

      {isDetailed && (
        <button
          onClick={() => {/* Placeholder for purchase logic */}}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Purchase Domain
        </button>
      )}
    </div>
  );
};

export default DomainCard;