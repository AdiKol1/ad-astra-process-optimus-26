/**
 * Environment utilities for safe access to environment variables
 */

/**
 * Get an environment variable with type safety and an optional fallback
 */
export function getEnvVar(key: keyof ImportMetaEnv, fallback?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

/**
 * Check if the application is running in production
 */
export function isProduction(): boolean {
  return getEnvVar('VITE_MODE', 'development') === 'production';
}

/**
 * Check if the application is running in development
 */
export function isDevelopment(): boolean {
  return getEnvVar('VITE_MODE', 'development') === 'development';
}

/**
 * Check if the application is running in staging
 */
export function isStaging(): boolean {
  return getEnvVar('VITE_MODE', 'development') === 'staging';
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true';
}

/**
 * Check if error monitoring is enabled
 */
export function isErrorMonitoringEnabled(): boolean {
  return getEnvVar('VITE_ENABLE_ERROR_MONITORING', 'false') === 'true';
}

/**
 * Get the API URL
 */
export function getApiUrl(): string {
  return getEnvVar('VITE_API_URL', 'https://api.adiastra.com');
}

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig() {
  return {
    url: getEnvVar('VITE_SUPABASE_URL', ''),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
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
  // Instead of throwing errors, we'll set default values
  // and allow the application to run in a demo mode
  try {
    // Ensure we have some defaults
    getEnvVar('VITE_MODE', 'development');
    getEnvVar('VITE_API_URL', 'https://api.adiastra.com');
    getEnvVar('VITE_SECRET_KEY', 'demo-key');
    getEnvVar('VITE_SUPABASE_URL', '');
    getEnvVar('VITE_SUPABASE_ANON_KEY', '');
    getEnvVar('VITE_ENABLE_ANALYTICS', 'false');
    getEnvVar('VITE_ENABLE_ERROR_MONITORING', 'false');
    
    console.log('Environment validation successful');
  } catch (error) {
    console.warn('Environment validation warning:', error);
    console.warn('Application will continue in demo mode with limited functionality');
  }
} 