export type AdminRole =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "CONTENT_ADMIN"
  | "SUPPORT_ADMIN"
  | "WAITING";

export type AdminStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AdminUser {
  id?: number;
  uid: string;
  email: string;
  username: string;
  role: AdminRole;
  status: AdminStatus;
  profilePicture?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ADMIN_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "CONTENT_ADMIN",
  "SUPPORT_ADMIN",
  "WAITING",
];

export const ADMIN_STATUS_ACTIONS: {
  value: AdminStatus;
  label: string;
  color: string;
}[] = [
  { value: "ACTIVE", label: "활성화", color: "text-green-600" },
  { value: "INACTIVE", label: "비활성화", color: "text-gray-600" },
  { value: "SUSPENDED", label: "정지", color: "text-red-600" },
];

export interface AdminSearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export interface AdminTableProps {
  admins: AdminUser[];
  onSort: (key: keyof AdminUser, direction: "asc" | "desc") => void;
  onUpdateRole: (userId: number, currentRole: AdminRole, newRole: AdminRole) => void;
  onUpdateStatus: (userId: number, newStatus: AdminStatus) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentUserRole: AdminRole;
}

export interface AuthContextProps {
  admin: AdminUser | null;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (userId: number, newRole: AdminRole) => Promise<void>;
  isLoading: boolean;
}
