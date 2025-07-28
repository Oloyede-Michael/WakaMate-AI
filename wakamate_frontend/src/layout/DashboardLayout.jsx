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
  Menu
} from 'lucide-react';
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5 text-green-600" /> },
    { name: "Delivery Assistant", path: "/delivery", icon: <Truck className="w-5 h-5 text-blue-600" /> },
    { name: "Inventory Manager", path: "/inventory", icon: <Package className="w-5 h-5 text-purple-600" /> },
    { name: "AI Assistant", path: "/ai-caption", icon: <Sparkles className="w-5 h-5 text-orange-600" /> },
    { name: "Profit and Loss", path: "/profitNloss", icon: <TrendingUp className="w-5 h-5 text-green-600" /> },
  ];

  return (
    <div
      className={`fixed z-30 bg-white shadow-xl text-black h-screen top-0 left-0 transition-all duration-300 ease-in-out 
      ${isOpen ? "w-72" : "w-0 overflow-hidden"} md:w-80`}
    >
      <div className="flex items-center justify-between pt-7 pl-7 pr-4">
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

      <ul className="space-y-4 flex flex-col justify-between text-[17px]  gap-13 font-medium text-zinc-700 px-5 py-5 mt-5">
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

        <div className="flex gap-4 items-center bg-green-50 border border-green-200 p-4 mt-6 rounded-2xl">
          <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center">💪</div>
          <h2 className="text-[16px]">
            Keep Hustling! <br />
            <span className="text-[12px]">You're doing great</span>
          </h2>
        </div>
      </ul>
    </div>
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
