import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/theme-typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Search, Filter, Download } from 'lucide-react';
import { UserFilters as UserFiltersType, PaginationState } from '../types';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: UserFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<UserFiltersType>>;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onExportCSV: () => void;
  onResetFilters: () => void;
  pagination: PaginationState;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  onExportCSV,
  onResetFilters,
  pagination
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar and Filter Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="회원 검색 (이름, 이메일, 아이디)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-primary/10' : ''}
        >
          <Filter className="w-4 h-4 mr-2" />
          필터
        </Button>
        
        <Button variant="outline" onClick={onExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          CSV 내보내기
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="bodyLarge" className="font-medium">고급 필터</Typography>
            <Button variant="ghost" size="sm" onClick={onResetFilters}>
              초기화
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 상태 필터 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">접속 상태</Typography>
              <Select value={filters.status} onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="online">접속</SelectItem>
                  <SelectItem value="offline">비접속</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 역할 필터 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">역할</Typography>
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="user">일반 사용자</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 로그인 방식 필터 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">로그인 방식</Typography>
              <Select value={filters.provider} onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="local">일반 가입</SelectItem>
                  <SelectItem value="google">구글</SelectItem>
                  <SelectItem value="kakao">카카오</SelectItem>
                  <SelectItem value="naver">네이버</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 분석 사용 여부 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">분석 사용</Typography>
              <Select value={filters.hasAnalyses} onValueChange={(value: any) => setFilters(prev => ({ ...prev, hasAnalyses: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="분석 사용 여부" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="yes">사용함</SelectItem>
                  <SelectItem value="no">사용안함</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 정렬 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">정렬</Typography>
              <div className="flex gap-2">
                <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">가입일</SelectItem>
                    <SelectItem value="name">이름</SelectItem>
                    <SelectItem value="email">이메일</SelectItem>
                    <SelectItem value="lastLoginAt">최근 로그인</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.sortDirection} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortDirection: value }))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">최신순</SelectItem>
                    <SelectItem value="asc">오래된순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 가입일 범위 */}
            <div className="space-y-2">
              <Typography variant="bodySmall" className="font-medium">가입일 범위</Typography>
              <DatePickerWithRange 
                date={filters.dateRange}
                setDate={(date) => setFilters(prev => ({ ...prev, dateRange: date }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          총 {pagination.totalElements}명 | 페이지 {pagination.page + 1}/{pagination.totalPages}
        </div>
        {Object.values(filters).some(v => v !== 'all' && v !== 'createdAt' && v !== 'desc' && v !== undefined) && (
          <Typography variant="bodySmall" className="text-primary">
            필터 적용됨
          </Typography>
        )}
      </div>
    </div>
  );
};