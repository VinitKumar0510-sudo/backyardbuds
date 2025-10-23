import React from 'react';

const PropertyStatus = ({ property }) => {
  if (!property) return null;

  const getStatusIcon = (condition) => {
    return condition ? '⚠️' : '✓';
  };

  const getStatusText = (condition, trueText, falseText) => {
    return condition ? trueText : falseText;
  };

  // Handle different property object structures
  const address = property.short_address || property.fullAddress || property.address || 'Not specified';
  const zoneType = property.zone_type || property.zoning || 'Unknown';
  const zoneDescription = property.zone_description || property.zoneDescription || '';
  const areaTotal = property.area_total || property.lotSize || property.lotSizeM2 || 'Unknown';
  const areaUnits = property.area_units || 'm²';
  
  // Handle boolean values with fallbacks
  const bushfireProne = property.bushfire_prone || property.bushfireProne || false;
  const heritageOverlay = property.heritage_overlay || property.heritageOverlay || false;
  const environmentalOverlay = property.has_environmental_overlay || property.hasEnvironmentalOverlay || false;
  const floodOverlay = property.flood_overlay || property.floodOverlay || false;
  const hasEasement = property.has_easement || property.hasEasement || false;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-semibold text-lg mb-2">Property Information</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>Address:</strong> {address}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Zone:</strong> {zoneType}{zoneDescription && ` - ${zoneDescription}`}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Size:</strong> {areaTotal} {areaUnits}
        </p>
      </div>
      
      <h4 className="font-medium mb-2">Property Status:</h4>
      <div className="space-y-1 text-sm">
        <div className="flex items-center">
          <span className="mr-2">{getStatusIcon(bushfireProne)}</span>
          <span>{getStatusText(bushfireProne, 'Bushfire Prone Area', 'No Bushfire Overlay')}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{getStatusIcon(heritageOverlay)}</span>
          <span>{getStatusText(heritageOverlay, 'Heritage Overlay Present', 'No Heritage Overlay')}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{getStatusIcon(environmentalOverlay)}</span>
          <span>{getStatusText(environmentalOverlay, 'Environmental Overlay Present', 'No Environmental Overlay')}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{getStatusIcon(floodOverlay)}</span>
          <span>{getStatusText(floodOverlay, 'Flood Zone', 'No Flood Overlay')}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{getStatusIcon(hasEasement)}</span>
          <span>{getStatusText(hasEasement, 'Easement Present', 'No Easement')}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyStatus;