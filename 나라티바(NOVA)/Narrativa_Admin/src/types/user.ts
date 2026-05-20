export type UserRole = "ROLE_USER" | "ROLE_VIP";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export type LoginType = "GITHUB" | "GOOGLE" | "KAKAO";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  profileUrl?: string;
  loginType: LoginType;
}

export interface UserTableProps {
  users: User[];
  onSort: (key: keyof User, direction: "asc" | "desc") => void;
  onUpdateRole: (userId: number, role: UserRole) => void;
  onUpdateStatus: (userId: number, status: UserStatus) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export interface UserPageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
}

export const USER_ROLES: UserRole[] = ["ROLE_USER", "ROLE_VIP"];

export const USER_STATUS_ACTIONS: {
  value: UserStatus;
  label: string;
  color: string;
}[] = [
  { value: "ACTIVE", label: "활성화", color: "text-green-600" },
  { value: "INACTIVE", label: "비활성화", color: "text-gray-600" },
  { value: "BANNED", label: "정지", color: "text-red-600" },
];
