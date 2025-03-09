import { migrationManager } from './migrationManager';
import { migrateV1_0_to_V1_1 } from './v1_0_to_v1_1';
import { migrateV1_1_to_V2_0 } from './v1_1_to_v2_0';
import { logger } from '@/utils/logger';

export async function runMigrations() {
  try {
    // Register migrations in order
    migrationManager.registerMigration(
      '1.1.0',
      'Add section scores and automation potential',
      migrateV1_0_to_V1_1
    );

    migrationManager.registerMigration(
      '2.0.0',
      'Add AI suggestions and industry benchmarks',
      migrateV1_1_to_V2_0
    );

    // Run all pending migrations
    const results = await migrationManager.runPendingMigrations();

    // Log results
    results.forEach((result, index) => {
      if (result.success) {
        logger.info(`Migration ${index + 1} completed successfully`, {
          recordsProcessed: result.details?.recordsProcessed,
          recordsSkipped: result.details?.recordsSkipped,
        });

        if (result.details?.warnings.length) {
          logger.warn('Migration warnings:', result.details.warnings);
        }
      } else {
        logger.error(`Migration ${index + 1} failed:`, { error: result.error });
      }
    });

    return results;
  } catch (error) {
    logger.error('Failed to run migrations:', { error });
    throw error;
  }
}

// Add a CLI command for running migrations
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
