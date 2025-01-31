/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_MODE: 'development' | 'staging' | 'production'
  readonly VITE_API_URL: string

  // Security
  readonly VITE_SECRET_KEY: string

  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string

  // Monitoring
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SEGMENT_WRITE_KEY?: string
  readonly VITE_DD_APPLICATION_ID?: string
  readonly VITE_DD_CLIENT_TOKEN?: string

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_MONITORING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Environment utilities
declare module '@/utils/env' {
  export function getEnvVar(key: keyof ImportMetaEnv): string
  export function isProduction(): boolean
  export function isDevelopment(): boolean
  export function isStaging(): boolean
  export function isAnalyticsEnabled(): boolean
  export function isErrorMonitoringEnabled(): boolean
}
