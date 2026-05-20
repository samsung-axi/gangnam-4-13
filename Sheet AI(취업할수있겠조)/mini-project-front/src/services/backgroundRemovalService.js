import axiosCustom from '@src/config/axios';

/**
 * 이미지 배경 제거 서비스
 */
const backgroundRemovalService = {
  /**
   * 이미지 배경 제거 API 호출
   * @param {File} imageFile - 배경을 제거할 이미지 파일
   * @param {string} method - 배경 제거 방법 (기본값: 'modnet')
   * @returns {Promise<Object>} - 배경이 제거된 이미지 URL을 포함한 응답 객체
   */
  async removeBackground(imageFile, method = 'modnet') {
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('image', imageFile);

      // API 호출
      const response = await axiosCustom.post(
        `/api/remove-background?method=${method}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('배경 제거 중 오류 발생:', error);

      // 에러 메시지 처리
      let errorMessage = '배경 제거 중 오류가 발생했습니다.';

      if (error.response) {
        // 서버 응답이 있는 경우
        errorMessage =
          error.response.data.message || '서버에서 오류가 발생했습니다.';
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMessage =
          '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
      }

      throw new Error(errorMessage);
    }
  },
};

export default backgroundRemovalService;
