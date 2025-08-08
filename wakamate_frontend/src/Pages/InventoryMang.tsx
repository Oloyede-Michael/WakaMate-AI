import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Filter, 
  Search, 
  Plus, 
  Edit3, 
  Trash2,
  Loader2 
} from 'lucide-react';

// API configuration
const API_BASE_URL = 'http://localhost:1050/api';

// Types
interface Product {
  _id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  unitsSold: number;
  minStock: number;
  sales: Array<{
    quantity: number;
    price: number;
    amountMade: number;
    date: string;
  }>;
  user: string;
  createdAt: string;
  updatedAt: string;
  lowStock?: boolean;
}

interface FormData {
  name: string;
  category: string;
  currentStock: string;
  minimumStock: string;
  costPrice: string;
  sellingPrice: string;
}

// Get auth token from localStorage with multiple possible keys
const getAuthToken = (): string | null => {
  // Try different possible token keys that might be used
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
};

// API service functions
const apiService = {
  async getAllProducts(): Promise<Product[]> {
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

  async createProduct(productData: {
    name: string;
    category: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
  }): Promise<{ message: string; product: Product }> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create product: ${response.status}`);
    }

    return response.json();
  },

  async restockProduct(productId: string, quantity: number, costPrice?: number): Promise<{ message: string; product: Product }> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    console.log('Restocking product:', { productId, quantity, costPrice });

    const requestBody: { quantity: number; costPrice?: number } = { quantity };
    if (costPrice !== undefined && costPrice > 0) {
      requestBody.costPrice = costPrice;
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}/restock`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Restock response status:', response.status);

    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Restock error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || errorData.error || `Failed to restock product: ${response.status}`);
      } catch {
        throw new Error(`Failed to restock product: ${response.status} - ${errorText}`);
      }
    }

    return response.json();
  }
};

export default function InventoryManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restockingProduct, setRestockingProduct] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Other',
    currentStock: '',
    minimumStock: '',
    costPrice: '',
    sellingPrice: ''
  });

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check what tokens are available
      const allTokens: { key: string; token: string }[] = [];
      const possibleKeys = ['authToken', 'token', 'accessToken', 'jwt', 'userToken'];
      for (const key of possibleKeys) {
        const token = localStorage.getItem(key);
        if (token) {
          allTokens.push({ key, token: token.substring(0, 20) + '...' });
        }
      }
      console.log('Available tokens:', allTokens);
      
      const fetchedProducts = await apiService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Move handleQuickRestock outside of the map function
  const handleQuickRestock = async (productId: string) => {
    const qtyStr = restockQuantity[productId];
    const quantity = parseInt(qtyStr || '0', 10);
    
    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity to restock.');
      return;
    }

    setRestockingProduct(productId);
    setError(null);
    
    try {
      console.log('Starting restock for product:', productId, 'with quantity:', quantity);
      await apiService.restockProduct(productId, quantity);
      await loadProducts();
      setRestockQuantity(prev => ({ ...prev, [productId]: '' }));
      console.log('Restock successful');
    } catch (err) {
      console.error('Restock failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to restock product');
    } finally {
      setRestockingProduct(null);
    }
  };

  const categories = ['All Categories', 'Clothing', 'Electronics', 'Cosmetics', 'Bags', 'Other'];
  const lowStockItems = products.filter(p => p.lowStock || p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.sellingPrice), 0);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateProfitMargin = (cost: string, selling: string): number => {
    const costPrice = parseFloat(cost);
    const sellingPrice = parseFloat(selling);
    if (isNaN(costPrice) || isNaN(sellingPrice) || costPrice === 0) return 0;
    const margin = ((sellingPrice - costPrice) / costPrice) * 100;
    return margin;
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        name: formData.name,
        category: formData.category,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.currentStock) || 0,
        minStock: parseInt(formData.minimumStock) || 0,
      };

      await apiService.createProduct(productData);
      
      // Reload products to get the latest data
      await loadProducts();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      currentStock: product.stock.toString(),
      minimumStock: product.minStock.toString(),
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !formData.name || !formData.costPrice || !formData.sellingPrice) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const currentProduct = products.find(p => p._id === editingProduct);
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Calculate stock difference for restocking
      const newStock = parseInt(formData.currentStock) || 0;
      const stockDifference = newStock - currentProduct.stock;
      const newCostPrice = parseFloat(formData.costPrice);

      console.log('Update data:', {
        currentStock: currentProduct.stock,
        newStock,
        stockDifference,
        newCostPrice,
        currentCostPrice: currentProduct.costPrice
      });

      if (stockDifference !== 0) {
        if (stockDifference > 0) {
          // If stock is being increased, use the restock endpoint
          console.log('Restocking with quantity:', stockDifference);
          await apiService.restockProduct(editingProduct, stockDifference, newCostPrice);
        } else {
          // If stock is being decreased, you might need a different endpoint
          // For now, we'll show a message that stock can only be increased
          throw new Error('Stock can only be increased. Use the sales function to reduce stock.');
        }
      } else if (newCostPrice !== currentProduct.costPrice) {
        // If only cost price is being updated, restock with 0 quantity but new cost price
        console.log('Updating cost price only');
        await apiService.restockProduct(editingProduct, 0, newCostPrice);
      } else {
        // No stock or price changes, just reload to show current data
        console.log('No changes detected');
      }

      // Note: For full product updates (name, category, selling price, etc.), 
      // you need to add an update endpoint to your backend like:
      // PUT /api/products/:id (for updating name, category, sellingPrice, etc.)
      
      // Reload products to get the latest data
      await loadProducts();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Other',
      currentStock: '',
      minimumStock: '',
      costPrice: '',
      sellingPrice: ''
    });
    setShowAddForm(false);
    setEditingProduct(null);
    setError(null);
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (current <= minimum) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3">
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

            <button
              onClick={loadProducts}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
              Refresh
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
                    placeholder="0"
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

              {/* Profit Margin Preview */}
              {formData.costPrice && formData.sellingPrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Estimated Profit Margin:</span> ~{calculateProfitMargin(formData.costPrice, formData.sellingPrice).toFixed(1)}%
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  disabled={submitting}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
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
              const stockStatus = getStockStatus(product.stock, product.minStock);
              const profitMargin = ((product.sellingPrice - product.costPrice) / product.costPrice) * 100;
              
              return (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
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
                        disabled={submitting}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.stock}</span>
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
                      <span className="text-gray-600">Units Sold:</span>
                      <span className="font-medium">{product.unitsSold}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="text-green-600 font-medium">~{profitMargin.toFixed(1)}%</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Min Stock: {product.minStock}</span>
                        <span>Cost: ₦{product.costPrice.toLocaleString()}</span>
                      </div>
                      
                      {/* Quick Restock */}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={restockQuantity[product._id] || ''}
                          onChange={(e) => setRestockQuantity(prev => ({ 
                            ...prev, 
                            [product._id]: e.target.value 
                          }))}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          disabled={restockingProduct === product._id}
                          min="1"
                        />
                        <button
                          onClick={() => handleQuickRestock(product._id)}
                          disabled={restockingProduct === product._id || !restockQuantity[product._id] || parseInt(restockQuantity[product._id] || '0') <= 0}
                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded transition-colors flex items-center gap-1"
                        >
                          {restockingProduct === product._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          Restock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'All Categories'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding some products to your inventory'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
