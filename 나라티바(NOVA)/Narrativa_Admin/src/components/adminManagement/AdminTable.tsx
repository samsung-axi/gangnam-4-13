import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { AdminTableProps, AdminUser } from "../../types/admin";
import {
  ADMIN_ROLE_DESCRIPTIONS,
  ADMIN_ROLE_COLORS,
  ADMIN_STATUS_COLORS,
  formatDate,
} from "../../constants/adminConstants";
import { Tooltip } from "../ui/Tooltip";

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onSort,
  onUpdateRole,
  currentPage,
  onPageChange,
  currentUserRole,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AdminUser | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(Math.max(admins.length, 1) / itemsPerPage);

  const handleSort = (key: keyof AdminUser) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return [
      ...admins.slice(startIndex, endIndex),
      ...Array(itemsPerPage - admins.slice(startIndex, endIndex).length).fill(null),
    ];
  };

  const renderSortIcon = (key: keyof AdminUser) =>
    sortConfig.key !== key ? (
      <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    ) : sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );

  const renderHeader = (
    key: keyof AdminUser,
    label: string,
    sortable = true,
    className = ""
  ) => (
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

  const getRoleColor = (role: AdminUser["role"]) =>
    ADMIN_ROLE_COLORS[role] || ADMIN_ROLE_COLORS.WAITING;
  const getStatusColor = (status: AdminUser["status"]) =>
    ADMIN_STATUS_COLORS[status] || ADMIN_STATUS_COLORS.INACTIVE;

  const renderRoleCell = (admin: AdminUser) => (
    <div className="relative w-full">
      <Tooltip content={ADMIN_ROLE_DESCRIPTIONS[admin.role] || ""}>
        <button
          onClick={() =>
            setOpenDropdownId(openDropdownId === admin.id ? null : admin.id)
          }
          className={`flex items-center justify-between w-full px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-contents font-medium rounded ${getRoleColor(
            admin.role
          )} transition-colors`}
        >
          <span>{admin.role}</span>
          <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </button>
      </Tooltip>
      {openDropdownId === admin.id && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {(Object.keys(ADMIN_ROLE_DESCRIPTIONS) as Array<AdminUser["role"]>).map(
              (role) => (
                <button
                  key={role}
                  onClick={() => {
                    onUpdateRole(admin.id, admin.role, role);
                    setOpenDropdownId(null);
                  }}
                  className={`flex items-center justify-between w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-contents hover:bg-gray-50 ${
                    role === admin.role ? getRoleColor(role) : ""
                  }`}
                  disabled={
                    currentUserRole !== "SUPER_ADMIN" ||
                    admin.role === "SUPER_ADMIN"
                  }
                >
                  <div className="flex flex-col items-start w-full">
                    <span className="text-[10px] sm:text-sm font-contents font-medium">{role}</span>
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {ADMIN_ROLE_DESCRIPTIONS[role]}
                    </span>
                  </div>
                  {role === admin.role && (
                    <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-7 bg-gray-50 text-xs uppercase font-contents font-contents font-medium text-gray-700 h-10 sm:h-12">
          {renderHeader("username", "이름")}
          {renderHeader("role", "권한")}
          {renderHeader("lastLoginAt", "최근 로그인", true, "hidden sm:flex")}
          {renderHeader("email", "이메일", true, "hidden sm:flex")}
          {renderHeader("status", "상태", false, "hidden sm:flex")}
          {renderHeader("createdAt", "가입 날짜", true, "hidden sm:flex")}
        </div>

        <div className="divide-y divide-gray-200 overflow-y-auto h-[400px] sm:h-[500px]">
          {getCurrentPageData().map((admin, index) => (
            <div
              key={admin?.id || `empty-${index}`}
              className="grid grid-cols-2 sm:grid-cols-7 hover:bg-gray-50 transition-colors"
            >
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center font-contents font-medium text-gray-900 text-sm">
                {admin?.username || "\u00A0"}
              </div>
              <div className="px-2 sm:px-4 py-3 sm:py-4 items-center">
                {admin ? renderRoleCell(admin) : "\u00A0"}
              </div>
                <div className="hidden sm:flex text-[10px] sm:text-sm px-2 sm:px-4 py-3 sm:py-4 items-center font-contents text-gray-500 text-sm">
                {admin ? formatDate(admin.lastLoginAt) : "\u00A0"}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center font-contents text-gray-500">
                {admin?.email || "\u00A0"}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center">
                {admin && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-contents font-medium ${getStatusColor(
                      admin.status
                    )}`}
                  >
                    {admin.status}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex px-4 py-4 items-center font-contents text-gray-500 text-sm">
                {admin ? formatDate(admin.createdAt) : "\u00A0"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-2 sm:px-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            총 <span className="font-contents font-semibold">{admins.length}</span> 명의 관리자
          </span>
        </div>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <div className="sm:hidden text-sm text-gray-700">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 sm:px-3 sm:py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md 
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;