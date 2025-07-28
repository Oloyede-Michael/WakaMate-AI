import React, { useState } from 'react';
import { 
  DollarSign, 
  Package, 
  Truck, 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Earbuds', stock: 3, minStock: 5 },
    { id: 2, name: 'Phone Case', stock: 15, minStock: 10 },
    { id: 3, name: 'Bluetooth Speaker', stock: 8, minStock: 5 },
    { id: 4, name: 'Power Bank', stock: 2, minStock: 8 }
  ]);
  const [deliveries, setDeliveries] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleAmount, setSaleAmount] = useState('');

  // Calculate stats
  const todaysSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const totalRevenue = 32000; // Static for demo, would be calculated from all sales

  const handleRecordSale = () => {
    if (!saleAmount || parseFloat(saleAmount) <= 0) return;
    
    const newSale = {
      id: Date.now(),
      amount: parseFloat(saleAmount),
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString()
    };
    
    setSales(prev => [...prev, newSale]);
    setSaleAmount('');
    setShowSaleForm(false);
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

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            👋 Good Morning, Hustler!
          </h1>
          <p className="text-gray-600 text-lg">Let's make today profitable. Here's your business overview:</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sales */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-green-600 font-medium text-sm mb-1">Today's Sales</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(todaysSales)}</p>
                <p className="text-sm text-green-600 mt-1">Profit: {formatCurrency(Math.round(todaysSales * 0.3))}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
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
            <button
              onClick={() => handleQuickAction('plan-route')}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Plan Route</h3>
              <p className="text-sm text-gray-600">Optimize your delivery route</p>
            </button>

            {/* Add Stock */}
            <button
              onClick={() => handleQuickAction('add-stock')}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Stock</h3>
              <p className="text-sm text-gray-600">Update your inventory</p>
            </button>

            {/* Generate Caption */}
            <button
              onClick={() => handleQuickAction('generate-caption')}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Generate Caption</h3>
              <p className="text-sm text-gray-600">Create catchy posts</p>
            </button>

            {/* Record Sale */}
            <button
              onClick={() => handleQuickAction('record-sale')}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Record Sale</h3>
              <p className="text-sm text-gray-600">Log your latest sale</p>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Sales */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-5 h-5 text-teal-500" />
              <h2 className="text-xl font-semibold text-gray-900">Today's Sales</h2>
            </div>
            
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 text-gray-300 mb-4">
                  <ShoppingCart className="w-full h-full" />
                </div>
                <p className="text-gray-500 text-lg mb-6">No sales recorded today</p>
                <button
                  onClick={() => setShowSaleForm(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Record Your First Sale
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{formatCurrency(sale.amount)}</p>
                      <p className="text-sm text-gray-500">{sale.time}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowSaleForm(true)}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Record Another Sale
                </button>
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
              {lowStockItems.map((item) => (
                <div key={item.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                      Low Stock
                    </span>
                  </div>
                  <p className="text-orange-600 text-sm">Only {item.stock} left</p>
                </div>
              ))}

              {lowStockItems.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">All products are well stocked!</p>
                </div>
              )}

              <button
                onClick={() => handleQuickAction('add-stock')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="font-medium text-gray-900">Manage Inventory</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Sale Recording Modal */}
        {showSaleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Sale</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Amount (₦)
                </label>
                <input
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="Enter sale amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRecordSale}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Record Sale
                </button>
                <button
                  onClick={() => {
                    setShowSaleForm(false);
                    setSaleAmount('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
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