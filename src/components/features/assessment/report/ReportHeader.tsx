import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessmentStore } from '@/stores/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import type { UserInfo } from '@/types/assessment/index';
import { ReportHeaderProps } from '../types';

interface ReportMetadata {
  generatedAt: string;
  reportId: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ userInfo }) => {
  const { responses, isLoading } = useAssessmentStore();

  React.useEffect(() => {
    if (responses?.userInfo) {
      telemetry.track('report_header_viewed', {
        hasUserInfo: true,
        timestamp: new Date().toISOString()
      });
    }
  }, [responses?.userInfo]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!responses?.userInfo) {
    logger.warn('No user info available for report header');
    return null;
  }

  const { name, email, company } = responses.userInfo as UserInfo;
  const metadata: ReportMetadata = {
    generatedAt: new Date().toISOString(),
    reportId: `PR-${Date.now().toString(36)}`
  };

  const HeaderContent = () => (
    <Card className="bg-space-light">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 
              className="text-xl font-semibold text-gold mb-4"
              id="report-title"
            >
              Process Audit Report
            </h2>
            <div 
              className="space-y-2"
              role="contentinfo"
              aria-label="Report recipient information"
            >
              <p className="text-sm text-gray-300">
                <span className="font-medium">Prepared for:</span> {name}
                {company && <span className="ml-1">at {company}</span>}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Contact:</span> {email}
              </p>
            </div>
          </div>
          <div 
            className="text-right text-xs text-gray-400"
            aria-label="Report metadata"
          >
            <p>Report ID: {metadata.reportId}</p>
            <p>Generated: {new Date(metadata.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary>
      <HeaderContent />
    </ErrorBoundary>
  );
};

ReportHeader.displayName = 'ReportHeader';