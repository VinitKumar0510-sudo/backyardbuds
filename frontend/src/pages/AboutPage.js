import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Backyard Buds</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-700 mb-6">
            Backyard Buds is your friendly web-based companion designed to help residents, 
            builders, and property purchasers in Albury determine whether their shed or patio proposal 
            qualifies as Exempt Development under the NSW State Environmental Planning Policy 
            (Exempt & Complying Development Codes) 2008.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Backyard Buds Works</h2>
          <p className="text-gray-700 mb-4">
            Backyard Buds uses a friendly, rules-based approach that applies the specific criteria outlined 
            in SEPP Part 2 for exempt development. When you submit your backyard project details, we:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Evaluates your proposal against height, area, and setback requirements</li>
            <li>Checks lot size minimums for your property type</li>
            <li>Applies structure-specific rules for sheds, patios, pergolas, and carports</li>
            <li>Provides detailed feedback with SEPP clause references</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Supported Structure Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sheds</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum height: 4.0m</li>
                <li>• Maximum floor area: 50m²</li>
                <li>• Minimum setback: 1.5m</li>
                <li>• Minimum lot size: 450m²</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Patios</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum height: 3.0m</li>
                <li>• Maximum floor area: 40m²</li>
                <li>• Minimum setback: 1.0m</li>
                <li>• Minimum lot size: 300m²</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Pergolas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum height: 3.5m</li>
                <li>• Maximum floor area: 35m²</li>
                <li>• Minimum setback: 1.0m</li>
                <li>• Minimum lot size: 300m²</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Carports</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum height: 4.0m</li>
                <li>• Maximum floor area: 60m²</li>
                <li>• Minimum setback: 1.5m</li>
                <li>• Minimum lot size: 450m²</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Limitations</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">This Tool Does NOT Cover:</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Local Environmental Plans (LEP) requirements</li>
              <li>• Development Control Plans (DCP) requirements</li>
              <li>• Heritage overlays or environmental constraints</li>
              <li>• Building Code of Australia compliance</li>
              <li>• Engineering or structural requirements</li>
              <li>• Bushfire, flooding, or other hazard considerations</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Disclaimer</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium mb-2">Important Notice</p>
            <p className="text-red-700 text-sm">
              This is a prototype tool for educational and planning assistance purposes only. 
              The results provided should not be considered as official planning advice or 
              legal guidance. Always consult with qualified professionals, including town planners, 
              architects, and relevant authorities such as Albury City Council, before proceeding 
              with any development proposal.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Architecture</h2>
          <p className="text-gray-700 mb-4">
            This tool is built using modern web technologies to ensure reliability and ease of use:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Frontend: React with TailwindCSS for responsive design</li>
            <li>Backend: Node.js with Express for API services</li>
            <li>Rules Engine: JSON-based decision tree applying SEPP criteria</li>
            <li>Checkpoint System: Automatic saving of assessments for debugging</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h2>
          <div className="space-y-2">
            <p>
              <a 
                href="https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                NSW State Environmental Planning Policy (Exempt & Complying Development Codes) 2008
              </a>
            </p>
            <p>
              <a 
                href="https://www.alburycity.nsw.gov.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Albury City Council
              </a>
            </p>
            <p>
              <a 
                href="https://www.planning.nsw.gov.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                NSW Department of Planning and Environment
              </a>
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Contact & Support</h2>
          <p className="text-gray-700">
            Backyard Buds is your friendly companion for educational purposes. For official planning 
            advice and development applications, please contact Albury City Council directly 
            or consult with a qualified town planner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
