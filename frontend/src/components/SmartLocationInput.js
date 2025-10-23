import React, { useState, useRef } from 'react';
import axios from 'axios';

const SmartLocationInput = ({ onPropertySelect, onAddressSelect, onPropertyInfoUpdate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [mode, setMode] = useState('search'); // 'search', 'manual', 'selected'
  const searchTimeout = useRef(null);

  const searchDatabase = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/property/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.properties || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setMode('search');
    setSelectedProperty(null);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.length >= 2) {
      searchTimeout.current = setTimeout(() => {
        searchDatabase(value);
      }, 300);
    } else {
      setResults([]);
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setQuery(property.address);
    setResults([]);
    setMode('selected');
    onPropertySelect(property);
  };

  const handleManualEntry = () => {
    setMode('manual');
    setManualAddress(query);
    setResults([]);
  };

  const handleManualSubmit = async () => {
    if (!manualAddress.trim()) return;

    // Try geocoding for coordinates
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress + ', Australia')}&limit=1`);
      const data = await response.json();
      
      let coordinates = { lat: -36.0737, lng: 146.9135 };
      if (data && data.length > 0) {
        coordinates = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }

      const addressData = {
        address: manualAddress.trim(),
        coordinates
      };
      
      onAddressSelect(addressData);
      setMode('selected');
      setQuery(manualAddress);
      
      if (onPropertyInfoUpdate) {
        onPropertyInfoUpdate(null, 'Address entered manually - please verify property details');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelectedProperty(null);
    setManualAddress('');
    setMode('search');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Location
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 pr-10"
            value={mode === 'manual' ? manualAddress : query}
            onChange={mode === 'manual' ? (e) => setManualAddress(e.target.value) : handleSearchChange}
            placeholder="Start typing your address..."
            disabled={mode === 'selected'}
          />
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {mode === 'selected' && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Database Search Results */}
      {mode === 'search' && results.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 bg-green-50 border-b border-green-200">
            <p className="text-sm text-green-700 font-medium">✓ Found in Albury Council Database</p>
          </div>
          {results.map((property, index) => (
            <button
              key={index}
              onClick={() => handlePropertySelect(property)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{property.address}</div>
              <div className="text-sm text-gray-500">
                {property.lotSize}m² • {property.type} • {property.zoning}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results - Manual Entry Option */}
      {mode === 'search' && !loading && results.length === 0 && query.length >= 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800 mb-3">
            Address not found in Albury Council database
          </p>
          <button
            onClick={handleManualEntry}
            className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
          >
            Enter Manually
          </button>
        </div>
      )}

      {/* Manual Entry Mode */}
      {mode === 'manual' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800 mb-3">Manual address entry</p>
          <div className="flex gap-2">
            <button
              onClick={handleManualSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Confirm Address
            </button>
            <button
              onClick={() => setMode('search')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
            >
              Back to Search
            </button>
          </div>
        </div>
      )}

      {/* Selected State */}
      {mode === 'selected' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl text-green-600 mr-3">✓</div>
              <div>
                <p className="font-semibold text-green-800">Location Confirmed</p>
                <p className="text-sm text-gray-600">{query}</p>
                {selectedProperty && (
                  <p className="text-xs text-green-600 mt-1">From Albury Council Database</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartLocationInput;