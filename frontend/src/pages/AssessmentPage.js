import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressMap from '../components/AddressMap';
import PropertySearch from '../components/PropertySearch';
import SelectedPropertyMap from '../components/SelectedPropertyMap';
import PropertyDetails from '../components/PropertyDetails';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [error, setError] = useState(null);
  const [propertyInfoMessage, setPropertyInfoMessage] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const resultsRef = useRef(null);
  
  const [formData, setFormData] = useState({
    property: {
      type: '',
      lotSize: '',
      zoning: 'R1',
      address: '',
      coordinates: null
    },
    proposal: {
      structureType: '',
      height: '',
      floorArea: '',
      distanceFromBoundary: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setError(null);
  };

  const handleAddressSelect = (addressData) => {
    setFormData(prev => ({
      ...prev,
      property: {
        ...prev.property,
        address: addressData.address,
        coordinates: addressData.coordinates
      }
    }));
    setError(null);
  };

  const handlePropertyInfoUpdate = (propertyInfo, message) => {
    if (propertyInfo) {
      setFormData(prev => ({
        ...prev,
        property: {
          ...prev.property,
          type: propertyInfo.type,
          lotSize: propertyInfo.lotSize.toString(),
          zoning: propertyInfo.zoning
        }
      }));
    }
    setPropertyInfoMessage(message);
  };

  const handlePropertySelect = (propertyData) => {
    setFormData(prev => ({
      ...prev,
      property: {
        ...prev.property,
        type: propertyData.type,
        lotSize: propertyData.lotSize.toString(),
        zoning: propertyData.zoning,
        address: propertyData.address,
        selectedProperty: propertyData // Store full property data
      }
    }));
    setPropertyInfoMessage('Property information loaded from Albury Council database');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoadingAnimation(true);
    setError(null);
    setAssessmentResult(null);

    try {
      // Convert string values to numbers where needed
      const assessmentData = {
        property: {
          type: formData.property.type,
          lotSize: parseFloat(formData.property.lotSize),
          zoning: formData.property.zoning,
          // Include heritage and overlay data if available
          ...(formData.property.selectedProperty && {
            heritageOverlay: formData.property.selectedProperty.heritageOverlay,
            floodOverlay: formData.property.selectedProperty.floodOverlay,
            bushfireProne: formData.property.selectedProperty.bushfireProne,
            hasRestrictions: formData.property.selectedProperty.hasRestrictions,
            restrictionSummary: formData.property.selectedProperty.restrictionSummary
          }),
          // Only include address and coordinates if they exist
          ...(formData.property.address && { address: formData.property.address }),
          ...(formData.property.coordinates && { coordinates: formData.property.coordinates })
        },
        proposal: {
          ...formData.proposal,
          height: parseFloat(formData.proposal.height),
          floorArea: parseFloat(formData.proposal.floorArea),
          distanceFromBoundary: parseFloat(formData.proposal.distanceFromBoundary)
        }
      };

      const response = await axios.post('/api/assess', assessmentData);
      
      // Show logo animation for 2 seconds then show results
      setTimeout(() => {
        setShowLoadingAnimation(false);
        setAssessmentResult({
          assessment: response.data.assessment,
          input: assessmentData,
          metadata: response.data.metadata
        });
        
        // Scroll to results section after a short delay to ensure it's rendered
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }, 2000);

    } catch (err) {
      console.error('Assessment error:', err);
      setTimeout(() => {
        setShowLoadingAnimation(false);
        setError(
          err.response?.data?.details?.join(', ') || 
          err.response?.data?.message || 
          'Failed to assess proposal. Please check your inputs and try again.'
        );
      }, 2000);
    }
  };

  const handleEmailResults = async () => {
    if (!emailAddress || !assessmentResult) return;
    
    setEmailSending(true);
    try {
      await axios.post('/api/email-results', {
        email: emailAddress,
        assessment: assessmentResult
      });
      alert('Results sent successfully!');
      setEmailAddress('');
    } catch (err) {
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const isFormValid = () => {
    const { property, proposal } = formData;
    return (
      property.type &&
      property.lotSize &&
      proposal.structureType &&
      proposal.height &&
      proposal.floorArea &&
      proposal.distanceFromBoundary
    );
  };

  const formatStructureType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatPropertyType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Loading animation overlay
  if (showLoadingAnimation) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-pulse">
          <img 
            src="/alburylogo.jpg" 
            alt="Albury City Council" 
            className="w-32 h-32 animate-bounce"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-white border-opacity-20 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Development Approval Assessment
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Determine if your proposed structure requires council approval under NSW planning regulations
          </p>
          <div className="flex justify-center space-x-12 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Complimentary Assessment
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              NSW SEPP Compliant
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Immediate Results
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-danger mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Step 1: Property Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-slide-up hover-lift">
          <div className="flex items-center mb-6">
            <div className="bg-slate-700 text-white rounded w-8 h-8 flex items-center justify-center font-semibold mr-4 text-sm animate-bounce-in">1</div>
            <h2 className="text-xl font-semibold text-gray-900">Property Location</h2>
          </div>
          <p className="text-gray-600 mb-6">Search for your property to retrieve accurate lot size and zoning information from council records</p>
          <PropertySearch onPropertySelect={handlePropertySelect} />
        </div>
        


        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 2: Property Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-slide-up hover-lift" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="bg-slate-700 text-white rounded w-8 h-8 flex items-center justify-center font-semibold mr-4 text-sm animate-bounce-in" style={{animationDelay: '0.3s'}}>2</div>
              <h2 className="text-xl font-semibold text-gray-900">Property Information</h2>
            </div>
            {/* Property Details Display */}
            {formData.property.selectedProperty && (
              <PropertyDetails property={formData.property.selectedProperty} />
            )}
            
            {/* Property Map Display - Only show for manual address entry */}
            {formData.property.address && !propertyInfoMessage && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Property Location Map</h3>
                <SelectedPropertyMap address={formData.property.address} />
              </div>
            )}
            
            {/* Manual Address Entry - Only show if no property selected */}
            {!formData.property.address && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Manual Address Entry
                  </h3>
                  <span className="text-xs text-gray-500">For properties outside Albury region</span>
                </div>
                <AddressMap 
                  onAddressSelect={handleAddressSelect}
                  onPropertyInfoUpdate={handlePropertyInfoUpdate}
                />
              </div>
            )}
            


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.property.type}
                  onChange={(e) => handleInputChange('property', 'type', e.target.value)}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="urban">Urban (city/suburban)</option>
                  <option value="rural">Rural (farm/acreage)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size (m²)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.property.lotSize}
                  onChange={(e) => handleInputChange('property', 'lotSize', e.target.value)}
                  placeholder="e.g. 800"
                  min="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 h-4">As shown on property title or rates notice</p>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoning Classification
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.property.zoning}
                  onChange={(e) => handleInputChange('property', 'zoning', e.target.value)}
                >
                  <option value="R1">R1 - General Residential</option>
                  <option value="R2">R2 - Low Density Residential</option>
                  <option value="R3">R3 - Medium Density Residential</option>
                  <option value="R5">R5 - Large Lot Residential</option>
                  <option value="RU1">RU1 - Primary Production</option>
                  <option value="RU5">RU5 - Village</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Proposed Development */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-slide-up hover-lift" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center mb-6">
              <div className="bg-slate-700 text-white rounded w-8 h-8 flex items-center justify-center font-semibold mr-4 text-sm animate-bounce-in" style={{animationDelay: '0.5s'}}>3</div>
              <h2 className="text-xl font-semibold text-gray-900">Proposed Development</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Structure Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.proposal.structureType}
                  onChange={(e) => handleInputChange('proposal', 'structureType', e.target.value)}
                  required
                >
                  <option value="">Select structure type</option>
                  <option value="shed">Shed (storage/workshop)</option>
                  <option value="patio">Patio (covered outdoor area)</option>
                  <option value="pergola">Pergola (garden structure)</option>
                  <option value="carport">Carport (vehicle shelter)</option>
                  <option value="deck">Deck (outdoor platform)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Height (metres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.proposal.height}
                  onChange={(e) => handleInputChange('proposal', 'height', e.target.value)}
                  placeholder="e.g. 3.5"
                  min="0.1"
                  max="10"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 h-4">Measured from natural ground level to highest point</p>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Area (m²)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.proposal.floorArea}
                  onChange={(e) => handleInputChange('proposal', 'floorArea', e.target.value)}
                  placeholder="e.g. 40"
                  min="0.1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 h-4">Total covered area (length × width)</p>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Boundary Setback (metres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 h-12"
                  value={formData.proposal.distanceFromBoundary}
                  onChange={(e) => handleInputChange('proposal', 'distanceFromBoundary', e.target.value)}
                  placeholder="e.g. 2.5"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 h-4">Closest distance to any property boundary</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`bg-slate-700 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-md shadow-sm transition-all duration-300 transform hover:scale-105 hover-lift animate-pulse-glow ${
                (!isFormValid() || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Assessment...
                </span>
              ) : (
                'Submit Assessment'
              )}
            </button>
            <p className="text-gray-500 mt-3 text-sm">Assessment typically completes within 30 seconds</p>
          </div>
        </form>

        {/* Information Panel */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Assessment Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Measurement Requirements</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• All measurements must be accurate to 0.1m</li>
                <li>• Height measured from natural ground level</li>
                <li>• Floor area includes all covered areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Boundary Setbacks</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Measure to all property boundaries</li>
                <li>• Include front, side, and rear setbacks</li>
                <li>• Use the minimum distance found</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Disclaimer:</strong> This assessment is based on NSW State Environmental Planning Policy (SEPP) regulations. 
              Local council requirements may vary. Always consult with your local council for definitive approval requirements.
            </p>
          </div>
        </div>

        {/* Results Section */}
        {assessmentResult && (
          <div ref={resultsRef} className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-slide-up print-section">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
                assessmentResult.assessment.recommendation === 'exempt'
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {assessmentResult.assessment.recommendation === 'exempt' ? (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Exempt Development
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Not Exempt Development
                  </>
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Assessment Results</h2>
              <p className="text-gray-600">
                {assessmentResult.assessment.recommendation === 'exempt'
                  ? 'Great news! Your project meets the requirements for exempt development - no Development Application required.'
                  : 'Your project needs a Development Application, but don\'t worry - we\'ll explain why and how to proceed.'
                }
              </p>
            </div>

            {/* Assessment Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Type: {formatPropertyType(assessmentResult.input.property.type)}</li>
                    <li>Lot Size: {assessmentResult.input.property.lotSize.toLocaleString()} m²</li>
                    <li>Zoning: {assessmentResult.input.property.zoning}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Proposal Details</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Structure: {formatStructureType(assessmentResult.input.proposal.structureType)}</li>
                    <li>Height: {assessmentResult.input.proposal.height}m</li>
                    <li>Floor Area: {assessmentResult.input.proposal.floorArea}m²</li>
                    <li>Boundary Setback: {assessmentResult.input.proposal.distanceFromBoundary}m</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
                <p className="text-gray-700">{assessmentResult.assessment.reasoning}</p>
              </div>
            </div>

            {/* Conditions Met */}
            {assessmentResult.assessment.conditions.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Conditions Met
                </h3>
                <ul className="space-y-2">
                  {assessmentResult.assessment.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {assessmentResult.assessment.warnings && assessmentResult.assessment.warnings.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Important Considerations
                </h3>
                <ul className="space-y-2">
                  {assessmentResult.assessment.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                      <span className="text-gray-700">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Failed Conditions */}
            {assessmentResult.assessment.failedConditions.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Failed Conditions
                </h3>
                <ul className="space-y-2">
                  {assessmentResult.assessment.failedConditions.map((condition, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SEPP References */}
            {assessmentResult.assessment.clauses.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SEPP References</h3>
                <div className="space-y-2">
                  {assessmentResult.assessment.clauses.map((clause, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-gray-700">{clause}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className={`rounded-lg p-6 mb-6 ${
              assessmentResult.assessment.recommendation === 'exempt'
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
              {assessmentResult.assessment.recommendation === 'exempt' ? (
                <div className="space-y-2 text-gray-700">
                  <p>🎉 Congratulations! Your project qualifies as exempt development</p>
                  <p>✅ No Development Application is required</p>
                  <p>🔨 You may proceed with construction (subject to other approvals like building permits)</p>
                  <p className="text-sm text-gray-600 mt-4">
                    <strong>Remember:</strong> This assessment covers SEPP Part 2 criteria only. 
                    You may still need building permits, engineering approvals, or other certifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-gray-700">
                  <p>📋 A Development Application (DA) is required for this project</p>
                  <p>🔧 Consider modifying your project to meet exempt development criteria</p>
                  <p>📞 Contact Albury City Council for DA requirements and processes</p>
                  <p className="text-sm text-gray-600 mt-4">
                    <strong>Helpful tip:</strong> Check the failed conditions above to see what changes might make your project exempt.
                  </p>
                </div>
              )}
            </div>

            {/* Email Results */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 no-print">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Results</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
                <button
                  onClick={handleEmailResults}
                  disabled={!emailAddress || emailSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  {emailSending ? 'Sending...' : 'Send Results'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
              <button
                onClick={() => {
                  setAssessmentResult(null);
                  setFormData({
                    property: {
                      type: '',
                      lotSize: '',
                      zoning: 'R1',
                      address: '',
                      coordinates: null
                    },
                    proposal: {
                      structureType: '',
                      height: '',
                      floorArea: '',
                      distanceFromBoundary: ''
                    }
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
              >
                Check Another Project
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
              >
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
// UI enhancements
