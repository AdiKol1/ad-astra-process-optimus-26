import type { AssessmentResponses } from '@/types/assessment/index';

export const testScenarios: Array<{
  name: string;
  description: string;
  responses: AssessmentResponses;
  expectedResults: {
    minSavings: number;
    maxSavings: number;
    minEfficiency: number;
    minROI: number;
  };
}> = [
  {
    name: 'Small Marketing Agency',
    description: 'Digital marketing agency with manual campaign management',
    responses: {
      timeSpent: '20',
      processVolume: '50',
      errorRate: '15',
      complexity: '3',
      processDocumentation: true,
      digitalTools: true,
      standardization: false,
      integration: false,
      marketingBudget: '10000',
      automationLevel: '25',
      toolStack: ['Google Ads', 'Facebook Ads', 'Excel'],
      metricsTracking: ['campaign performance', 'client satisfaction', 'team productivity'],
      userInfo: {
        industry: 'Marketing',
        company: 'Digital Marketing Co'
      }
    },
    expectedResults: {
      minSavings: 15000,
      maxSavings: 25000,
      minEfficiency: 30,
      minROI: 150
    }
  },
  {
    name: 'Large E-commerce Operation',
    description: 'High-volume order processing and inventory management',
    responses: {
      timeSpent: '40',
      processVolume: '500',
      errorRate: '8',
      complexity: '4',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: false,
      marketingBudget: '50000',
      automationLevel: '45',
      toolStack: ['Shopify', 'Excel', 'QuickBooks'],
      metricsTracking: ['order volume', 'processing time', 'error rates'],
      userInfo: {
        industry: 'E-commerce',
        company: 'Global Shop'
      }
    },
    expectedResults: {
      minSavings: 50000,
      maxSavings: 75000,
      minEfficiency: 45,
      minROI: 200
    }
  },
  {
    name: 'Healthcare Provider',
    description: 'Patient records and appointment management',
    responses: {
      timeSpent: '35',
      processVolume: '200',
      errorRate: '5',
      complexity: '5',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: true,
      marketingBudget: '20000',
      automationLevel: '60',
      toolStack: ['Epic', 'Microsoft Office', 'Practice Management System'],
      metricsTracking: ['patient satisfaction', 'appointment efficiency', 'documentation accuracy'],
      userInfo: {
        industry: 'Healthcare',
        company: 'Health Plus'
      }
    },
    expectedResults: {
      minSavings: 40000,
      maxSavings: 60000,
      minEfficiency: 60,
      minROI: 180
    }
  },
  {
    name: 'Small Manufacturing Company',
    description: 'Production planning and quality control',
    responses: {
      timeSpent: '30',
      processVolume: '100',
      errorRate: '12',
      complexity: '4',
      processDocumentation: false,
      digitalTools: true,
      standardization: false,
      integration: false,
      marketingBudget: '15000',
      automationLevel: '35',
      toolStack: ['Excel', 'Legacy ERP', 'Quality Management System'],
      metricsTracking: ['production efficiency', 'quality metrics', 'inventory turnover'],
      userInfo: {
        industry: 'Manufacturing',
        company: 'Quality Products Inc'
      }
    },
    expectedResults: {
      minSavings: 35000,
      maxSavings: 55000,
      minEfficiency: 35,
      minROI: 160
    }
  },
  {
    name: 'Financial Services Firm',
    description: 'Client onboarding and compliance checks',
    responses: {
      timeSpent: '25',
      processVolume: '75',
      errorRate: '3',
      complexity: '5',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: true,
      marketingBudget: '30000',
      automationLevel: '55',
      toolStack: ['Salesforce', 'Compliance Software', 'Document Management System'],
      metricsTracking: ['client satisfaction', 'compliance accuracy', 'processing time'],
      userInfo: {
        industry: 'Financial Services',
        company: 'Wealth Management Pro'
      }
    },
    expectedResults: {
      minSavings: 45000,
      maxSavings: 65000,
      minEfficiency: 55,
      minROI: 190
    }
  },
  {
    name: 'Real Estate Agency',
    description: 'Property listing and client management',
    responses: {
      timeSpent: '15',
      processVolume: '30',
      errorRate: '10',
      complexity: '2',
      processDocumentation: false,
      digitalTools: true,
      standardization: false,
      integration: false,
      marketingBudget: '25000',
      automationLevel: '25',
      toolStack: ['MLS', 'Excel', 'Email Marketing Tool'],
      metricsTracking: ['lead conversion', 'showing efficiency', 'client follow-up'],
      userInfo: {
        industry: 'Real Estate',
        company: 'Prime Properties'
      }
    },
    expectedResults: {
      minSavings: 20000,
      maxSavings: 35000,
      minEfficiency: 25,
      minROI: 140
    }
  },
  {
    name: 'Legal Practice',
    description: 'Case management and document processing',
    responses: {
      timeSpent: '45',
      processVolume: '150',
      errorRate: '4',
      complexity: '5',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: false,
      marketingBudget: '35000',
      automationLevel: '50',
      toolStack: ['Legal Case Management', 'Document Management', 'Time Tracking'],
      metricsTracking: ['case efficiency', 'billing accuracy', 'document processing time'],
      userInfo: {
        industry: 'Legal',
        company: 'Legal Solutions LLC'
      }
    },
    expectedResults: {
      minSavings: 55000,
      maxSavings: 75000,
      minEfficiency: 50,
      minROI: 185
    }
  },
  {
    name: 'Educational Institution',
    description: 'Student enrollment and course management',
    responses: {
      timeSpent: '35',
      processVolume: '300',
      errorRate: '7',
      complexity: '3',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: true,
      marketingBudget: '40000',
      automationLevel: '45',
      toolStack: ['Student Information System', 'Learning Management System', 'Microsoft Office'],
      metricsTracking: ['enrollment efficiency', 'student satisfaction', 'administrative time'],
      userInfo: {
        industry: 'Education',
        company: 'Learning Academy'
      }
    },
    expectedResults: {
      minSavings: 40000,
      maxSavings: 60000,
      minEfficiency: 45,
      minROI: 170
    }
  },
  {
    name: 'Logistics Company',
    description: 'Shipment tracking and route optimization',
    responses: {
      timeSpent: '50',
      processVolume: '1000',
      errorRate: '6',
      complexity: '4',
      processDocumentation: true,
      digitalTools: true,
      standardization: true,
      integration: true,
      marketingBudget: '45000',
      automationLevel: '65',
      toolStack: ['TMS', 'Route Optimization', 'Warehouse Management'],
      metricsTracking: ['delivery time', 'fuel efficiency', 'vehicle utilization'],
      userInfo: {
        industry: 'Logistics',
        company: 'Fast Freight Inc'
      }
    },
    expectedResults: {
      minSavings: 60000,
      maxSavings: 80000,
      minEfficiency: 65,
      minROI: 200
    }
  }
]; 