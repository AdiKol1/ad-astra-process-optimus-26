import React, { useCallback, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssessmentLayout from '../components/layout/AssessmentLayout';
import AssessmentFlow from '../components/features/assessment/AssessmentFlow';
import { Calculator, TestCalculator } from '../components/features/assessment/Calculator';
import { ReportGenerator } from '../components/features/assessment/ReportGenerator';
import { ScoreCards } from '../components/features/assessment/ScoreCards';
import SEO from '../components/shared/SEO';
import { useContext } from 'react';
import AssessmentContext from '../contexts/AssessmentContext';
import PreviewInsights from '../components/features/assessment/PreviewInsights';
import LeadCaptureForm from '../components/features/assessment/LeadCaptureForm';
import TestimonialsSection from '../components/features/assessment/TestimonialsSection';
import saveLeadToGoogleSheets from '../utils/saveLeadToGoogleSheets';
import { Analytics, trackEvent, trackAssessmentProgress } from '../components/features/assessment/utils/analytics';
import { useExitIntent } from '../components/features/assessment/hooks/useExitIntent';
import ExitIntentModal from '../components/features/assessment/ExitIntentModal';

const TestPage = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Assessment Calculator Test</h1>
      <TestCalculator />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        <ScoreCards />
        <ReportGenerator />
      </div>
    </div>
  );
};

const Assessment = () => {
  const {
    assessmentData,
    currentStep,
    setCurrentStep,
    leadData,
    setLeadData,
    isPreviewMode,
    setPreviewMode,
    leadScore,
    setLeadScore
  } = useContext(AssessmentContext);

  // Start tracking session when assessment begins
  useEffect(() => {
    Analytics.startSession();
    trackEvent({
      category: 'Assessment',
      action: 'Start',
      metadata: {
        entry_point: window.location.pathname,
        referrer: document.referrer,
      },
    });

    return () => {
      Analytics.endSession();
    };
  }, []);

  const sections = [
    {
      id: 'intro',
      title: 'Process Optimization Assessment',
      description: 'Discover how to improve your business processes and increase efficiency',
      isGated: false
    },
    {
      id: 'team',
      title: 'Team Structure',
      description: 'Let's understand your team composition and workflow',
      isGated: false
    },
    {
      id: 'process',
      title: 'Process Analysis',
      description: 'Evaluate your current processes and identify opportunities',
      isGated: false
    },
    {
      id: 'technology',
      title: 'Technology Assessment',
      description: 'Review your technical infrastructure and integration needs',
      isGated: false
    },
    {
      id: 'preview',
      title: 'Initial Insights',
      description: 'Preview your potential optimization opportunities',
      isGated: true
    },
    {
      id: 'leadCapture',
      title: 'Unlock Full Report',
      description: 'Get your detailed assessment and recommendations',
      isGated: true
    }
  ];

  const trackProgress = useCallback((step: number) => {
    const section = sections[step];
    trackAssessmentProgress({
      category: 'Assessment',
      action: 'Section_Complete',
      metadata: {
        sectionName: section.id,
        sectionTitle: section.title,
        completionTime: Date.now(),
        score: leadScore,
        isGated: section.isGated,
        progress: ((step + 1) / sections.length) * 100,
      },
    });
  }, [sections, leadScore]);

  const calculateLeadScore = useCallback((responses: any) => {
    let score = 0;
    
    if (responses.teamSize > 50) score += 30;
    else if (responses.teamSize > 20) score += 20;
    else score += 10;

    if (responses.processComplexity === 'High') score += 30;
    else if (responses.processComplexity === 'Medium') score += 20;
    else score += 10;

    if (responses.monthlyBudget === '$5,001+') score += 40;
    else if (responses.monthlyBudget === '$1,001-$5,000') score += 30;
    else score += 10;

    setLeadScore(score);

    // Track lead scoring
    trackEvent({
      category: 'Assessment',
      action: 'Lead_Score_Update',
      value: score,
      metadata: {
        teamSize: responses.teamSize,
        processComplexity: responses.processComplexity,
        monthlyBudget: responses.monthlyBudget,
      },
    });
  }, [setLeadScore]);

  const handleNextSection = useCallback(() => {
    if (currentStep < sections.length - 1) {
      const nextSection = sections[currentStep + 1];
      
      if (nextSection.isGated && !leadData) {
        setPreviewMode(true);
        trackEvent({
          category: 'Assessment',
          action: 'Preview_Mode_Enter',
          metadata: {
            currentSection: sections[currentStep].id,
            leadScore,
          },
        });
      }
      
      setCurrentStep(currentStep + 1);
      trackProgress(currentStep + 1);
    } else {
      // Track assessment completion
      trackAssessmentProgress({
        category: 'Assessment',
        action: 'Complete',
        metadata: {
          totalTime: Date.now() - sessionStartTime,
          finalScore: leadScore,
          completedSections: sections.map(s => s.id),
        },
      });
    }
  }, [currentStep, sections, leadData, setPreviewMode, setCurrentStep, trackProgress, leadScore]);

  const handleLeadCapture = useCallback(async (data: any) => {
    setLeadData(data);
    setPreviewMode(false);
    
    // Track lead capture
    await trackEvent({
      category: 'Lead',
      action: 'Form_Complete',
      metadata: {
        leadScore,
        progress: ((currentStep + 1) / sections.length) * 100,
        industry: data.industry,
        companySize: data.companySize,
      },
    });

    await saveLeadToGoogleSheets(data, leadScore);
  }, [leadScore, currentStep, sections.length, setLeadData, setPreviewMode]);

  const { showModal, closeModal } = useExitIntent({
    threshold: 20,
    triggerOnce: true,
    onExit: () => {
      trackEvent({
        category: 'Assessment',
        action: 'Exit_Intent_Triggered',
        metadata: {
          currentSection: assessmentData.currentSection,
          progress: calculateProgress(),
          timeSpent: Date.now() - (assessmentData.startTime || Date.now()),
        },
      });
    },
  });

  const calculateProgress = () => {
    // Calculate progress based on completed sections and questions
    const totalSections = assessmentData.sections?.length || 1;
    const completedSections = assessmentData.completedSections?.length || 0;
    return Math.round((completedSections / totalSections) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {Math.round(((currentStep + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">{sections[currentStep].title}</h1>
          <p className="text-gray-600 mb-6">{sections[currentStep].description}</p>

          {sections[currentStep].isGated && isPreviewMode ? (
            <div className="space-y-6">
              <PreviewInsights assessmentData={assessmentData} />
              <LeadCaptureForm onSubmit={handleLeadCapture} />
            </div>
          ) : (
            <AssessmentFlow
              currentStep={currentStep}
              onComplete={handleNextSection}
            />
          )}
        </div>

        <div className="hidden">
          <TestimonialsSection />
        </div>
      </div>
      <ExitIntentModal
        isOpen={showModal}
        onClose={closeModal}
        currentProgress={calculateProgress()}
      />
    </div>
  );
};

export default Assessment;