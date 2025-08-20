import React, { useState, useEffect } from 'react';
import {
  Banknote,
  Package,
  Truck,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { Link } from "react-router-dom";

// API configuration
const API_BASE_URL = 'http://localhost:1050/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const possibleKeys = ['authToken', 'token', 'accessToken', 'jwt', 'userToken'];
  
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  
  return null;
};

// API service functions
const apiService = {
  async getAllProducts() {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/products/getAll`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch products: ${response.status}`);
    }
    
    return response.json();
  },

  async recordSale(productId, saleData) {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/sell`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to record sale: ${response.status}`);
    }
    
    return response.json();
  },

  // Add other API calls here as needed for sales, deliveries, etc.
  async getAllSales() {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    // This endpoint might need to be created in your backend
    try {
      const response = await fetch(`${API_BASE_URL}/sales/getAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return response.json();
      }
      
      // If sales endpoint doesn't exist, return empty array
      return [];
    } catch {
      return [];
    }
  }
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleLoading, setSaleLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    
    // Load data from API
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load products (this will give us inventory data)
      const productsData = await apiService.getAllProducts();
      setProducts(productsData);

      // Load sales data (if endpoint exists)
      const salesData = await apiService.getAllSales();
      setSales(salesData);

      // For now, we'll use mock data for deliveries since the endpoint might not exist
      // You can replace this with actual API call when available
      setDeliveries([
        { id: 1, status: 'pending' },
        { id: 2, status: 'delivered' },
        { id: 3, status: 'pending' }
      ]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard metrics from real data
  const todaysSales = React.useMemo(() => {
    const today = new Date().toDateString();
    return products.reduce((total, product) => {
      // Sum up today's sales from each product
      const todaySales = product.sales?.filter(sale => 
        new Date(sale.date).toDateString() === today
      ) || [];
      
      return total + todaySales.reduce((sum, sale) => sum + sale.amountMade, 0);
    }, 0);
  }, [products]);

  const totalProducts = products.length;
  
  const lowStockItems = React.useMemo(() => {
    return products.filter(p => p.stock <= p.minStock);
  }, [products]);

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;

  const totalRevenue = React.useMemo(() => {
    return products.reduce((total, product) => {
      const productRevenue = product.sales?.reduce((sum, sale) => sum + sale.amountMade, 0) || 0;
      return total + productRevenue;
    }, 0);
  }, [products]);

  const handleRecordSale = async () => {
    if (!selectedProduct || !saleQuantity || !salePrice || 
        parseFloat(saleQuantity) <= 0 || parseFloat(salePrice) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    const product = products.find(p => p._id === selectedProduct);
    if (!product) {
      alert('Selected product not found');
      return;
    }

    if (parseFloat(saleQuantity) > product.stock) {
      alert('Sale quantity cannot exceed available stock');
      return;
    }

    setSaleLoading(true);
    try {
      const saleData = {
        quantity: parseFloat(saleQuantity),
        price: parseFloat(salePrice),
        amountMade: parseFloat(saleQuantity) * parseFloat(salePrice)
      };

      await apiService.recordSale(selectedProduct, saleData);
      
      // Reload the dashboard data to get updated information
      await loadDashboardData();
      
      // Reset form
      setSelectedProduct('');
      setSaleQuantity('');
      setSalePrice('');
      setShowSaleForm(false);
      
      alert('Sale recorded successfully!');
      
    } catch (err) {
      console.error('Error recording sale:', err);
      alert('Failed to record sale: ' + err.message);
    } finally {
      setSaleLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'plan-route':
        alert('Route planning feature would open here');
        break;
      case 'add-stock':
        alert('Inventory management would open here');
        break;
      case 'generate-caption':
        alert('Caption generator would open here');
        break;
      case 'record-sale':
        setShowSaleForm(true);
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            👋 Good Morning{user?.firstName ? `, ${user.firstName}!` : ', Hustler!'}
          </h1>
          <p className="text-gray-600 text-lg">Let's make today profitable. Here's your business overview:</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sales */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-green-600 font-medium text-sm">Today's Sales</p>
                <Banknote className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(todaysSales)}</p>
              <p className="text-sm text-green-600 mt-1">Profit: {formatCurrency(Math.round(todaysSales * 0.3))}</p>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-purple-600 font-medium text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                {lowStockItems.length > 0 && (
                  <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {lowStockItems.length} low stock
                  </p>
                )}
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          {/* Pending Deliveries */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-blue-600 font-medium text-sm mb-1">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">{pendingDeliveries}</p>
                <p className="text-sm text-blue-600 mt-1">Ready to deliver</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-orange-600 font-medium text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-orange-600 mt-1">All time</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Plan Route */}
            <Link to="delivery" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Plan Route</h3>
              <p className="text-sm text-gray-600">Optimize your delivery route</p>
            </Link>

            {/* Add Stock */}
            <Link to="inventory" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Stock</h3>
              <p className="text-sm text-gray-600">Update your inventory</p>
            </Link>

            {/* Generate Caption */}
            <Link to="ai-caption" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Generate Caption</h3>
              <p className="text-sm text-gray-600">Create catchy posts</p>
            </Link>

            {/* Record Sale */}
            <Link to="profitNloss" className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Record Sale</h3>
              <p className="text-sm text-gray-600">Log your latest sale</p>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-teal-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
              </div>
              <button
                onClick={() => setShowSaleForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Sale
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 text-gray-300 mb-4">
                  <ShoppingCart className="w-full h-full" />
                </div>
                <p className="text-gray-500 text-lg mb-6">No sales data available</p>
                <button
                  onClick={loadDashboardData}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Display recent sales from products */}
                {products
                  .filter(product => product.sales && product.sales.length > 0)
                  .flatMap(product => 
                    product.sales.map(sale => ({
                      ...sale,
                      productName: product.name,
                      productId: product._id
                    }))
                  )
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((sale, index) => (
                    <div key={`${sale.productId}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sale.productName}</p>
                        <p className="text-sm text-gray-500">
                          {sale.quantity} units × {formatCurrency(sale.price)} = {formatCurrency(sale.amountMade)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sale.date).toLocaleDateString()} at {new Date(sale.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Banknote className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                
                {products.filter(p => p.sales && p.sales.length > 0).length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No recent sales found</p>
                    <button
                      onClick={() => setShowSaleForm(true)}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Record First Sale
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Stock Alerts</h2>
            </div>

            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                <>
                  {lowStockItems.map((item) => (
                    <div key={item._id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          {item.stock === 0 ? (
                            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-orange-600 text-sm">
                          {item.stock === 0 ? 'Completely out of stock' : `Only ${item.stock} left`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Min: {item.minStock} units
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.stock === 0 ? 'bg-red-500' : 
                              item.stock <= item.minStock ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.max(5, (item.stock / (item.minStock * 2)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Category: {item.category}
                        </span>
                        <span className="text-gray-500">
                          Value: {formatCurrency(item.stock * item.sellingPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Action Required</h4>
                    </div>
                    <p className="text-yellow-700 text-sm mb-3">
                      You have {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} that need restocking.
                    </p>
                    <Link to="inventory">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Restock Items
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-2">All products are well stocked!</p>
                  <p className="text-sm text-gray-400">Keep up the good work managing your inventory.</p>
                </div>
              )}

              <Link to="./inventory">
                <button className="w-full mt-4 flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors group">
                  <span className="font-medium text-gray-900">Manage Inventory</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Sale Recording Modal */}
        {showSaleForm && (
          <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Record New Sale</h3>
                <button
                  onClick={() => {
                    setShowSaleForm(false);
                    setSelectedProduct('');
                    setSaleQuantity('');
                    setSalePrice('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => {
                      setSelectedProduct(e.target.value);
                      // Auto-populate price with selling price
                      const product = products.find(p => p._id === e.target.value);
                      if (product) {
                        setSalePrice(product.sellingPrice.toString());
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  >
                    <option value="">Choose a product...</option>
                    {products.filter(p => p.stock > 0).map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} (Stock: {product.stock}, Price: {formatCurrency(product.sellingPrice)})
                      </option>
                    ))}
                  </select>
                  {products.filter(p => p.stock > 0).length === 0 && (
                    <p className="text-sm text-red-600 mt-1">No products with stock available</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(e.target.value)}
                    placeholder="Enter quantity sold"
                    min="1"
                    max={selectedProduct ? products.find(p => p._id === selectedProduct)?.stock : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                  {selectedProduct && (
                    <p className="text-sm text-gray-500 mt-1">
                      Available stock: {products.find(p => p._id === selectedProduct)?.stock}
                    </p>
                  )}
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Enter sale price per unit"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                </div>

                {/* Total Amount Display */}
                {saleQuantity && salePrice && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      Total Amount: <span className="font-semibold">{formatCurrency(parseFloat(saleQuantity) * parseFloat(salePrice))}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRecordSale}
                  disabled={!selectedProduct || !saleQuantity || !salePrice || saleLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {saleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4" />
                      Record Sale
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSaleForm(false);
                    setSelectedProduct('');
                    setSaleQuantity('');
                    setSalePrice('');
                  }}
                  disabled={saleLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}