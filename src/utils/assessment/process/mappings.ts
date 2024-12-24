import type { 
  TimeRange, 
  ErrorRange, 
  VolumeRange, 
  ManualProcessType,
  RangeMapping 
} from '@/types/processAssessment';

export const TIME_RANGE_MAPPINGS: RangeMapping<TimeRange>[] = [
  { displayText: 'Less than 10 hours', value: 'LESS_THAN_10', numericalValue: 5 },
  { displayText: '10-20 hours', value: '10_TO_20', numericalValue: 15 },
  { displayText: '20-40 hours', value: '20_TO_40', numericalValue: 30 },
  { displayText: '40-60 hours', value: '40_TO_60', numericalValue: 50 },
  { displayText: 'More than 60 hours', value: 'MORE_THAN_60', numericalValue: 70 }
];

export const ERROR_RANGE_MAPPINGS: RangeMapping<ErrorRange>[] = [
  { displayText: 'Less than 1% errors', value: 'LESS_THAN_1', numericalValue: 0.005 },
  { displayText: '1-5% errors', value: '1_TO_5', numericalValue: 0.03 },
  { displayText: '5-10% errors', value: '5_TO_10', numericalValue: 0.075 },
  { displayText: 'More than 10% errors', value: 'MORE_THAN_10', numericalValue: 0.15 },
  { displayText: 'Not currently tracking errors', value: 'NOT_TRACKED', numericalValue: 0.05 }
];

export const VOLUME_RANGE_MAPPINGS: RangeMapping<VolumeRange>[] = [
  { displayText: 'Less than 100', value: 'LESS_THAN_100', numericalValue: 50 },
  { displayText: '100-500', value: '100_TO_500', numericalValue: 250 },
  { displayText: '500-1000', value: '500_TO_1000', numericalValue: 750 },
  { displayText: '1000-5000', value: '1000_TO_5000', numericalValue: 2500 },
  { displayText: 'More than 5000', value: 'MORE_THAN_5000', numericalValue: 7500 }
];

export const MANUAL_PROCESS_MAPPINGS: Record<ManualProcessType, string> = {
  DATA_ENTRY: 'Data Entry',
  DOCUMENT_PROCESSING: 'Document Processing',
  CUSTOMER_COMMUNICATION: 'Customer Communication',
  REPORTING: 'Reporting',
  INVOICE_PROCESSING: 'Invoice Processing',
  SCHEDULING: 'Scheduling',
  APPROVAL_WORKFLOWS: 'Approval Workflows',
  OTHER: 'Other'
};
