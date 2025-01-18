import { supabase } from '@/integrations/supabase/client';
import { MigrationResult } from './types';
import { logger } from '@/utils/logger';

export async function migrateV1_0_to_V1_1(): Promise<MigrationResult> {
  const warnings: string[] = [];
  let recordsProcessed = 0;
  let recordsSkipped = 0;

  try {
    // Fetch all assessments
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('version', '1.0');

    if (error) {
      throw error;
    }

    for (const assessment of assessments || []) {
      try {
        // Calculate new fields
        const sectionScores = calculateSectionScores(assessment);
        const automationPotential = calculateAutomationPotential(assessment);

        // Update assessment with new fields
        const { error: updateError } = await supabase
          .from('assessments')
          .update({
            version: '1.1',
            sectionScores,
            automationPotential,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', assessment.id);

        if (updateError) {
          warnings.push(`Failed to update assessment ${assessment.id}: ${updateError.message}`);
          recordsSkipped++;
          continue;
        }

        recordsProcessed++;
      } catch (error) {
        warnings.push(`Error processing assessment ${assessment.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        recordsSkipped++;
      }
    }

    return {
      success: true,
      details: {
        recordsProcessed,
        recordsSkipped,
        warnings,
      },
    };
  } catch (error) {
    logger.error('Migration v1.0 to v1.1 failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during migration',
      details: {
        recordsProcessed,
        recordsSkipped,
        warnings,
      },
    };
  }
}

function calculateSectionScores(assessment: any) {
  // Implementation of section score calculation
  const sections = {
    process: 0,
    technology: 0,
    people: 0,
  };

  // Calculate process score
  if (assessment.processEfficiency) {
    sections.process = assessment.processEfficiency * 0.4 +
                      (assessment.processStandardization || 0) * 0.3 +
                      (assessment.processDocumentation || 0) * 0.3;
  }

  // Calculate technology score
  if (assessment.technologyAdoption) {
    sections.technology = assessment.technologyAdoption * 0.5 +
                         (assessment.systemIntegration || 0) * 0.3 +
                         (assessment.dataQuality || 0) * 0.2;
  }

  // Calculate people score
  if (assessment.teamCapability) {
    sections.people = assessment.teamCapability * 0.4 +
                     (assessment.changeReadiness || 0) * 0.3 +
                     (assessment.skillGaps || 0) * 0.3;
  }

  return sections;
}

function calculateAutomationPotential(assessment: any) {
  // Calculate automation potential based on assessment metrics
  const weights = {
    processComplexity: 0.3,
    dataStructure: 0.25,
    volumeFrequency: 0.25,
    errorRates: 0.2,
  };

  let potential = 0;
  let applicableWeights = 0;

  for (const [metric, weight] of Object.entries(weights)) {
    if (assessment[metric] !== undefined && assessment[metric] !== null) {
      potential += assessment[metric] * weight;
      applicableWeights += weight;
    }
  }

  // Normalize the score if not all metrics are present
  return applicableWeights > 0 ? potential / applicableWeights : 0;
}
