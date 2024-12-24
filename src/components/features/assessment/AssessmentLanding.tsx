import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import BenefitsSection from './sections/BenefitsSection';
import TeamAssessment from './sections/TeamAssessment';

const AssessmentLanding: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();

  const handleIndustryChange = (value: string) => {
    console.log('Industry selected:', value);
    
    setAssessmentData({
      ...assessmentData || {},
      responses: {
        ...(assessmentData?.responses || {}),
        industry: value
      },
      currentStep: 0,
      totalSteps: 4
    });
  };

  const handleTeamSizeChange = (option: string, checked: boolean) => {
    console.log('Team size changed:', option, checked);
    
    const currentAnswers = assessmentData?.responses?.teamSize || [];
    let newAnswers;
    
    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter((answer: string) => answer !== option);
    }
    
    console.log('New team size answers:', newAnswers);
    
    setAssessmentData({
      ...assessmentData || {},
      responses: {
        ...(assessmentData?.responses || {}),
        teamSize: newAnswers
      },
      currentStep: 0,
      totalSteps: 4
    });
  };

  const handleContinue = () => {
    console.log('Current assessment data before navigation:', assessmentData);
    
    const industry = assessmentData?.responses?.industry;
    const teamSize = assessmentData?.responses?.teamSize || [];
    
    if (!industry || teamSize.length === 0) {
      console.log('Missing required fields:', { industry, teamSize });
      const teamSection = document.getElementById('team-section');
      teamSection?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    navigate('/assessment/processes');
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <BenefitsSection />
      
      <TeamAssessment 
        onIndustryChange={handleIndustryChange}
        onTeamSizeChange={handleTeamSizeChange}
      />

      {/* Continue Button */}
      <div className="text-center">
        <Button
          size="lg"
          className="text-lg px-8 py-6"
          onClick={handleContinue}
        >
          Continue to Process Assessment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentLanding;