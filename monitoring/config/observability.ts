import { MetricsConfig, LogConfig, TracingConfig } from '@/types/monitoring';

export const metricsConfig: MetricsConfig = {
  collection: {
    interval: '10s',
    flushInterval: '30s',
    batchSize: 100,
    bufferSize: 1000
  },
  tags: {
    service: 'assessment-flow',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  },
  aggregations: {
    errorRate: {
      type: 'rate',
      window: '5m'
    },
    responseTime: {
      type: 'histogram',
      buckets: [100, 200, 500, 1000, 2000, 5000]
    },
    userSatisfaction: {
      type: 'gauge'
    }
  },
  retention: {
    raw: '7d',
    aggregated: '90d'
  }
};

export const logConfig: LogConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: 'json',
  correlation: {
    enabled: true,
    header: 'x-correlation-id'
  },
  sampling: {
    enabled: true,
    rate: 0.1
  },
  retention: {
    errorLogs: '30d',
    accessLogs: '7d',
    auditLogs: '365d'
  },
  scrubbing: {
    enabled: true,
    fields: ['password', 'token', 'apiKey']
  }
};

export const tracingConfig: TracingConfig = {
  sampling: {
    rate: 0.1,
    priority: {
      error: 1.0,
      slow: 0.5
    }
  },
  spans: {
    maxPerTrace: 1000,
    maxDuration: '5m'
  },
  correlation: {
    enabled: true,
    propagation: ['b3', 'w3c']
  },
  retention: '7d'
};

export const anomalyDetection = {
  algorithms: {
    errorSpike: {
      algorithm: 'ewma',
      sensitivity: 2,
      warmup: '1h'
    },
    performanceDegradation: {
      algorithm: 'percentile',
      baseline: '24h',
      threshold: 95
    },
    userBehavior: {
      algorithm: 'isolation_forest',
      features: ['stepTime', 'errorRate', 'satisfaction']
    }
  },
  training: {
    interval: '24h',
    minSamples: 1000,
    maxAge: '30d'
  }
};

export const alertRouting = {
  routes: [
    {
      severity: 1,
      channels: ['pagerduty', 'slack-critical'],
      escalation: {
        delay: '15m',
        levels: [
          { team: 'primary-oncall', timeout: '15m' },
          { team: 'secondary-oncall', timeout: '15m' },
          { team: 'engineering-manager', timeout: '30m' }
        ]
      }
    },
    {
      severity: 2,
      channels: ['slack-high'],
      escalation: {
        delay: '30m',
        levels: [
          { team: 'primary-oncall', timeout: '30m' },
          { team: 'engineering-manager', timeout: '1h' }
        ]
      }
    },
    {
      severity: 3,
      channels: ['slack-medium'],
      escalation: {
        delay: '1h',
        levels: [
          { team: 'primary-oncall', timeout: '4h' }
        ]
      }
    },
    {
      severity: 4,
      channels: ['slack-low'],
      escalation: {
        delay: '4h',
        levels: [
          { team: 'engineering', timeout: '1d' }
        ]
      }
    }
  ],
  defaults: {
    timezone: 'America/New_York',
    businessHours: {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  }
};

export const retentionPolicies = {
  metrics: {
    raw: '7d',
    minute: '30d',
    hour: '90d',
    day: '365d'
  },
  traces: {
    error: '30d',
    slow: '7d',
    normal: '3d'
  },
  logs: {
    error: '30d',
    application: '7d',
    audit: '365d'
  }
};

export const capacityPlanning = {
  metrics: {
    storage: {
      daily: '10GB',
      retention: '90d'
    },
    ingest: {
      rate: '1000/s',
      burst: '5000/s'
    }
  },
  traces: {
    storage: {
      daily: '50GB',
      retention: '7d'
    },
    ingest: {
      rate: '100/s',
      burst: '500/s'
    }
  },
  logs: {
    storage: {
      daily: '20GB',
      retention: '30d'
    },
    ingest: {
      rate: '500/s',
      burst: '2000/s'
    }
  }
};
