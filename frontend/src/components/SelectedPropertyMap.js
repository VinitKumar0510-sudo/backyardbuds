import React from 'react';

const SelectedPropertyMap = ({ address }) => {
  if (!address) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Select a property to view location</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
      <div className="w-full h-full bg-green-50 border-2 border-green-200 rounded-lg flex flex-col items-center justify-center">
        <div className="text-5xl mb-3 text-green-600">✓</div>
        <p className="text-green-800 font-semibold text-center px-4 mb-1">Property Selected</p>
        <p className="text-gray-700 font-medium text-center px-4 text-sm">{address}</p>
        <p className="text-green-600 text-sm mt-2 font-medium">From Albury Council Database</p>
      </div>
    </div>
  );
};

export default SelectedPropertyMap;