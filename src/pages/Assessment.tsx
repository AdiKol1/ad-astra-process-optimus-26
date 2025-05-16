import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAssessmentStore } from '../stores/assessment';
import { logger } from '../utils/logger';
// Import directly to avoid module resolution issues
import { AuditFormProvider } from '../contexts/AuditFormContext';
import AssessmentLayout from '../components/layout/AssessmentLayout';

// Direct import of the AssessmentFlow component to avoid any issues with lazy loading
import AssessmentFlow from '../components/features/assessment/core/AssessmentFlow';

const Assessment: React.FC = () => {
  const assessmentStore = useAssessmentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Ensure the assessment store is initialized
    const initializeAssessment = async () => {
      try {
        setIsLoading(true);
        console.log('Assessment page: Initializing assessment');
        
        // Allow some time for initialization and component loading
        setTimeout(() => {
          setIsLoading(false);
          console.log('Assessment page: Initialization complete');
        }, 1000);
      } catch (err) {
        console.error('Error initializing assessment:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing assessment'));
        setIsLoading(false);
      }
    };

    initializeAssessment();

    // Cleanup function
    return () => {
      console.log('Assessment page: Cleanup');
    };
  }, []);

  // If there's an error, display it
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Assessment</h1>
        <p className="text-gray-700 mb-4">{error.message || 'Unknown error occurred'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700">Loading your assessment experience...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Process Assessment - Ad Astra Process Optimus</title>
        <meta name="description" content="Take our process assessment to identify automation opportunities" />
      </Helmet>
      
      <AuditFormProvider>
        <AssessmentLayout>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              {/* Directly render the AssessmentFlow component */}
              <AssessmentFlow />
            </div>
          </div>
        </AssessmentLayout>
      </AuditFormProvider>
    </>
  );
};

export default Assessment;
