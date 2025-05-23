import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '@/contexts/assessment/store';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-blue-600 mr-4">Ad Astra</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-600 hover:text-blue-600">
                Features
              </Link>
              <Link to="/solutions" className="text-gray-600 hover:text-blue-600">
                Solutions
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </nav>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600"
            >
              Log in
            </Link>
            <StartAssessmentButton />
          </div>
        </div>
      </div>
    </header>
  );
};

const StartAssessmentButton: React.FC = () => {
  const navigate = useNavigate();
  const { resetAssessment } = useAssessmentStore(state => state);

  const handleStartAssessment = async () => {
    try {
      // Reset to start a fresh session
      resetAssessment();
      
      // Navigate to assessment route - let AssessmentFlow handle the rest
      if (navigate) {
        navigate('/assessment');
      } else {
        window.location.pathname = '/assessment';
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to start assessment from header:', error);
    }
  };

  return (
    <button
      onClick={handleStartAssessment}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Start Assessment
    </button>
  );
}; 