import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calculator,
  Eye,
  EyeOff,
  Download,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
const salesData = [
    {
      id: 1,
      product: 'African Print Dress',
      category: 'Clothing',
      categoryColor: 'purple',
      costPrice: 2500,
      sellingPrice: 8500,
      quantity: 3,
      supplier: 'Mama Kemi - Balogun Market',
      date: '2025-07-20',
      description: 'Beautiful Ankara dress, sizes S-XL available'
    },
    {
      id: 2,
      product: 'Wireless Earbuds',
      category: 'Electronics',
      categoryColor: 'blue',
      costPrice: 6000,
      sellingPrice: 12000,
      quantity: 2,
      supplier: 'Alaba Electronics',
      date: '2025-07-19',
      description: 'High quality Bluetooth earbuds with charging case'
    },
    {
      id: 3,
      product: 'Shea Butter Cream',
      category: 'Cosmetics',
      categoryColor: 'pink',
      costPrice: 1000,
      sellingPrice: 3000,
      quantity: 5,
      supplier: 'Northern Naturals',
      date: '2025-07-18',
      description: '100% natural shea butter moisturizer, 100ml'
    },
    {
      id: 4,
      product: 'Leather Handbag',
      category: 'Bags',
      categoryColor: 'yellow',
      costPrice: 9000,
      sellingPrice: 18000,
      quantity: 1,
      supplier: 'Kano Leather Works',
      date: '2025-07-17',
      description: 'Genuine leather handbag, brown and black available'
    },
    {
      id: 5,
      product: 'Traditional Beads',
      category: 'Accessories',
      categoryColor: 'green',
      costPrice: 1500,
      sellingPrice: 4500,
      quantity: 4,
      supplier: 'Benin Craft Center',
      date: '2025-07-16',
      description: 'Handmade traditional beads, various colors'
    }
  ];

export default function PndL() {
  const [showDetails, setShowDetails] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
    const [sales, setSales] = useState(salesData);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newSale, setNewSale] = useState({
    product: '',
    category: 'Clothing',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    supplier: '',
    date: '',
    description: ''
  });

const handleAddSale = () => {
  const newId = sales.length + 1;
  const updatedSale = {
    ...newSale,
    id: newId,
    costPrice: Number(newSale.costPrice),
    sellingPrice: Number(newSale.sellingPrice),
    quantity: Number(newSale.quantity),
    categoryColor: 'blue' // you can customize based on category
  };
  setSales([updatedSale, ...sales]);
  setIsAddMode(false);
  setNewSale({
    product: '',
    category: 'Clothing',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    supplier: '',
    date: '',
    description: ''
  });
};

const handleDeleteSale = (id) => {
  setSales(sales.filter(item => item.id !== id));
};

  

  // Calculate totals
  const totalRevenue = sales.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const totalCosts = sales.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const totalProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

  // Filter sales data
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
    return ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100);
  };

  const getCategoryColor = (category, type = 'bg') => {
    const colors = {
      purple: type === 'bg' ? 'bg-purple-100 text-purple-700' : 'border-purple-200',
      blue: type === 'bg' ? 'bg-blue-100 text-blue-700' : 'border-blue-200',
      pink: type === 'bg' ? 'bg-pink-100 text-pink-700' : 'border-pink-200',
      yellow: type === 'bg' ? 'bg-yellow-100 text-yellow-700' : 'border-yellow-200',
      green: type === 'bg' ? 'bg-green-100 text-green-700' : 'border-green-200'
    };
    return colors[category] || colors.blue;
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-medium mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-green-500 mt-1">↗ +12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-medium mb-1">Total Costs</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</p>
                <p className="text-sm text-red-500 mt-1">↗ +8.2% from last month</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-medium mb-1">Net Profit</h3>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalProfit)}</p>
                <p className="text-sm text-green-500 mt-1">↗ +18.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-medium mb-1">Profit Margin</h3>
                <p className="text-2xl font-bold text-purple-600">{profitMargin.toFixed(1)}%</p>
                <p className="text-sm text-green-500 mt-1">↗ +4.7% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="bags">Bags</option>
                  <option value="accessories">Accessories</option>
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
              
              <button  onClick={() => setIsAddMode(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Sale</span>
              </button>
            </div>
          </div>
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
            {filteredSales.map((item) => (
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
                    <p className="font-semibold text-purple-600">{formatCurrency(calculateItemProfit(item))}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <span className="text-gray-500 text-sm block">Profit Margin</span>
                    <p className="font-semibold text-orange-600">
                      ↗ {calculateItemMargin(item).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
      {isAddMode && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Add New Sale</h2>

      <input type="text" placeholder="Product" value={newSale.product}
        onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
        className="w-full border rounded p-2"
      />

      <select value={newSale.category} onChange={(e) => setNewSale({ ...newSale, category: e.target.value })} className="w-full border rounded p-2">
        <option>Clothing</option>
        <option>Electronics</option>
        <option>Cosmetics</option>
        <option>Bags</option>
        <option>Accessories</option>
      </select>

      <input type="number" placeholder="Cost Price" value={newSale.costPrice}
        onChange={(e) => setNewSale({ ...newSale, costPrice: e.target.value })}
        className="w-full border rounded p-2"
      />
      <input type="number" placeholder="Selling Price" value={newSale.sellingPrice}
        onChange={(e) => setNewSale({ ...newSale, sellingPrice: e.target.value })}
        className="w-full border rounded p-2"
      />
      <input type="number" placeholder="Quantity" value={newSale.quantity}
        onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
        className="w-full border rounded p-2"
      />
      <input type="text" placeholder="Supplier" value={newSale.supplier}
        onChange={(e) => setNewSale({ ...newSale, supplier: e.target.value })}
        className="w-full border rounded p-2"
      />
      <input type="date" value={newSale.date}
        onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
        className="w-full border rounded p-2"
      />
      <textarea placeholder="Description" value={newSale.description}
        onChange={(e) => setNewSale({ ...newSale, description: e.target.value })}
        className="w-full border rounded p-2"
      ></textarea>

      <div className="flex justify-end space-x-3">
        <button onClick={() => setIsAddMode(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
        <button onClick={handleAddSale} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}