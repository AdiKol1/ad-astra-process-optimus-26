import type { BaseQuestion } from '@/types/assessment/core';

export const processesQuestions = {
  title: 'Process Assessment',
  description: 'Help us understand your current processes and challenges',
  questions: [
    {
      id: 'industry',
      type: 'select',
      label: 'What industry are you in?',
      description: 'This helps us benchmark against similar companies',
      required: true,
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Retail', value: 'retail' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Other', value: 'default' }
      ]
    },
    {
      id: 'teamSize',
      type: 'number',
      label: 'How many people are in your team?',
      description: 'Include all full-time employees and contractors',
      required: true,
      placeholder: 'Enter team size',
      validation: {
        min: 1,
        max: 10000,
        message: 'Team size must be between 1 and 10,000'
      }
    },
    {
      id: 'manualProcesses',
      type: 'multiselect',
      label: 'Which processes are currently manual?',
      description: 'Select all that apply',
      required: true,
      options: [
        { label: 'Data Entry', value: 'data_entry' },
        { label: 'Document Processing', value: 'document_processing' },
        { label: 'Customer Onboarding', value: 'customer_onboarding' },
        { label: 'Reporting', value: 'reporting' },
        { label: 'Approvals', value: 'approvals' },
        { label: 'Compliance Checks', value: 'compliance' },
        { label: 'Data Validation', value: 'data_validation' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      id: 'marketingSpend',
      type: 'number',
      label: 'What is your monthly marketing spend?',
      description: 'Enter approximate amount in USD',
      required: true,
      placeholder: 'Enter amount',
      validation: {
        min: 0,
        message: 'Marketing spend must be a positive number'
      }
    },
    {
      id: 'customerVolume',
      type: 'number',
      label: 'How many new customers do you acquire monthly?',
      description: 'Enter average monthly customer acquisitions',
      required: true,
      placeholder: 'Enter number',
      validation: {
        min: 0,
        message: 'Customer volume must be a positive number'
      }
    },
    {
      id: 'toolStack',
      type: 'multiselect',
      label: 'Which tools do you currently use?',
      description: 'Select all that apply',
      required: true,
      options: [
        { label: 'CRM System', value: 'crm' },
        { label: 'Marketing Automation', value: 'marketing' },
        { label: 'Sales Tools', value: 'sales' },
        { label: 'Process Automation', value: 'automation' },
        { label: 'Analytics Platform', value: 'analytics' },
        { label: 'Spreadsheets', value: 'spreadsheets' },
        { label: 'Custom Software', value: 'custom' },
        { label: 'Other', value: 'other' }
      ]
    }
  ] as BaseQuestion[]
};