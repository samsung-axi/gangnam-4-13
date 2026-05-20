import { useMessages } from './useMessages';    // 메시지 관련 기능
import { useSearch } from './useSearch';        // 검색 관련 기능
import { useUpload } from './useUpload';        // 이미지 업로드 관련 기능
import { useModal } from './useModal';          // 팝업창 관리
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { useState } from 'react';

/**
 * 채팅 기능을 모아둔 Hook
 * 
 * 이 Hook은 채팅에 필요한 모든 기능을 한 곳에서 관리합니다:
 * - 메시지 전송 및 수신
 * - 메시지 검색 기능
 * - 이미지 업로드 및 관리
 * - 모달 창(팝업) 관리
 * - 페이지 이동(뒤로 가기) 기능
 */
export const useChat = () => {
    // 페이지 이동을 위한 navigate 함수
    const navigate = useNavigate();

    // useUpload Hook에서 이미지 업로드 관련 상태 및 함수를 가져옴
    const {
        selectedImages,      // 현재 선택된 이미지 배열
        setSelectedImages,   // 선택된 이미지 배열을 업데이트하는 함수
        handleImageUpload,   // 이미지 업로드 처리 함수
        handleRemoveImage    // 이미지 제거 함수
    } = useUpload();

    // useMessages Hook에서 채팅 메시지 관련 상태와 함수를 가져옴
    const {
        messages,       // 현재 채팅 메시지 배열
        setMessages,    // 채팅 메시지 배열을 업데이트하는 함수
        isLoading,      // 메시지 전송 중 로딩 상태
        retryAvailable, // 메시지 전송 실패 시 재시도 가능 여부
        addMessage      // 메시지 전송(추가) 함수
    } = useMessages();

    // useSearch Hook을 사용해 검색 관련 상태 및 함수들을 설정
    // 메시지 배열을 인자로 전달하여 검색 대상이 되는 데이터를 지정함
    const {
        searchInput,              // 현재 검색어
        setSearchInput,           // 검색어를 업데이트하는 함수
        handleSearch,             // 검색 실행 함수
        goToPreviousHighlight,    // 이전 하이라이트 메시지로 이동하는 함수
        goToNextHighlight,        // 다음 하이라이트 메시지로 이동하는 함수
        clearSearch,              // 검색 결과를 초기화하는 함수
        currentHighlightedIndex,  // 현재 선택된 하이라이트 메시지의 인덱스
        highlightedMessageIndexes,// 하이라이트된 메시지 인덱스 배열
        isSearchMode              // 검색 모드 활성화 여부
    } = useSearch(messages);

    // 모달 관련 상태
    const { modalProps } = useModal();

    // input 상태 추가 (가이드 메시지 입력 반영)
    const [input, setInput] = useState("");

    /**
     * 메시지 전송 핸들러
     * - 사용자가 입력한 텍스트와 선택한 이미지 배열을 받아 메시지를 전송합니다.
     * - 이미지가 존재하면 첫 번째 이미지의 파일 객체를 사용하여 전송 처리합니다.
     *
     * @param {string} content - 사용자 입력 텍스트
     * @param {Array} images - 업로드된 이미지 배열
     */
    const handleSendMessage = async (content, images) => {
        console.log('handleSendMessage 호출됨', images);

        // 텍스트 메시지나 이미지가 있을 때만 메시지를 전송
        if ((images && images.length > 0) || content.trim()) {
            // 이미지가 존재할 경우 첫 번째 이미지의 file 속성을 추출
            const imageFile = images && images.length > 0 ? images[0]?.file : null;
            console.log('전송할 이미지:', imageFile);

            // 메시지 전송: addMessage 함수는 내부적으로 서버 요청 및 상태 업데이트를 수행함
            await addMessage(content, images || []);
            setSelectedImages([]); // 이미지 전송 후 초기화
            setInput(""); // 입력창 초기화
        }
    };

    // 채팅 입력 컴포넌트에 전달할 속성들을 구성
    const inputProps = {
        onSend: handleSendMessage,  // 메시지 전송 시 호출되는 함수
        setInput,                   // 가이드 메시지가 입력될 수 있도록 추가
        input,                      // 입력값 상태
        selectedImages,             // 현재 선택된 이미지 배열
        setSelectedImages,          // 선택된 이미지 배열 업데이트 함수
        handleImageUpload,          // 이미지 업로드 처리 함수
        handleRemoveImage           // 이미지 제거 함수
    };

    // 뒤로 가기 기능: 이전 페이지로 이동하기 위해 navigate 함수를 사용
    const handleGoBack = () => navigate(-1);

    return {
        // 메시지 관련 속성: 채팅 메시지 표시 및 전송에 필요한 모든 상태와 함수들
        messageProps: {
            messages,                      // 채팅 메시지 배열
            setMessages,                   // 채팅 메시지 업데이트 함수
            isLoading,                     // 로딩 상태
            retryAvailable,                // 재시도 가능 여부
            selectedImages,                // 업로드된 이미지 배열
            setSelectedImages,             // 이미지 배열 업데이트 함수
            addMessage: handleSendMessage, // 메시지 전송 함수 (실제 전송 로직 포함)
            openImageModal: modalProps.imageModal.openModal, // 이미지 모달 열기 함수
            highlightedMessageIndexes,     // 검색 결과로 하이라이트된 메시지 인덱스 배열
            currentHighlightedIndex        // 현재 선택된 하이라이트 메시지의 인덱스
        },
        inputProps, // 채팅 입력 컴포넌트에 전달할 속성들
        // 검색 관련 속성: 검색 입력, 실행 및 네비게이션 기능 제공
        searchProps: {
            searchInput,              // 현재 검색어
            setSearchInput,           // 검색어 업데이트 함수
            handleSearch,             // 검색 실행 함수
            goToPreviousHighlight,    // 이전 하이라이트 메시지로 이동 함수
            goToNextHighlight,        // 다음 하이라이트 메시지로 이동 함수
            clearSearch,              // 검색 초기화 함수
            currentHighlightedIndex,  // 현재 선택된 하이라이트 메시지 인덱스
            highlightedMessageIndexes, // 전체 하이라이트된 메시지 인덱스 배열
            isSearchMode              // 검색 모드 활성화 여부
        },
        modalProps,     // 모달(팝업) 관련 속성 및 함수들
        handleGoBack,   // 페이지 뒤로 가기 함수
    };
};