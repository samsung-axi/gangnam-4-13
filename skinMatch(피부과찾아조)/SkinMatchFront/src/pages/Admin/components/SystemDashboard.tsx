import React from 'react';
import { SystemStats, PerformanceMetrics } from '../types';
import { SystemStatusCards } from './SystemStatusCards';
import { PerformanceCharts } from './PerformanceCharts';
import { Typography } from '@/components/ui/theme-typography';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SystemDashboardProps {
  systemStats: SystemStats | null;
  performanceData: PerformanceMetrics[];
  performanceTimeRange: '1h' | '6h' | '24h' | '7d';
  setPerformanceTimeRange: (range: '1h' | '6h' | '24h' | '7d') => void;
}

export const SystemDashboard: React.FC<SystemDashboardProps> = ({
  systemStats,
  performanceData,
  performanceTimeRange,
  setPerformanceTimeRange
}) => {
  // 로딩 상태
  if (!systemStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <Typography variant="body" className="text-muted-foreground">
            시스템 데이터를 불러오는 중...
          </Typography>
        </div>
      </div>
    );
  }

  // 에러 상태 (systemStats가 있지만 비어있는 경우)
  if (systemStats && Object.keys(systemStats).length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <Typography variant="body" className="text-muted-foreground mb-2">
            시스템 데이터를 불러올 수 없습니다
          </Typography>
          <Typography variant="bodySmall" className="text-muted-foreground">
            잠시 후 다시 시도해주세요
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemStatusCards systemStats={systemStats} />
      <PerformanceCharts 
        performanceData={performanceData}
        performanceTimeRange={performanceTimeRange}
        setPerformanceTimeRange={setPerformanceTimeRange}
      />
    </div>
  );
};