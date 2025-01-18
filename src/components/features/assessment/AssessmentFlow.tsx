import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { ProcessSection } from './ProcessSection';
import { TechnologySection } from './TechnologySection';
import { TeamSection } from './TeamSection';

const processDetailsSection = {
  title: "Process Details",
  description: "Organizational Structure & Documentation",
  subItems: [
    "Number of employees involved",
    "Transaction volumes",
    "Documentation quality",
    "Workflow structure"
  ],
  benefitText: "Understanding your process structure helps determine automation readiness"
};

const processesSection = {
  title: "Processes",
  description: "Day-to-Day Operations & Tasks",
  subItems: [
    "Manual task duration",
    "Error rates",
    "Task complexity",
    "Repetitive activities"
  ],
  benefitText: "Identifying specific tasks that can be automated for maximum efficiency"
};

export const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { state, setState } = useAssessmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ['process', 'technology', 'team'];
  
  useEffect(() => {
    if (!state.currentStep) {
      setState({ currentStep: steps[0] });
    }
  }, [state.currentStep, setState]);

  const handleNext = () => {
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      setState({ currentStep: steps[currentIndex + 1] });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setState({ currentStep: steps[currentIndex - 1] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit logic here
      navigate('/assessment/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 'process':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-xl font-bold text-white mb-3">{processDetailsSection.title}</h3>
                <p className="text-white/80 mb-4">{processDetailsSection.description}</p>
                <ul className="space-y-2 mb-4">
                  {processDetailsSection.subItems.map((item, index) => (
                    <li key={index} className="text-white/70 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-emerald-400 text-sm">{processDetailsSection.benefitText}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-xl font-bold text-white mb-3">{processesSection.title}</h3>
                <p className="text-white/80 mb-4">{processesSection.description}</p>
                <ul className="space-y-2 mb-4">
                  {processesSection.subItems.map((item, index) => (
                    <li key={index} className="text-white/70 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-emerald-400 text-sm">{processesSection.benefitText}</p>
              </Card>
            </div>
            <ProcessSection />
          </>
        );
      case 'technology':
        return <TechnologySection />;
      case 'team':
        return <TeamSection />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Business Assessment</h2>
        <div className="flex space-x-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${
                index < steps.indexOf(state.currentStep)
                  ? 'text-green-500'
                  : index === steps.indexOf(state.currentStep)
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              <span className="font-medium capitalize">{step}</span>
              {index < steps.length - 1 && <span className="mx-2">→</span>}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        <Button
          onClick={handleBack}
          disabled={steps.indexOf(state.currentStep) === 0}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {steps.indexOf(state.currentStep) === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
