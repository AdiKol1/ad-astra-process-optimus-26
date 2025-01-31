import { AssessmentState, AssessmentStep } from '../../types/assessment/state';
import { logger } from '../logger';
import { telemetry } from '../monitoring/telemetry';
import { createPerformanceMonitor } from '../monitoring/performance';

const performanceMonitor = createPerformanceMonitor('AssessmentMigrations');

interface MigrationResult {
  success: boolean;
  state: AssessmentState;
  error?: Error;
}

type MigrationFn = (state: AssessmentState) => AssessmentState;

const migrations: Record<number, MigrationFn> = {
  // Migration from version 1 to 2
  2: (state: AssessmentState): AssessmentState => {
    // Example migration: Add new metadata fields
    return {
      ...state,
      metadata: {
        ...state.metadata,
        version: '2.0.0',
        migrationDate: new Date().toISOString(),
        previousVersion: state.metadata.version
      }
    };
  },
  
  // Migration from version 2 to 3
  3: (state: AssessmentState): AssessmentState => {
    // Example migration: Update step structure
    return {
      ...state,
      metadata: {
        ...state.metadata,
        version: '3.0.0',
        migrationDate: new Date().toISOString(),
        previousVersion: state.metadata.version
      },
      // Add any new required fields or transform existing ones
      stepHistory: state.stepHistory || ['initial']
    };
  }
};

export const migrateState = (state: AssessmentState, targetVersion: number): MigrationResult => {
  const mark = performanceMonitor.start('migrate_state');
  
  try {
    // Get current version from state
    const currentVersion = parseInt(state.metadata.version.split('.')[0]);
    
    if (currentVersion >= targetVersion) {
      return { success: true, state };
    }

    logger.info('Starting state migration', {
      component: 'AssessmentMigrations',
      fromVersion: currentVersion,
      toVersion: targetVersion
    });

    // Apply migrations in sequence
    let migratedState = { ...state };
    
    for (let version = currentVersion + 1; version <= targetVersion; version++) {
      const migration = migrations[version];
      
      if (!migration) {
        throw new Error(`No migration found for version ${version}`);
      }

      const migrationMark = performanceMonitor.start(`migrate_to_v${version}`);
      
      try {
        migratedState = migration(migratedState);
        
        logger.info(`Migration to version ${version} successful`, {
          component: 'AssessmentMigrations'
        });
        
        telemetry.track('state_migration_success', {
          fromVersion: version - 1,
          toVersion: version
        });
        
      } catch (error) {
        logger.error(`Migration to version ${version} failed`, {
          component: 'AssessmentMigrations',
          error
        });
        
        telemetry.track('state_migration_failed', {
          fromVersion: version - 1,
          toVersion: version,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        throw error;
      } finally {
        performanceMonitor.end(migrationMark);
      }
    }

    return { 
      success: true, 
      state: migratedState 
    };
    
  } catch (error) {
    logger.error('State migration failed', {
      component: 'AssessmentMigrations',
      error
    });
    
    return { 
      success: false, 
      state,
      error: error instanceof Error ? error : new Error('Unknown migration error')
    };
  } finally {
    performanceMonitor.end(mark);
  }
};
