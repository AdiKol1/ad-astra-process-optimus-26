import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FiX, FiSave, FiMail } from 'react-icons/fi';
import { AssessmentContext } from './AssessmentContext';
import { trackEvent } from './utils/analytics';

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress: number;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  isOpen,
  onClose,
  currentProgress,
}) => {
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { assessmentData } = useContext(AssessmentContext);

  useEffect(() => {
    if (isOpen) {
      trackEvent({
        category: 'Exit_Intent',
        action: 'Modal_Show',
        metadata: {
          currentProgress,
          currentSection: assessmentData.currentSection,
          timeSpent: Date.now() - (assessmentData.startTime || Date.now()),
        },
      });
    }
  }, [isOpen, currentProgress, assessmentData]);

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Track save attempt
      await trackEvent({
        category: 'Exit_Intent',
        action: 'Save_Progress',
        metadata: {
          email,
          currentProgress,
          responses: Object.keys(assessmentData.responses || {}).length,
        },
      });

      // Store progress in localStorage for demo
      localStorage.setItem('assessment_progress', JSON.stringify({
        email,
        timestamp: Date.now(),
        progress: currentProgress,
        data: assessmentData,
      }));

      setShowSuccess(true);
      
      // Close after showing success message
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setEmail('');
      }, 2000);

    } catch (error) {
      console.error('Error saving progress:', error);
      trackEvent({
        category: 'Exit_Intent',
        action: 'Save_Error',
        metadata: { error: error.message },
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="p-6">
          {!showSuccess ? (
            <>
              <div className="text-center mb-6">
                <FiSave className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Save Your Progress
                </h2>
                <p className="text-gray-600">
                  You're {currentProgress}% through the assessment! Save your progress and
                  continue later where you left off.
                </p>
              </div>

              <form onSubmit={handleSaveProgress} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? 'Saving...' : 'Save Progress'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    No thanks, I'll start over later
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  We'll email you a secure link to continue your assessment.
                  Your data is safe and will not be shared.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Progress Saved!
              </h3>
              <p className="text-sm text-gray-600">
                Check your email for the continuation link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;