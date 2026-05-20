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
  onlineUsers: number;
  recentlyActiveUsers: number;
  newUsersToday: number;
  totalAnalyses: number;
  analysesToday: number;
  usersWithAnalyses?: number; // 호환성을 위해 추가
}

export interface SystemStats {
  serverStatus: 'healthy' | 'warning' | 'error';
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage: number;
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  apiResponseTime: {
    average: number;
    p95: number;
    p99: number;
  };
  databaseStatus: 'connected' | 'disconnected' | 'slow';
  databaseResponseTime: number;
  totalRequests: number;
  requestsPerMinute: number;
  errorRate: number;
  activeConnections: number;
  // 호환성을 위해 추가
  loadAverage?: number;
  memoryUsed?: number;
  memoryTotal?: number;
  diskUsed?: number;
  diskTotal?: number;
  databaseConnections?: number;
  maxDatabaseConnections?: number;
  networkStatus?: 'connected' | 'disconnected';
  networkLatency?: number;
}

export interface PerformanceMetrics {
  timestamp: string;
  responseTime: number;
  requestCount?: number;
  errorCount?: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface UserFilters {
  status: 'online' | 'offline' | 'all';
  role: string;
  provider: string;
  sortBy: 'createdAt' | 'name' | 'email' | 'lastLoginAt';
  sortDirection: 'asc' | 'desc';
  dateRange?: { from: Date; to: Date };
  hasAnalyses: 'yes' | 'no' | 'all';
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

export interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
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