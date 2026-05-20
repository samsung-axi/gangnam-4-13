import React, { useState, useEffect } from "react";
import SearchBar from "../components/userManagement/SearchBar";
import UserTable from "../components/userManagement/UserTable";
import { useToast } from "../hooks/useToast";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import PageLayout from "../components/ui/PageLayout";
import { User, UserRole, UserPageResponse } from "types/user";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/userService";
import { RefreshCw } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();
  const [totalItems, setTotalItems] = useState<number>(0);

  const itemsPerPage = 7;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data: UserPageResponse = await getUsers(0, 1000);
      setUsers(data.content);
      setFilteredUsers(data.content);
      setTotalItems(data.content.length);
    } catch (error) {
      showToast("사용자 데이터 로드에 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    const searchValue = term.trim().toLowerCase();
    if (!searchValue) {
      setFilteredUsers(users);
      setTotalItems(users.length);
      return;
    }

    const filtered = users.filter(
      (user) =>
        (user.username?.toLowerCase() || '').includes(searchValue) ||
        (user.role?.toLowerCase() || '').includes(searchValue) ||
        (user.loginType?.toLowerCase() || '').includes(searchValue)
    );
    setFilteredUsers(filtered);
    setTotalItems(filtered.length);
  };

  const handleReFetchUsers = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
      setSearchTerm("");
      showToast("새로고침 완료", "success");
    } catch (error) {
      showToast("새로고침 실패", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: UserRole) => {
    const currentUser = users.find((user) => user.id === userId);
    if (currentUser && currentUser.role === newRole) {
      showToast("이미 해당 권한입니다.", "info");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      showToast("권한이 성공적으로 변경되었습니다.", "success");
    } catch (error) {
      showToast("권한 변경에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: User["status"]) => {
    const currentUser = users.find((user) => user.id === userId);
    if (currentUser && currentUser.status === newStatus) {
      showToast("이미 해당 상태입니다.", "info");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserStatus(userId, newStatus);
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      showToast("상태가 성공적으로 변경되었습니다.", "success");
    } catch (error) {
      showToast("상태 변경에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSort = (key: keyof User, direction: "asc" | "desc") => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsers(sorted);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center p-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="User Management">
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="flex flex-row justify-start gap-x-4">
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <button 
            onClick={handleReFetchUsers}
            disabled={isRefreshing}
            className="w-10 h-10 p-2 bg-white hover:bg-gray-100 rounded-xl transition-all 
              hover:shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center"
            aria-label="새로고침"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto pb-4">
          <UserTable
            users={filteredUsers.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            onSort={handleSort}
            onUpdateRole={handleUpdateRole}
            onUpdateStatus={handleUpdateStatus}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      </div>

      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <LoadingAnimation />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default UserManagementPage;