import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ROICalculator = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROI calculations will be implemented here */}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/assessment/questionnaire')}
            >
              Back to Assessment
            </Button>
            <Button onClick={() => navigate('/assessment/report')}>
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};