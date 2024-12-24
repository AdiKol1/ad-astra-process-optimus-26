import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { QuestionSection } from './sections';
import { processesQuestions } from '@/constants/questions/processes';
import { NavigationButtons } from './NavigationButtons';
import { calculateProcessMetrics } from '@/utils/processAssessment/calculations';
import { generateCACResults } from '@/utils/cacCalculations';
import { transformProcessData } from '@/utils/processAssessment/adapters';

const ProcessAssessment = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData, updateResults } = useAssessment();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  console.log('ProcessAssessment - Current assessment data:', assessmentData);

  const handleAnswer = (questionId: string, answer: any) => {
    console.log('Process answer received:', { questionId, answer });
    
    // Convert values to proper types
    let processedAnswer = answer;
    if (questionId === 'teamSize') {
      processedAnswer = Number(answer) || 0;
    } else if (questionId === 'manualProcesses' || questionId === 'toolStack') {
      processedAnswer = Array.isArray(answer) ? answer : [answer];
    }
    
    setAssessmentData({
      ...assessmentData,
      responses: {
        ...(assessmentData?.responses || {}),
        [questionId]: processedAnswer
      }
    });
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['manualProcesses', 'teamSize', 'industry'];
    
    processesQuestions.questions.forEach(question => {
      if (question.required && !assessmentData?.responses[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
    });

    requiredFields.forEach(field => {
      if (!assessmentData?.responses[field]) {
        newErrors[field] = 'This field is required for calculations';
      }
    });

    if (assessmentData?.responses.teamSize && isNaN(Number(assessmentData.responses.teamSize))) {
      newErrors.teamSize = 'Team size must be a number';
    }

    if (assessmentData?.responses.manualProcesses && !Array.isArray(assessmentData.responses.manualProcesses)) {
      newErrors.manualProcesses = 'Invalid manual processes selection';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateResults = () => {
    if (!assessmentData) return null;

    // Transform process data
    const processData = transformProcessData(assessmentData);
    console.log('Transformed process data:', processData);

    // Calculate process metrics
    const processResults = calculateProcessMetrics(processData);
    console.log('Process calculation results:', processResults);

    // Calculate CAC metrics
    const cacResults = generateCACResults({
      industry: assessmentData.responses.industry,
      marketing_spend: assessmentData.responses.marketingSpend,
      new_customers: assessmentData.responses.customerVolume,
      manualProcesses: assessmentData.responses.manualProcesses,
      toolStack: assessmentData.responses.toolStack
    });
    console.log('CAC calculation results:', cacResults);

    return { processResults, cacResults };
  };

  const handleNext = () => {
    if (!validateResponses()) {
      console.error('Validation failed:', errors);
      return;
    }

    const results = calculateResults();
    if (!results) {
      console.error('Failed to calculate results');
      return;
    }

    // Update results in context
    updateResults(results.processResults, results.cacResults);
    console.log('Results updated, navigating to results page');
    navigate('/assessment/results');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Process Assessment</h2>
          <p className="text-gray-600 mt-2">
            Help us understand your current processes and challenges
          </p>
        </div>

        {processesQuestions.questions.map((question) => (
          <QuestionSection
            key={question.id}
            question={question}
            answer={assessmentData?.responses[question.id]}
            error={errors[question.id]}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
          />
        ))}

        <NavigationButtons
          onBack={() => navigate('/assessment/team')}
          onNext={handleNext}
          nextLabel="View Results"
        />
      </div>
    </Card>
  );
};

export default ProcessAssessment;