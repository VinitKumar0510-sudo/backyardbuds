import React, { useState, useEffect } from 'react';

const PropertySearch = ({ onPropertySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suburbs, setSuburbs] = useState([]);
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [stats, setStats] = useState(null);

  // Load suburbs and stats on component mount
  useEffect(() => {
    loadSuburbs();
    loadStats();
  }, []);

  const loadSuburbs = async () => {
    try {
      const response = await fetch('/api/property/suburbs');
      const data = await response.json();
      if (data.success) {
        setSuburbs(data.suburbs);
      }
    } catch (error) {
      console.error('Error loading suburbs:', error);
      // Fallback suburbs from the dataset
      setSuburbs([
        'ALBURY', 'EAST ALBURY', 'WEST ALBURY', 'NORTH ALBURY', 'SOUTH ALBURY',
        'LAVINGTON', 'THURGOONA', 'SPRINGDALE HEIGHTS', 'TABLE TOP', 'WIRLINGA',
        'ETTAMOGAH', 'SPLITTERS CREEK', 'LAKE HUME VILLAGE', 'GLENROY', 'HAMILTON VALLEY'
      ]);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/property/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/property/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      setSearchResults([]);
      // Show error message to user
      alert('Backend server not running. Please start the backend server on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handlePropertySelect = async (property) => {
    try {
      // Get full property details
      const response = await fetch(
        `/api/property/address?houseNumber=${property.houseNumber}&streetName=${property.streetName}&suburb=${property.suburb}`
      );
      const data = await response.json();
      
      if (data.success && onPropertySelect) {
        onPropertySelect(data.property);
      }
      
      // Clear search
      setSearchTerm('');
      setSearchResults([]);
      
      // Auto-scroll to form below
      setTimeout(() => {
        const formElement = document.querySelector('form');
        if (formElement) {
          formElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error getting property details:', error);
    }
  };

  const handleSuburbFilter = (suburb) => {
    setSelectedSuburb(suburb);
    if (suburb) {
      handleSearch(suburb);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🏡 Find Your Property
      </h2>
      
      {/* Statistics Display */}
      {stats && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Albury Council Property Database
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Total Properties:</span>
              <div className="text-lg font-bold text-blue-800">
                {stats.totalProperties.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Urban:</span>
              <div className="text-lg font-bold text-blue-800">
                {stats.urbanProperties.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Rural:</span>
              <div className="text-lg font-bold text-blue-800">
                {stats.ruralProperties.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Avg Lot Size:</span>
              <div className="text-lg font-bold text-blue-800">
                {stats.averageLotSize.toLocaleString()}m²
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by address (e.g., '123 Dean Street' or 'Albury')"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suburb Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or browse by suburb:
        </label>
        <select
          value={selectedSuburb}
          onChange={(e) => handleSuburbFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a suburb...</option>
          {suburbs.map(suburb => (
            <option key={suburb} value={suburb}>
              {suburb}
            </option>
          ))}
        </select>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Found {searchResults.length} properties
            </span>
          </div>
          {searchResults.map((property, index) => (
            <div
              key={`${property.objectId}-${index}`}
              onClick={() => handlePropertySelect(property)}
              className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {property.fullAddress}
                  </div>
                  <div className="text-sm text-gray-600">
                    Lot Size: {property.lotSizeDisplay} • 
                    Type: {property.propertyType} • 
                    Zone: {property.zoning}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {property.heritageOverlay && <span className="bg-yellow-100 text-yellow-800 px-1 rounded mr-1">Heritage</span>}
                    {property.floodOverlay && <span className="bg-blue-100 text-blue-800 px-1 rounded mr-1">Flood</span>}
                    {property.bushfireProne && <span className="bg-red-100 text-red-800 px-1 rounded mr-1">Bushfire</span>}
                  </div>
                  {property.title && (
                    <div className="text-xs text-gray-500 mt-1">
                      {property.title}
                    </div>
                  )}
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  Select →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchTerm.length >= 2 && searchResults.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">🔍</div>
          <div>No properties found matching "{searchTerm}"</div>
          <div className="text-sm mt-1">
            Try searching by street name, suburb, or house number
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>💡 Search Tips:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Enter a house number and street (e.g., "123 Dean Street")</li>
            <li>• Search by suburb name (e.g., "Albury", "Lavington")</li>
            <li>• Use partial matches (e.g., "Dean" will find Dean Street properties)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;