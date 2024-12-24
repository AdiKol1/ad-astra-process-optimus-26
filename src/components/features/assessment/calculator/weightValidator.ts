export const validateWeights = (weights: Record<string, number>): boolean => {
  // Ensure all weights are numbers between 0 and 1
  const validWeights = Object.values(weights).every(
    weight => typeof weight === 'number' && weight >= 0 && weight <= 1
  );

  // Ensure weights sum to 1
  const weightSum = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const sumIsValid = Math.abs(weightSum - 1) < 0.0001; // Allow for floating point imprecision

  console.log('Weight validation:', { validWeights, weightSum, sumIsValid });
  
  return validWeights && sumIsValid;
};