import React, { useState, useEffect } from 'react';

const HeroSection = ({ isDarkMode }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    'Smart Delivery Routes',
    'Inventory Management', 
    'Financial Tracking',
    'Business Analytics'
  ];

  // Typing animation effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (!isDeleting) {
        setCurrentText(current.substring(0, currentText.length + 1));
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(current.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}>
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className={`border ${isDarkMode ? 'border-green-500/20' : 'border-green-500/30'} animate-pulse`}
                style={{ animationDelay: `${i * 0.01}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${isDarkMode ? 'bg-green-400' : 'bg-green-600'} rounded-full animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Main Headline */}
            <div className="relative">
              <h1 className={`text-6xl md:text-8xl font-black mb-8 leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                  AI-Powered Business
                </span>
                <br />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Assistant</span>
              </h1>
              
              {/* Typing animation */}
              <div className="h-16 mb-8">
                <p className="text-2xl md:text-3xl font-bold text-green-500">
                  for {currentText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Empowering Nigerian vendors with cutting-edge AI technology to revolutionize 
              <span className="text-green-500 font-semibold"> delivery optimization</span>, 
              <span className="text-green-500 font-semibold"> inventory management</span>, and 
              <span className="text-green-500 font-semibold"> financial insights</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group relative px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/25">
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
              
              <button className={`group px-12 py-5 backdrop-blur-sm border-2 font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400' 
                  : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
              }`}>
                <span className="flex items-center gap-3">
                  Watch Demo
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '5,000+', label: 'Active Vendors', icon: '👥' },
                { number: '99.9%', label: 'Uptime', icon: '⚡' },
                { number: '4.8★', label: 'User Rating', icon: '⭐' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800/30 border-gray-700/50 hover:border-green-500/50' 
                      : 'bg-white/30 border-gray-200/50 hover:border-green-500/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-green-500 mb-1">{stat.number}</div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating App Preview */}
          <div className="relative">
            <div className="mx-auto max-w-md">
              <div className="relative group">
                {/* Phone mockup with glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                <div className={`relative backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-500 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-white/50 border-gray-200/50'
                }`}>
                  <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden relative">
                    {/* App UI simulation */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-green-400 text-sm font-mono">WakaMate AI</div>
                    </div>
                    
                    {/* Simulated charts and data */}
                    <div className="space-y-4">
                      <div className="h-2 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-2 bg-gray-700 rounded w-3/4 animate-pulse delay-100"></div>
                      <div className="h-2 bg-green-500 rounded w-1/2 animate-pulse delay-200"></div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="h-20 bg-gray-700/50 rounded border border-green-500/20 animate-pulse delay-300"></div>
                        <div className="h-20 bg-gray-700/50 rounded border border-green-500/20 animate-pulse delay-400"></div>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-xs text-green-400">
                          <span>Revenue</span>
                          <span className="animate-pulse">↗ 24.5%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 ${
        isDarkMode 
          ? 'bg-gradient-to-t from-gray-900 to-transparent' 
          : 'bg-gradient-to-t from-gray-50 to-transparent'
      }`}></div>
    </div>
  );
};

export default HeroSection;