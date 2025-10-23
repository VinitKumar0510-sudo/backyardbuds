import React, { useState, useEffect } from 'react';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isTransitioning) {
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
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default PageTransition;