import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './globe.css';

const HomePage = () => {
  const [selectedStructure, setSelectedStructure] = useState(null);


  const structureRules = {
    'Garden Structures': {
      height: '≤ 3.0m',
      area: '≤ 20m² (50m² rural)',
      setback: '≥ 900mm (5m rural)',
      clause: 'SEPP Part 2, Clause 2.17-2.18',
      description: 'Sheds, gazebos, greenhouses',
      additional: 'Max 2 per lot, Class 10 building, no shipping containers'
    },
    'Carports': {
      height: '≤ 3.0m (gutter line if attached)',
      area: '≤ 20-50m² (depends on lot)',
      setback: '≥ 900mm + 1m from road',
      clause: 'SEPP Part 2, Clause 2.19-2.20',
      description: 'Covered parking',
      additional: 'Max 1 per lot, roof 500mm from boundary, road consent if new driveway'
    },
    'Outdoor Areas': {
      height: '≤ 3.0m (1.4m walls)',
      area: '≤ 25m² total',
      setback: '≥ 900mm (5m rural)',
      clause: 'SEPP Part 2, Clause 2.11-2.12',
      description: 'Patios, decks, pergolas',
      additional: 'Floor max 1m high, roof overhang 600mm, behind building line'
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div>
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img 
              src="/backyard-buds-logo.svg" 
              alt="BackyardBud Logo" 
              className="w-20 h-20 mx-auto mb-6 filter brightness-0 invert"
            />
            <h1 className="text-5xl font-bold mb-4">
              BackyardBud
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Your friendly guide to determining whether your shed or patio proposal qualifies as Exempt Development 
              under the NSW State Environmental Planning Policy (Exempt & Complying Development Codes) 2008
            </p>
            <Link
              to="/assessment"
              className="inline-block bg-white text-blue-600 font-semibold text-lg px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow hover-lift"
            >
              Start Your Assessment
            </Link>
          </div>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="stagger-item bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-white border-opacity-20 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-float">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Quick Assessment</h3>
            <p className="text-gray-600 text-center">
              Get instant feedback on whether your proposal meets SEPP Part 2 exempt development criteria.
            </p>
          </div>

          <div className="stagger-item bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-white border-opacity-20 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-float" style={{animationDelay: '0.5s'}}>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">SEPP References</h3>
            <p className="text-gray-600 text-center">
              Receive detailed explanations with references to specific SEPP Part 2 clauses.
            </p>
          </div>

          <div className="stagger-item bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-white border-opacity-20 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-float" style={{animationDelay: '1s'}}>
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Albury Focused</h3>
            <p className="text-gray-600 text-center">
              Specifically designed for Albury properties with local planning context.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-10 rounded-2xl shadow-lg mb-16 border border-white border-opacity-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl shadow-lg">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Property Details</h3>
              <p className="text-gray-600">Enter your property type, lot size, and zoning information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl shadow-lg">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Proposal Details</h3>
              <p className="text-gray-600">Specify structure type, dimensions, and placement</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl shadow-lg">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Assessment</h3>
              <p className="text-gray-600">Our rules engine applies SEPP Part 2 criteria</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl shadow-lg">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Results</h3>
              <p className="text-gray-600">Get clear recommendation with detailed reasoning</p>
            </div>
          </div>
        </div>

        {/* Supported Structures */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Supported Structure Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(structureRules).map((structure, index) => (
              <button 
                key={structure} 
                onClick={() => setSelectedStructure(structure)}
                className="stagger-item bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 border border-white border-opacity-20 cursor-pointer hover:bg-green-50 hover-lift animate-bounce-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <h3 className="font-bold text-gray-900 text-sm">
                  {structure}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {structureRules[structure].description}
                </p>
              </button>
            ))}
          </div>

          {/* Rules Popup Modal */}
          {selectedStructure && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStructure} Rules</h3>
                  <button 
                    onClick={() => setSelectedStructure(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Includes</h4>
                    <p className="text-indigo-700">{structureRules[selectedStructure].description}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Height Limit</h4>
                    <p className="text-green-700">{structureRules[selectedStructure].height}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Floor Area</h4>
                    <p className="text-blue-700">{structureRules[selectedStructure].area}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Setback</h4>
                    <p className="text-yellow-700">{structureRules[selectedStructure].setback}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Additional Requirements</h4>
                    <p className="text-purple-700 text-sm">{structureRules[selectedStructure].additional}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Legal Reference</h4>
                    <p className="text-gray-700 text-sm">{structureRules[selectedStructure].clause}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Link 
                    to="/assessment" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Start Assessment
                  </Link>
                  <button 
                    onClick={() => setSelectedStructure(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
