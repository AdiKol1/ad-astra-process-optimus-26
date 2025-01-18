import { CoreQuestionSection } from '@/types/assessment/questions';

export const assessmentQuestions: CoreQuestionSection[] = [
  {
    id: 'section1',
    title: 'Basic Information',
    description: 'Let\'s start with some basic information',
    questions: [
      {
        id: 'name',
        text: 'What is your name?',
        type: 'text',
        required: true
      },
      {
        id: 'role',
        text: 'What is your role?',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'section2',
    title: 'Project Details',
    description: 'Tell us about your project',
    questions: [
      {
        id: 'projectName',
        text: 'What is your project name?',
        type: 'text',
        required: true
      },
      {
        id: 'projectType',
        text: 'What type of project is this?',
        type: 'multiple_choice',
        required: true,
        options: [
          { id: 'web', text: 'Web Application', value: 'web' },
          { id: 'mobile', text: 'Mobile Application', value: 'mobile' },
          { id: 'desktop', text: 'Desktop Application', value: 'desktop' }
        ]
      }
    ]
  }
];
