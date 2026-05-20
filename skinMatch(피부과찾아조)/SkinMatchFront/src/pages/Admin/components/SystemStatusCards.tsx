import React from 'react';
import { Typography } from '@/components/ui/theme-typography';
import { Server, Cpu, HardDrive, Database, Globe, Activity, Zap } from 'lucide-react';
import { SystemStats } from '../types';

interface SystemStatusCardsProps {
  systemStats: SystemStats;
}

export const SystemStatusCards: React.FC<SystemStatusCardsProps> = ({ systemStats }) => {
  // 상태 색상 결정
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'up':
        return 'text-green-600';
      case 'warning':
      case 'slow':
      case 'degraded':
        return 'text-yellow-600';
      case 'error':
      case 'disconnected':
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // 업타임 포맷팅
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}일 ${hours}시간`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  };

  // 파일 크기 포맷팅
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Server Status */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">서버 상태</Typography>
            <Server className={`w-5 h-5 ${getStatusColor(systemStats.serverStatus)}`} />
          </div>
          <Typography variant="h6" className={getStatusColor(systemStats.serverStatus)}>
            {systemStats.serverStatus === 'healthy' ? '정상' : systemStats.serverStatus === 'warning' ? '주의' : '오류'}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            업타임: {formatUptime(systemStats.uptime)}
          </Typography>
        </div>

        {/* CPU Usage */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">CPU 사용률</Typography>
            <Cpu className={`w-5 h-5 ${systemStats.cpuUsage > 80 ? 'text-red-500' : systemStats.cpuUsage > 60 ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <Typography variant="h6" className={systemStats.cpuUsage > 80 ? 'text-red-600' : systemStats.cpuUsage > 60 ? 'text-yellow-600' : 'text-green-600'}>
            {systemStats.cpuUsage.toFixed(1)}%
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            응답시간: {systemStats.apiResponseTime.average.toFixed(0)}ms
          </Typography>
        </div>

        {/* Memory Usage */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">메모리 사용량</Typography>
            <HardDrive className={`w-5 h-5 ${systemStats.memoryUsage.percentage > 80 ? 'text-red-500' : systemStats.memoryUsage.percentage > 60 ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <Typography variant="h6" className={systemStats.memoryUsage.percentage > 80 ? 'text-red-600' : systemStats.memoryUsage.percentage > 60 ? 'text-yellow-600' : 'text-green-600'}>
            {systemStats.memoryUsage.percentage.toFixed(1)}%
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            사용: {formatBytes(systemStats.memoryUsage.used)} / {formatBytes(systemStats.memoryUsage.total)}
          </Typography>
        </div>

        {/* Disk Usage */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">디스크 사용량</Typography>
            <Database className={`w-5 h-5 ${systemStats.diskUsage.percentage > 90 ? 'text-red-500' : systemStats.diskUsage.percentage > 75 ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <Typography variant="h6" className={systemStats.diskUsage.percentage > 90 ? 'text-red-600' : systemStats.diskUsage.percentage > 75 ? 'text-yellow-600' : 'text-green-600'}>
            {systemStats.diskUsage.percentage.toFixed(1)}%
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            사용: {formatBytes(systemStats.diskUsage.used)} / {formatBytes(systemStats.diskUsage.total)}
          </Typography>
        </div>
      </div>

      {/* Network and Application Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Database Status */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">DB 상태</Typography>
            <Database className={`w-5 h-5 ${getStatusColor(systemStats.databaseStatus)}`} />
          </div>
          <Typography variant="h6" className={getStatusColor(systemStats.databaseStatus)}>
            {systemStats.databaseStatus === 'connected' ? '연결됨' : systemStats.databaseStatus === 'slow' ? '느림' : '연결 끊김'}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            응답시간: {systemStats.databaseResponseTime.toFixed(0)}ms
          </Typography>
        </div>

        {/* Request Rate */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">요청 처리율</Typography>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <Typography variant="h6" className="text-green-600">
            {systemStats.requestsPerMinute.toFixed(0)}/분
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            총 요청: {systemStats.totalRequests.toLocaleString()}
          </Typography>
        </div>

        {/* Error Rate */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">에러율</Typography>
            <Zap className={`w-5 h-5 ${systemStats.errorRate > 5 ? 'text-red-500' : systemStats.errorRate > 1 ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <Typography variant="h6" className={systemStats.errorRate > 5 ? 'text-red-600' : systemStats.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'}>
            {systemStats.errorRate.toFixed(2)}%
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            활성 연결: {systemStats.activeConnections}
          </Typography>
        </div>

        {/* API Performance */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="bodySmall" className="font-medium">API 성능</Typography>
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <Typography variant="h6" className="text-blue-600">
            {systemStats.apiResponseTime.average.toFixed(0)}ms
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            P95: {systemStats.apiResponseTime.p95.toFixed(0)}ms
          </Typography>
        </div>
      </div>
    </>
  );
};