import React, { useState, useEffect } from 'react';
import { 
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
  ArrowLeft
} from 'lucide-react';
import { DashboardDataService } from '../services/DashboardDataService';
import { useAddress } from '@thirdweb-dev/react';

// Mock data - will be replaced with real data from API
const mockPurchaseHistory = [
  { date: '2024-02-15', domain: 'crypto.eth', price: 1.2 },
  { date: '2024-02-10', domain: 'defi.io', price: 0.8 },
  { date: '2024-02-05', domain: 'web3.com', price: 2.1 }
];

interface DashboardProps {
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const address = useAddress();
  
  // Load dashboard data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        const data = await DashboardDataService.loadDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [address]);
  
  // Save dashboard data when it changes (debounced)
  useEffect(() => {
    if (!dashboardData) return;
    
    setSaveStatus('saving');
    const saveTimeout = setTimeout(async () => {
      try {
        await DashboardDataService.saveDashboardData(dashboardData);
        setSaveStatus('saved');
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (error) {
        console.error('Failed to save dashboard data:', error);
        setSaveStatus('error');
      }
    }, 2000); // Save after 2 seconds of no changes
    
    return () => clearTimeout(saveTimeout);
  }, [dashboardData]);
  
  // Handle watchlist updates
  const handleWatchlistUpdate = (updatedWatchlist: any[]) => {
    setDashboardData(prev => ({
      ...prev,
      watchlist: updatedWatchlist
    }));
  };
  
  // Handle portfolio updates
  const handlePortfolioUpdate = (updatedPortfolio: any[]) => {
    setDashboardData(prev => ({
      ...prev,
      portfolio: updatedPortfolio
    }));
  };
  
  // Update theme preference
  const toggleTheme = () => {
    setDashboardData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences?.theme === 'dark' ? 'light' : 'dark'
      }
    }));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-100">
        <div className="p-4 text-gray-600">Loading your dashboard data...</div>
      </div>
    );
  }
  
  if (!address) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-100">
        <div className="p-4 text-gray-600">Please connect your wallet to view your dashboard</div>
      </div>
    );
  }
  
  // Extract data or use defaults
  const watchlist = dashboardData?.watchlist || [];
  const portfolio = dashboardData?.portfolio || [];
  const preferences = dashboardData?.preferences || {};
  
  // Calculate portfolio metrics
  const portfolioValue = portfolio.length > 0 ? 
    portfolio.reduce((sum: number, item: any) => sum + (item.currentValue || item.purchasePrice), 0) : 
    0;
  
  const portfolioGrowth = portfolio.length > 0 ? 
    (portfolioValue / portfolio.reduce((sum: number, item: any) => sum + item.purchasePrice, 0) - 1) * 100 : 
    0;
  
  // Generate portfolio value chart data
  const portfolioValueHistory = [
    { date: '2024-01', value: portfolioValue * 0.8 },
    { date: '2024-02', value: portfolioValue * 0.9 },
    { date: '2024-03', value: portfolioValue }
  ];
  
  // Process watchlist for display
  const processedWatchlist = watchlist.map((item: any) => {
    const priceChange = item.initialPrice && item.currentPrice ? 
      ((item.currentPrice - item.initialPrice) / item.initialPrice) * 100 : 
      0;
    
    return {
      ...item,
      priceChange
    };
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Back to Listings Button */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Domains
          </button>
          
          {/* Sync status indicator */}
          <div className="text-sm">
            {saveStatus === 'saving' && (
              <span className="text-blue-600">Saving changes...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-green-600">Changes saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600">Error saving changes</span>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Portfolio Value</span>
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{portfolioValue.toFixed(2)} ETH</div>
            <div className={`text-sm flex items-center mt-1 ${portfolioGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioGrowth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(portfolioGrowth).toFixed(1)}% overall
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Domains Owned</span>
              <Globe className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{portfolio.length}</div>
            <div className="text-blue-600 text-sm flex items-center mt-1">
              <Clock size={16} className="mr-1" />
              {portfolio.filter((p: any) => p.acquisitionMethod === 'pending').length || 0} pending transfers
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Watchlist</span>
              <Eye className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{watchlist.length}</div>
            <div className="text-orange-600 text-sm flex items-center mt-1">
              <ArrowUpRight size={16} />
              {processedWatchlist.filter((w: any) => w.priceChange > 0).length} price increases
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Avg. Domain Value</span>
              <Heart className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">
              {portfolio.length > 0 ? (portfolioValue / portfolio.length).toFixed(2) : '0.00'} ETH
            </div>
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
                <AreaChart data={portfolioValueHistory}>
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
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden mb-6">
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
                {processedWatchlist.map((item: any, index: number) => {
                  const isPriceUp = item.priceChange > 0;

                  return (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{item.domainName}</div>
                      </td>
                      <td className="py-3">{item.currentPrice?.toFixed(2) || '0.00'} ETH</td>
                      <td className="py-3">
                        <div className={`flex items-center ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isPriceUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {Math.abs(item.priceChange).toFixed(1)}%
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
                
                {watchlist.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No domains in your watchlist. Add domains to track their prices.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* User Settings */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Theme Preferences</h4>
                <p className="text-sm text-gray-500">Switch between light and dark mode</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                {preferences.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Connected Wallet</h4>
                <p className="text-sm text-gray-500">{address}</p>
              </div>
              <button 
                onClick={onBack}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
              >
                Back to Domains
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;