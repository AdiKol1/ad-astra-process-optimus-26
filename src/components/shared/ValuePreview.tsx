import React from 'react';

interface ValuePreviewProps {
  label: string;
  value: string | number;
}

export const ValuePreview: React.FC<ValuePreviewProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-medium text-gray-900">{value}</div>
    </div>
  );
};