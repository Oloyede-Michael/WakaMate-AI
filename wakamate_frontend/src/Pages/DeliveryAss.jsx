import React, { useState, useEffect } from 'react';
import { Send, MapPin, Banknote, CheckCircle, Plus, Calendar, Trash2, Phone, Navigation, MessageSquare, Route, TrendingUp, Zap, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function DeliveryAss() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deliveries, setDeliveries] = useState([]);

  // Get auth token from localStorage with multiple possible keys (matching your P&L dashboard)
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

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    estimatedCost: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    priority: 'Medium priority',
    additionalNotes: ''
  });

  // Update these URLs to match your backend
  const DELIVERY_API_BASE_URL = 'http://localhost:1050/api'; // Update with your actual delivery backend URL
  const AI_API_BASE_URL = 'http://localhost:3002/api'; // Keep the AI backend separate

  const pendingDeliveries = deliveries.length; // Since your schema doesn't have status
  const completedToday = 0; // You might want to add status to your schema
  const totalCost = deliveries.reduce((sum, d) => sum + (d.estimatedCost || 0), 0);

  // Backend API functions for delivery management
  const deliveryApiCall = async (endpoint, options = {}) => {
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${DELIVERY_API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await deliveryApiCall('/getdeliveries');
      if (response.success) {
        setDeliveries(response.data || []);
      } else {
        throw new Error('Failed to fetch deliveries');
      }
    } catch (error) {
      setError('Failed to fetch deliveries. Please check your connection and try again.');
      console.error('Fetch deliveries error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDelivery = async (deliveryData) => {
    try {
      const response = await deliveryApiCall('/deliveries', {
        method: 'POST',
        body: JSON.stringify(deliveryData)
      });
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save delivery');
      }
    } catch (error) {
      setError('Failed to save delivery');
      throw error;
    }
  };

  const updateDelivery = async (id, updates) => {
    try {
      const response = await deliveryApiCall(`/updeliveries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update delivery');
      }
    } catch (error) {
      setError('Failed to update delivery');
      throw error;
    }
  };

  const deleteDelivery = async (id) => {
    try {
      const response = await deliveryApiCall(`/deletedeliveries/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete delivery');
      }
    } catch (error) {
      setError('Failed to delete delivery');
      throw error;
    }
  };

  const clearAllDeliveries = async () => {
    try {
      // Since there's no bulk delete endpoint, we'll delete each delivery individually
      const deletePromises = deliveries.map(delivery => deleteDelivery(delivery._id));
      await Promise.all(deletePromises);
      
      setDeliveries([]);
      setOptimizationResult(null);
      setShowClearConfirm(false);
      setError(null);
    } catch (error) {
      setError('Failed to clear all deliveries');
    }
  };

  // Test connection and fetch data on component mount
  useEffect(() => {
    testConnection();
    fetchDeliveries();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      const authToken = getAuthToken();
      // Test delivery backend connection
      const response = await fetch(`${DELIVERY_API_BASE_URL}/getdeliveries`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        setError(null);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus('warning');
      console.warn('Connection test failed:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // AI optimization function (using the separate AI backend)
  const optimizeRoute = async (deliveryData) => {
    if (deliveryData.length < 2) return null;

    setIsOptimizing(true);
    
    try {
      const addresses = deliveryData.map(d => d.deliveryAddress).join(', ');
      const message = `Optimize delivery route for these Lagos locations: ${addresses}. Include estimated travel times, distances, and fuel costs. Suggest the most efficient order.`;

      const response = await fetch(`${AI_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let botResponse = '';
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        botResponse = data.choices[0].message.content;
      } else if (data.response) {
        botResponse = data.response;
      } else if (data.output) {
        botResponse = data.output;
      } else if (data.value) {
        botResponse = data.value;
      } else if (typeof data === 'string') {
        botResponse = data;
      } else {
        botResponse = 'No response content received from agent';
      }

      return botResponse;

    } catch (error) {
      console.error('Route optimization error:', error);
      
      // Try fallback endpoint
      try {
        const addresses = deliveryData.map(d => d.deliveryAddress).join(', ');
        const message = `Optimize delivery route for these Lagos locations: ${addresses}. Include estimated travel times, distances, and fuel costs.`;
        
        const fallbackResponse = await fetch(`${AI_API_BASE_URL}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ input_message: message })
        });

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        return fallbackData.value || fallbackData.response || fallbackData.output || 'Route optimization service unavailable';

      } catch (fallbackError) {
        return `❌ **Route Optimization Failed**\n\nCould not connect to the Lagos Route Optimizer.\n\n**Error:** ${error.message}`;
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAddDelivery = async () => {
    if (!formData.customerName || !formData.deliveryAddress || !formData.phoneNumber) return;

    const newDelivery = {
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      deliveryAddress: formData.deliveryAddress,
      estimatedCost: parseFloat(formData.estimatedCost) || 0,
      deliveryDate: new Date(formData.deliveryDate),
      priority: formData.priority,
      additionalNotes: formData.additionalNotes
    };

    try {
      const savedDelivery = await saveDelivery(newDelivery);
      setDeliveries([...deliveries, savedDelivery]);

      setFormData({
        customerName: '',
        phoneNumber: '',
        deliveryAddress: '',
        estimatedCost: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        priority: 'Medium priority',
        additionalNotes: ''
      });
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error('Failed to add delivery:', error);
    }
  };

  const handleDeleteDelivery = async (id) => {
    try {
      await deleteDelivery(id);
      setDeliveries(deliveries.filter(d => d._id !== id));
      setError(null);
    } catch (error) {
      console.error('Failed to delete delivery:', error);
    }
  };

  const manualOptimize = async () => {
    if (deliveries.length >= 2) {
      const optimization = await optimizeRoute(deliveries);
      setOptimizationResult({
        timestamp: new Date(),
        deliveryCount: deliveries.length,
        content: optimization
      });
    }
  };

  const formatOptimizationContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-blue-700 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-blue-800 mt-6 mb-3 border-b border-blue-200 pb-1">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-blue-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-sm border-l-4 border-blue-400"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/^[•\-\*]\s+(.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/(<li>.*<\/li>)/g, function(match) {
        return '<ul class="list-disc list-inside my-2">' + match + '</ul>';
      });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢 system Connected';
      case 'connecting': return '🟡 Connecting...';
      case 'warning': return '🟠 Connection Uncertain';
      default: return '🔴 Offline Mode';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delivery Assistant</h1>
              <p className="text-gray-600">Smart route optimization for Lagos deliveries 🏍️</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={() => { testConnection(); fetchDeliveries(); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            {/* Clear Data Button */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
            
            {/* Connection Status */}
            <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <p className="text-orange-800">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-orange-500 hover:text-orange-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-blue-800 font-medium">Loading deliveries...</p>
            </div>
          </div>
        )}

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Clear All Data?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete all deliveries from the backend. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllDeliveries}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yes, Clear All Data
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium mb-1">Total Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">{pendingDeliveries}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">₦{totalCost}</p>
              </div>
              <Banknote className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium mb-1">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">
                  {deliveries.filter(d => d.priority === 'High priority').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium mb-1">Route Efficiency</p>
                <p className="text-3xl font-bold text-gray-900">94%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Route Optimization Results */}
        {optimizationResult && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Route Optimization</h3>
                <p className="text-sm text-gray-600">
                  Optimized for {optimizationResult.deliveryCount} deliveries • 
                  {optimizationResult.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div 
              className="prose prose-sm max-w-none bg-white rounded-lg p-4 border"
              dangerouslySetInnerHTML={{ 
                __html: formatOptimizationContent(optimizationResult.content) 
              }}
            />
          </div>
        )}

        {/* Manual Optimization Button */}
        {deliveries.length >= 2 && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Optimize Route?</h3>
                <p className="text-purple-100">
                  {deliveries.length} deliveries ready for optimization
                </p>
              </div>
              <button
                onClick={manualOptimize}
                disabled={isOptimizing}
                className="bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Optimize Route
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator when optimizing */}
        {isOptimizing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-yellow-600 rounded-full animate-spin"></div>
              <p className="text-yellow-800 font-medium">
                AI is optimizing your Lagos delivery route...
              </p>
            </div>
          </div>
        )}

        {/* Add New Delivery Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-gray-900 font-medium mb-4 hover:text-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Delivery
          </button>

          {showAddForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="080xxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter full address with landmarks (e.g., No 15, Adeniyi Jones, Ikeja)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost (₦) *
                  </label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                    <option>Low priority</option>
                    <option>Medium priority</option>
                    <option>High priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or landmarks..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddDelivery}
                  disabled={!formData.customerName || !formData.deliveryAddress || !formData.phoneNumber}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Locations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Navigation className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Delivery Locations ({deliveries.length})
            </h2>
          </div>

          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{delivery.customerName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      delivery.priority === 'High priority' 
                        ? 'bg-red-100 text-red-700'
                        : delivery.priority === 'Medium priority'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {delivery.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteDelivery(delivery._id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {delivery.deliveryAddress}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {delivery.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      ₦{delivery.estimatedCost}
                    </p>
                  </div>
                </div>

                {delivery.additionalNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-600 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {delivery.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {deliveries.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">No deliveries added yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-2 text-blue-500 hover:text-blue-600 font-medium"
                >
                  Add your first delivery
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}