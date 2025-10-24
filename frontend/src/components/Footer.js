import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Backyard Bud</h3>
            <p className="text-gray-300 text-sm">
              Your friendly guide to help Albury residents determine if their shed or patio 
              proposal qualifies as exempt development under NSW SEPP.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Notice</h3>
            <p className="text-gray-300 text-sm">
              This is a prototype tool for educational purposes. Always consult with 
              qualified professionals and relevant authorities for official planning advice.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  NSW SEPP (Exempt & Complying Development Codes) 2008
                </a>
              </li>
              <li>
                <a 
                  href="https://www.alburycity.nsw.gov.au/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Albury City Council
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Backyard Bud. Your friendly planning assessment companion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
