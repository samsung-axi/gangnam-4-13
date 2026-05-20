import React from 'react';
import { Button } from '@/components/ui/button';
import { PaginationState, UserSearchParams } from '../types';

interface PaginationProps {
  pagination: PaginationState;
  loading: boolean;
  onPageChange: (params: UserSearchParams) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  loading,
  onPageChange
}) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange({ page: pagination.page - 1 })}
        disabled={pagination.page === 0 || loading}
      >
        이전
      </Button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          const page = pagination.page < 3 
            ? i 
            : pagination.page > pagination.totalPages - 3
            ? pagination.totalPages - 5 + i
            : pagination.page - 2 + i;
          
          if (page < 0 || page >= pagination.totalPages) return null;
          
          return (
            <Button
              key={page}
              variant={page === pagination.page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange({ page })}
              disabled={loading}
            >
              {page + 1}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange({ page: pagination.page + 1 })}
        disabled={pagination.page >= pagination.totalPages - 1 || loading}
      >
        다음
      </Button>
    </div>
  );
};