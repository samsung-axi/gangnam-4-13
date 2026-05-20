import axiosCustom from '@src/config/axios.js';

/**
 * 사진 분석 API 요청을 처리하는 서비스
 */
export const photoAnalysisService = {
  /**
   * 사진을 분석하는 API 호출
   * @param {File} file - 분석할 이미지 파일
   * @returns {Promise} - API 응답 Promise
   * @throws {Error} - API 호출 실패 시 에러
   */
  analyzePhoto: async (file) => {
    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosCustom.post('/api/analyze-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      // API 에러 핸들링 및 더 의미 있는 에러 메시지 제공
      const errorMessage = error.response?.data?.message || 
                          '사진 분석 중 오류가 발생했습니다.';
      const statusCode = error.response?.status;
      
      // 커스텀 에러 객체 생성
      const enhancedError = new Error(errorMessage);
      enhancedError.statusCode = statusCode;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  }
};
