import React, { useState, useEffect } from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800/50 shadow-2xl shadow-green-500/5' 
          : 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl'
        : isDarkMode
          ? 'bg-transparent backdrop-blur-sm'
          : 'bg-transparent backdrop-blur-sm'
    } border-b ${isDarkMode ? 'border-gray-800/30' : 'border-gray-200/30'}`}>
      
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <a href="/" className="group">
              <span className={`text-2xl font-black transition-colors duration-300 ${
                isDarkMode ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'
              }`}>
                WakaMate
                <span className="text-green-500 animate-pulse">AI</span>
              </span>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#testimonials", label: "Testimonials" },
              { href: "#about", label: "About Us" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`relative px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {item.label}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
              </a>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Switch */}
            <div className="relative">
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 shadow-inner' 
                    : 'bg-gray-300 shadow-inner'
                }`}
              >
                {/* Toggle Circle */}
                <div className={`w-5 h-5 rounded-full transition-all duration-300 transform flex items-center justify-center text-xs ${
                  isDarkMode 
                    ? 'translate-x-7 bg-yellow-400 text-gray-900' 
                    : 'translate-x-0 bg-white text-gray-600 shadow-md'
                }`}>
                  {isDarkMode ? '☀️' : '🌙'}
                </div>
              </button>
            </div>
            
            {/* Get Started Button */}
            <a 
              href="/register" 
              className="hidden md:block group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50' 
                  : 'bg-white/50 border-gray-200/50 hover:bg-white/70'
              }`}
              onClick={toggleMobileMenu}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-0 bg-green-500' : '-translate-y-2 bg-current'
                } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}></span>
                <span className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 bg-green-500' : 'opacity-100 bg-current'
                } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}></span>
                <span className={`absolute h-0.5 w-6 transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 translate-y-0 bg-green-500' : 'translate-y-2 bg-current'
                } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full transition-all duration-500 ${
        isMobileMenuOpen 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-4 invisible'
      } ${
        isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800/50' 
          : 'bg-white/95 backdrop-blur-xl border-gray-200/50'
      } border-b shadow-2xl`}>
        
        {/* Mobile menu glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent"></div>
        
        <div className="relative px-6 py-8 space-y-6">
          {[
            { href: "#features", label: "Features", icon: "⚡" },
            { href: "#how-it-works", label: "How It Works", icon: "🔧" },
            { href: "#testimonials", label: "Testimonials", icon: "💬" },
            { href: "#about", label: "About Us", icon: "👋" }
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center space-x-4 py-4 px-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:text-green-400 hover:border-green-500/50' 
                  : 'bg-white/30 border-gray-200/50 text-gray-600 hover:text-green-600 hover:border-green-500/50'
              }`}
              onClick={closeMobileMenu}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-lg">{item.label}</span>
            </a>
          ))}
          
          {/* Mobile Get Started Button */}
          <a 
            href="/register"
            className="block w-full group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl text-center overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 mt-8"
            onClick={closeMobileMenu}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Get Started</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={`md:hidden fixed inset-0 -z-10 transition-all duration-500 ${
            isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'
          } backdrop-blur-sm`}
          onClick={closeMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;