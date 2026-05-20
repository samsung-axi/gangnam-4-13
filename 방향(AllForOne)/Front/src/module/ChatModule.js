import { createActions, handleActions } from "redux-actions";
import { requestRecommendations, getChatHistory } from "../api/ChatAPICalls";

// 초기 상태: 채팅 모드, 응답, 추천 향수, 채팅 기록, 로딩 상태, 오류 정보 등을 포함
const initialState = {
    chatMode: "chat", 
    response: null, 
    recommendedPerfumes: [],
    chatHistory: [], 
    loading: false,
    error: null,
};

// 액션 생성: redux-actions 라이브러리를 사용하여 액션 생성자들을 정의
export const {
    chat: {
        fetchChatStart,            // 채팅 요청 시작 액션
        fetchChatSuccess,          // 채팅 요청 성공 액션 (응답 데이터 포함)
        fetchChatFail,             // 채팅 요청 실패 액션 (오류 메시지 포함)
        fetchChatHistoryStart,     // 채팅 내역 요청 시작 액션
        fetchChatHistorySuccess,   // 채팅 내역 요청 성공 액션 (채팅 기록 배열 포함)
        fetchChatHistoryFail,      // 채팅 내역 요청 실패 액션 (오류 메시지 포함)
        clearChatHistory,          // 채팅 기록 초기화 액션 (새로 추가)
    },
} = createActions({
    CHAT: {
        FETCH_CHAT_START: () => { },
        FETCH_CHAT_SUCCESS: (response) => response,
        FETCH_CHAT_FAIL: (error) => error,
        FETCH_CHAT_HISTORY_START: () => { },
        FETCH_CHAT_HISTORY_SUCCESS: (chatHistory) => chatHistory,
        FETCH_CHAT_HISTORY_FAIL: (error) => error,
        CLEAR_CHAT_HISTORY: () => { }, // 채팅 기록을 초기화하기 위한 액션
    },
});

// 채팅 응답 API 호출 함수 (비동기 thunk 액션)
// 사용자 입력 및 선택된 이미지 파일을 전달받아 서버에 추천 요청을 보내고, 응답에 따라 채팅 메시지 객체를 생성 후 상태를 업데이트
export const fetchChatResponse = (userInput, imageFile = null) => async (dispatch) => {
    try {
        // 채팅 요청 시작 액션 디스패치로 로딩 상태를 true로 설정
        dispatch(fetchChatStart());

        // 로컬 스토리지에서 사용자 인증 정보를 확인하여 userId 추출
        const localAuth = JSON.parse(localStorage.getItem("auth"));
        const userId = localAuth?.id || null;

        // 서버에 추천 요청 (사용자 입력, 이미지 파일, 사용자 ID 전달)
        const response = await requestRecommendations(userInput, imageFile, userId);
        console.log("API 응답 데이터:", response);

        // 백엔드 응답 모드에 따라 채팅 메시지 객체 생성
        // mode가 "chat"이면 일반 채팅 메시지, 그렇지 않으면 추천 메시지 형식으로 처리
        const chatMessage = response.mode === "chat" ? {
            id: response.id,
            type: "AI",
            content: response.content,
            timestamp: response.timeStamp || new Date().toISOString(),
            mode: "chat",
            recommendationType: response.recommendationType, // 추가 정보
        } : {
            id: response.id,
            type: "AI",
            mode: "recommendation",
            content: response.content,  // 백엔드에서 전달한 답변 텍스트
            lineId: response.lineId,
            imageUrl: response.imageUrl,
            recommendations: response.recommendations,
            timestamp: response.timeStamp || new Date().toISOString(),
            recommendationType: response.recommendationType, // 추가 정보
        };

        // 성공 액션 디스패치 및 생성한 채팅 메시지 반환
        dispatch(fetchChatSuccess(chatMessage));
        return chatMessage;

    } catch (error) {
        // 오류 발생 시 실패 액션 디스패치 (오류 메시지 포함)
        dispatch(fetchChatFail(error.message || "추천 요청 중 오류 발생"));
    }
};

// 전체 채팅 기록을 서버에서 가져오는 함수 (비동기 thunk 액션)
// 로컬 스토리지에서 사용자 정보를 확인한 후, 해당 사용자의 채팅 기록을 요청하고 상태를 업데이트
export const fetchChatHistory = () => async (dispatch) => {
    try {
        // 채팅 내역 요청 시작 액션 디스패치로 로딩 상태를 true로 설정
        dispatch(fetchChatHistoryStart());

        // 로컬 스토리지에서 사용자 인증 정보를 확인하여 memberId 추출
        const localAuth = JSON.parse(localStorage.getItem("auth"));
        const memberId = localAuth?.id;

        // 로그인한 사용자 정보가 없으면 오류 발생
        if (!memberId) {
            throw new Error("로그인한 사용자 정보가 없습니다.");
        }

        // 서버 API 호출: memberId를 사용하여 채팅 내역 가져오기
        const chatHistory = await getChatHistory(memberId);
        console.log("채팅 내역 API 응답:", chatHistory);

        // 성공 액션 디스패치 및 채팅 기록 반환
        dispatch(fetchChatHistorySuccess(chatHistory));
        return chatHistory;

    } catch (error) {
        // 오류 발생 시 콘솔에 에러 출력 후 실패 액션 디스패치
        console.error("채팅 내역 불러오기 실패:", error);
        dispatch(fetchChatHistoryFail(error.message || "채팅 내역을 불러오는 중 오류 발생"));
        return null;
    }
};

// 리듀서: 액션에 따라 상태(state)를 업데이트하는 함수
const chatReducer = handleActions(
    {
        // 채팅 요청 시작 시 로딩 상태 true, 오류 초기화
        [fetchChatStart]: (state) => ({ ...state, loading: true, error: null }),
        // 채팅 요청 성공 시 응답 데이터와 함께 로딩 상태 false, 채팅 기록에 새 메시지 추가
        [fetchChatSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            response: payload,
            chatHistory: [...state.chatHistory, payload],
        }),
        // 채팅 요청 실패 시 로딩 상태 false, 오류 메시지 업데이트
        [fetchChatFail]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
        // 채팅 내역 요청 시작 시 로딩 상태 true, 오류 초기화
        [fetchChatHistoryStart]: (state) => ({ ...state, loading: true, error: null }),
        // 채팅 내역 요청 성공 시 로딩 상태 false, 채팅 기록을 서버에서 가져온 기록으로 대체
        [fetchChatHistorySuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            chatHistory: payload,
        }),
        // 채팅 내역 요청 실패 시 로딩 상태 false, 오류 메시지 업데이트
        [fetchChatHistoryFail]: (state, { payload }) => ({ ...state, loading: false, error: payload }),
        // 채팅 기록 초기화 액션 처리: 채팅 기록 배열을 빈 배열로 설정
        [clearChatHistory]: (state) => ({
            ...state,
            chatHistory: [],
        }),
    },
    initialState
);

// 셀렉터: 스토어(state)에서 필요한 데이터를 추출하는 함수들
export const selectChatMode = (state) => state.chat.chatMode;     // 현재 채팅 모드 (예: "chat")
export const selectResponse = (state) => state.chat.response;         // 마지막 AI 응답 메시지
export const selectChatHistory = (state) => state.chat.chatHistory;   // 전체 채팅 기록 배열
export const selectLoading = (state) => state.chat.loading;           // 로딩 상태

export default chatReducer;
