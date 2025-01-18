import { supabase } from '@/integrations/supabase/client';
import { MigrationMetadata, MigrationResult } from './types';
import { logger } from '@/utils/logger';

class MigrationManager {
  private migrations: Map<string, () => Promise<MigrationResult>> = new Map();
  private readonly tableName = 'migrations';

  constructor() {
    this.initializeMigrationsTable();
  }

  private async initializeMigrationsTable() {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .select('version')
        .limit(1);

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        await supabase.rpc('create_migrations_table');
      }
    } catch (error) {
      logger.error('Failed to initialize migrations table:', error);
      throw error;
    }
  }

  registerMigration(version: string, description: string, migrationFn: () => Promise<MigrationResult>) {
    if (this.migrations.has(version)) {
      throw new Error(`Migration version ${version} already registered`);
    }
    this.migrations.set(version, migrationFn);
    logger.info(`Registered migration: ${version} - ${description}`);
  }

  async getAppliedMigrations(): Promise<MigrationMetadata[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      logger.error('Failed to fetch applied migrations:', error);
      throw error;
    }

    return data || [];
  }

  async applyMigration(version: string): Promise<MigrationResult> {
    const migrationFn = this.migrations.get(version);
    if (!migrationFn) {
      throw new Error(`Migration version ${version} not found`);
    }

    try {
      logger.info(`Starting migration ${version}`);
      const result = await migrationFn();

      if (result.success) {
        await this.recordMigration(version);
        logger.info(`Successfully completed migration ${version}`);
      } else {
        logger.error(`Migration ${version} failed:`, result.error);
      }

      return result;
    } catch (error) {
      logger.error(`Error during migration ${version}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during migration',
      };
    }
  }

  private async recordMigration(version: string) {
    const metadata: MigrationMetadata = {
      version,
      timestamp: new Date().toISOString(),
      description: 'Migration applied successfully',
      applied: true,
    };

    const { error } = await supabase
      .from(this.tableName)
      .insert([metadata]);

    if (error) {
      logger.error('Failed to record migration:', error);
      throw error;
    }
  }

  async runPendingMigrations(): Promise<MigrationResult[]> {
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));
    const results: MigrationResult[] = [];

    for (const [version, _] of this.migrations) {
      if (!appliedVersions.has(version)) {
        const result = await this.applyMigration(version);
        results.push(result);

        if (!result.success) {
          logger.error(`Migration chain stopped at version ${version} due to error`);
          break;
        }
      }
    }

    return results;
  }
}

export const migrationManager = new MigrationManager();
