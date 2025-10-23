import React, { useState } from 'react';

const AddressMap = ({ onAddressSelect, onPropertyInfoUpdate }) => {
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState([-36.0737, 146.9135]); // Albury coordinates

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.trim()) {
      // Try to geocode the address using free Nominatim API
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.trim() + ', Australia')}&limit=1`);
        const data = await response.json();
        
        let coordinates = { lat: -36.0737, lng: 146.9135 }; // Default to Albury
        
        if (data && data.length > 0) {
          coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          setMapCenter([coordinates.lat, coordinates.lng]);
        }
        
        const addressData = {
          address: address.trim(),
          coordinates
        };
        onAddressSelect(addressData);
        
        if (onPropertyInfoUpdate) {
          onPropertyInfoUpdate(null, 'Address entered manually - please verify property details');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        const addressData = {
          address: address.trim(),
          coordinates: { lat: -36.0737, lng: 146.9135 }
        };
        onAddressSelect(addressData);
      }
    }
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1]-0.01},${mapCenter[0]-0.01},${mapCenter[1]+0.01},${mapCenter[0]+0.01}&layer=mapnik&marker=${mapCenter[0]},${mapCenter[1]}`;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your property address (e.g., 123 Main Street, Albury NSW)"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-slate-700 text-white rounded-md hover:bg-slate-800 focus:ring-2 focus:ring-slate-500"
          >
            Show on Map
          </button>
        </div>
      </form>
      
      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          title="Property Location Map"
        ></iframe>
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-2">Enter your property address and click "Show on Map" to view location</p>
        <div className="text-xs">
          <strong>Note:</strong> Using OpenStreetMap - free and no API key required
        </div>
      </div>
    </div>
  );
};

export default AddressMap;