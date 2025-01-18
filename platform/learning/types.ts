/**
 * Learning Platform Type Definitions
 */

export interface LearningPlatform {
  initialize(): Promise<void>;
  enrollUser(userId: string, trackId: string): Promise<void>;
  trackProgress(userId: string, activity: LearningActivity): Promise<void>;
  submitAssessment(userId: string, assessment: Assessment): Promise<Result>;
  generateReport(userId: string): Promise<LearningReport>;
}

export interface PlatformConfig {
  storage: StorageConfig;
  tracking: TrackingConfig;
  assessment: AssessmentConfig;
  integration: IntegrationConfig;
  analytics: AnalyticsConfig;
}

export interface StorageConfig {
  type: 'distributed' | 'centralized';
  providers: string[];
  caching: {
    strategy: 'adaptive' | 'fixed';
    ttl: number;
  };
}

export interface TrackingConfig {
  metrics: {
    completion: boolean;
    timeSpent: boolean;
    interaction: boolean;
    assessment: boolean;
  };
  persistence: {
    type: 'distributed' | 'centralized';
    replication: boolean;
    consistency: 'strong' | 'eventual';
  };
}

export interface AssessmentConfig {
  types: AssessmentType[];
  grading: {
    automatic: boolean;
    peer: boolean;
    mentor: boolean;
  };
  feedback: {
    immediate: boolean;
    detailed: boolean;
    actionable: boolean;
  };
}

export interface IntegrationConfig {
  github: {
    events: string[];
    actions: {
      trackProgress: boolean;
      updateStatus: boolean;
      notifyMentors: boolean;
    };
  };
  slack: {
    channels: {
      announcements: string;
      discussion: string;
      help: string;
    };
    notifications: {
      achievements: boolean;
      deadlines: boolean;
      mentorship: boolean;
    };
  };
  jira: {
    projects: string[];
    tracking: {
      progress: boolean;
      blockers: boolean;
      mentorship: boolean;
    };
  };
}

export interface AnalyticsConfig {
  metrics: {
    engagement: EngagementMetrics;
    performance: PerformanceMetrics;
    mentorship: MentorshipMetrics;
  };
  insights: {
    trends: boolean;
    recommendations: boolean;
    anomalies: boolean;
  };
}

export interface LearningActivity {
  type: ActivityType;
  moduleId: string;
  timestamp: Date;
  duration: number;
  progress: number;
  metadata: Record<string, any>;
}

export interface Assessment {
  id: string;
  type: AssessmentType;
  moduleId: string;
  userId: string;
  submission: any;
  timestamp: Date;
}

export interface Result {
  assessmentId: string;
  score: number;
  feedback: Feedback[];
  status: 'passed' | 'failed' | 'needs_review';
  metadata: Record<string, any>;
}

export interface LearningReport {
  progress: Progress;
  insights: LearningInsights;
  recommendations: Recommendation[];
}

export interface Progress {
  completed: string[];
  inProgress: string[];
  planned: string[];
  metrics: {
    completionRate: number;
    timeSpent: number;
    assessmentScores: number[];
  };
}

export interface LearningInsights {
  trends: Trend[];
  recommendations: Recommendation[];
  alerts: Alert[];
}

export interface Trend {
  metric: string;
  period: string;
  values: number[];
  analysis: string;
}

export interface Recommendation {
  type: 'content' | 'path' | 'mentor';
  priority: number;
  description: string;
  action: string;
}

export interface Alert {
  type: 'progress' | 'engagement' | 'performance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestions: string[];
}

export type ActivityType = 
  | 'content_view'
  | 'exercise_completion'
  | 'assessment_submission'
  | 'mentorship_session'
  | 'code_review'
  | 'project_work';

export type AssessmentType = 
  | 'quiz'
  | 'practical'
  | 'project'
  | 'peer_review'
  | 'mentor_review';

export interface Feedback {
  type: 'auto' | 'peer' | 'mentor';
  score: number;
  comments: string;
  suggestions: string[];
}

export interface EngagementMetrics {
  activeUsers: number;
  timeSpent: number;
  completionRate: number;
}

export interface PerformanceMetrics {
  assessmentScores: number[];
  projectSuccess: number;
  skillGrowth: number;
}

export interface MentorshipMetrics {
  sessionQuality: number;
  mentorActivity: number;
  menteeProgress: number;
}

export interface Resource {
  id: string;
  type: 'guide' | 'reference' | 'example' | 'exercise';
  format: 'text' | 'code' | 'video' | 'slides';
  content: any;
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    tags: string[];
  };
}

export interface Achievement {
  id: string;
  type: 'skill' | 'milestone' | 'contribution';
  title: string;
  description: string;
  points: number;
  metadata: Record<string, any>;
}

export interface LearningPath {
  modules: string[];
  milestones: string[];
  dependencies: Record<string, string[]>;
  estimated_duration: number;
  difficulty_curve: number[];
}
