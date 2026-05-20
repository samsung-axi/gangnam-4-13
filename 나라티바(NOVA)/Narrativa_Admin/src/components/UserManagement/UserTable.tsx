import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  User,
  UserRole,
  UserTableProps,
  USER_ROLES,
  USER_STATUS_ACTIONS,
} from "../../types/user";
import {
  getStatusColor,
  getStatusLabel,
  formatRole,
} from "../../constants/userConstants";

const UserTable: React.FC<UserTableProps> = ({
  users,
  onSort,
  onUpdateRole,
  onUpdateStatus,
  currentPage,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<number | null>(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (key: keyof User) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const getCurrentPageData = () => {
    const emptySlots = itemsPerPage - users.length;
    return [...users, ...Array(Math.max(0, emptySlots)).fill(null)];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "기록 없음";
    try {
      return new Date(dateString).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return "기록 없음";
    }
  };

  const renderSortIcon = (key: keyof User) =>
    sortConfig.key !== key ? (
      <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    ) : sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );

  const renderHeader = (key: keyof User, label: string, sortable = true, className = "") => (
    <div className={`px-4 flex items-center ${className}`}>
      {sortable ? (
        <button
          onClick={() => handleSort(key)}
          className="flex items-center space-x-1 hover:text-gray-900"
        >
          <span>{label}</span>
          {renderSortIcon(key)}
        </button>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );

  const renderRoleCell = (user: User) => (
    <div className="relative w-full">
      <button
        onClick={() =>
          setOpenDropdownId(openDropdownId === user.id ? null : user.id)
        }
        className="flex items-center justify-between w-full px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-contents font-medium rounded hover:bg-gray-50"
      >
        <span>{formatRole(user.role)}</span>
        <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
      </button>
      {openDropdownId === user.id && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {USER_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onUpdateRole(user.id, role);
                  setOpenDropdownId(null);
                }}
                className="flex items-center justify-between w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-contents font-medium hover:bg-gray-50"
              >
                <span>{formatRole(role)}</span>
                {user.role === role && <Check className="w-4 h-4 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStatusCell = (user: User) => (
    <div className="relative w-full">
      <button
        onClick={() =>
          setOpenStatusDropdownId(
            openStatusDropdownId === user.id ? null : user.id
          )
        }
        className={`flex items-center justify-between w-full px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-contents font-medium rounded ${getStatusColor(
          user.status
        )}`}
      >
        <span>{getStatusLabel(user.status)}</span>
        <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
      </button>
      {openStatusDropdownId === user.id && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {USER_STATUS_ACTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onUpdateStatus(user.id, status.value);
                  setOpenStatusDropdownId(null);
                }}
                className={`flex items-center justify-between w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-contents font-medium hover:bg-gray-50 ${status.color}`}
              >
                <span>{status.label}</span>
                {user.status === status.value && (
                  <Check className="w-4 h-4 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPageNumbers = () => {
    const pageRange = 5;
    const start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const end = Math.min(totalPages, start + pageRange - 1);

    return (
      <>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-contents text-gray-700 bg-white border border-gray-300 rounded-md 
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          처음
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 text-sm font-contents text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              1
            </button>
            {start > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {Array.from({ length: end - start + 1 }).map((_, i) => {
          const page = start + i;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm font-contents rounded-md ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-contents text-gray-700 bg-white border border-gray-300 rounded-md 
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          마지막
        </button>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-3 sm:grid-cols-6 bg-gray-50 text-xs uppercase font-medium font-contents text-gray-700 h-10 sm:h-12">
          {renderHeader("username", "이름")}
          {renderHeader("role", "권한")}
          {renderHeader("status", "상태")}
          {renderHeader("profileUrl", "프로필 이미지", false, "hidden sm:flex")}
          {renderHeader("loginType", "로그인 타입", true, "hidden sm:flex")}
          {renderHeader("createdAt", "가입일", true, "hidden sm:flex")}
        </div>

        <div className="divide-y divide-gray-200 overflow-y-auto h-[400px] sm:h-[500px]">
          {getCurrentPageData().map((user, index) => (
            <div
              key={user?.id || `empty-${index}`}
              className="grid grid-cols-3 sm:grid-cols-6 hover:bg-gray-50 transition-colors"
            >
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center font-contents font-medium text-gray-900 text-sm">
                {user?.username || "\u00A0"}
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center relative">
                {user && renderRoleCell(user)}
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center">
                {user && renderStatusCell(user)}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center">
                {user?.profileUrl && (
                  <img
                    src={user.profileUrl}
                    alt={`${user.username}의 프로필`}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center font-contents text-gray-500">
                {user?.loginType || "\u00A0"}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center font-contents text-gray-500 text-sm">
                {user ? formatDate(user.createdAt) : "\u00A0"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 sm:px-4">
        <span className="text-sm font-contents text-gray-700">
          총 <span className="font-semibold">{totalItems}</span> 명의 사용자
        </span>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 sm:px-3 sm:py-1 text-sm font-contents text-gray-700 bg-white border border-gray-300 rounded-md 
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            {renderPageNumbers()}
          </div>
          <div className="sm:hidden text-sm font-contents text-gray-700">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 sm:px-3 sm:py-1 text-sm font-contents text-gray-700 bg-white border border-gray-300 rounded-md 
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;