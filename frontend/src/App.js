import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import EnhancedAssessmentPage from './pages/EnhancedAssessmentPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/assessment" element={<PageTransition><EnhancedAssessmentPage /></PageTransition>} />
            <Route path="/assessment-old" element={<PageTransition><AssessmentPage /></PageTransition>} />
            <Route path="/results" element={<PageTransition><ResultsPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          </Routes>
        </main>
        
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
