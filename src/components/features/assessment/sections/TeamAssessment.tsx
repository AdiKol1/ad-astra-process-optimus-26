import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessment } from '@/contexts/AssessmentContext';
import { teamQuestions } from '@/constants/questions/team';

interface TeamAssessmentProps {
  onIndustryChange: (value: string) => void;
  onTeamSizeChange: (option: string, checked: boolean) => void;
}

const TeamAssessment: React.FC<TeamAssessmentProps> = ({
  onIndustryChange,
  onTeamSizeChange,
}) => {
  const { assessmentData } = useAssessment();

  return (
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
              onValueChange={onIndustryChange}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {teamQuestions.questions[0].options?.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                  >
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
              {teamQuestions.questions[1].options?.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`teamSize-${option}`}
                    checked={(assessmentData?.responses?.teamSize || []).includes(option)}
                    onCheckedChange={(checked) => {
                      onTeamSizeChange(option, checked as boolean);
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
  );
};

export default TeamAssessment;