import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, User, Trash2, RefreshCw, AlertCircle, MoreVertical } from 'lucide-react';
import { AdminUser } from '../types';

interface UserTableProps {
  users: AdminUser[];
  loading: boolean;
  searchTerm: string;
  selectedUsers: Set<string>;
  selectAll: boolean;
  onSelectAll: () => void;
  onSelectUser: (userId: string) => void;
  onDeleteUser: (user: AdminUser) => void;
  onToggleUserStatus: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  searchTerm,
  selectedUsers,
  selectAll,
  onSelectAll,
  onSelectUser,
  onDeleteUser,
  onToggleUserStatus
}) => {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium w-12">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={onSelectAll}
                  disabled={users.length === 0}
                />
              </th>
              <th className="text-left p-4 font-medium">프로필</th>
              <th className="text-left p-4 font-medium">아이디</th>
              <th className="text-left p-4 font-medium">이름</th>
              <th className="text-left p-4 font-medium">이메일</th>
              <th className="text-left p-4 font-medium">가입일</th>
              <th className="text-left p-4 font-medium">접속 상태</th>
              <th className="text-left p-4 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => onSelectUser(user.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="w-10 h-10 bg-muted rounded-full overflow-hidden border-2 border-border">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Typography variant="body" className="font-medium">
                    {user.username}
                  </Typography>
                  {user.provider && (
                    <Typography variant="caption" className="text-muted-foreground block">
                      {user.provider} 연동
                    </Typography>
                  )}
                </td>
                <td className="p-4">
                  <Typography variant="body">
                    {user.name}
                  </Typography>
                  {user.nickname && (
                    <Typography variant="caption" className="text-muted-foreground block">
                      ({user.nickname})
                    </Typography>
                  )}
                </td>
                <td className="p-4">
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    {user.email}
                  </Typography>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Typography variant="bodySmall">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </div>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserStatus(user)}
                    className={user.status === 'online' ? 'text-green-600' : 'text-gray-600'}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    {user.status === 'online' ? '접속' : '비접속'}
                  </Button>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onDeleteUser(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        사용자 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <Typography variant="body" className="text-muted-foreground mb-2">
            {searchTerm ? '검색 결과가 없습니다' : '등록된 사용자가 없습니다'}
          </Typography>
          {searchTerm && (
            <Typography variant="bodySmall" className="text-muted-foreground">
              다른 검색어를 입력해보세요
            </Typography>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <Typography variant="body" className="text-muted-foreground">
            데이터를 불러오는 중...
          </Typography>
        </div>
      )}
    </div>
  );
};