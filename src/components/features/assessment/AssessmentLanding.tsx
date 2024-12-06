import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search, DollarSign, TrendingUp } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { teamQuestions } from '@/constants/questions/team';

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
    const industry = assessmentData?.responses?.industry;
    const teamSize = assessmentData?.responses?.teamSize || [];
    
    if (!industry || teamSize.length === 0) {
      // Show error or highlight required fields
      const teamSection = document.getElementById('team-section');
      teamSection?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    navigate('/assessment/processes');
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      {/* Benefits Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Discover Your Optimization Potential
        </h1>
        <p className="text-xl text-muted-foreground">
          Take our quick assessment to uncover opportunities for growth and efficiency
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="p-6 flex flex-col items-center text-center">
          <Search className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Process Analysis</h3>
          <p className="text-muted-foreground">
            Identify inefficiencies and bottlenecks
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <DollarSign className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
          <p className="text-muted-foreground">
            Calculate potential cost reductions
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <TrendingUp className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
          <p className="text-muted-foreground">
            Unlock your business potential
          </p>
        </Card>
      </div>

      {/* Team Assessment Section */}
      <Card className="p-8 mb-8" id="team-section">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{teamQuestions.title}</h2>
            <p className="text-muted-foreground">
              {teamQuestions.description}
            </p>
          </div>

          <div className="space-y-4">
            {/* Industry Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                {teamQuestions.questions[0].label}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                {teamQuestions.questions[0].description}
              </p>
              <Select
                value={assessmentData?.responses?.industry || ""}
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {teamQuestions.questions[0].options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Size Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                {teamQuestions.questions[1].label}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                {teamQuestions.questions[1].description}
              </p>
              <div className="grid gap-4">
                {teamQuestions.questions[1].options.map((option) => (
                  <div key={option} className="flex items-center space-x-3">
                    <Checkbox
                      id={`teamSize-${option}`}
                      checked={(assessmentData?.responses?.teamSize || []).includes(option)}
                      onCheckedChange={(checked) => {
                        handleTeamSizeChange(option, checked as boolean);
                      }}
                    />
                    <Label
                      htmlFor={`teamSize-${option}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

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