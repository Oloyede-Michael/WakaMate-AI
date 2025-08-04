import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Filter, 
  Search, 
  Plus, 
  Edit3, 
  Trash2 
} from 'lucide-react';

export default function InventoryManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('inventory_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'Others',
    currentStock: '',
    minimumStock: '',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
    description: ''
  });

  // Persist products whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('inventory_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products', e);
    }
  }, [products]);

  const categories = ['All Categories', 'Clothing', 'Electronics', 'Cosmetics', 'Bags', 'Other'];  
  const lowStockItems = products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateProfitMargin = (cost, selling) => {
    const costPrice = parseFloat(cost);
    const sellingPrice = parseFloat(selling);
    if (isNaN(costPrice) || isNaN(sellingPrice) || costPrice === 0) return 0;
    const margin = ((sellingPrice - costPrice) / costPrice) * 100;
    return margin;
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.costPrice || !formData.sellingPrice) return;

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      currentStock: parseInt(formData.currentStock) || 0,
      minimumStock: parseInt(formData.minimumStock) || 5,
      costPrice: parseInt(formData.costPrice),
      sellingPrice: parseInt(formData.sellingPrice),
      supplier: formData.supplier || 'Unknown Supplier',
      description: formData.description || 'No description provided',
      profitMargin: Number(calculateProfitMargin(formData.costPrice, formData.sellingPrice).toFixed(2))
    };

    setProducts(prev => [...prev, newProduct]);
    resetForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      currentStock: product.currentStock.toString(),
      minimumStock: product.minimumStock.toString(),
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      supplier: product.supplier,
      description: product.description
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = () => {
    if (!formData.name || !formData.costPrice || !formData.sellingPrice) return;

    setProducts(prev =>
      prev.map(product =>
        product.id === editingProduct
          ? {
              ...product,
              name: formData.name,
              category: formData.category,
              currentStock: parseInt(formData.currentStock) || 0,
              minimumStock: parseInt(formData.minimumStock) || 5,
              costPrice: parseInt(formData.costPrice),
              sellingPrice: parseInt(formData.sellingPrice),
              supplier: formData.supplier || 'Unknown Supplier',
              description: formData.description || 'No description provided',
              profitMargin: Number(
                calculateProfitMargin(formData.costPrice, formData.sellingPrice).toFixed(2)
              )
            }
          : product
      )
    );
    resetForm();
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Other',
      currentStock: '',
      minimumStock: '',
      costPrice: '',
      sellingPrice: '',
      supplier: '',
      description: ''
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (current, minimum) => {
    if (current === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (current <= minimum) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Manager</h1>
            <p className="text-gray-600">Keep track of your stock and never run out again 📦</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium mb-1">Inventory Value</p>
                <p className="text-3xl font-bold text-gray-900">₦{totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>

          <div className="flex  gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddForm(prev => !prev)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Close Form' : 'Add New Product'}
            </button>
          </div>
        </div>

        {/* Add / Edit Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  >
                    <option value="Other">Other</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Where do you buy this from?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product details, size, color, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.currentStock, product.minimumStock);
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.currentStock}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-semibold text-green-600">
                        ₦{product.sellingPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="text-green-600 font-medium">~{product.profitMargin}%</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 text-xs mb-1">
                        <span className="font-medium">Supplier:</span> {product.supplier}
                      </p>
                      <p className="text-gray-500 text-xs">{product.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
