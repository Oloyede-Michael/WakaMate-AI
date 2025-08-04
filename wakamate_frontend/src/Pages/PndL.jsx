import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calculator,
  Eye,
  EyeOff,
  Filter,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';

const categoryColorMap = {
  Clothing: 'purple',
  Electronics: 'blue',
  Cosmetics: 'pink',
  Bags: 'yellow',
  Accessories: 'green',
};

const defaultNewSale = {
  product: '',
  category: 'Clothing',
  costPrice: '',
  sellingPrice: '',
  quantity: '',
  supplier: '',
  date: '',
  description: ''
};

export default function PndL() {
  const [showDetails, setShowDetails] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem('sales');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAddMode, setIsAddMode] = useState(false);
  const [newSale, setNewSale] = useState({ ...defaultNewSale });

  // Persist sales to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sales', JSON.stringify(sales));
    } catch (e) {
      console.warn('Failed to persist sales', e);
    }
  }, [sales]);

  const safeNumber = (v) => (v === '' || v === null || isNaN(Number(v)) ? 0 : Number(v));

  const handleAddSale = () => {
    if (!newSale.product.trim()) return;

    const newId = sales.length ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const categoryKey = newSale.category || 'Clothing';
    const updatedSale = {
      ...newSale,
      id: newId,
      costPrice: safeNumber(newSale.costPrice),
      sellingPrice: safeNumber(newSale.sellingPrice),
      quantity: safeNumber(newSale.quantity),
      categoryColor: categoryColorMap[categoryKey] || 'blue',
      date: newSale.date || new Date().toISOString().slice(0, 10)
    };
    setSales([updatedSale, ...sales]);
    setIsAddMode(false);
    setNewSale({ ...defaultNewSale });
  };

  const handleDeleteSale = (id) => {
    setSales(sales.filter(item => item.id !== id));
  };

  // Totals
  const totalRevenue = sales.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const totalCosts = sales.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const totalProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;
  const isLoss = totalProfit < 0;

  // Filtered
  const filteredSales = sales.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateItemProfit = (item) => {
    return (item.sellingPrice - item.costPrice) * item.quantity;
  };

  const calculateItemMargin = (item) => {
    return item.sellingPrice > 0 
      ? ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100) 
      : 0;
  };

  const getCategoryColor = (category, type = 'bg') => {
    const keyColor = categoryColorMap[category] || category;
    const colors = {
      purple: type === 'bg' ? 'bg-purple-100 text-purple-700' : 'border-purple-200',
      blue: type === 'bg' ? 'bg-blue-100 text-blue-700' : 'border-blue-200',
      pink: type === 'bg' ? 'bg-pink-100 text-pink-700' : 'border-pink-200',
      yellow: type === 'bg' ? 'bg-yellow-100 text-yellow-700' : 'border-yellow-200',
      green: type === 'bg' ? 'bg-green-100 text-green-700' : 'border-green-200'
    };
    return colors[keyColor] || colors.blue;
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className=" items-center justify-between">
              <div  className='flex justify-between items-center'>
                <h3 className="text-gray-600 font-medium mb-1">Total Revenue</h3>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl mt-2 font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className=" items-center justify-between">
              <div className='flex justify-between items-center'>
                <h3 className="text-gray-600 font-medium mb-1">Total Costs</h3>
                 <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                   <TrendingDown className="w-6 h-6 text-red-600" />
                 </div>
              </div>
               <p className="text-2xl mt-2 font-bold text-red-600">{formatCurrency(totalCosts)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="items-center justify-between">
              <div className='flex justify-between items-center'>
                <h3 className="text-gray-600 font-medium mb-1">Net Profit</h3>
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                   <Calculator className="w-6 h-6 text-blue-600" />
                 </div>
              </div>
              <p className={`text-2xl mt-2 font-bold ${isLoss ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatCurrency(totalProfit)}
                </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className=" items-center justify-between">
              <div className='flex justify-between items-center'>
                <h3 className="text-gray-600 font-medium mb-1">Profit Margin</h3>
                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div> 
              </div>
                <p className="text-2xl mt-2  font-bold text-purple-600">{profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Search / Controls + Add Form Toggle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Cosmetics">Cosmetics</option>
                  <option value="Bags">Bags</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
              </button>

              <button
                onClick={() => setIsAddMode(prev => !prev)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddMode ? 'Close Form' : 'Add Sale'}</span>
              </button>
            </div>
          </div>

          {/* Inline Add Sale Form */}
          {isAddMode && (
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product"
                  value={newSale.product}
                  onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <select
                  value={newSale.category}
                  onChange={(e) => setNewSale({ ...newSale, category: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  <option>Clothing</option>
                  <option>Electronics</option>
                  <option>Cosmetics</option>
                  <option>Bags</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Cost Price"
                  value={newSale.costPrice}
                  onChange={(e) => setNewSale({ ...newSale, costPrice: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={newSale.sellingPrice}
                  onChange={(e) => setNewSale({ ...newSale, sellingPrice: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newSale.supplier}
                  onChange={(e) => setNewSale({ ...newSale, supplier: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <input
                  type="date"
                  value={newSale.date}
                  onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <textarea
                placeholder="Description"
                value={newSale.description}
                onChange={(e) => setNewSale({ ...newSale, description: e.target.value })}
                className="w-full border rounded p-2"
              ></textarea>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAddMode(false);
                    setNewSale({ ...defaultNewSale });
                  }}
                  className="px-4 py-2 border rounded text-gray-600"
                >
                  Cancel
                </button>
                <button onClick={handleAddSale} className="px-4 py-2 bg-green-500 text-white rounded">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sales Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Sales Transactions ({filteredSales.length})
                </h3>
              </div>
              <div className="text-sm text-gray-500">
                Total Items Sold: {filteredSales.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSales.map((item) => {
              const itemProfit = calculateItemProfit(item);
              const itemMargin = calculateItemMargin(item);
              const isItemLoss = itemProfit < 0;
              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-800 text-lg">{item.product}</h4>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDeleteSale(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showDetails && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Supplier:</span>
                          <span className="ml-2 font-medium">{item.supplier}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-NG', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500 text-sm block">Cost Price</span>
                      <p className="font-semibold text-gray-800">{formatCurrency(item.costPrice)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="text-gray-500 text-sm block">Selling Price</span>
                      <p className="font-semibold text-green-600">{formatCurrency(item.sellingPrice)}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-gray-500 text-sm block">Total Revenue</span>
                      <p className="font-semibold text-blue-600">{formatCurrency(item.sellingPrice * item.quantity)}</p>
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

          {filteredSales.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No sales found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
