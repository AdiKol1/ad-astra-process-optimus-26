export const getVolumeMultiplier = (processVolume: string): number => {
  const multipliers: Record<string, number> = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  };
  return multipliers[processVolume] || 1;
};