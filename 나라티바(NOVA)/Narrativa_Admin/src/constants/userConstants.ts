import { UserStatus } from "../types/user";

// 상태별 색상 반환 함수
export const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "text-green-600";
    case "BANNED":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// 상태별 라벨 반환 함수
export const getStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "활성화";
    case "INACTIVE":
      return "비활성화";
    case "BANNED":
      return "정지";
    default:
      return status;
  }
};

export const formatRole = (role: string): string => {
  return role.startsWith("ROLE_") ? role.replace("ROLE_", "") : role;
};
