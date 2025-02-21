import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Globe,
  DollarSign,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
  ChevronLeft
} from 'lucide-react';

// Mock data
const mockPortfolioValue = [
  { date: '2024-01', value: 4.2 },
  { date: '2024-02', value: 6.8 },
  { date: '2024-03', value: 8.3 }
];

const mockPurchaseHistory = [
  { date: '2024-02-15', domain: 'crypto.eth', price: 1.2 },
  { date: '2024-02-10', domain: 'defi.io', price: 0.8 },
  { date: '2024-02-05', domain: 'web3.com', price: 2.1 }
];

const mockWatchlist = [
  { domain: 'metaverse.io', currentPrice: 1.5, initialPrice: 1.2 },
  { domain: 'nft.com', currentPrice: 2.8, initialPrice: 3.0 },
  { domain: 'blockchain.eth', currentPrice: 1.9, initialPrice: 1.7 }
];

interface DashboardProps {
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Marketplace
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col items-center py-3 sm:py-6">
          <div className="w-full flex relative justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Mode Toggle Buttons */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-sm font-medium border bg-white text-gray-900 border-gray-200 hover:bg-gray-100 rounded-l-lg"
                >
                  Buy Domain
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm font-medium border bg-blue-600 text-white border-blue-600 rounded-r-lg"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="sm:hidden flex justify-center mb-4">
          <img 
            src="/LogoHeader_Transparent_5972X_1080Y.png" 
            alt="Domain Chain Logo" 
            className="h-12 w-auto"
          />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Portfolio Value</span>
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">8.3 ETH</div>
            <div className="text-green-600 text-sm flex items-center mt-1">
              <ArrowUpRight size={16} />
              +23.5% this month
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Domains Owned</span>
              <Globe className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-blue-600 text-sm flex items-center mt-1">
              <Clock size={16} className="mr-1" />
              3 pending transfers
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Watchlist</span>
              <Eye className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-orange-600 text-sm flex items-center mt-1">
              <ArrowUpRight size={16} />
              2 price changes
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Avg. Domain Value</span>
              <Heart className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">0.69 ETH</div>
            <div className="text-green-600 text-sm flex items-center mt-1">
              <ArrowUpRight size={16} />
              +12.3% this month
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4">Portfolio Value</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPortfolioValue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    fill="#93c5fd" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4">Recent Purchases</h3>
            <div className="space-y-3">
              {mockPurchaseHistory.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="text-blue-600" size={20} />
                    <div>
                      <div className="font-medium">{purchase.domain}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{purchase.price} ETH</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <h3 className="text-lg font-medium mb-4">Watchlist</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Domain</th>
                  <th className="pb-3 font-medium">Current Price</th>
                  <th className="pb-3 font-medium">Price Change</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockWatchlist.map((item, index) => {
                  const priceChange = ((item.currentPrice - item.initialPrice) / item.initialPrice) * 100;
                  const isPriceUp = priceChange > 0;

                  return (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{item.domain}</div>
                      </td>
                      <td className="py-3">{item.currentPrice} ETH</td>
                      <td className="py-3">
                        <div className={`flex items-center ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isPriceUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {Math.abs(priceChange).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Available
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;