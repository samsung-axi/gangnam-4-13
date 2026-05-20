import { evaluationResultAtom, isLoadingAtom, errorStateAtom } from '@src/config/atom.js';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { photoAnalysisService } from '@src/services/photoAnalysisService.js';

/**
 * 사진 평가 기능을 제공하는 커스텀 훅
 * @returns {Object} mutate 함수와 로딩 상태를 포함한 객체
 */
const useEvalutePhoto = () => {
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setEvaluationResult] = useAtom(evaluationResultAtom);
  const [, setErrorState] = useAtom(errorStateAtom);

  const { mutate, isLoading: isMutationLoading } = useMutation({
    mutationFn: async (file) => {
      return await photoAnalysisService.analyzePhoto(file);
    },
    onMutate: () => {
      // 상태 초기화
      setIsLoading(true);
      setEvaluationResult(null);
      setErrorState({
        isError: false,
        message: '',
        statusCode: null
      });
    },
    onSuccess: (data) => {
      // 응답 데이터를 상태에 저장
      console.log('평가 결과:', data);
      setEvaluationResult(data);
    },
    onError: (error) => {
      console.error('평가 중 오류 발생:', error);
      
      // 에러 상태 업데이트
      setErrorState({
        isError: true,
        message: error.message || '사진 분석 중 오류가 발생했습니다.',
        statusCode: error.statusCode || 500
      });
    },
    onSettled: () => {
      // 성공이든 실패든 로딩 상태 해제
      setIsLoading(false);
    },
  });

  /**
   * 에러 상태를 초기화하는 함수
   */
  const resetError = () => {
    setErrorState({
      isError: false,
      message: '',
      statusCode: null
    });
  };

  return { 
    mutate, 
    isLoading: isMutationLoading,
    resetError
  };
};

export default useEvalutePhoto;
