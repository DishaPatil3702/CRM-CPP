// src/components/Layout.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown"; 

import {
  BarChart3, Users, DollarSign, FileText, Settings, 
  Moon, Sun, Menu, X, User, LogOut, Bell, Search,
  Home, UserCheck, Target, TrendingUp
} from "lucide-react";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDark = theme === "dark";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Contacts", href: "/contacts", icon: UserCheck },
    { name: "Deals", href: "/deals", icon: Target },
    { name: "Reports", href: "/reports", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  
  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full ${isDark ? 'bg-gray-900' : 'bg-white'} transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
            <SidebarContent navigation={navigation} isDark={isDark} user={user} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-2xl z-30`}>
         <SidebarContent navigation={navigation} isDark={isDark} user={user} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className={`${isDark ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-white/50'} backdrop-blur-xl border-b sticky top-0 z-20 transition-all duration-300 shadow-lg`}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`md:hidden p-2 ${isDark ? 'text-gray-300 hover:text-white bg-gray-700/70' : 'text-gray-600 hover:text-gray-800 bg-white/70'} rounded-xl transition-all`}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <img 
                    src="/crmpro-icon.svg" 
                    alt="CRMPro Logo" 
                    className="h-8 w-auto"
                  />
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} tracking-tight`}>CRMPro</h1>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Welcome, {user?.name || "User"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 w-64 ${isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300 text-gray-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm shadow-lg text-sm`}
                />
              </div>

              {/* 🔔 Notification bell with dropdown */}
              <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 ${isDark ? 'bg-gray-700/70 text-gray-200' : 'bg-gray-100 text-gray-600'} rounded-full`}
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Dropdown appears below bell */}
      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>

              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 ${isDark ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-gray-700/20 text-gray-700 hover:bg-gray-700/30'} rounded-xl transition-all backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User / Logout */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white shadow-xl text-xs">
                  
                  {user?.name
                      ? user.name.split(" ").map(n => n[0]).join("")
                      : "U"}
                </div>
                
                <button 
                  onClick={logout} 
                  className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-105 font-medium text-sm"
                >
                  <LogOut className="w-4 h-4 inline mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, isDark, user }) {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
             <img 
              src="/crmpro-icon.svg" 
              alt="CRMPro Logo" 
              className="h-8 w-auto"
             />
          </div>
          <div>
            
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>CRMPro</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Professional</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? `${isDark ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' : 'bg-purple-100 text-purple-700 border-purple-200'} border shadow-lg`
                  : `${isDark ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} hover:shadow-md`
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
                  isActive
                    ? isDark ? 'text-purple-400' : 'text-purple-600'
                    : isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                }`}
              />
              {item.name}
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={`flex-shrink-0 p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white shadow-xl text-sm">
            
            {user?.name
              ? user.name.split(" ").map(n => n[0]).join("")
              : "U"}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name || "User"}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
