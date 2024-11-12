import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

export const ROICalculator = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    employeeCost: 50000,
    employeeCount: 1,
    hoursPerWeek: 40,
    errorRate: 5
  });

  const calculateROI = () => {
    const annualLaborCost = inputs.employeeCost * inputs.employeeCount;
    const automationSavings = (inputs.hoursPerWeek * 52 * (inputs.employeeCost / 2080)) * 
                             inputs.employeeCount * 0.3; // 30% time savings
    const errorCostSavings = (annualLaborCost * (inputs.errorRate / 100)) * 0.8; // 80% error reduction
    
    return {
      annualSavings: automationSavings + errorCostSavings,
      productivityGain: 30, // 30% productivity increase
      errorReduction: 80, // 80% error reduction
      roi: ((automationSavings + errorCostSavings) / (annualLaborCost * 0.1)) * 100 // ROI calculation
    };
  };

  const results = calculateROI();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Average Employee Cost (Annual)</Label>
                <Input
                  type="number"
                  value={inputs.employeeCost}
                  onChange={(e) => setInputs(prev => ({ ...prev, employeeCost: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Number of Employees</Label>
                <Input
                  type="number"
                  value={inputs.employeeCount}
                  onChange={(e) => setInputs(prev => ({ ...prev, employeeCount: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Hours Spent on Manual Processes (Weekly)</Label>
                <Input
                  type="number"
                  value={inputs.hoursPerWeek}
                  onChange={(e) => setInputs(prev => ({ ...prev, hoursPerWeek: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Current Error Rate (%)</Label>
                <Input
                  type="number"
                  value={inputs.errorRate}
                  onChange={(e) => setInputs(prev => ({ ...prev, errorRate: Number(e.target.value) }))}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-gold/10 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Projected Annual Benefits</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Total Cost Savings</Label>
                    <p className="text-2xl font-bold text-gold">{formatCurrency(results.annualSavings)}</p>
                  </div>
                  <div>
                    <Label>ROI</Label>
                    <p className="text-2xl font-bold text-gold">{Math.round(results.roi)}%</p>
                  </div>
                  <div>
                    <Label>Productivity Increase</Label>
                    <p className="text-2xl font-bold text-gold">{results.productivityGain}%</p>
                  </div>
                  <div>
                    <Label>Error Reduction</Label>
                    <p className="text-2xl font-bold text-gold">{results.errorReduction}%</p>
                  </div>
                </div>
              </div>
            </div>
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