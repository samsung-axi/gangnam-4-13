import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { logger } from '@/utils/logger';
import { AdminStats, SystemStats, PerformanceMetrics } from '../types';

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSystemDashboard, setShowSystemDashboard] = useState(false);
  const [performanceTimeRange, setPerformanceTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');

  // 초기 로드 추적
  const initialLoadRef = useRef(false);

  const { toast } = useToast();

  // 통계 정보 로드
  const loadStats = useCallback(async () => {
    try {
      const statsData = await adminService.getAdminStats();
      setStats(statsData);
    } catch (error: any) {
      logger.error('통계 정보 로드 실패', error);
      
      // 404나 401 에러의 경우 API가 아직 구현되지 않았을 수 있음
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast({
          title: "API 준비 중",
          description: "관리자 API가 아직 준비되지 않았습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "오류",
          description: "통계 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // 시스템 통계 로드
  const loadSystemStats = useCallback(async () => {
    try {
      const systemData = await adminService.getSystemStats();
      setSystemStats(systemData);
    } catch (error: any) {
      logger.error('시스템 통계 로드 실패', error);
      
      // 404나 401 에러의 경우 API가 아직 구현되지 않았을 수 있음
      if (error.response?.status === 404 || error.response?.status === 401) {
        // 시스템 모니터링 API가 없는 경우 조용히 넘어감
        logger.info('시스템 모니터링 API가 아직 구현되지 않음');
      } else {
        toast({
          title: "오류",
          description: "시스템 통계를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // 성능 메트릭 로드
  const loadPerformanceData = useCallback(async () => {
    try {
      const performanceMetrics = await adminService.getPerformanceMetrics({
        timeRange: performanceTimeRange,
        granularity: performanceTimeRange === '1h' ? '1m' : performanceTimeRange === '6h' ? '5m' : '1h'
      });
      setPerformanceData(performanceMetrics);
    } catch (error: any) {
      logger.error('성능 메트릭 로드 실패', error);
      
      // 404나 401 에러의 경우 API가 아직 구현되지 않았을 수 있음
      if (error.response?.status === 404 || error.response?.status === 401) {
        // 성능 모니터링 API가 없는 경우 조용히 넘어감
        logger.info('성능 모니터링 API가 아직 구현되지 않음');
      } else {
        toast({
          title: "오류",
          description: "성능 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  }, [performanceTimeRange, toast]);

  // 전체 새로고침
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const promises = [loadStats()];
      if (showSystemDashboard) {
        promises.push(loadSystemStats(), loadPerformanceData());
      }
      await Promise.all(promises);
      toast({
        title: "새로고침 완료",
        description: "데이터가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      // 에러는 각 함수에서 이미 처리됨
    } finally {
      setRefreshing(false);
    }
  }, [loadStats, loadSystemStats, loadPerformanceData, showSystemDashboard, toast]);

  // 초기 데이터 로드
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      const loadInitialData = async () => {
        await Promise.all([loadStats(), loadSystemStats()]);
        setLoading(false);
      };
      loadInitialData();
    }
  }, [loadStats, loadSystemStats]);

  // 성능 데이터 로드 (시스템 대시보드 활성화 시)
  useEffect(() => {
    if (showSystemDashboard && initialLoadRef.current) {
      loadPerformanceData();
    }
  }, [showSystemDashboard, loadPerformanceData]);

  // 성능 시간 범위 변경 시 데이터 새로고침
  useEffect(() => {
    if (showSystemDashboard && initialLoadRef.current) {
      loadPerformanceData();
    }
  }, [performanceTimeRange, showSystemDashboard, loadPerformanceData]);

  // 시스템 통계 주기적 업데이트 (30초마다)
  useEffect(() => {
    if (!showSystemDashboard || !initialLoadRef.current) return;
    
    const interval = setInterval(() => {
      loadSystemStats();
      loadPerformanceData();
    }, 30000); // 30초

    return () => clearInterval(interval);
  }, [showSystemDashboard, loadSystemStats, loadPerformanceData]);

  return {
    stats,
    systemStats,
    performanceData,
    loading,
    refreshing,
    showSystemDashboard,
    performanceTimeRange,
    setShowSystemDashboard,
    setPerformanceTimeRange,
    handleRefresh,
    loadStats
  };
};