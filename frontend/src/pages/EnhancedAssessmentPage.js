import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertySearch from '../components/PropertySearch';
import PropertyStatus from '../components/PropertyStatus';
import StructureTypeSelector from '../components/StructureTypeSelector';
import AssessmentForm from '../components/AssessmentForm';
import AssessmentResults from '../components/AssessmentResults';
import axios from 'axios';

const EnhancedAssessmentPage = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [step, setStep] = useState(1); // 1: search, 2: select property, 3: choose type, 4: form, 5: results
  const [selectedStructureType, setSelectedStructureType] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setStep(2);
  };

  const handleStructureTypeSelect = (type) => {
    setSelectedStructureType(type);
  };

  const handleStructureTypeContinue = () => {
    if (selectedStructureType) {
      setStep(3);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Map property data to expected backend format
      const propertyData = {
        short_address: selectedProperty.fullAddress || selectedProperty.short_address || selectedProperty.address || 'Unknown',
        zone_type: selectedProperty.zoning || selectedProperty.zone_type || 'R1',
        zone_description: selectedProperty.zoneDescription || selectedProperty.zone_description || '',
        area_total: selectedProperty.lotSizeM2 || selectedProperty.lotSize || selectedProperty.area_total || 800,
        area_units: 'm²',
        heritage_overlay: selectedProperty.heritageOverlay || selectedProperty.heritage_overlay || false,
        bushfire_prone: selectedProperty.bushfireProne || selectedProperty.bushfire_prone || false,
        has_environmental_overlay: selectedProperty.hasEnvironmentalOverlay || selectedProperty.has_environmental_overlay || false,
        has_easement: selectedProperty.hasEasement || selectedProperty.has_easement || false,
        flood_overlay: selectedProperty.floodOverlay || selectedProperty.flood_overlay || false
      };

      const response = await axios.post('/api/assess', {
        property: propertyData,
        userInputs: formData
      });

      setAssessment(response.data.assessment);
      setStep(4);
    } catch (err) {
      console.error('Assessment error:', err);
      setError(err.response?.data?.details?.join(', ') || err.response?.data?.message || 'Assessment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setSelectedProperty(null);
    setSelectedStructureType('');
    setStep(1);
    setAssessment(null);
    setError(null);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Exempt Development Assessment
          </h1>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 1: Find Your Property</h2>
              <PropertySearch onPropertySelect={handlePropertySelect} />
            </div>
          )}

          {step === 2 && selectedProperty && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 2: Property Information</h2>
              <PropertyStatus property={selectedProperty} />
              <StructureTypeSelector 
                selectedType={selectedStructureType}
                onTypeSelect={handleStructureTypeSelect}
                onContinue={handleStructureTypeContinue}
              />
              <div className="mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to Search
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedProperty && selectedStructureType && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 3: Assessment Questions</h2>
              <PropertyStatus property={selectedProperty} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Assessing your proposal...</div>
                  <div className="text-sm text-gray-600 mt-2">Please wait while we check compliance with SEPP requirements.</div>
                </div>
              ) : (
                <AssessmentForm 
                  structureType={selectedStructureType}
                  onSubmit={handleFormSubmit}
                  onBack={goBack}
                />
              )}
            </div>
          )}

          {step === 4 && assessment && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Assessment Results</h2>
              <AssessmentResults 
                assessment={assessment}
                onNewAssessment={resetAssessment}
              />
            </div>
          )}
        </div>

        {/* Footer disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          ⚠️ This tool provides guidance only and is NOT a formal approval. Contact your council if uncertain.
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssessmentPage;