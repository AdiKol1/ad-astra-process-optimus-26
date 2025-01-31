import { runAssessmentTests } from '../utils/testing/run-assessment-tests';
import { logger } from '../utils/logger';

const main = async () => {
  try {
    logger.info('Starting assessment tests...');
    
    const results = await runAssessmentTests();
    
    // Print detailed results
    console.log('\nDetailed Test Results:');
    console.log('=====================');
    
    results.forEach((result) => {
      console.log(`\nScenario: ${result.scenario}`);
      console.log('-------------------');
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
      } else {
        console.log(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log('\nActual Results:');
        console.log(`- Annual Savings: $${result.actual.savings.toLocaleString()}`);
        console.log(`- Efficiency: ${result.actual.efficiency}%`);
        console.log(`- ROI: ${result.actual.roi}%`);
        
        console.log('\nExpected Results:');
        console.log(`- Min Savings: $${result.expected.minSavings.toLocaleString()}`);
        console.log(`- Max Savings: $${result.expected.maxSavings.toLocaleString()}`);
        console.log(`- Min Efficiency: ${result.expected.minEfficiency}%`);
        console.log(`- Min ROI: ${result.expected.minROI}%`);
      }
    });
    
    // Print summary
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const passRate = (passedTests / totalTests) * 100;
    
    console.log('\nTest Summary:');
    console.log('=============');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Pass Rate: ${passRate.toFixed(1)}%`);
    
    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to run assessment tests:', { error: errorMessage });
    process.exit(1);
  }
};

// Run the tests
main(); 