import React from 'react';

const StructureTypeSelector = ({ selectedType, onTypeSelect, onContinue }) => {
  const structureTypes = [
    {
      id: 'Garden Structures & Storage',
      label: 'Garden Structures & Storage',
      description: '(cabana, cubby house, fernery, garden shed, gazebo, greenhouse)',
      key: 'A'
    },
    {
      id: 'Carports',
      label: 'Carports',
      description: '',
      key: 'B'
    },
    {
      id: 'Outdoor Entertainment Areas',
      label: 'Outdoor Entertainment Areas',
      description: '(balcony, deck, patio, pergola, terrace, verandah)',
      key: 'C'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-6">What do you want to build?</h3>
      
      <div className="space-y-4 mb-6">
        {structureTypes.map((type) => (
          <div key={type.id} className="border rounded-lg p-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="radio"
                name="structureType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={(e) => onTypeSelect(e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium">
                  [{type.key}] {type.label}
                </div>
                {type.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        disabled={!selectedType}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          selectedType
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default StructureTypeSelector;