import { AdminUser } from "../types/admin";

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminUser["role"], string> = {
  SUPER_ADMIN: "시스템 전체 관리 권한",
  SYSTEM_ADMIN: "시스템 관리 권한",
  CONTENT_ADMIN: "컨텐츠 관리 권한",
  SUPPORT_ADMIN: "고객 지원 권한",
  WAITING: "승인 대기중",
};

export const ADMIN_ROLE_COLORS: Record<AdminUser["role"], string> = {
  SUPER_ADMIN: "text-red-600 bg-red-50",
  SYSTEM_ADMIN: "text-purple-600 bg-purple-50",
  CONTENT_ADMIN: "text-blue-600 bg-blue-50",
  SUPPORT_ADMIN: "text-green-600 bg-green-50",
  WAITING: "text-gray-600 bg-gray-50",
};

export const ADMIN_STATUS_COLORS: Record<AdminUser["status"], string> = {
  ACTIVE: "text-green-600",
  INACTIVE: "text-gray-600",
  SUSPENDED: "text-red-600",
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "기록 없음";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
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
