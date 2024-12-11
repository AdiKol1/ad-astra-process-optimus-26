import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportHeaderProps {
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ userInfo }) => {
  if (!userInfo) return null;

  return (
    <Card className="bg-space-light">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gold mb-4">Process Audit Report</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Prepared for: {userInfo.name}</p>
          <p className="text-sm text-gray-300">Contact: {userInfo.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};