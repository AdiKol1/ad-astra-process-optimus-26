export const TIME_RANGE_MAPPINGS = [
  { value: 'Less than 1 hour', numeric: 0.5 },
  { value: '1-2 hours', numeric: 1.5 },
  { value: '2-4 hours', numeric: 3 },
  { value: '4-8 hours', numeric: 6 },
  { value: 'More than 8 hours', numeric: 10 }
] as const;

export const ERROR_RANGE_MAPPINGS = [
  { value: 'Less than 1%', numeric: 0.005 },
  { value: '1-2%', numeric: 0.015 },
  { value: '2-5%', numeric: 0.035 },
  { value: '5-10%', numeric: 0.075 },
  { value: 'More than 10%', numeric: 0.15 }
] as const;

export const VOLUME_RANGE_MAPPINGS = [
  { value: 'Less than 100', numeric: 50 },
  { value: '100-500', numeric: 300 },
  { value: '501-1000', numeric: 750 },
  { value: '1001-5000', numeric: 3000 },
  { value: 'More than 5000', numeric: 7500 }
] as const;

export type TimeRange = typeof TIME_RANGE_MAPPINGS[number]['value'];
export type ErrorRange = typeof ERROR_RANGE_MAPPINGS[number]['value'];
export type VolumeRange = typeof VOLUME_RANGE_MAPPINGS[number]['value']; 