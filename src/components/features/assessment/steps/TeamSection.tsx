import React from 'react';
import { Question } from '../types';
import QuestionSection from '../QuestionSection';

const teamSection = {
  id: 'team',
  title: 'Team Assessment',
  description: 'Help us understand your team structure and processes.',
  questions: [
    {
      id: 'teamSize',
      text: 'How many people are involved in your core business processes?',
      type: 'number',
      required: true,
      placeholder: 'Enter number of team members',
      validation: (value: any) => {
        const num = Number(value);
        if (isNaN(num) || num < 1) return 'Please enter a valid number';
        return undefined;
      }
    },
    {
      id: 'teamStructure',
      text: 'How is your team structured?',
      type: 'select',
      required: true,
      options: [
        'Hierarchical',
        'Flat',
        'Matrix',
        'Project-based',
        'Other'
      ]
    },
    {
      id: 'processOwners',
      text: 'Who are the primary process owners in your organization?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Department Heads, Team Leads'
    }
  ]
};

interface TeamSectionProps {
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
  errors?: Record<string, string>;
}

const TeamSection: React.FC<TeamSectionProps> = ({ onAnswer, answers, errors }) => {
  return (
    <QuestionSection
      section={teamSection}
      answers={answers}
      onAnswer={onAnswer}
      errors={errors}
    />
  );
};

export default TeamSection;
