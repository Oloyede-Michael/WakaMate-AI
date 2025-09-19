// layout/DashboardLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Home,
  Truck,
  Package,
  Sparkles,
  TrendingUp,
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  Shield,
  X,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

// Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, userInfo, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-white/20'} max-w-md w-full mx-4`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Logout</h3>
            <button
              onClick={onClose}
              className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} transition-colors p-1 rounded-lg`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Are you sure you want to log out of your account?
            </p>
            {userInfo && (
              <div className={`flex items-center space-x-3 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white/70'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userInfo.name}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userInfo.email}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 ${isDarkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// User Profile Modal Component
const UserProfileModal = ({ isOpen, onClose, userInfo, onLogout, onSettingsClick, onNotificationsClick, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-white/20'} max-w-md w-full mx-4`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Profile</h3>
            <button
              onClick={onClose}
              className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} transition-colors p-1 rounded-lg`}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className={`flex items-center space-x-4 mb-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-white/70'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userInfo?.name || 'User Name'}</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userInfo?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className={`mb-6 space-y-3 p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Account Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Status:</span>
                <span className="text-green-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Last Login:</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>1 minute ago</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Member Since:</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>August 22, 2025</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSettingsClick();
                  onClose();
                }}
                className={`flex items-center space-x-2 p-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 border-gray-600' : 'text-gray-700 hover:bg-white/70 border-gray-100'} rounded-lg transition-colors border`}
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={() => {
                  onNotificationsClick();
                  onClose();
                }}
                className={`flex items-center space-x-2 p-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 border-gray-600' : 'text-gray-700 hover:bg-white/70 border-gray-100'} rounded-lg transition-colors border`}
              >
                <Bell size={16} />
                <span className="text-sm">Notifications</span>
              </button>
              
              <button className={`flex items-center space-x-2 p-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 border-gray-600' : 'text-gray-700 hover:bg-white/70 border-gray-100'} rounded-lg transition-colors border`}>
                <Shield size={16} />
                <span className="text-sm">Privacy</span>
              </button>
              
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// User Profile Section Component
const UserProfileSection = ({ userInfo, onProfileClick, onLogout, isDarkMode }) => {
  return (
    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-4 pt-4`}>
      {/* User Profile Header */}
      <div 
        className={`flex items-center justify-between cursor-pointer p-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg transition-colors`}
        onClick={onProfileClick}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>{userInfo?.name || 'User Name'}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{userInfo?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProfileClick();
            }}
            className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
            title="View Profile"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, isDarkMode }) => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          email: user.email || 'user@wakamate.com',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          status: 'active',
          lastLogin: '2 hours ago',
          memberSince: 'January 2024'
        };
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    
    return {
      name: 'User',
      email: 'user@wakamate.com',
      firstName: '',
      lastName: '',
      status: 'active',
      lastLogin: '2 hours ago',
      memberSince: 'January 2024'
    };
  };

  const [userInfo] = useState(getUserInfo());

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5 text-green-600" /> },
    { name: "Delivery Assistant", path: "/dashboard/delivery", icon: <Truck className="w-5 h-5 text-blue-600" /> },
    { name: "Inventory Manager", path: "/dashboard/inventory", icon: <Package className="w-5 h-5 text-purple-600" /> },
    { name: "AI Assistant", path: "/dashboard/ai-caption", icon: <Sparkles className="w-5 h-5 text-orange-600" /> },
    { name: "Profit and Loss", path: "/dashboard/profitNloss", icon: <TrendingUp className="w-5 h-5 text-green-600" /> },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      <div
        className={`fixed z-30 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl ${isDarkMode ? 'text-white' : 'text-black'} h-screen top-0 left-0 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-72" : "w-0 overflow-hidden"} md:w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-7 pl-7 pr-4 flex-shrink-0">
          <div className="flex gap-3 items-center">
            <img 
              src="/images/logo.png" 
              alt="WakaMate AI Logo" 
              className="w-10 h-10 object-contain"
            />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              WakaMate AI
              <div className="text-green-600 text-[12px] font-medium">
                Smart Business Companion
              </div>
            </h2>
          </div>
          <button className={`md:hidden font-bold top-0 ${isDarkMode ? 'text-white' : 'text-black'}`} onClick={toggleSidebar}>
            X
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col justify-between">
          <ul className={`space-y-4 text-[17px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'} px-5 py-5 mt-5`}>
            <div className="flex flex-col gap-5">
              {links.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <li
                    key={link.path}
                    className={`py-3 px-6 rounded-2xl flex gap-2 items-center cursor-pointer transition duration-150 ${
                      isActive
                        ? isDarkMode 
                          ? "bg-green-900/50 text-green-400 font-semibold" 
                          : "bg-green-100 text-green-700 font-semibold"
                        : isDarkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <span className={`${isActive ? (isDarkMode ? "text-green-400" : "text-green-700") : ""}`}>
                      {link.icon}
                    </span>
                    <Link to={link.path} onClick={toggleSidebar}>
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </div>
          </ul>

          {/* User Profile Section */}
          <div className="px-5 pb-5">
            <UserProfileSection
              userInfo={userInfo}
              onProfileClick={handleProfileClick}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <UserProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            userInfo={userInfo}
            onLogout={handleLogout}
            onSettingsClick={handleSettingsClick}
            onNotificationsClick={handleNotificationsClick}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <LogoutConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            userInfo={userInfo}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default function DashboardLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get initial dark mode state from localStorage or system preference
    const saved = localStorage.getItem('dashboard-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('dashboard-theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className={`flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} />

      {/* Main content area - REMOVED padding and gap-causing backgrounds */}
      <div className={`flex-1 min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-200 
        ${isOpen ? "ml-0 md:ml-80" : "ml-0 md:ml-80"} w-full`}>
        
        {/* Topbar for mobile */}
        <div className={`md:hidden flex justify-between items-center px-6 py-4 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-20`}>
          <button onClick={toggleSidebar}>
            <Menu className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-zinc-700'}`} />
          </button>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>WakaMate AI</h2>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Theme toggle for desktop - positioned in top right */}
        <div className="hidden md:block fixed top-4 right-4 z-30">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-lg shadow-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Routed page content with animation - REMOVED padding that caused gaps */}
        <div className="">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}