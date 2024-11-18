import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ProgressBar } from './ProgressBar';
import QuestionSection from './QuestionSection';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { assessmentQuestions } from '@/constants/questions';
import { useAssessment } from '@/contexts/AssessmentContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { trackEvent } from '@/utils/analytics';
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
  const { assessmentData: auditState, setAssessmentData } = useAssessment();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());
  const [showRoadmap, setShowRoadmap] = useState(false);

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
    if (!currentSection?.questions) {
      console.error('Invalid section data');
      return false;
    }

    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentSection.questions.forEach(question => {
      if (!question) return;
      
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
    const insights = useMemo(() => ({
      processEfficiency: calculateProcessEfficiency(answers),
      potentialSavings: calculatePotentialSavings(answers)
    }), [answers]);

    trackEvent({
      category: 'Assessment',
      action: 'CTA_Click',
      label: action,
      metadata: {
        currentSection: currentSection?.id,
        progress: sections.length ? currentSectionIndex / sections.length : 0
      }
    });

    switch (action) {
      case 'schedule_urgent':
        navigate('/schedule-urgent', { 
          state: { 
            assessmentData: answers,
            insights
          } 
        });
        break;
      case 'download_report':
        generateAndDownloadReport();
        break;
      case 'view_roadmap':
        setShowRoadmap(true);
        break;
      case 'book_consultation':
        navigate('/schedule', { 
          state: { 
            assessmentData: answers,
            insights
          } 
        });
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

  const generateAndDownloadReport = async () => {
    try {
      setIsLoading(true);
      const reportData = {
        responses: answers,
        insights: {
          processEfficiency: calculateProcessEfficiency(answers),
          potentialSavings: calculatePotentialSavings(answers),
          recommendedActions: getRecommendedActions(answers)
        },
        timestamp: new Date().toISOString()
      };

      // Generate PDF or JSON
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `process-assessment-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error Generating Report",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProcessEfficiency = (answers) => {
    let score = 0;
    const areas = [];
    
    // Process complexity impact
    if (answers.processComplexity === 'Low') score += 30;
    else if (answers.processComplexity === 'Medium') score += 20;
    else if (answers.processComplexity === 'High') score += 10;

    // Manual processes impact
    const manualProcesses = answers.manualProcesses || [];
    if (manualProcesses.includes('Data Entry')) {
      score += 15;
      areas.push('Data Entry');
    }
    if (manualProcesses.includes('Approvals')) {
      score += 15;
      areas.push('Approvals');
    }
    if (manualProcesses.includes('Document Processing')) {
      score += 15;
      areas.push('Document Processing');
    }

    // Team size impact
    const teamSize = answers.teamSize;
    if (teamSize === '1-10') score += 10;
    else if (teamSize === '11-50') score += 15;
    else if (teamSize === '51-200') score += 20;
    else if (teamSize === '201-500') score += 25;
    else if (teamSize === '500+') score += 30;

    return {
      score: Math.min(score, 100),
      areas: areas.length > 0 ? areas : ['General Process Optimization']
    };
  };

  const calculatePotentialSavings = (answers) => {
    // Calculate time savings
    const manualProcesses = answers.manualProcesses || [];
    const processCount = manualProcesses.length;
    const teamSize = answers.teamSize;
    
    let hoursPerWeek = 0;
    let costPerYear = 0;
    
    // Time calculations
    const baseHoursPerProcess = 5;
    hoursPerWeek = processCount * baseHoursPerProcess;
    
    // Cost calculations
    const avgHourlyCost = 50; // Average hourly cost
    const weeksPerYear = 52;
    costPerYear = hoursPerWeek * avgHourlyCost * weeksPerYear;
    
    // Team size multiplier
    let multiplier = 1;
    if (teamSize === '11-50') multiplier = 2;
    else if (teamSize === '51-200') multiplier = 3;
    else if (teamSize === '201-500') multiplier = 4;
    else if (teamSize === '500+') multiplier = 5;
    
    hoursPerWeek *= multiplier;
    costPerYear *= multiplier;

    return {
      timePerWeek: `${hoursPerWeek}-${Math.round(hoursPerWeek * 1.5)} hours`,
      costPerYear: `$${Math.round(costPerYear/1000)}k-${Math.round(costPerYear*1.5/1000)}k`
    };
  };

  const getRecommendedActions = (answers) => {
    const recommendations = [];
    const manualProcesses = answers.manualProcesses || [];
    
    if (manualProcesses.includes('Data Entry')) {
      recommendations.push('Implement automated data entry using OCR and AI');
    }
    if (manualProcesses.includes('Approvals')) {
      recommendations.push('Deploy digital approval workflows with automated routing');
    }
    if (manualProcesses.includes('Document Processing')) {
      recommendations.push('Set up intelligent document processing system');
    }
    if (answers.currentTools?.toLowerCase().includes('excel')) {
      recommendations.push('Upgrade from Excel to a dedicated process management system');
    }
    if (answers.processComplexity === 'High') {
      recommendations.push('Conduct detailed process mapping workshop');
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Implement automated data entry',
      'Streamline approval workflows',
      'Integrate existing tools'
    ];
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
      <ValueMicroConversion />
      
      {shouldShowInsights() && (
        <IndustryInsights />
      )}
      
      {currentSectionIndex / sections.length > 0.25 && (
        <PersonalizedCTA onAction={handleCTAAction} />
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
