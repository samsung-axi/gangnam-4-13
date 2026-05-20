import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Users, UserCheck, UserX, Trash2 } from 'lucide-react';

interface BulkActionsProps {
  selectedUsers: Set<string>;
  onBulkStatusChange: (newStatus: 'online' | 'offline') => void;
  onBulkDelete: () => void;
  bulkOperationLoading: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedUsers,
  onBulkStatusChange,
  onBulkDelete,
  bulkOperationLoading
}) => {
  if (selectedUsers.size === 0) {
    return null;
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <Typography variant="body" className="font-medium text-primary">
            {selectedUsers.size}명 선택됨
          </Typography>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkStatusChange('online')}
            disabled={bulkOperationLoading}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            접속으로 변경
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkStatusChange('offline')}
            disabled={bulkOperationLoading}
          >
            <UserX className="w-4 h-4 mr-2" />
            비접속으로 변경
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            disabled={bulkOperationLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};