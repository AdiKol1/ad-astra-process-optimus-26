import { calculateResults } from '../assessment/calculations';
import { testScenarios } from './assessment-scenarios';
import { logger } from '../logger';
import { telemetry } from '../monitoring/telemetry';

interface TestResult {
  scenario: string;
  passed: boolean;
  actual: {
    savings: number;
    efficiency: number;
    roi: number;
  };
  expected: {
    minSavings: number;
    maxSavings: number;
    minEfficiency: number;
    minROI: number;
  };
  error?: string;
}

export const runAssessmentTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  for (const scenario of testScenarios) {
    try {
      logger.info(`Running test scenario: ${scenario.name}`);
      
      // Calculate results for the scenario
      const calculatedResults = await calculateResults(scenario.responses);
      
      // Validate results against expectations
      const passed = (
        calculatedResults.savings.annual >= scenario.expectedResults.minSavings &&
        calculatedResults.savings.annual <= scenario.expectedResults.maxSavings &&
        calculatedResults.metrics.efficiency >= scenario.expectedResults.minEfficiency &&
        calculatedResults.metrics.roi >= scenario.expectedResults.minROI
      );
      
      // Record test result
      const testResult: TestResult = {
        scenario: scenario.name,
        passed,
        actual: {
          savings: calculatedResults.savings.annual,
          efficiency: calculatedResults.metrics.efficiency,
          roi: calculatedResults.metrics.roi
        },
        expected: scenario.expectedResults
      };
      
      results.push(testResult);
      
      // Log results
      if (passed) {
        logger.info(`✅ Test passed for ${scenario.name}`, {
          metrics: testResult.actual
        });
        telemetry.track('assessment_test_passed', {
          scenario: scenario.name,
          metrics: testResult.actual
        });
      } else {
        logger.warn(`❌ Test failed for ${scenario.name}`, {
          expected: scenario.expectedResults,
          actual: testResult.actual
        });
        telemetry.track('assessment_test_failed', {
          scenario: scenario.name,
          expected: scenario.expectedResults,
          actual: testResult.actual
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error running test for ${scenario.name}:`, { error: errorMessage });
      
      results.push({
        scenario: scenario.name,
        passed: false,
        actual: { savings: 0, efficiency: 0, roi: 0 },
        expected: scenario.expectedResults,
        error: errorMessage
      });
      
      telemetry.track('assessment_test_error', {
        scenario: scenario.name,
        error: errorMessage
      });
    }
  }
  
  // Log overall results
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const passRate = (passedTests / totalTests) * 100;
  
  logger.info(`Assessment Test Results:`, {
    total: totalTests,
    passed: passedTests,
    failed: totalTests - passedTests,
    passRate: `${passRate.toFixed(1)}%`
  });
  
  telemetry.track('assessment_tests_completed', {
    totalTests,
    passedTests,
    passRate
  });
  
  return results;
}; 