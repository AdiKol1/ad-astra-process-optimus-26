import { supabase } from '@/integrations/supabase/client';
import { MigrationResult } from './types';
import { logger } from '@/utils/logger';

export async function migrateV1_1_to_V2_0(): Promise<MigrationResult> {
  const warnings: string[] = [];
  let recordsProcessed = 0;
  let recordsSkipped = 0;

  try {
    // Fetch all v1.1 assessments
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('version', '1.1');

    if (error) {
      throw error;
    }

    for (const assessment of assessments || []) {
      try {
        // Generate AI suggestions based on assessment data
        const aiSuggestions = await generateAISuggestions(assessment);
        
        // Calculate industry benchmarks
        const industryBenchmarks = await calculateIndustryBenchmarks(assessment);

        // Update assessment with new fields
        const { error: updateError } = await supabase
          .from('assessments')
          .update({
            version: '2.0',
            aiSuggestions,
            industryBenchmarks,
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
    logger.error('Migration v1.1 to v2.0 failed:', error);
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

async function generateAISuggestions(assessment: any): Promise<string[]> {
  try {
    // Call the AI completion endpoint
    const response = await fetch('/api/functions/v1/chat-completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Generate improvement suggestions based on the assessment data.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              scores: assessment.sectionScores,
              automation: assessment.automationPotential,
              industry: assessment.industry,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI suggestions');
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    logger.error('Error generating AI suggestions:', error);
    return [];
  }
}

async function calculateIndustryBenchmarks(assessment: any) {
  try {
    // Fetch industry averages
    const { data: industryData, error } = await supabase
      .from('industry_benchmarks')
      .select('*')
      .eq('industry', assessment.industry)
      .single();

    if (error) {
      throw error;
    }

    return {
      efficiency: industryData.efficiency_score || 0,
      costs: industryData.cost_efficiency || 0,
      automation: industryData.automation_level || 0,
    };
  } catch (error) {
    logger.error('Error calculating industry benchmarks:', error);
    return {
      efficiency: 0,
      costs: 0,
      automation: 0,
    };
  }
}
