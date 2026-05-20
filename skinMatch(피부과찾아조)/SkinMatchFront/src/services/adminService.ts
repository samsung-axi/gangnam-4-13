// src/services/adminService.ts
import apiClient from './authService';
import { logger } from '@/utils/logger';

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    name: string;
    nickname?: string;
    profileImage?: string;
    gender?: string;
    birthYear?: string;
    nationality?: string;
    allergies?: string;
    surgicalHistory?: string;
    provider?: string;
    role?: string;
    status: 'online' | 'offline';
    createdAt: string;
    updatedAt?: string;
    lastLoginAt?: string;
}

export interface AdminStats {
    totalUsers: number;
    onlineUsers: number;        // is_online=true인 실시간 접속자
    recentlyActiveUsers: number; // 최근 5분 내 활동한 '접속 회원'
    newUsersToday: number;      // 오늘 가입한 사용자
    totalAnalyses: number;
    analysesToday: number;
}

export interface SystemStats {
    serverStatus: 'healthy' | 'warning' | 'error';
    uptime: number; // 서버 가동 시간 (초)
    memoryUsage: {
        used: number;
        total: number;
        percentage: number;
    };
    cpuUsage: number; // CPU 사용률 (%)
    diskUsage: {
        used: number;
        total: number;
        percentage: number;
    };
    apiResponseTime: {
        average: number; // 평균 응답시간 (ms)
        p95: number;     // 95퍼센타일 응답시간 (ms)
        p99: number;     // 99퍼센타일 응답시간 (ms)
    };
    databaseStatus: 'connected' | 'disconnected' | 'slow';
    databaseResponseTime: number; // DB 응답시간 (ms)
    totalRequests: number; // 총 요청 수
    requestsPerMinute: number; // 분당 요청 수
    errorRate: number; // 에러율 (%)
    activeConnections: number; // 활성 연결 수
}

export interface PerformanceMetrics {
    timestamp: string;
    responseTime: number;
    requestCount: number;
    errorCount: number;
    cpuUsage: number;
    memoryUsage: number;
}

export interface UserSearchParams {
    page?: number;
    size?: number;
    search?: string;
    status?: 'online' | 'offline' | 'all';
    role?: string;
    provider?: string;
    sortBy?: 'createdAt' | 'name' | 'email' | 'lastLoginAt';
    sortDirection?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    hasAnalyses?: 'yes' | 'no' | 'all';
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export const adminService = {
    // 관리자 통계 정보 조회
    async getAdminStats(): Promise<AdminStats> {
        logger.info('관리자 통계 정보 조회 요청');
        try {
            const response = await apiClient.get('/admin/stats');
            logger.info('관리자 통계 정보 조회 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('관리자 통계 정보 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 사용자 목록 조회 (페이징, 검색)
    async getUsers(params: UserSearchParams = {}): Promise<PaginatedResponse<AdminUser>> {
        logger.info('사용자 목록 조회 요청', params);
        try {
            const response = await apiClient.get('/admin/users', {
                params: {
                    page: params.page || 0,
                    size: params.size || 20,
                    search: params.search || '',
                    status: params.status || 'all',
                    role: params.role,
                    provider: params.provider,
                    sortBy: params.sortBy || 'createdAt',
                    sortDirection: params.sortDirection || 'desc',
                    startDate: params.startDate,
                    endDate: params.endDate,
                    hasAnalyses: params.hasAnalyses
                }
            });
            logger.info('사용자 목록 조회 성공', { 
                totalElements: response.data.data.totalElements 
            });
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 목록 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 사용자 상태 변경 (활성/비활성)
    async toggleUserStatus(userId: string): Promise<AdminUser> {
        logger.info('사용자 상태 변경 요청', { userId });
        try {
            const response = await apiClient.patch(`/admin/users/${userId}/status`);
            logger.info('사용자 상태 변경 성공', { 
                userId, 
                newStatus: response.data.data.status 
            });
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 상태 변경 실패', { 
                userId, 
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 사용자 삭제
    async deleteUser(userId: string): Promise<void> {
        logger.info('사용자 삭제 요청', { userId });
        try {
            await apiClient.delete(`/admin/users/${userId}`);
            logger.info('사용자 삭제 성공', { userId });
        } catch (error: any) {
            logger.error('사용자 삭제 실패', { 
                userId, 
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 특정 사용자 정보 조회
    async getUser(userId: string): Promise<AdminUser> {
        logger.info('사용자 정보 조회 요청', { userId });
        try {
            const response = await apiClient.get(`/admin/users/${userId}`);
            logger.info('사용자 정보 조회 성공', { userId });
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 정보 조회 실패', { 
                userId, 
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 사용자 역할 변경
    async updateUserRole(userId: string, role: string): Promise<AdminUser> {
        logger.info('사용자 역할 변경 요청', { userId, role });
        try {
            const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
            logger.info('사용자 역할 변경 성공', { userId, role });
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 역할 변경 실패', { 
                userId, 
                role,
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 사용자 분석 기록 조회
    async getUserAnalyses(userId: string): Promise<any[]> {
        logger.info('사용자 분석 기록 조회 요청', { userId });
        try {
            const response = await apiClient.get(`/admin/users/${userId}/analyses`);
            logger.info('사용자 분석 기록 조회 성공', { 
                userId, 
                count: response.data.data.length 
            });
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 분석 기록 조회 실패', { 
                userId, 
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 시스템 로그 조회
    async getSystemLogs(params: {
        page?: number;
        size?: number;
        level?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
        startDate?: string;
        endDate?: string;
    } = {}): Promise<PaginatedResponse<any>> {
        logger.info('시스템 로그 조회 요청', params);
        try {
            const response = await apiClient.get('/admin/logs', { params });
            logger.info('시스템 로그 조회 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('시스템 로그 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 벌크 작업: 사용자 상태 일괄 변경
    async bulkUpdateUserStatus(userIds: string[], status: 'online' | 'offline'): Promise<void> {
        logger.info('사용자 상태 일괄 변경 요청', { userIds, status });
        try {
            await apiClient.patch('/admin/users/bulk/status', {
                userIds,
                status
            });
            logger.info('사용자 상태 일괄 변경 성공', { count: userIds.length, status });
        } catch (error: any) {
            logger.error('사용자 상태 일괄 변경 실패', { 
                userIds, 
                status,
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 벌크 작업: 사용자 일괄 삭제
    async bulkDeleteUsers(userIds: string[]): Promise<void> {
        logger.info('사용자 일괄 삭제 요청', { userIds });
        try {
            await apiClient.delete('/admin/users/bulk', {
                data: { userIds }
            });
            logger.info('사용자 일괄 삭제 성공', { count: userIds.length });
        } catch (error: any) {
            logger.error('사용자 일괄 삭제 실패', { 
                userIds,
                error: error.response?.data 
            });
            throw error;
        }
    },

    // 벌크 작업: 사용자 역할 일괄 변경
    async bulkUpdateUserRole(userIds: string[], role: string): Promise<void> {
        logger.info('사용자 역할 일괄 변경 요청', { userIds, role });
        try {
            await apiClient.patch('/admin/users/bulk/role', {
                userIds,
                role
            });
            logger.info('사용자 역할 일괄 변경 성공', { count: userIds.length, role });
        } catch (error: any) {
            logger.error('사용자 역할 일괄 변경 실패', { 
                userIds, 
                role,
                error: error.response?.data 
            });
            throw error;
        }
    },

    // CSV 내보내기
    async exportUsersCSV(filters: any = {}): Promise<string> {
        logger.info('사용자 CSV 내보내기 요청', filters);
        try {
            const response = await apiClient.get('/admin/users/export/csv', {
                params: filters,
                responseType: 'text'
            });
            logger.info('사용자 CSV 내보내기 성공');
            return response.data;
        } catch (error: any) {
            logger.error('사용자 CSV 내보내기 실패', error.response?.data);
            throw error;
        }
    },

    // 사용자 통계 내보내기
    async exportUserStats(): Promise<any> {
        logger.info('사용자 통계 내보내기 요청');
        try {
            const response = await apiClient.get('/admin/stats/export');
            logger.info('사용자 통계 내보내기 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('사용자 통계 내보내기 실패', error.response?.data);
            throw error;
        }
    },

    // 시스템 상태 조회
    async getSystemStats(): Promise<SystemStats> {
        logger.info('시스템 상태 조회 요청');
        try {
            const response = await apiClient.get('/admin/system/stats');
            logger.info('시스템 상태 조회 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('시스템 상태 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 성능 메트릭 조회 (차트용)
    async getPerformanceMetrics(params: {
        timeRange?: '1h' | '6h' | '24h' | '7d';
        granularity?: '1m' | '5m' | '1h';
    } = {}): Promise<PerformanceMetrics[]> {
        logger.info('성능 메트릭 조회 요청', params);
        try {
            const response = await apiClient.get('/admin/system/performance', { params });
            logger.info('성능 메트릭 조회 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('성능 메트릭 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 시스템 헬스체크
    async getHealthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'down';
        services: {
            name: string;
            status: 'up' | 'down';
            responseTime: number;
            lastCheck: string;
        }[];
        uptime: number;
    }> {
        logger.info('시스템 헬스체크 요청');
        try {
            const response = await apiClient.get('/admin/system/health');
            logger.info('시스템 헬스체크 성공');
            return response.data.data;
        } catch (error: any) {
            logger.error('시스템 헬스체크 실패', error.response?.data);
            throw error;
        }
    }
};
