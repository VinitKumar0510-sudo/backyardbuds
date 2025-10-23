import React from 'react';

const PropertyMap = ({ onPropertySelect }) => {
  const handleMapClick = () => {
    // Demo property selection
    if (onPropertySelect) {
      onPropertySelect({
        type: 'urban',
        lotSize: 800,
        zoning: 'R1',
        address: 'Selected from Map',
        estimatedData: false
      });
    }
  };

  return (
    <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold mb-2">Interactive Property Map</h3>
        <p className="text-gray-600 mb-4">Map integration coming soon</p>
        <button 
          onClick={handleMapClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Demo: Select Property
        </button>
        <div className="mt-4 text-sm text-gray-500">
          <a 
            href="https://opendata.alburywodonga.gov.au/datasets/7453af7de1464ed0b7062aeaf5500a05_5/explore" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Official Property Map →
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;