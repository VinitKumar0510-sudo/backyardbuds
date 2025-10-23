import React, { useState } from 'react';

const AssessmentResults = ({ assessment, onNewAssessment }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!assessment) return null;

  const getResultIcon = (result) => {
    if (result.includes('✅') || result.includes('APPROVED')) return '✅';
    if (result.includes('❌') || result.includes('REJECTED')) return '❌';
    if (result.includes('⚠️') || result.includes('CONDITIONAL')) return '⚠️';
    return '❓';
  };

  const getResultColor = (result) => {
    if (result.includes('✅') || result.includes('APPROVED')) return 'text-green-600';
    if (result.includes('❌') || result.includes('REJECTED')) return 'text-red-600';
    if (result.includes('⚠️') || result.includes('CONDITIONAL')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getResultMessage = (result) => {
    if (result.includes('APPROVED')) {
      return 'Your structure appears to qualify as exempt development.';
    }
    if (result.includes('REJECTED')) {
      return 'Your structure does not qualify as exempt development.';
    }
    if (result.includes('CONDITIONAL')) {
      return 'Your structure may qualify with conditions.';
    }
    return 'Assessment completed.';
  };

  const renderLegislationDetail = (legislation) => {
    const getStatusIcon = (status) => {
      if (status.includes('✓')) return '✓';
      if (status.includes('❌')) return '❌';
      if (status.includes('⚠️')) return '⚠️';
      return '?';
    };

    const getStatusColor = (status) => {
      if (status.includes('✓')) return 'text-green-600';
      if (status.includes('❌')) return 'text-red-600';
      if (status.includes('⚠️')) return 'text-yellow-600';
      return 'text-gray-600';
    };

    return (
      <div key={legislation.clause} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
        <div className="flex items-center mb-2">
          <span className={`mr-2 font-bold ${getStatusColor(legislation.status)}`}>
            {getStatusIcon(legislation.status)}
          </span>
          <h4 className="font-medium">
            {legislation.clause} - {legislation.plain?.split(' - ')[0] || 'Requirement'}
          </h4>
        </div>
        
        <div className="ml-6 space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Legislative Text:</p>
            <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
              "{legislation.text}"
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Plain English:</p>
            <p className="text-sm text-gray-600">
              {legislation.plain}
            </p>
          </div>
          
          {legislation.userValue && (
            <div>
              <p className="text-sm font-medium text-gray-700">Your Structure:</p>
              <p className="text-sm text-gray-600">
                {legislation.userValue} {legislation.limit && `(limit: ${legislation.limit})`}
              </p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className={`text-sm font-medium ${getStatusColor(legislation.status)}`}>
              {legislation.status}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{getResultIcon(assessment.result)}</div>
        <h2 className={`text-2xl font-bold mb-2 ${getResultColor(assessment.result)}`}>
          RESULT: {assessment.result}
        </h2>
        <p className="text-gray-600">
          {getResultMessage(assessment.result)}
        </p>
      </div>

      {assessment.summary && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Assessment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Requirements Checked:</span>
              <div className="text-lg font-bold">{assessment.summary.totalChecked}</div>
            </div>
            <div>
              <span className="font-medium text-green-600">✅ Complies:</span>
              <div className="text-lg font-bold text-green-600">{assessment.summary.complies}</div>
            </div>
            <div>
              <span className="font-medium text-red-600">❌ Fails:</span>
              <div className="text-lg font-bold text-red-600">{assessment.summary.fails}</div>
            </div>
            <div>
              <span className="font-medium text-yellow-600">⚠️ Conditional:</span>
              <div className="text-lg font-bold text-yellow-600">{assessment.summary.conditional}</div>
            </div>
          </div>
        </div>
      )}

      {assessment.issues && assessment.issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-red-800 mb-2">Critical Issues:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {assessment.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {assessment.conditions && assessment.conditions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">Mandatory Conditions:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {assessment.conditions.map((condition, index) => (
              <li key={index}>• {condition}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <span className="font-medium">View Details</span>
          <span className="text-xl">{showDetails ? '▲' : '▼'}</span>
        </button>
      </div>

      {showDetails && assessment.legislationApplied && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">LEGISLATION CHECKED:</h3>
          <div className="space-y-4">
            {assessment.legislationApplied.map((legislation) => 
              renderLegislationDetail(legislation)
            )}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-yellow-800 mb-2">⚠️ IMPORTANT DISCLAIMERS:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• This is NOT a formal approval or building permit</li>
          <li>• You must verify Schedule 4 status with council</li>
          <li>• You must verify property is NOT in foreshore area</li>
          <li>• All measurements must be verified on-site</li>
          <li>• Contact council if uncertain about any requirement</li>
        </ul>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onNewAssessment}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          New Assessment
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;