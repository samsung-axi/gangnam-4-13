import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { logger } from '@/utils/logger';
import { format } from 'date-fns';
import { AdminUser, UserFilters, PaginationState, UserSearchParams } from '../types';

export const useUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  // 고급 필터링 상태
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    role: 'all',
    provider: 'all',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    dateRange: undefined,
    hasAnalyses: 'all'
  });

  // 벌크 작업 상태
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 초기 로드 여부를 추적
  const initialLoadRef = useRef(false);

  const { toast } = useToast();

  // 사용자 목록 로드 (필터링 포함)
  const loadUsers = useCallback(async (params: UserSearchParams = {}) => {
    try {
      setLoading(true);
      const searchParams = {
        page: params.page ?? 0,
        size: params.size ?? 20,
        search: searchTerm || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        role: filters.role !== 'all' ? filters.role : undefined,
        provider: filters.provider !== 'all' ? filters.provider : undefined,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
        startDate: filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined,
        endDate: filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined,
        hasAnalyses: filters.hasAnalyses !== 'all' ? filters.hasAnalyses : undefined,
        ...params
      };

      const response = await adminService.getUsers(searchParams);
      setUsers(response.content);
      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      });
      
      // 선택된 사용자 목록 정리 (페이지 변경 시)
      if (params.page !== undefined) {
        setSelectedUsers(new Set());
        setSelectAll(false);
      }
    } catch (error: any) {
      logger.error('사용자 목록 로드 실패', error);
      
      // 404나 401 에러의 경우 API가 아직 구현되지 않았을 수 있음
      if (error.response?.status === 404 || error.response?.status === 401) {
        toast({
          title: "API 준비 중",
          description: "사용자 관리 API가 아직 준비되지 않았습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "오류",
          description: "사용자 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, toast]);

  // 초기 데이터 로드 (한 번만)
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadUsers();
    }
  }, [loadUsers]);

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    if (!initialLoadRef.current) return; // 초기 로드가 완료된 후에만 실행
    
    const debounceTimer = setTimeout(() => {
      loadUsers({ page: 0 });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, loadUsers]);

  // 필터 변경 시 데이터 새로고침
  useEffect(() => {
    if (!initialLoadRef.current) return; // 초기 로드가 완료된 후에만 실행
    
    loadUsers({ page: 0 });
  }, [filters, loadUsers]);

  // 벌크 작업: 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
      setSelectAll(false);
    } else {
      const allUserIds = new Set(users.map(user => user.id));
      setSelectedUsers(allUserIds);
      setSelectAll(true);
    }
  };

  // 벌크 작업: 개별 사용자 선택/해제
  const handleSelectUser = (userId: string) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
    setSelectAll(newSelectedUsers.size === users.length);
  };

  // 벌크 작업: 선택된 사용자들 상태 변경
  const handleBulkStatusChange = async (newStatus: 'online' | 'offline') => {
    if (selectedUsers.size === 0) {
      toast({
        title: "선택된 사용자 없음",
        description: "상태를 변경할 사용자를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setBulkOperationLoading(true);
    try {
      await adminService.bulkUpdateUserStatus(Array.from(selectedUsers), newStatus);
      
      toast({
        title: "상태 변경 완료",
        description: `${selectedUsers.size}명의 사용자 상태가 ${newStatus === 'online' ? '접속' : '비접속'}으로 변경되었습니다.`,
      });
      
      await loadUsers({ page: pagination.page });
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? "벌크 작업 API가 아직 구현되지 않았습니다."
        : error instanceof Error ? error.message : "일괄 상태 변경에 실패했습니다.";
      toast({
        title: "상태 변경 실패",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // 벌크 작업: 선택된 사용자들 삭제
  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "선택된 사용자 없음",
        description: "삭제할 사용자를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`정말로 선택된 ${selectedUsers.size}명의 사용자를 삭제하시겠습니까?`)) {
      return;
    }

    setBulkOperationLoading(true);
    try {
      await adminService.bulkDeleteUsers(Array.from(selectedUsers));
      
      toast({
        title: "삭제 완료",
        description: `${selectedUsers.size}명의 사용자가 삭제되었습니다.`,
      });
      
      await loadUsers({ page: pagination.page });
      setSelectedUsers(new Set());
      setSelectAll(false);
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? "벌크 삭제 API가 아직 구현되지 않았습니다."
        : error instanceof Error ? error.message : "일괄 삭제에 실패했습니다.";
      toast({
        title: "삭제 실패",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBulkOperationLoading(false);
    }
  };

  // CSV 내보내기 - 에러 처리 개선
  const handleExportCSV = async () => {
    try {
      toast({
        title: "내보내기 시작",
        description: "CSV 파일을 준비하고 있습니다...",
      });

      const response = await adminService.exportUsersCSV(filters);
      
      // CSV 다운로드
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "내보내기 완료",
        description: "사용자 데이터가 CSV 파일로 다운로드되었습니다.",
      });
    } catch (error: any) {
      logger.error('CSV 내보내기 실패', error);
      
      let errorMessage = "CSV 내보내기에 실패했습니다.";
      if (error.response?.status === 404) {
        errorMessage = "CSV 내보내기 API가 아직 구현되지 않았습니다.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "내보내기 실패",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
      provider: 'all',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      dateRange: undefined,
      hasAnalyses: 'all'
    });
    setSearchTerm('');
  };

  // 사용자 삭제
  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`정말로 "${user.name}"님을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await adminService.deleteUser(user.id);
      toast({
        title: "삭제 완료",
        description: `${user.name}님이 삭제되었습니다.`,
      });
      
      // 목록 새로고침
      await loadUsers({ page: pagination.page });
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? "사용자 삭제 API가 아직 구현되지 않았습니다."
        : error instanceof Error ? error.message : "사용자 삭제에 실패했습니다.";
      toast({
        title: "삭제 실패",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // 사용자 상태 토글 (접속/비접속)
  const toggleUserStatus = async (user: AdminUser) => {
    try {
      const updatedUser = await adminService.toggleUserStatus(user.id);
      
      // 사용자 목록에서 해당 사용자 상태 업데이트
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: updatedUser.status } : u
      ));
      
      toast({
        title: "상태 변경 완료",
        description: `${user.name}님의 상태가 ${updatedUser.status === 'online' ? '접속' : '비접속'}으로 변경되었습니다.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? "사용자 상태 변경 API가 아직 구현되지 않았습니다."
        : error instanceof Error ? error.message : "사용자 상태 변경에 실패했습니다.";
      toast({
        title: "상태 변경 실패",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    selectedUsers,
    selectAll,
    pagination,
    bulkOperationLoading,
    handleSelectAll,
    handleSelectUser,
    handleBulkStatusChange,
    handleBulkDelete,
    handleExportCSV,
    handleResetFilters,
    handleDeleteUser,
    toggleUserStatus,
    loadUsers
  };
};