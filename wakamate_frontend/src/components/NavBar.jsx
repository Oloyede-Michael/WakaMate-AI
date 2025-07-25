import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar fixed w-full z-50 py-4 px-6 shadow-sm bg-white border-b border-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <i className="fas fa-robot text-white text-xl"></i>
          </div>
          <Link to="/">
            <span className="text-xl font-bold text-purple-600">WakaMate AI</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="hover:text-purple-600 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-purple-600 transition">
            How It Works
          </a>
          <a href="#testimonials" className="hover:text-purple-600 transition">
            Testimonials
          </a>
          <Link to="/about" className="hover:text-purple-600 transition">
            About Us
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          <button
            id="theme-toggle"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <i className="fas fa-moon text-gray-600 dark:text-yellow-300"></i>
          </button>
          
          {/* Fixed Desktop Get Started Button */}
          <Link 
            to="/register" 
            className="hidden md:block btn-primary px-6 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Get Started
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 border border-gray-200"
            onClick={toggleMobileMenu}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg text-purple-600`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-4 invisible'
      }`}>
        <div className="px-6 py-6 space-y-6">
          <a 
            href="#features" 
            className="block py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-lg font-medium border-b border-gray-50 pb-4"
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="block py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-lg font-medium border-b border-gray-50 pb-4"
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a 
            href="#testimonials" 
            className="block py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-lg font-medium border-b border-gray-50 pb-4"
            onClick={closeMobileMenu}
          >
            Testimonials
          </a>
          <Link 
            to="/about"
            className="block py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-lg font-medium border-b border-gray-50 pb-4"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>
          
          {/* Fixed Mobile Get Started Button */}
          <Link 
            to="/register"
            className="block w-full mt-6 px-6 py-4 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200 text-lg shadow-lg text-center"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-white bg-opacity-25 -z-10"
          onClick={closeMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;