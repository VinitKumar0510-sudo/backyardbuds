import React, { useState } from 'react';

const AssessmentForm = ({ structureType, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    // Basic questions for all types
    floor_area: '',
    height: '',
    boundary_distance: '',
    dwelling_distance: '',
    tree_removal: false,
    tree_permit: false,
    asbestos_type: 'A',
    stormwater_connected: false,
    
    // Garden Structures & Storage specific
    is_shipping_container: false,
    is_habitable: false,
    cabana_services: false,
    existing_garden_structures: 0,
    
    // Carports specific
    roof_boundary_distance: '',
    new_driveway: false,
    road_consent: false,
    existing_carports: 0,
    
    // Outdoor Entertainment Areas specific
    has_walls: false,
    wall_height: '',
    has_roof: false,
    roof_overhang: '',
    attached: false,
    floor_height: '',
    existing_outdoor_area: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to numbers and handle empty values
    const submissionData = {
      structure_type: structureType,
      floor_area: parseFloat(formData.floor_area) || 0,
      height: parseFloat(formData.height) || 0,
      boundary_distance: parseFloat(formData.boundary_distance) || 0,
      dwelling_distance: parseFloat(formData.dwelling_distance) || 0,
      tree_removal: formData.tree_removal,
      tree_permit: formData.tree_permit,
      asbestos_type: formData.asbestos_type,
      stormwater_connected: formData.stormwater_connected,
      is_shipping_container: formData.is_shipping_container,
      is_habitable: formData.is_habitable,
      cabana_services: formData.cabana_services,
      existing_garden_structures: parseInt(formData.existing_garden_structures) || 0,
      roof_boundary_distance: formData.roof_boundary_distance ? parseFloat(formData.roof_boundary_distance) : undefined,
      new_driveway: formData.new_driveway,
      road_consent: formData.road_consent,
      existing_carports: parseInt(formData.existing_carports) || 0,
      has_walls: formData.has_walls,
      wall_height: formData.wall_height ? parseFloat(formData.wall_height) : undefined,
      has_roof: formData.has_roof,
      roof_overhang: formData.roof_overhang ? parseFloat(formData.roof_overhang) : undefined,
      attached: formData.attached,
      floor_height: formData.floor_height ? parseFloat(formData.floor_height) : undefined,
      existing_outdoor_area: parseFloat(formData.existing_outdoor_area) || 0
    };
    
    onSubmit(submissionData);
  };

  const renderBasicQuestions = () => (
    <div className="mb-6">
      <h4 className="font-medium text-lg mb-4">Basic Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Floor area (m²):</label>
          <input
            type="number"
            value={formData.floor_area}
            onChange={(e) => handleInputChange('floor_area', parseFloat(e.target.value) || '')}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (meters):</label>
          <input
            type="number"
            step="0.1"
            value={formData.height}
            onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || '')}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Distance to boundary (meters):</label>
          <input
            type="number"
            step="0.1"
            value={formData.boundary_distance}
            onChange={(e) => handleInputChange('boundary_distance', parseFloat(e.target.value) || '')}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Distance to house (meters):</label>
          <input
            type="number"
            step="0.1"
            value={formData.dwelling_distance}
            onChange={(e) => handleInputChange('dwelling_distance', parseFloat(e.target.value) || '')}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderEnvironmentalQuestions = () => (
    <div className="mb-6">
      <h4 className="font-medium text-lg mb-4">Environmental Impact</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Remove trees?</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tree_removal"
                checked={!formData.tree_removal}
                onChange={() => handleInputChange('tree_removal', false)}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tree_removal"
                checked={formData.tree_removal}
                onChange={() => handleInputChange('tree_removal', true)}
                className="mr-2"
              />
              Yes (have permit)
            </label>
          </div>
          {formData.tree_removal && (
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tree_permit}
                  onChange={(e) => handleInputChange('tree_permit', e.target.checked)}
                  className="mr-2"
                />
                I have the required permits
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Asbestos removal?</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="asbestos_type"
                value="A"
                checked={formData.asbestos_type === 'A'}
                onChange={(e) => handleInputChange('asbestos_type', e.target.value)}
                className="mr-2"
              />
              A. No asbestos removal
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="asbestos_type"
                value="B"
                checked={formData.asbestos_type === 'B'}
                onChange={(e) => handleInputChange('asbestos_type', e.target.value)}
                className="mr-2"
              />
              B. Less than 10m² bonded asbestos (I'll remove)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="asbestos_type"
                value="C"
                checked={formData.asbestos_type === 'C'}
                onChange={(e) => handleInputChange('asbestos_type', e.target.value)}
                className="mr-2"
              />
              C. More than 10m² bonded asbestos OR any loose asbestos
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="asbestos_type"
                value="D"
                checked={formData.asbestos_type === 'D'}
                onChange={(e) => handleInputChange('asbestos_type', e.target.value)}
                className="mr-2"
              />
              D. Licensed removalist will handle all asbestos
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stormwater connected?</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="stormwater_connected"
                checked={!formData.stormwater_connected}
                onChange={() => handleInputChange('stormwater_connected', false)}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="stormwater_connected"
                checked={formData.stormwater_connected}
                onChange={() => handleInputChange('stormwater_connected', true)}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStructureSpecificQuestions = () => {
    if (structureType === 'Garden Structures & Storage') {
      return (
        <div className="mb-6">
          <h4 className="font-medium text-lg mb-4">Structure Specific</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Shipping container?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_shipping_container"
                    checked={!formData.is_shipping_container}
                    onChange={() => handleInputChange('is_shipping_container', false)}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_shipping_container"
                    checked={formData.is_shipping_container}
                    onChange={() => handleInputChange('is_shipping_container', true)}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Habitable (live in)?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_habitable"
                    checked={!formData.is_habitable}
                    onChange={() => handleInputChange('is_habitable', false)}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_habitable"
                    checked={formData.is_habitable}
                    onChange={() => handleInputChange('is_habitable', true)}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Existing structures:</label>
              <input
                type="number"
                min="0"
                value={formData.existing_garden_structures}
                onChange={(e) => handleInputChange('existing_garden_structures', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      );
    }

    if (structureType === 'Carports') {
      return (
        <div className="mb-6">
          <h4 className="font-medium text-lg mb-4">Carport Specific</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Roof distance to boundary (meters):</label>
              <input
                type="number"
                step="0.1"
                value={formData.roof_boundary_distance}
                onChange={(e) => handleInputChange('roof_boundary_distance', parseFloat(e.target.value) || '')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New driveway?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="new_driveway"
                    checked={!formData.new_driveway}
                    onChange={() => handleInputChange('new_driveway', false)}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="new_driveway"
                    checked={formData.new_driveway}
                    onChange={() => handleInputChange('new_driveway', true)}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>
              {formData.new_driveway && (
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.road_consent}
                      onChange={(e) => handleInputChange('road_consent', e.target.checked)}
                      className="mr-2"
                    />
                    Do you have road authority consent?
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Existing carports:</label>
              <input
                type="number"
                min="0"
                value={formData.existing_carports}
                onChange={(e) => handleInputChange('existing_carports', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      );
    }

    if (structureType === 'Outdoor Entertainment Areas') {
      return (
        <div className="mb-6">
          <h4 className="font-medium text-lg mb-4">Outdoor Entertainment Specific</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Has walls?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_walls"
                    checked={!formData.has_walls}
                    onChange={() => handleInputChange('has_walls', false)}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_walls"
                    checked={formData.has_walls}
                    onChange={() => handleInputChange('has_walls', true)}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>
              {formData.has_walls && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Wall height (meters):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.wall_height}
                    onChange={(e) => handleInputChange('wall_height', parseFloat(e.target.value) || '')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Has roof?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_roof"
                    checked={!formData.has_roof}
                    onChange={() => handleInputChange('has_roof', false)}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_roof"
                    checked={formData.has_roof}
                    onChange={() => handleInputChange('has_roof', true)}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>
              {formData.has_roof && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Roof overhang (mm):</label>
                    <input
                      type="number"
                      value={formData.roof_overhang}
                      onChange={(e) => handleInputChange('roof_overhang', parseFloat(e.target.value) || '')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.attached}
                      onChange={(e) => handleInputChange('attached', e.target.checked)}
                      className="mr-2"
                    />
                    Attached to dwelling?
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Floor height (meters):</label>
              <input
                type="number"
                step="0.1"
                value={formData.floor_height}
                onChange={(e) => handleInputChange('floor_height', parseFloat(e.target.value) || '')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Existing outdoor area total (m²):</label>
              <input
                type="number"
                min="0"
                value={formData.existing_outdoor_area}
                onChange={(e) => handleInputChange('existing_outdoor_area', parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-6">{structureType}</h3>
      
      <form onSubmit={handleSubmit}>
        {renderBasicQuestions()}
        {renderEnvironmentalQuestions()}
        {renderStructureSpecificQuestions()}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Check Compliance
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm;