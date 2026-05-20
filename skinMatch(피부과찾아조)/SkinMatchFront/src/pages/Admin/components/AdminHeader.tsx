import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Server, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  showSystemDashboard: boolean;
  setShowSystemDashboard: (show: boolean) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  showSystemDashboard,
  setShowSystemDashboard,
  refreshing,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Typography variant="h3">관리자 페이지</Typography>
        <Typography variant="body" className="text-muted-foreground">
          회원 관리 및 시스템 운영
        </Typography>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant={showSystemDashboard ? "default" : "outline"}
          size="sm"
          onClick={() => setShowSystemDashboard(!showSystemDashboard)}
        >
          <Server className="w-4 h-4 mr-2" />
          {showSystemDashboard ? '사용자 관리' : '시스템 모니터링'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
        
        <div className="bg-primary/10 px-3 py-1 rounded-full">
          <Typography variant="caption" className="text-primary font-medium">
            Admin
          </Typography>
        </div>
      </div>
    </div>
  );
};