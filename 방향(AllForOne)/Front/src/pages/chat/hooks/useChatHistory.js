import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { selectChatHistory, fetchChatHistory, clearChatHistory } from '../../../module/ChatModule';

/**
 * 채팅 기록을 관리하는 Hook
 * 
 * 이 Hook은 채팅 기록을 불러오고 저장하는 일을 합니다.
 */

export const useChatHistory = () => {
    const dispatch = useDispatch();
    // Redux store에서 채팅 기록을 가져옵니다
    const chatHistory = useSelector(selectChatHistory);
    // 채팅 기록이 이미 로드됐는지 확인하는 변수
    const chatHistoryLoaded = useRef(false);

    /**
   * 채팅 기록을 초기화하는 함수
   */
    const resetChatHistory = () => {
        dispatch(clearChatHistory());
        chatHistoryLoaded.current = false;
    };

    /**
   * 채팅 기록을 불러오는 함수
   * - forceLoad가 true면 이미 로드되었더라도 다시 로드합니다
   */
    const loadChatHistory = async (forceLoad = false) => {
        // 강제 로드이거나 아직 로드되지 않았을 때만 실행
        if (forceLoad || !chatHistoryLoaded.current) {
            // 로드 시작을 표시
            chatHistoryLoaded.current = true;
            try {
                // 채팅 기록 불러오기
                await dispatch(fetchChatHistory());
            } catch (error) {
                console.error("채팅 기록 로드 실패:", error);
                // 다시 시도할 수 있도록 상태 초기화
                chatHistoryLoaded.current = false;
            }
        }
    };

    // 채팅 기록과 관련 함수들을 반환
    return {
        chatHistory,      // 저장된 채팅 기록
        loadChatHistory,  // 채팅 기록을 불러오는 함수
        resetChatHistory  // 채팅 기록을 초기화하는 함수
    };
};