import React from 'react';
import { Typography } from '@/components/ui/theme-typography';
import { RefreshCw } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <Typography variant="body" className="text-muted-foreground">
          관리자 데이터를 불러오는 중...
        </Typography>
      </div>
    </div>
  );
};