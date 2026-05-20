import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createScentCard } from '../../../module/HistoryModule';  // 실제 action 경로에 맞게 수정 필요

/**
 * 향수 추천 기능을 관리하는 Hook
 * 
 * 이 Hook은 다음 기능들을 제공합니다:
 * 1. 향수 필터 목록 (예: 스파이시, 달콤한 등)
 * 2. 향수 추천 카드 생성
 * 3. 추천 결과 표시
 */

// filters를 상수로 분리
export const SCENT_FILTERS = [
    { id: 1, name: 'Spicy', color: '#FF5757' },
    { id: 2, name: 'Fruity', color: '#FFBD43' },
    { id: 3, name: 'Citrus', color: '#FFE043' },
    { id: 4, name: 'Green', color: '#62D66A' },
    { id: 5, name: 'Aldehyde', color: '#98D1FF' },
    { id: 6, name: 'Aquatic', color: '#56D2FF' },
    { id: 7, name: 'Fougere', color: '#7ED3BB' },
    { id: 8, name: 'Gourmand', color: '#A1522C' },
    { id: 9, name: 'Woody', color: '#86390F' },
    { id: 10, name: 'Oriental', color: '#C061FF' },
    { id: 11, name: 'Floral', color: '#FF80C1' },
    { id: 12, name: 'Musk', color: '#F8E4FF' },
    { id: 13, name: 'Powdery', color: '#FFFFFF' },
    { id: 14, name: 'Tobacco Leather', color: '#000000' },
];

export const useRecommendation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filters = SCENT_FILTERS;

    /**
  * 향수 추천 카드 생성 함수
  * - 채팅 내용을 바탕으로 향수 카드를 만들고
  * - 결과 페이지로 이동합니다
  * 
  * @param {string} chatId - 채팅 세션 ID
  */

    const handleCreateScentCard = async (chatId) => {
        try {
            // 향수 카드 생성 요청
            const cardData = await dispatch(createScentCard(chatId));
            // 결과 페이지로 이동
            navigate('/history', {
                state: { recommendations: cardData.recommendations }
            });
        } catch (error) {
            console.error("향기 카드 생성 실패:", error);
        }
    };

    /**
 * 추천 결과 카드 컴포넌트
 * - 추천된 향수 정보와 필터를 표시
 */

    const RecommendationCard = ({ perfume, filters }) => {
        // ... 기존 RecommendationCard 컴포넌트 로직
    };

    return {
        filters,
        handleCreateScentCard,
        RecommendationCard
    };
};
