import type { LoginRequest, UserUpdateRequest } from '../types/user';

export const updateMypageUser = async (
  updateData: UserUpdateRequest
): Promise<any | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/update`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": "Bearer YOUR_ACCESS_TOKEN", // 필요 시 주석 해제
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('업데이트 실패:', errorData);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('업데이트 중 오류 발생:', error);
    return null;
  }
};

export const postLogin = async (
  data: LoginRequest
): Promise<Boolean | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/mypage/check`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const result: Boolean = await response.json();
    return result;
  } catch (error) {
    console.error('❌ 로그인 요청 실패:', error);
    return null;
  }
};

export async function fetchUserData() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! 상태: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 받은 데이터:', data);
    return data;
  } catch (error) {
    console.error('🚨 사용자 정보 요청 에러:', error);
    throw error;
  }
}
