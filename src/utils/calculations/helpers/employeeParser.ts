export const parseEmployeeCount = (employeeString: string | undefined): number => {
  console.log('Parsing employee count from:', employeeString);
  
  if (!employeeString) {
    console.log('No employee string provided, defaulting to 1');
    return 1;
  }

  // Handle formats like "6-20 employees"
  if (typeof employeeString === 'string') {
    const match = employeeString.match(/(\d+)(?:-(\d+))?\s*employees?/);
    if (match) {
      // If range (e.g., "6-20"), take the average
      if (match[2]) {
        return Math.round((Number(match[1]) + Number(match[2])) / 2);
      }
      // Single number
      return Number(match[1]);
    }
    
    // Try parsing just the number
    const numberMatch = employeeString.match(/\d+/);
    if (numberMatch) {
      return Number(numberMatch[0]);
    }
  }

  // Default to 1 if we can't parse
  console.log('Could not parse employee count, defaulting to 1');
  return 1;
};