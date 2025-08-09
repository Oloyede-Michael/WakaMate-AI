import { Sparkles, Truck, Package, TrendingUp, CheckCircle, MessageSquare, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AIDashboard() {
  // Simulate user data (in a real app, you'd get this from localStorage or an API)
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryResponse, setInventoryResponse] = useState(null);
  const [profitResponse, setProfitResponse] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);

  // API Configuration - using the same pattern as DeliveryAss
  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const storedUser = localStorage?.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    
    // Test connection on component mount
    testConnection();
  }, []);

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
        console.warn('Inventory agent connection test failed:', error, healthError);
      }
    }
  };

  const callInventoryAgent = async (message) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
        botResponse = 'No response content received from inventory agent';
      }

      return botResponse;

    } catch (error) {
      console.error('Inventory agent error:', error);
      
      // Try fallback endpoint
      try {
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
        return fallbackData.value || fallbackData.response || fallbackData.output || 'Inventory agent service unavailable';

      } catch (fallbackError) {
        throw new Error(`Could not connect to inventory agent: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInventorySummary = async () => {
    const message = `Please provide a comprehensive inventory summary analysis. I need to see:
    1. Current inventory status with all product details
    2. Stock levels and low stock alerts
    3. Business intelligence summary with financial metrics
    4. Critical alerts and recommendations
    
    Please fetch the latest data from the API and provide a detailed analysis.`;
    
    try {
      const response = await callInventoryAgent(message);
      setInventoryResponse({
        timestamp: new Date(),
        content: response
      });
    } catch (error) {
      setError(`Failed to get inventory summary: ${error.message}`);
    }
  };

  const handleProfitBoostTips = async () => {
    const message = `Please analyze my inventory and provide profit boost tips and recommendations. I need:
    1. Product profitability analysis based on current data
    2. Specific recommendations to increase revenue
    3. Pricing optimization suggestions
    4. Inventory management tips for better margins
    5. Restocking recommendations for high-profit items
    
    Please use real data from the API to give actionable business insights.`;
    
    try {
      const response = await callInventoryAgent(message);
      setProfitResponse({
        timestamp: new Date(),
        content: response
      });
    } catch (error) {
      setError(`Failed to get profit tips: ${error.message}`);
    }
  };

  const formatAgentResponse = (content) => {
    if (!content) return '';
    
    return content
      // Handle headers first
      .replace(/^\*\*(.*?)\*\*$/gm, '<h2 class="text-xl font-bold text-blue-800 mt-6 mb-3 border-b border-blue-200 pb-1">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-blue-700 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-blue-800 mt-6 mb-3 border-b border-blue-200 pb-1">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-blue-900 mt-8 mb-4">$1</h1>')
      
      // Handle your specific table format first
      .replace(/\|([^|\n]*Product[^|\n]*)\|([^|\n]*Stock[^|\n]*)\|([^|\n]*Margin[^|\n]*)\|([^|\n]*)\|([^|\n]*)\|\s*\n\|[-:\s|]*\|\s*\n((?:\|[^|\n]*\|[^|\n]*\|[^|\n]*\|[^|\n]*\|[^|\n]*\|\s*\n)*)/g, function(match) {
        const lines = match.split('\n').filter(line => line.trim() && !line.match(/^\|[-:\s|]+\|$/));
        
        let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 text-sm bg-white rounded-lg shadow-sm">';
        
        lines.forEach((line, index) => {
          const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
          if (cells.length === 0) return;
          
          if (index === 0) {
            // Header row
            tableHtml += `<thead><tr class="bg-blue-600 text-white">`;
            cells.forEach(cell => {
              tableHtml += `<th class="border border-gray-300 px-4 py-3 font-semibold text-left">${cell}</th>`;
            });
            tableHtml += `</tr></thead><tbody>`;
          } else {
            // Data rows
            const rowClass = index % 2 === 1 ? 'bg-gray-50' : 'bg-white';
            tableHtml += `<tr class="${rowClass}">`;
            cells.forEach(cell => {
              tableHtml += `<td class="border border-gray-300 px-4 py-2 text-gray-700">${cell}</td>`;
            });
            tableHtml += `</tr>`;
          }
        });
        
        tableHtml += '</tbody></table></div>';
        return tableHtml;
      })
      
      // Handle simple single-row table data
      .replace(/^\|([^|\n]+(?:\|[^|\n]+)*)\|$/gm, function(match) {
        const cells = match.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length === 0) return match;
        
        // Check if this looks like a data row
        const hasNumbers = cells.some(cell => /\d/.test(cell));
        const hasProductName = cells.some(cell => /iPhone|MacBook|Samsung|Nike|Galaxy/i.test(cell));
        
        if (hasNumbers || hasProductName) {
          let tableHtml = '<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 my-3 shadow-sm"><div class="grid gap-3">';
          
          // First cell is usually product name
          if (cells.length > 0) {
            tableHtml += `<div class="text-lg font-semibold text-blue-900">${cells[0]}</div>`;
            tableHtml += `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">`;
            
            for (let i = 1; i < cells.length; i++) {
              const labels = ['Stock', 'Margin', 'Revenue Potential', 'Action Status'];
              const label = labels[i-1] || `Info ${i}`;
              tableHtml += `<div class="bg-white rounded p-2 border border-gray-200">
                <div class="text-gray-600 text-xs font-medium">${label}</div>
                <div class="text-gray-900 font-medium">${cells[i]}</div>
              </div>`;
            }
            tableHtml += `</div>`;
          }
          
          tableHtml += '</div></div>';
          return tableHtml;
        }
        
        return match;
      })
      
      // Handle horizontal rules
      .replace(/^[-=]{3,}$/gm, '<hr class="border-gray-300 my-4">')
      
      // Handle bullet points and lists
      .replace(/^[•‑]\s+(.*$)/gm, '<li class="ml-4 mb-1 list-disc list-inside">$1</li>')
      .replace(/^-\s+(.*$)/gm, '<li class="ml-4 mb-1 list-disc list-inside">$1</li>')
      .replace(/^\*\s+(.*$)/gm, '<li class="ml-4 mb-1 list-disc list-inside">$1</li>')
      
      // Group consecutive list items
      .replace(/(<li[^>]*>.*?<\/li>\s*)+/g, function(match) {
        return '<ul class="my-2 space-y-1">' + match + '</ul>';
      })
      
      // Handle checkboxes
      .replace(/^\[\s?\]\s+(.*$)/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" class="w-4 h-4"> <span>$1</span></div>')
      .replace(/^\[x\]\s+(.*$)/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked class="w-4 h-4"> <span class="line-through text-gray-600">$1</span></div>')
      
      // Handle bold and italic text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      
      // Handle code blocks and inline code
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-sm border-l-4 border-blue-400"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Handle line breaks - do this after other replacements
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      
      // Handle emojis and special characters
      .replace(/❌/g, '<span class="text-red-600">❌</span>')
      .replace(/✅/g, '<span class="text-green-600">✅</span>')
      .replace(/💰/g, '<span class="text-yellow-600">💰</span>')
      .replace(/📊/g, '<span class="text-blue-600">📊</span>')
      .replace(/🔴/g, '<span class="text-red-600">🔴</span>')
      .replace(/🟡/g, '<span class="text-yellow-600">🟡</span>')
      .replace(/🟢/g, '<span class="text-green-600">🟢</span>')
      .replace(/🔄/g, '<span class="text-blue-600">🔄</span>')
      .replace(/📈/g, '<span class="text-green-600">📈</span>')
      .replace(/💎/g, '<span class="text-purple-600">💎</span>')
      .replace(/🏆/g, '<span class="text-yellow-600">🏆</span>')
      .replace(/⚠️/g, '<span class="text-orange-600">⚠️</span>')
      .replace(/🚨/g, '<span class="text-red-600">🚨</span>')
      .replace(/💬/g, '<span class="text-blue-600">💬</span>');
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
      case 'connected': return '🟢 Inventory AI Connected';
      case 'connecting': return '🟡 Connecting...';
      case 'warning': return '🟠 Connection Uncertain';
      default: return '🔴 Disconnected';
    }
  };

  const clearResponses = () => {
    setInventoryResponse(null);
    setProfitResponse(null);
    setError(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Top Greeting with Connection Status */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hi👋{user?.firstName ? `, ${user.firstName}!` : ', Hustler!'}</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's your AI-powered dashboard summary.</p>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearResponses}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Clear
          </button>
          <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 font-medium">Error</p>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            <p className="text-blue-800 font-medium">
              AI is analyzing your inventory data...
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card icon={<TrendingUp className="text-green-600" />} label="Total Sales" value="₦124,000" />
        <Card icon={<Package className="text-blue-500" />} label="Inventory Items" value="132" />
        <Card icon={<CheckCircle className="text-purple-500" />} label="Orders Delivered" value="98%" />
        <Card icon={<Truck className="text-orange-500" />} label="Low Stock" value="4 Items" />
      </div>

      {/* AI Assistant Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-400 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-pink-600" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <AICard 
            title="Delivery Route Suggestion" 
            description="Let AI suggest the fastest delivery path based on current orders."
            onClick={() => {
              // This would navigate to your delivery assistant or show a message
              alert("This feature connects to the Delivery Assistant. Navigate to your delivery page to use route optimization.");
            }}
          />
          <AICard 
            title="Inventory Summary" 
            description="Ask the AI anything about your current inventory and get instant answers."
            onClick={handleInventorySummary}
            isLoading={isLoading}
            isConnected={connectionStatus === 'connected'}
          />
          <AICard 
            title="Profit Boost Tips" 
            description="Smart suggestions to help increase your revenue."
            onClick={handleProfitBoostTips}
            isLoading={isLoading}
            isConnected={connectionStatus === 'connected'}
          />
          <AICard 
            title="AI-Generated Caption" 
            description="Let AI write a caption for your next product post."
            onClick={() => {
              // This would connect to another AI service
              alert("This feature would connect to a caption generation AI service.");
            }}
          />
        </div>
      </div>

      {/* Inventory Summary Results */}
      {inventoryResponse && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Inventory Analysis</h3>
              <p className="text-sm text-gray-600">
                Generated at {inventoryResponse.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div 
            className="prose prose-sm max-w-none bg-white rounded-lg p-4 border max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ 
              __html: formatAgentResponse(inventoryResponse.content) 
            }}
          />
        </div>
      )}

      {/* Profit Tips Results */}
      {profitResponse && (
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Profit Optimization</h3>
              <p className="text-sm text-gray-600">
                Generated at {profitResponse.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div 
            className="prose prose-sm max-w-none bg-white rounded-lg p-4 border max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ 
              __html: formatAgentResponse(profitResponse.content) 
            }}
          />
        </div>
      )}

      {/* Footer Note */}
      <p className="text-xs text-gray-400 text-center">
        Built with ❤️ by Team Wakamate AI
      </p>
    </div>
  );
}

function Card({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-green-400 hover:shadow-md transition-all">
      <div className="bg-gray-100 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function AICard({ title, description, onClick, isLoading, isConnected }) {
  const isInventoryFeature = title.includes("Inventory") || title.includes("Profit");
  
  return (
    <div 
      className={`border border-green-400 rounded-xl p-4 transition cursor-pointer ${
        isInventoryFeature && !isConnected 
          ? 'opacity-50 cursor-not-allowed hover:shadow-none' 
          : 'hover:shadow-md'
      } ${isLoading && isInventoryFeature ? 'bg-blue-50' : ''}`}
      onClick={isInventoryFeature && (!isConnected || isLoading) ? undefined : onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {isLoading && isInventoryFeature && (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        )}
        {isInventoryFeature && !isConnected && (
          <AlertCircle className="w-4 h-4 text-orange-500" />
        )}
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      {isInventoryFeature && !isConnected && (
        <p className="text-xs text-orange-600 mt-2">
          ⚠️ Agent connection required
        </p>
      )}
    </div>
  );
}
