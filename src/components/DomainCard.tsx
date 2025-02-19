import React, { useState } from 'react';
import { 
  Globe, 
  DollarSign, 
  Clock, 
  Heart,
  ChartLine,
  Shield,
  ShieldCheck,
  ShieldAlert
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
        return <ShieldCheck className="text-green-500" size={20} />;
      case 'pending':
        return <Shield className="text-yellow-500" size={20} />;
      case 'unverified':
        return <ShieldAlert className="text-red-500" size={20} />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow ${
      isDetailed ? 'w-full' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="text-gray-400" size={20} />
          <h3 className="text-lg font-medium">{listing.domain}</h3>
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
            onClick={() => onFavorite(listing.id)}
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

      {isDetailed && listing.priceHistory.length > 0 && (
        <div className="h-48 mt-4">
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
      )}

      {!isDetailed && (
        <button
          onClick={() => onSelect(listing)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
};

export default DomainCard;