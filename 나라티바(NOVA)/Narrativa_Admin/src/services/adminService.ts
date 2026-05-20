import axios from "axios";
import { AdminUser, AdminStatus } from "../types/admin";
import { getAuth } from "firebase/auth";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 인증 토큰을 가져오는 헬퍼 함수
const getAuthToken = async () => {
  const auth = getAuth();
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("로그인이 필요합니다.");
  return idToken;
};

export const adminService = {
  // Auth 관련
  verifyToken: async (idToken: string) => {
    const response = await api.post('/api/auth/verify', { idToken });
    return response.data;
  },

  registerAdmin: async (idToken: string) => {
    const response = await api.post('/api/auth/register', { idToken });
    return response.data;
  },

  updateLastLogin: async (userId: number) => {
    const response = await api.patch(`/api/admin/users/${userId}/last-login`);
    return response.data;
  },

  // Admin 관리 관련
  getAllAdmins: async () => {
    const idToken = await getAuthToken();
    const response = await api.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data.data;
  },

  updateAdminRole: async (
    userId: number,
    currentRole: AdminUser["role"],
    newRole: AdminUser["role"]
  ) => {
    if (currentRole === newRole) {
      throw new Error("이미 지정된 권한입니다.");
    }

    const idToken = await getAuthToken();
    const response = await api.patch(
      `/api/admin/users/${userId}/role`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );
    return response.data.data;
  },

  updateAdminStatus: async (userId: number, newStatus: AdminStatus) => {
    const idToken = await getAuthToken();
    const response = await api.patch(
      `/api/admin/users/${userId}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );
    return response.data.data;
  },
};