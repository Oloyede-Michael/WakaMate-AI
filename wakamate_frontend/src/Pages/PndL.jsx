import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Banknote,
  Calculator,
  Eye,
  EyeOff,
  Search,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function PndL() {
  // API Configuration
  const API_BASE_URL = 'http://localhost:1050/api'; // backend URL

  // Get auth token from localStorage with multiple possible keys
  const getAuthToken = () => {
    try {
      const possibleKeys = ['authToken', 'token', 'accessToken', 'jwt', 'userToken'];
      
      for (const key of possibleKeys) {
        const token = localStorage.getItem(key);
        if (token) {
          console.log(`Found token with key: ${key}`);
          return token;
        }
      }
      
      console.warn('No auth token found in localStorage');
      return null;
    } catch (e) {
      console.warn('localStorage not available, proceeding without auth token');
      return null;
    }
  };

  // API Functions with enhanced error handling
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on ' + API_BASE_URL);
      }
      console.error('API call failed:', error);
      throw error;
    }
  };

  const [showDetails, setShowDetails] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('overall');
  const [analysisType, setAnalysisType] = useState('general'); // 'general', 'monthly', 'weekly'
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profit/loss analysis data
  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/analysis');
      setAnalysisData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analysis data: ' + err.message);
      console.error('Fetch analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly analysis data
  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/monthly');
      setMonthlyData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch monthly data: ' + err.message);
      console.error('Fetch monthly error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle analysis type change
  const handleAnalysisTypeChange = (type) => {
    setAnalysisType(type);
    if (type === 'general') {
      fetchAnalysisData();
    } else if (type === 'monthly') {
      fetchMonthlyData();
    } else if (type === 'weekly') {
      // TODO: Implement weekly analysis when backend is ready
      console.log('Weekly analysis not implemented yet');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const safeNumber = (v) => (v === '' || v === null || isNaN(Number(v)) ? 0 : Number(v));

  // Extract summary data from analysis
  const summary = analysisData?.summary || {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    overallMargin: '0%'
  };

  const totalRevenue = summary.totalRevenue;
  const totalCosts = summary.totalCost;
  const totalProfit = summary.totalProfit;
  const profitMargin = parseFloat(summary.overallMargin) || 0;
  const isLoss = totalProfit < 0;

  // Get breakdown data for display based on analysis type
  const getDisplayData = () => {
    if (analysisType === 'general') {
      return analysisData?.breakdown || [];
    } else if (analysisType === 'monthly') {
      return monthlyData || [];
    }
    return [];
  };

  const displayData = getDisplayData();

  // Filtered data
  const filteredData = displayData.filter(item => {
    const searchField = analysisType === 'monthly' ? item.productName : item.product;
    return searchField?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateItemProfit = (item) => {
    return analysisType === 'monthly' ? item.profit : item.profit;
  };

  const calculateItemMargin = (item) => {
    if (analysisType === 'monthly') {
      return parseFloat(item.margin) || 0;
    }
    return parseFloat(item.margin) || 0;
  };

  const formatMonthYear = (month, year) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profit & Loss Dashboard</h1>
              <p className="text-gray-600">Track your business performance and profitability 📊</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-400 mr-2">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards - Only show for general analysis */}
        {!loading && analysisData && analysisType === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-1">
                <Banknote className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-600 font-medium">Total Revenue</h3>
              </div>
              <p className="text-2xl mt-2 font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-600 font-medium mb-1">Total Costs</h3>
                  <p className="text-2xl mt-2 font-bold text-red-600">{formatCurrency(totalCosts)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-600 font-medium mb-1">Net Profit</h3>
                  <p className={`text-2xl mt-2 font-bold ${isLoss ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatCurrency(totalProfit)}
                  </p>
                  <p className={`text-sm ${isLoss ? 'text-red-500' : 'text-green-500'}`}>
                    {isLoss ? 'Loss' : 'Profit'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-600 font-medium mb-1">Profit Margin</h3>
                  <p className={`text-2xl mt-2 font-bold ${isLoss ? 'text-red-600' : 'text-purple-600'}`}>
                    {profitMargin.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${profitMargin >= 20 ? 'text-green-500' : profitMargin >= 10 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {profitMargin >= 20 ? 'Excellent' : profitMargin >= 10 ? 'Good' : 'Poor'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {!loading && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <select
                    value={analysisType}
                    onChange={(e) => handleAnalysisTypeChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="general">General Analysis</option>
                    <option value="monthly">Monthly Analysis</option>
                    <option value="weekly">Weekly Analysis</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!loading && (analysisData || monthlyData) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {analysisType === 'monthly' ? 'Monthly' : 'Product'} Performance ({filteredData.length})
                  </h3>
                </div>
                <div className="text-sm text-gray-500">
                  {analysisType === 'monthly' ? 'Monthly Breakdown' : 
                   `Total Units Sold: ${filteredData.reduce((sum, item) => sum + (item.unitsSold || item.totalUnitsSold || 0), 0)}`}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const itemProfit = calculateItemProfit(item);
                const itemMargin = calculateItemMargin(item);
                const isItemLoss = itemProfit < 0;
                
                return (
                  <div key={`${analysisType}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {analysisType === 'monthly' ? item.productName : item.product}
                        </h4>
                        {analysisType === 'monthly' && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {formatMonthYear(item.month, item.year)}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          Units Sold: {item.unitsSold || item.totalUnitsSold || 0}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          itemProfit > 0 ? 'bg-green-100 text-green-700' :
                          itemProfit < 0 ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {itemProfit > 0 ? 'Profitable' : itemProfit < 0 ? 'Loss' : 'Break-even'}
                        </span>
                      </div>
                    </div>

                    {showDetails && analysisType === 'general' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm">
                            <span className="text-gray-500">Current Stock:</span>
                            <span className={`ml-2 font-medium ${item.lowStock ? 'text-red-600' : 'text-gray-800'}`}>
                              {item.stock} {item.lowStock && '(Low Stock!)'}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Min Stock:</span>
                            <span className="ml-2 font-medium text-gray-600">{item.minStock}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm block">Total Revenue</span>
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(item.revenue || item.totalRevenue)}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm block">Total Cost</span>
                        <p className="font-semibold text-red-600">
                          {formatCurrency(item.cost || item.totalCost)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm block">Total Profit</span>
                        <p className={`font-semibold ${isItemLoss ? 'text-red-600' : 'text-purple-600'}`}>
                          {formatCurrency(itemProfit)}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm block">Profit Margin</span>
                        <p className={`font-semibold ${isItemLoss ? 'text-red-600' : 'text-orange-600'}`}>
                          {isItemLoss ? `↘ ${Math.abs(itemMargin).toFixed(1)}%` : `↗ ${itemMargin.toFixed(1)}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No data found</h3>
                <p className="text-gray-500">
                  {analysisType === 'monthly' 
                    ? 'No monthly sales data available. Try changing the analysis type or ensure you have sales data.'
                    : 'Try adjusting your search criteria, or ensure you have sales data recorded.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}