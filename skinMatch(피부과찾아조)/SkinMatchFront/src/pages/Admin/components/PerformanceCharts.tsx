import React from 'react';
import { Typography } from '@/components/ui/theme-typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { PerformanceMetrics } from '../types';
import { AlertCircle } from 'lucide-react';

interface PerformanceChartsProps {
  performanceData: PerformanceMetrics[];
  performanceTimeRange: '1h' | '6h' | '24h' | '7d';
  setPerformanceTimeRange: (range: '1h' | '6h' | '24h' | '7d') => void;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  performanceData,
  performanceTimeRange,
  setPerformanceTimeRange
}) => {
  // 데이터가 없는 경우 처리
  const hasData = performanceData && performanceData.length > 0;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Time Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="bodyLarge" className="font-medium">API 응답시간</Typography>
          <Select value={performanceTimeRange} onValueChange={(value: any) => setPerformanceTimeRange(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1시간</SelectItem>
              <SelectItem value="6h">6시간</SelectItem>
              <SelectItem value="24h">24시간</SelectItem>
              <SelectItem value="7d">7일</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => {
                    try {
                      return format(new Date(value), 'HH:mm');
                    } catch {
                      return value;
                    }
                  }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip 
                  labelFormatter={(value) => {
                    try {
                      return format(new Date(value), 'MM/dd HH:mm');
                    } catch {
                      return value;
                    }
                  }}
                  formatter={(value: any) => [`${Number(value).toFixed(0)}ms`, '응답시간']}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <Typography variant="bodySmall" className="text-muted-foreground">
                  성능 데이터를 불러오는 중...
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Resources Chart */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <Typography variant="bodyLarge" className="font-medium mb-4">시스템 리소스</Typography>
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => {
                    try {
                      return format(new Date(value), 'HH:mm');
                    } catch {
                      return value;
                    }
                  }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                  domain={[0, 100]}
                />
                <Tooltip 
                  labelFormatter={(value) => {
                    try {
                      return format(new Date(value), 'MM/dd HH:mm');
                    } catch {
                      return value;
                    }
                  }}
                  formatter={(value: any, name: string) => [
                    `${Number(value).toFixed(1)}%`, 
                    name === 'cpuUsage' ? 'CPU' : 'Memory'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="cpuUsage"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="memoryUsage"
                  stackId="2"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <Typography variant="bodySmall" className="text-muted-foreground">
                  리소스 데이터를 불러오는 중...
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};