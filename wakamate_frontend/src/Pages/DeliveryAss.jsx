import React, { useState, useEffect } from 'react';
import { Send, MapPin, DollarSign, CheckCircle, Plus, Calendar, Trash2, Phone, Navigation, MessageSquare, Route, TrendingUp, Zap, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function DeliveryAss() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [deliveries, setDeliveries] = useState(() => {
    // Note: localStorage is not available in Claude artifacts, so using initial data
    return [
      {
        id: 1,
        customerName: 'Chioma Okafor',
        phone: '08099887766',
        address: 'No 23, Allen Avenue, Ikeja',
        cost: 600,
        date: '2024-12-20',
        priority: 'medium',
        notes: 'First floor apartment, blue gate',
        status: 'completed'
      }
    ];
  });

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'Medium Priority',
    notes: ''
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const completedToday = deliveries.filter(d => d.status === 'completed').length;
  const totalCost = deliveries.reduce((sum, d) => sum + (d.cost || 0), 0);

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  // Clear all data function
  const clearAllData = () => {
    setDeliveries([]);
    setOptimizationResult(null);
    setShowClearConfirm(false);
    
    // In your actual app with localStorage, you would also do:
    // localStorage.removeItem('deliveries');
    // localStorage.clear(); // This clears ALL localStorage data
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      const response = await fetch(`${API_BASE_URL}/openapi.json`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      try {
        const testResponse = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        if (testResponse.ok) {
          setConnectionStatus('connected');
        } else {
          throw new Error('Health check failed');
        }
      } catch (healthError) {
        setConnectionStatus('warning');
        console.warn('Connection test failed:', error, healthError);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const optimizeRoute = async (deliveryData) => {
    if (deliveryData.length < 2) return null;

    setIsOptimizing(true);
    
    try {
      const addresses = deliveryData.map(d => d.address).join(', ');
      const message = `Optimize delivery route for these Lagos locations: ${addresses}. Include estimated travel times, distances, and fuel costs. Suggest the most efficient order.`;

      const response = await fetch(`${API_BASE_URL}/chat`, {
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
        const addresses = deliveryData.map(d => d.address).join(', ');
        const message = `Optimize delivery route for these Lagos locations: ${addresses}. Include estimated travel times, distances, and fuel costs.`;
        
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
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

  const handleAddDelivery = () => {
    if (!formData.customerName || !formData.address) return;

    const newDelivery = {
      id: Date.now(),
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      cost: parseInt(formData.cost) || 0,
      date: formData.date,
      priority: formData.priority.toLowerCase().replace(' priority', ''),
      notes: formData.notes,
      status: 'pending'
    };

    setDeliveries([...deliveries, newDelivery]);

    setFormData({
      customerName: '',
      phone: '',
      address: '',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'Medium Priority',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteDelivery = (id) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
  };

  const toggleDeliveryStatus = (id) => {
    setDeliveries(deliveries.map(d => 
      d.id === id 
        ? { ...d, status: d.status === 'completed' ? 'pending' : 'completed' }
        : d
    ));
  };

  const manualOptimize = async () => {
    const pending = deliveries.filter(d => d.status === 'pending');
    if (pending.length >= 2) {
      const optimization = await optimizeRoute(pending);
      setOptimizationResult({
        timestamp: new Date(),
        deliveryCount: pending.length,
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
      case 'connected': return '🟢 Route Optimizer Connected';
      case 'connecting': return '🟡 Connecting...';
      case 'warning': return '🟠 Connection Uncertain';
      default: return '🔴 Disconnected';
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
            {/* Clear Data Button */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Clear All Data
            </button>
            
            {/* Connection Status */}
            <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        </div>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Clear All Data?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete all deliveries and optimization results. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllData}
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
                <p className="text-blue-600 font-medium mb-1">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-900">{pendingDeliveries}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium mb-1">Estimated Cost</p>
                <p className="text-3xl font-bold text-gray-900">₦{totalCost}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900">{completedToday}</p>
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
        {pendingDeliveries >= 2 && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Optimize Route?</h3>
                <p className="text-purple-100">
                  {pendingDeliveries} pending deliveries ready for optimization
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="080xxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
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
                    Estimated Cost (₦)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option>Low Priority</option>
                    <option>Medium Priority</option>
                    <option>High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
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
                  disabled={!formData.customerName || !formData.address}
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
              <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{delivery.customerName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      delivery.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {delivery.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      delivery.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : delivery.priority === 'medium'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {delivery.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDeliveryStatus(delivery.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        delivery.status === 'completed'
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDelivery(delivery.id)}
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
                      {delivery.address}
                    </p>
                    {delivery.phone && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {delivery.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      {delivery.date}
                    </p>
                    {delivery.cost > 0 && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        ₦{delivery.cost}
                      </p>
                    )}
                  </div>
                </div>

                {delivery.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-600 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {delivery.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {deliveries.length === 0 && (
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