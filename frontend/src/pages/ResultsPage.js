import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect if no assessment data
  if (!location.state?.assessment) {
    navigate('/assessment');
    return null;
  }

  const { assessment, input } = location.state;
  const isExempt = assessment.recommendation === 'exempt';

  const formatStructureType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatPropertyType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Results Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
          isExempt 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'
        }`}>
          {isExempt ? (
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Backyard Assessment Results</h1>
        <p className="text-gray-600">
          {isExempt 
            ? 'Great news! Your backyard project meets the requirements for exempt development - no Development Application required.'
            : 'Your backyard project needs a Development Application, but don\'t worry - we\'ll explain why and how to proceed.'
          }
        </p>
      </div>

      {/* Assessment Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Property Details</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Type: {formatPropertyType(input.property.type)}</li>
              <li>Lot Size: {input.property.lotSize.toLocaleString()} m²</li>
              <li>Zoning: {input.property.zoning}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Proposal Details</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Structure: {formatStructureType(input.proposal.structureType)}</li>
              <li>Height: {input.proposal.height}m</li>
              <li>Floor Area: {input.proposal.floorArea}m²</li>
              <li>Boundary Setback: {input.proposal.distanceFromBoundary}m</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Reasoning</h3>
          <p className="text-gray-700">{assessment.reasoning}</p>
        </div>
      </div>

      {/* Conditions Met */}
      {assessment.conditions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-success-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Conditions Met
          </h2>
          <ul className="space-y-2">
            {assessment.conditions.map((condition, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Failed Conditions */}
      {assessment.failedConditions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-danger-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Failed Conditions
          </h2>
          <ul className="space-y-2">
            {assessment.failedConditions.map((condition, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 text-danger-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-700">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SEPP References */}
      {assessment.clauses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SEPP References</h2>
          <div className="space-y-2">
            {assessment.clauses.map((clause, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-4 h-4 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-gray-700">{clause}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className={`rounded-lg p-6 mb-8 ${
        isExempt 
          ? 'bg-success-50 border border-success-200' 
          : 'bg-warning-50 border border-warning-200'
      }`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
        {isExempt ? (
          <div className="space-y-2 text-gray-700">
            <p>🎉 Congratulations! Your backyard project qualifies as exempt development</p>
            <p>✅ No Development Application is required</p>
            <p>🔨 You may proceed with construction (subject to other approvals like building permits)</p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Remember:</strong> This assessment covers SEPP Part 2 criteria only. 
              You may still need building permits, engineering approvals, or other certifications.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-gray-700">
            <p>📋 A Development Application (DA) is required for this backyard project</p>
            <p>🔧 Consider modifying your project to meet exempt development criteria</p>
            <p>📞 Contact Albury City Council for DA requirements and processes</p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Helpful tip:</strong> Check the failed conditions above to see what changes might make your project exempt.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/assessment"
          className="btn-secondary text-center"
        >
          Check Another Project
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-primary"
        >
          Print Results
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> Backyard Buds is your friendly companion for educational purposes. 
          Results should not be considered as official planning advice. Always consult with 
          qualified professionals and relevant authorities for official planning guidance.
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
