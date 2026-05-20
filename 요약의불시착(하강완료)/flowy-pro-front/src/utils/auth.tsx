export async function logout() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/logout`,
      {
        method: 'POST',
        credentials: 'include', // 쿠키 포함해서 요청 보내기
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // 로그아웃 성공 시 후속 처리 (예: 상태 초기화, 리다이렉트)
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}
