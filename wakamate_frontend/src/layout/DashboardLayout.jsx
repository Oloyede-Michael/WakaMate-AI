// layout/DashboardLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import logo from "../assets/logo.png";
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
  ChevronDown
} from 'lucide-react';

// Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, userInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-md w-full mx-4"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out of your account?
            </p>
            {userInfo && (
              <div className="flex items-center space-x-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userInfo.name}</p>
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100/80 hover:bg-gray-200 rounded-lg transition-colors backdrop-blur-sm"
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
const UserProfileModal = ({ isOpen, onClose, userInfo, onLogout, onSettingsClick, onNotificationsClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-md w-full mx-4"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">{userInfo?.name || 'User Name'}</p>
              <p className="text-gray-500">{userInfo?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-6 space-y-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login:</span>
                <span className="text-gray-700">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member Since:</span>
                <span className="text-gray-700">Jan 2024</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSettingsClick();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 text-gray-700 hover:bg-white/70 rounded-lg transition-colors border border-gray-100"
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={() => {
                  onNotificationsClick();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 text-gray-700 hover:bg-white/70 rounded-lg transition-colors border border-gray-100"
              >
                <Bell size={16} />
                <span className="text-sm">Notifications</span>
              </button>
              
              <button className="flex items-center space-x-2 p-3 text-gray-700 hover:bg-white/70 rounded-lg transition-colors border border-gray-100">
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

// User Profile Section Component (Simplified)
const UserProfileSection = ({ userInfo, onProfileClick, onLogout }) => {
  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      {/* User Profile Header */}
      <div 
        className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"
        onClick={onProfileClick}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{userInfo?.name || 'User Name'}</p>
            <p className="text-sm text-gray-500 truncate">{userInfo?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
          <div className="text-gray-400">
            <ChevronUp size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
    
    // Fallback if no user data found
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

  // Fixed: Updated paths to include /dashboard prefix
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
    // Perform logout logic here
    console.log('User logged out');
    
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove auth token if you have one
    localStorage.removeItem('refreshToken'); // Remove refresh token if you have one
    
    setShowLogoutModal(false);
    
    // Redirect to login page or home
    window.location.href = '/login'; // or use your router navigation
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // Navigate to settings page or show settings modal
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
    // Navigate to notifications page or show notifications
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      <div
        className={`fixed z-30 bg-white shadow-xl text-black h-screen top-0 left-0 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-72" : "w-0 overflow-hidden"} md:w-80`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-7 pl-7 pr-4 flex-shrink-0">
          <div className="flex gap-3 items-center">
            <img className="w-10 h-10 rounded-2xl" src={logo} alt="Logo" />
            <h2 className="text-xl font-bold">
              WakaMate AI
              <div className="text-green-600 text-[12px] font-medium">
                Smart Business Companion
              </div>
            </h2>
          </div>
          <button className="md:hidden font-bold top-0" onClick={toggleSidebar}>
            X
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col justify-between">
          <ul className="space-y-4 text-[17px] font-medium text-zinc-700 px-5 py-5 mt-5">
            <div className="flex flex-col gap-5">
              {links.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <li
                    key={link.path}
                    className={`py-3 px-6 rounded-2xl flex gap-2 items-center cursor-pointer transition duration-150 ${
                      isActive
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <span className={`${isActive ? "text-green-700" : ""}`}>
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default function DashboardLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className={`flex-1 min-h-screen bg-gray-50 transition-all duration-200 
        ${isOpen ? "ml-0 md:ml-80" : "ml-0 md:ml-80"} w-full`}>
        
        {/* Topbar for mobile */}
        <div className="md:hidden flex justify-between items-center px-6 py-4 shadow bg-white sticky top-0 z-20">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-zinc-700" />
          </button>
          <h2 className="text-xl font-semibold">WakaMate AI</h2>
        </div>

        {/* Routed page content with animation */}
        <div className="p-4">
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