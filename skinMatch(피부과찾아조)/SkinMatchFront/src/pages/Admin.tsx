import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { ArrowLeft, Search, MoreVertical, Calendar, User, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  joinDate: string;
  profileImage?: string;
  status: 'active' | 'inactive';
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      // TODO: Implement user deletion with axios
      console.log('Delete user:', userId);
    }
  };

  const handleProfileImageChange = (userId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Implement profile image update with axios
        console.log('Update profile image for user:', userId, file);
      }
    };
    input.click();
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    // TODO: Implement user status toggle with axios
    console.log('Toggle user status:', userId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Section spacing="default">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <Typography variant="bodySmall">돌아가기</Typography>
            </Link>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Typography variant="h3">관리자 페이지</Typography>
                <Typography variant="body" className="text-muted-foreground">
                  회원 관리 및 시스템 운영
                </Typography>
              </div>
              
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <Typography variant="caption" className="text-primary font-medium">
                  Admin
                </Typography>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="text-primary">
                    {users.length}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    총 회원 수
                  </Typography>
                </div>
                <User className="w-8 h-8 text-primary/60" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    활성 회원
                  </Typography>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="text-yellow-600">
                    {users.filter(u => u.status === 'inactive').length}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    비활성 회원
                  </Typography>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="회원 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">프로필</th>
                    <th className="text-left p-4 font-medium">아이디</th>
                    <th className="text-left p-4 font-medium">이름</th>
                    <th className="text-left p-4 font-medium">이메일</th>
                    <th className="text-left p-4 font-medium">가입일</th>
                    <th className="text-left p-4 font-medium">상태</th>
                    <th className="text-left p-4 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden border-2 border-border">
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name}
                              className="w-full h-full object-cover"
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
                      </td>
                      <td className="p-4">
                        <Typography variant="body">
                          {user.name}
                        </Typography>
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
                            {user.joinDate}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          {user.status === 'active' ? '활성' : '비활성'}
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
                            <DropdownMenuItem onClick={() => handleProfileImageChange(user.id)}>
                              프로필 사진 변경
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
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
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Typography variant="body" className="text-muted-foreground">
                  검색 결과가 없습니다
                </Typography>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Admin;