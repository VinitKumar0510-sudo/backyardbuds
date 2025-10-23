import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="mr-4 transform transition-transform duration-300 group-hover:scale-110">
                <img 
                  src="/backyard-buds-logo.svg" 
                  alt="BackyardBud Logo" 
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  BackyardBud
                </h1>
                <p className="text-sm text-gray-600">Albury Planning Assessment</p>
              </div>
            </Link>
          </div>

          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-all duration-300 relative ${
                isActive('/') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
              )}
            </Link>
            <Link
              to="/assessment"
              className={`text-sm font-semibold transition-all duration-300 relative ${
                isActive('/assessment') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Assessment
              {isActive('/assessment') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
              )}
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-all duration-300 relative ${
                isActive('/about') 
                  ? 'text-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              About
              {isActive('/about') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;