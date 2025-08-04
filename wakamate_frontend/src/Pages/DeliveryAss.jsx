import React, { useState, useEffect } from 'react';
import { Send, MapPin, DollarSign, CheckCircle, Plus, Calendar, Trash2, Phone, Clock, Navigation } from 'lucide-react';

export default function DeliveryAss() {
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Load from localStorage on first render
  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem("deliveries");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save to localStorage whenever deliveries change
  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    cost: '',
    date: '07/23/2025',
    priority: 'Medium Priority',
    notes: ''
  });

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const completedToday = deliveries.filter(d => d.status === 'completed').length;
  const totalCost = deliveries.reduce((sum, d) => sum + (d.cost || 0), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    setDeliveries(prev => [...prev, newDelivery]);
    setFormData({
      customerName: '',
      phone: '',
      address: '',
      cost: '',
      date: '07/23/2025',
      priority: 'Medium Priority',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteDelivery = (id) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
  };

  const toggleDeliveryStatus = (id) => {
    setDeliveries(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: d.status === 'pending' ? 'completed' : 'pending' }
        : d
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50  p-6">
      <div className="max-w-4xl  space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Assistant</h1>
            <p className="text-gray-600">Plan your routes smart, save time and money 🏍️</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

       

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
                  placeholder="Enter full address with landmarks"
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
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  placeholder="Any special instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddDelivery}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {delivery.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDelivery(delivery.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{delivery.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{delivery.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{delivery.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>₦{delivery.cost}</span>
                  </div>
                  {delivery.notes && (
                    <p className="text-gray-500 italic mt-2">{delivery.notes}</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleDeliveryStatus(delivery.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      delivery.status === 'completed'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    Mark as {delivery.status === 'completed' ? 'Pending' : 'Completed'}
                  </button>
                </div>
              </div>
            ))}

            {deliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Navigation className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No deliveries added yet. Click "Add New Delivery" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}