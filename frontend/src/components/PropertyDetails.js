import React from 'react';
import SpatialDisclaimer from './SpatialDisclaimer';

const PropertyDetails = ({ property }) => {
  if (!property) return null;

  const getZoneColor = (zoning) => {
    const colors = {
      'R1': 'bg-green-100 text-green-800',
      'R2': 'bg-green-200 text-green-900', 
      'R3': 'bg-yellow-100 text-yellow-800',
      'RU1': 'bg-brown-100 text-brown-800',
      'RU2': 'bg-brown-200 text-brown-900',
      'C3': 'bg-blue-100 text-blue-800',
      'SP2': 'bg-purple-100 text-purple-800'
    };
    return colors[zoning] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">📍 Property Information</h3>
      
      <SpatialDisclaimer property={property} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Address</h4>
          <p className="text-gray-900">{property.address}</p>
          <p className="text-sm text-gray-600">{property.suburb} {property.postCode}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Property Details</h4>
          <p className="text-sm">Lot Size: <span className="font-medium">{property.lotSize?.toLocaleString()}m²</span></p>
          <p className="text-sm">Type: <span className="font-medium capitalize">{property.type}</span></p>
          <p className="text-sm">Title: <span className="font-medium">{property.title}</span></p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Zoning</h4>
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getZoneColor(property.zoning)}`}>
            {property.zoning}
          </span>
          <p className="text-sm text-gray-600 mt-1">{property.zoneDescription}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Overlays & Restrictions</h4>
          <div className="space-y-1">
            {property.heritageOverlay && (
              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-1">
                🏛️ Heritage
              </span>
            )}
            {property.floodOverlay && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                🌊 Flood Risk
              </span>
            )}
            {property.bushfireProne && (
              <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-1">
                🔥 Bushfire Prone
              </span>
            )}

            {!property.heritageOverlay && !property.floodOverlay && !property.bushfireProne && (
              <span className="text-sm text-gray-500">No overlays identified</span>
            )}
          </div>
          {property.restrictionSummary && property.restrictionSummary !== 'None identified' && (
            <p className="text-xs text-gray-600 mt-2">{property.restrictionSummary}</p>
          )}
        </div>
      </div>

      {property.latitude && property.longitude && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="font-medium text-gray-700 mb-2">Location</h4>
          <p className="text-sm text-gray-600">
            Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
          </p>
          <a 
            href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            📍 View on Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;