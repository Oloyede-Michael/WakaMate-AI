import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageSquare, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check,
  Zap,
  Heart,
  Smile,
  Moon,
  Sun
} from 'lucide-react';

export default function CaptionChatbot() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Wakamate, your AI-powered social media caption generator! 🚀\n\nI can help you create engaging captions for:\n• Instagram posts\n• Facebook content\n• Twitter/X tweets\n• LinkedIn posts\n• TikTok videos\n\nJust tell me what you'd like a caption for, or ask to see your inventory products!",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // API Configuration
  const API_BASE_URL = 'http://localhost:3003/api';
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    testConnection();
    inputRef.current?.focus();
  }, []);
  
  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Test multiple endpoints to find the working one
      const endpoints = ['/openapi.json', '/health', '/chat', '/generate'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            setConnectionStatus('connected');
            return;
          }
        } catch (e) {
          continue;
        }
      }
      
      throw new Error('No endpoints responding');
      
    } catch (error) {
      setConnectionStatus('warning');
      console.warn('Caption AI connection test failed:', error);
    }
  };
  
  const callCaptionAgent = async (message) => {
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
      
      if (data.choices?.[0]?.message?.content) {
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
        botResponse = 'No response content received from caption generator';
      }

      return botResponse;

    } catch (error) {
      console.error('Caption agent error:', error);
      
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
        return fallbackData.value || fallbackData.response || fallbackData.output || 'Caption service unavailable';

      } catch (fallbackError) {
        throw new Error(`Could not connect to caption generator: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    try {
      const botResponse = await callCaptionAgent(trimmedMessage);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      setError(`Failed to get response: ${error.message}`);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `❌ **Error**: ${error.message}\n\n🔧 **Troubleshooting**:\n1. Check if the caption agent is running\n2. Verify CORS proxy is active on port 3001\n3. Ensure API endpoints are accessible`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const copyToClipboard = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const formatMessage = (content) => {
    const darkClass = isDarkMode ? 'dark' : '';
    
    return content
      // Headers
      .replace(/^\*\*(.*?)\*\*$/gm, `<h3 class="text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} mt-4 mb-2 border-b ${isDarkMode ? 'border-purple-600' : 'border-purple-200'} pb-1">$1</h3>`)
      .replace(/^### (.*$)/gm, `<h4 class="text-md font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'} mt-3 mb-2">$1</h4>`)
      .replace(/^## (.*$)/gm, `<h3 class="text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} mt-4 mb-2 border-b ${isDarkMode ? 'border-purple-600' : 'border-purple-200'} pb-1">$1</h3>`)
      .replace(/^# (.*$)/gm, `<h2 class="text-xl font-bold ${isDarkMode ? 'text-purple-200' : 'text-purple-900'} mt-6 mb-3">$1</h2>`)
      
      // Lists
      .replace(/^[•·]\s+(.*$)/gm, `<li class="ml-4 mb-1 list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">$1</li>`)
      .replace(/^-\s+(.*$)/gm, `<li class="ml-4 mb-1 list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">$1</li>`)
      .replace(/^\*\s+(.*$)/gm, `<li class="ml-4 mb-1 list-disc list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">$1</li>`)
      .replace(/^(\d+)\.\s+(.*$)/gm, `<li class="ml-4 mb-1 list-decimal list-inside ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">$2</li>`)
      
      // Group consecutive list items
      .replace(/(<li[^>]*>.*?<\/li>\s*)+/g, function(match) {
        return `<ul class="my-2 space-y-1 ${isDarkMode ? 'bg-gray-800/50 border-purple-600' : 'bg-gray-50 border-purple-300'} rounded-lg p-3 border-l-4">${match}</ul>`;
      })
      
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em class="italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}">$1</em>`)
      .replace(/`(.*?)`/g, `<code class="${isDarkMode ? 'bg-gray-700 text-purple-300' : 'bg-gray-100 text-purple-700'} px-2 py-1 rounded text-sm font-mono">$1</code>`)
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, `<pre class="${isDarkMode ? 'bg-gray-800 border-purple-500' : 'bg-gray-100 border-purple-400'} p-4 rounded-lg overflow-x-auto my-3 text-sm border-l-4"><code>$1</code></pre>`)
      
      // Emojis and special formatting
      .replace(/❌/g, '<span class="text-red-500">❌</span>')
      .replace(/✅/g, '<span class="text-green-500">✅</span>')
      .replace(/🚀/g, '<span class="text-blue-500">🚀</span>')
      .replace(/💡/g, '<span class="text-yellow-500">💡</span>')
      .replace(/📦/g, '<span class="text-purple-500">📦</span>')
      .replace(/🔧/g, '<span class="text-gray-500">🔧</span>')
      .replace(/⚠️/g, '<span class="text-orange-500">⚠️</span>')
      .replace(/🎯/g, '<span class="text-red-500">🎯</span>')
      .replace(/💰/g, '<span class="text-green-500">💰</span>')
      .replace(/📱/g, '<span class="text-blue-500">📱</span>')
      .replace(/🔥/g, '<span class="text-red-500">🔥</span>')
      
      // Line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };
  
  const getConnectionStatus = () => {
    const statusConfig = {
      connected: { color: 'bg-green-500', text: '🟢 Caption AI Connected', textColor: 'text-green-400' },
      connecting: { color: 'bg-yellow-500', text: '🟡 Connecting...', textColor: 'text-yellow-400' },
      warning: { color: 'bg-orange-500', text: '🟠 Connection Uncertain', textColor: 'text-orange-400' },
      disconnected: { color: 'bg-red-500', text: '🔴 Disconnected', textColor: 'text-red-400' }
    };
    
    return statusConfig[connectionStatus] || statusConfig.disconnected;
  };
  
  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Chat cleared! I'm ready to help you create amazing captions. What would you like to start with? 🎨",
      timestamp: new Date()
    }]);
    setError(null);
  };
  
  const suggestionPrompts = [
    "Show me my inventory products",
    "Create Instagram captions for my products", 
    "Generate funny captions for a coffee post",
    "Write professional LinkedIn captions",
    "Create TikTok captions with trending hashtags"
  ];
  
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const status = getConnectionStatus();

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50'
    }`}>
      {/* Header */}
      <div className={`${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-purple-200'
      } backdrop-blur-sm shadow-lg border-b p-4 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Wakamate Caption Generator</h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>AI-powered social media captions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            
            <button
              onClick={clearChat}
              className={`flex items-center gap-2 px-4 py-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
            
            <div className={`px-4 py-2 rounded-xl text-white text-sm shadow-md ${status.color}`}>
              {status.text}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className={`${
            isDarkMode 
              ? 'bg-red-900/20 border-red-700' 
              : 'bg-red-50 border-red-200'
          } border rounded-xl p-4 shadow-md`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className={`font-medium ${
                  isDarkMode ? 'text-red-400' : 'text-red-800'
                }`}>Connection Error</p>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-red-300' : 'text-red-700'
                }`}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className={`text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-red-600 hover:text-red-700'
                }`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 ml-3' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                
                {/* Message Content */}
                <div className={`rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm relative group transition-all duration-300 hover:shadow-xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : isDarkMode
                      ? 'bg-gray-800/80 border border-gray-700'
                      : 'bg-white/80 border border-gray-200'
                }`}>
                  <div 
                    className={`leading-relaxed ${
                      message.type === 'user' 
                        ? 'text-white' 
                        : isDarkMode 
                          ? 'text-gray-200' 
                          : 'text-gray-800'
                    }`}
                    dangerouslySetInnerHTML={{ 
                      __html: message.type === 'bot' ? formatMessage(message.content) : message.content 
                    }}
                  />
                  
                  {/* Copy Button for Bot Messages */}
                  {message.type === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg ${
                        isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} />
                      )}
                    </button>
                  )}
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-3 ${
                    message.type === 'user' 
                      ? 'text-blue-100' 
                      : isDarkMode 
                        ? 'text-gray-500' 
                        : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700' 
                    : 'bg-white/80 border-gray-200'
                } border rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm`}>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                    <span className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Wakamate is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestion Prompts */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <p className={`text-sm mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Zap className="w-4 h-4 text-purple-500" />
              Try these suggestions:
            </p>
            <div className="flex flex-wrap gap-3">
              {suggestionPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt)}
                  className={`px-4 py-3 ${
                    isDarkMode 
                      ? 'bg-gray-800/60 border-gray-600 text-gray-200 hover:bg-gray-700/80 hover:border-purple-500' 
                      : 'bg-white/60 border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                  } border rounded-xl text-sm transition-all duration-300 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-105`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      } backdrop-blur-sm border-t p-4 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to create captions for your products or any topic..."
                className={`w-full px-5 py-4 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none backdrop-blur-sm transition-all duration-300 shadow-md`}
                rows="1"
                style={{ minHeight: '56px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              
              {/* Character count */}
              <div className={`absolute bottom-3 right-16 text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {inputMessage.length}/1000
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                inputMessage.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}