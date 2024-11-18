import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { toast } from '../../ui/use-toast';
import { ProgressBar } from './ProgressBar';
import QuestionSection from './QuestionSection';
import TrustIndicators from '../../shared/TrustIndicators';
import { assessmentQuestions } from '../../../constants/questions';
import { useAssessment } from './AssessmentContext';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { trackEvent } from './utils/analytics';
import ValueMicroConversion from './ValueMicroConversion';
import IndustryInsights from './IndustryInsights';
import PersonalizedCTA from './PersonalizedCTA';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => string | undefined;
}

const questions: Record<string, Question[]> = {
  team: [
    {
      id: 'teamSize',
      text: 'How many people are involved in your core business processes?',
      type: 'select',
      options: ['1-10', '11-50', '51-200', '201-500', '500+'],
      required: true,
    },
    {
      id: 'processOwners',
      text: 'How many process owners or managers do you have?',
      type: 'number',
      required: true,
      validation: (value) => {
        const num = Number(value);
        if (isNaN(num) || num < 0) return 'Please enter a valid number';
        return undefined;
      },
    },
  ],
  process: [
    {
      id: 'processComplexity',
      text: 'How would you rate the complexity of your current processes?',
      type: 'radio',
      options: ['Low', 'Medium', 'High'],
      required: true,
    },
    {
      id: 'manualProcesses',
      text: 'Which processes are currently manual or semi-manual?',
      type: 'checkbox',
      options: [
        'Data Entry',
        'Document Processing',
        'Approvals',
        'Reporting',
        'Customer Service',
        'Other',
      ],
      required: true,
    },
  ],
  technology: [
    {
      id: 'currentTools',
      text: 'What tools or software do you currently use?',
      type: 'text',
      placeholder: 'E.g., Excel, SAP, Custom software',
      required: true,
    },
    {
      id: 'monthlyBudget',
      text: 'What is your monthly budget for process optimization?',
      type: 'select',
      options: [
        'Under $1,000',
        '$1,001-$5,000',
        '$5,001+',
      ],
      required: true,
    },
  ],
};

const AssessmentFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auditState, setAssessmentData } = useAssessment();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    // Initialize assessment data if not already present
    if (!auditState.assessmentData) {
      setAssessmentData({
        responses: {},
        currentStep: 1,
        totalSteps: Object.keys(assessmentQuestions).length
      });
    }
  }, [auditState.assessmentData, setAssessmentData]);

  const sections = Object.values(assessmentQuestions);
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  useEffect(() => {
    // Track when user starts answering questions in a section
    trackEvent({
      category: 'Assessment',
      action: 'Section_Start',
      label: currentSection.id,
      metadata: {
        questionCount: currentSection.questions.length,
        sectionType: currentSection.id,
      },
    });
  }, [currentSection.id, currentSection.questions.length]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      // Update assessment data with new answers
      setAssessmentData({
        ...auditState.assessmentData!,
        responses: newAnswers,
        currentStep: currentSectionIndex + 1
      });
      return newAnswers;
    });

    // Track question interaction
    trackEvent({
      category: 'Assessment',
      action: 'Question_Answer',
      label: questionId,
      metadata: {
        section: currentSection.id,
        questionType: currentSection.questions.find(q => q.id === questionId)?.type,
        answerLength: value?.toString().length,
      },
    });

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: '',
      }));
    }
  };

  const validateCurrentSection = () => {
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => answers[q.id]);
  };

  const validateResponses = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentSection.questions.forEach(question => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = 'This field is required';
        isValid = false;
      } else if (question.validation) {
        const error = question.validation(answers[question.id]);
        if (error) {
          newErrors[question.id] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);

    // Track validation errors if any
    if (!isValid) {
      trackEvent({
        category: 'Assessment',
        action: 'Validation_Error',
        label: currentSection.id,
        metadata: {
          errorCount: Object.keys(newErrors).length,
          errorFields: Object.keys(newErrors),
        },
      });
    }

    return isValid;
  };

  const handleNext = async () => {
    if (!validateCurrentSection() || !validateResponses()) {
      toast({
        title: "Required Fields",
        description: "Please answer all required questions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (isLastSection) {
      setIsLoading(true);
      // Navigate to calculator with final assessment data
      setAssessmentData({
        ...auditState.assessmentData!,
        responses: answers,
        currentStep: sections.length
      });
      navigate('/assessment/calculator');
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      setAssessmentData({
        ...auditState.assessmentData!,
        currentStep: currentSectionIndex + 2
      });
    }

    const sectionTime = Date.now() - startTime;

    // Track section completion
    await trackEvent({
      category: 'Assessment',
      action: 'Section_Complete',
      label: currentSection.id,
      metadata: {
        timeSpent: sectionTime,
        questionCount: currentSection.questions.length,
        responseCount: Object.keys(answers).length,
      },
    });
  };

  const handleBack = () => {
    if (currentSectionIndex === 0) {
      navigate('/');
    } else {
      setCurrentSectionIndex(prev => prev - 1);
      setAssessmentData({
        ...auditState.assessmentData!,
        currentStep: currentSectionIndex
      });
    }
  };

  const handleCTAAction = (action: string) => {
    switch (action) {
      case 'schedule_urgent':
        // Handle urgent consultation scheduling
        window.location.href = '/schedule-urgent';
        break;
      case 'download_report':
        // Handle report download
        generateAndDownloadReport();
        break;
      case 'view_roadmap':
        // Handle roadmap view
        setShowRoadmap(true);
        break;
      case 'book_consultation':
        // Handle regular consultation booking
        window.location.href = '/schedule';
        break;
    }
  };

  const shouldShowInsights = () => {
    const keyDecisionPoints = [
      'process-mapping',
      'resource-allocation',
      'cost-analysis',
      'technology-assessment'
    ];
    return keyDecisionPoints.includes(currentSection.id);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Preparing your assessment...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ValueMicroConversion
        currentSection={currentSection}
        responses={auditState.assessmentData?.responses || {}}
        onInsightView={(insightId) => {
          trackEvent({
            category: 'Assessment',
            action: 'Value_Insight_View',
            metadata: {
              insightId,
              currentSection,
              progress: currentSectionIndex / sections.length
            }
          });
        }}
      />
      
      {shouldShowInsights() && (
        <IndustryInsights
          currentSection={currentSection}
          industry={auditState.assessmentData?.responses?.industry || 'Technology'}
          responses={auditState.assessmentData?.responses || {}}
        />
      )}
      
      {currentSectionIndex / sections.length > 0.25 && (
        <PersonalizedCTA
          responses={auditState.assessmentData?.responses || {}}
          currentSection={currentSection}
          progress={currentSectionIndex / sections.length}
          onAction={handleCTAAction}
        />
      )}
      
      <Card className="w-full">
        <div className="p-6">
          <ProgressBar 
            currentStep={currentSectionIndex + 1}
            totalSteps={sections.length}
          />
          
          <div className="mt-8">
            <QuestionSection
              section={currentSection}
              answers={answers}
              onAnswer={handleAnswer}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              {currentSectionIndex === 0 ? 'Exit' : 'Back'}
            </Button>
            <Button
              onClick={handleNext}
            >
              {isLastSection ? 'Calculate Results' : 'Next'}
            </Button>
          </div>

          <div className="mt-8">
            <TrustIndicators />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentFlow;
