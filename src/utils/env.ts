/**
 * Environment utilities for safe access to environment variables
 */

/**
 * Get an environment variable with type safety
 */
export function getEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

/**
 * Check if the application is running in production
 */
export function isProduction(): boolean {
  return getEnvVar('VITE_MODE') === 'production';
}

/**
 * Check if the application is running in development
 */
export function isDevelopment(): boolean {
  return getEnvVar('VITE_MODE') === 'development';
}

/**
 * Check if the application is running in staging
 */
export function isStaging(): boolean {
  return getEnvVar('VITE_MODE') === 'staging';
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return getEnvVar('VITE_ENABLE_ANALYTICS') === 'true';
}

/**
 * Check if error monitoring is enabled
 */
export function isErrorMonitoringEnabled(): boolean {
  return getEnvVar('VITE_ENABLE_ERROR_MONITORING') === 'true';
}

/**
 * Get the API URL
 */
export function getApiUrl(): string {
  return getEnvVar('VITE_API_URL');
}

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig() {
  return {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  };
}

/**
 * Get monitoring configuration
 */
export function getMonitoringConfig() {
  return {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    segmentWriteKey: import.meta.env.VITE_SEGMENT_WRITE_KEY,
    datadogAppId: import.meta.env.VITE_DD_APPLICATION_ID,
    datadogClientToken: import.meta.env.VITE_DD_CLIENT_TOKEN,
  };
}

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required: (keyof ImportMetaEnv)[] = [
    'VITE_MODE',
    'VITE_API_URL',
    'VITE_SECRET_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_ENABLE_ANALYTICS',
    'VITE_ENABLE_ERROR_MONITORING'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
} 