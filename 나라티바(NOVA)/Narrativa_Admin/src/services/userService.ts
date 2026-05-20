import axios from "axios";
import { User, UserRole, UserPageResponse } from "../types/user";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// axios 인스턴스 생성 및 기본 설정
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getUsers = async (
  page: number,
  size: number,
  search?: string
): Promise<UserPageResponse> => {
  const response = await api.get(`/api/admin/usersManage`, {
    params: {
      page,
      size,
      search
    }
  });
  return response.data;
};

export const updateUserRole = async (
  userId: number,
  role: UserRole
): Promise<void> => {
  await api.patch(`/api/admin/usersManage/${userId}/role`, { role });
};

export const updateUserStatus = async (
  userId: number,
  status: User["status"]
): Promise<void> => {
  await api.patch(`/api/admin/usersManage/${userId}/status`, { status });
};