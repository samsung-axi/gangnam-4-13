import React, { memo, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from '../messages/MessageList';
import ChatInput from '../input/ChatInput';
import SearchBar from '../search/SearchBar';
import ImageModal from '../modals/ImageModal';
import LoginModal from '../modals/LoginModal';
import styles from '../../../css/chat/ChatContainer.module.css';
import { useUpload } from '../../../pages/chat/hooks/useUpload';
import { useAuth } from '../../../pages/chat/hooks/useAuth';
import GuideMessages from '../../chat/messages/GuideMessages';

/**
 * 채팅 화면의 전체 구조를 담당하는 컴포넌트
 * 
 * 화면 구성:
 * - 상단: 헤더 (뒤로가기, 로고)
 * - 검색창: 채팅 내용 검색
 * - 중앙: 메시지 목록
 * - 하단: 메시지 입력창
 * - 팝업: 이미지 확대, 로그인 안내
 */

const ChatContainer = memo(({
    messageProps,   // 메시지 목록 관련 속성들
    inputProps,     // 입력창 관련 속성들
    searchProps,    // 검색 관련 속성들
    modalProps,     // 모달 관련 속성들
    handleGoBack    // 뒤로가기 처리 함수
}) => {

    // 이미지 업로드 관련 기능들
    const {
        selectedImages,     // 선택된 이미지들
        setSelectedImages,  // 이미지 선택 상태 변경
        handleImageUpload,  // 이미지 업로드 처리
        handleRemoveImage   // 이미지 제거 처리
    } = useUpload();

    // 로그인 상태와 비회원 채팅 횟수 관리
    const {
        isLoggedIn,
        incrementNonMemberChatCount,
        nonMemberChatCount,
        hasStartedChat,
        hasReceivedRecommendation,
        startChat,
        setRecommendationReceived,
        resetChat
    } = useAuth();

    const { loginModal } = modalProps;

    // searchProps가 undefined일 경우를 대비한 기본값 설정
    const defaultSearchProps = {
        searchInput: '',
        setSearchInput: () => { },
        handleInputChange: () => { },
        handleSearch: () => { },
        goToPreviousHighlight: () => { },
        goToNextHighlight: () => { },
        clearSearch: () => { },
        currentHighlightedIndex: null,
        highlightedMessageIndexes: []
    };

    // searchProps가 없을 경우 기본값 사용
    const finalSearchProps = searchProps || defaultSearchProps;
    const fileInputRef = useRef(null);

    // 채팅 초기화 로직
    useEffect(() => {
        if (!isLoggedIn && messageProps.messages.length === 0) {
            resetChat();
        }
    }, [isLoggedIn, messageProps.messages.length]);

    // 첫 AI 응답 시 대화 시작 상태만 설정
    useEffect(() => {
        if (!isLoggedIn && messageProps.messages.length > 0) {
            const lastMessage = messageProps.messages[messageProps.messages.length - 1];
            if (lastMessage?.type === 'AI' && !hasStartedChat) {
                startChat();
            }
        }
    }, [messageProps.messages]);

    // AI 향수 추천 응답 감지
    useEffect(() => {
        if (!isLoggedIn && messageProps.messages.length > 0) {
            const lastMessage = messageProps.messages[messageProps.messages.length - 1];
            if (lastMessage?.type === 'AI' && lastMessage?.mode === 'recommendation') {
                setRecommendationReceived();
            }
        }
    }, [messageProps.messages]);

    // 메시지 목록 컨테이너 참조
    const messageContainerRef = useRef(null);

    // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messageProps.messages]);

    // 페이지 로드 시 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, []);

    return (
        <div className={styles.chatLayout}>
            <div className={styles.ChatContainer}>
                <div className={styles.headerSection}>
                    {/* 상단 헤더 */}
                    <ChatHeader onGoBack={handleGoBack} />

                    {/* 검색창 */}
                    <SearchBar {...finalSearchProps} />
                </div>

                {/* 메세지 가림막 추가 */}
                <div className={styles.messageOverlay} />

                <div className={styles.messageSection}>
                    {/* 메시지 목록 */}
                    <MessageList
                        {...messageProps}
                        searchInput={searchProps?.searchInput}
                        openImageModal={modalProps.imageModal.openModal}
                    />

                    {/* 가이드 메시지 추가 */}
                    <GuideMessages onSend={inputProps.onSend} />
                </div>

                {/* 하단 메시지 가림막 */}
                <div className={styles.inputOverlay} />

                <div className={styles.inputSection}>
                    {/* 메시지 입력창 */}
                    <ChatInput
                        {...inputProps}
                        onSend={(message, images) => {  // images 매개변수 추가
                            if (!isLoggedIn) {
                                if (hasReceivedRecommendation || nonMemberChatCount >= 3) {
                                    loginModal.onOpen();
                                    return;
                                }
                                incrementNonMemberChatCount();
                            }
                            inputProps.onSend(message, images);  // images도 함께 전달
                        }}
                        selectedImages={selectedImages}
                        setSelectedImages={setSelectedImages}
                        handleImageUpload={handleImageUpload}
                        handleRemoveImage={handleRemoveImage}
                        fileInputRef={fileInputRef}
                    />
                </div>

                {/* 이미지 확대 모달 */}
                {modalProps?.isImageModalOpen && (
                    <ImageModal {...modalProps.imageModal} />
                )}

                {/* 로그인 안내 모달 */}
                {modalProps?.isLoginModalOpen && (
                    <LoginModal
                        isOpen={modalProps.isLoginModalOpen}
                        onClose={modalProps.loginModal.onClose}
                        onLogin={() => {
                            // 로그인 페이지로 이동하는 로직
                            window.location.href = '/login';
                            // 또는 다른 로그인 처리 로직
                        }}
                    />
                )}
            </div>
        </div>
    );
});

// 개발 도구에서 컴포넌트를 식별하기 위한 이름 설정
ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;