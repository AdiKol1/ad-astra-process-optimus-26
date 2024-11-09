import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AssessmentData } from '@/types/assessment';

export const QuestionnaireFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<AssessmentData>>({});

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/assessment/calculator');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Progress value={(step + 1) * 25} className="mb-8" />
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Business Process Assessment</h2>
          
          {/* Steps will be implemented here */}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {step === 3 ? 'Calculate ROI' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};