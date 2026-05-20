import { useState, useEffect } from 'react';

export const useAuth = () => {
    // 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nonMemberChatCount, setNonMemberChatCount] = useState(0);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [hasReceivedRecommendation, setHasReceivedRecommendation] = useState(false);
    
    useEffect(() => {
        const userData = localStorage.getItem('auth');
        setIsLoggedIn(!!userData);
        
        // 로그인하지 않은 경우 모든 상태 초기화
        if (!userData) {
            localStorage.removeItem('nonMemberChatCount');
            localStorage.removeItem('hasStartedChat');
            localStorage.removeItem('hasReceivedRecommendation');
            setNonMemberChatCount(0);
            setHasStartedChat(false);
            setHasReceivedRecommendation(false);
        }
    }, []);

    // 일반 대화 카운트 증가
    const incrementNonMemberChatCount = () => {
        setNonMemberChatCount(prevCount => {
            const newCount = prevCount + 1;
            localStorage.setItem('nonMemberChatCount', newCount.toString());
            return newCount;
        });
    };

    // 대화 시작 표시
    const startChat = () => {
        setHasStartedChat(true);
        localStorage.setItem('hasStartedChat', 'true');
    };

    // 향수 추천 받음 표시
    const setRecommendationReceived = () => {
        setHasReceivedRecommendation(true);
        localStorage.setItem('hasReceivedRecommendation', 'true');
    };

    // 모든 상태 초기화
    const resetChat = () => {
        localStorage.removeItem('nonMemberChatCount');
        localStorage.removeItem('hasStartedChat');
        localStorage.removeItem('hasReceivedRecommendation');
        setNonMemberChatCount(0);
        setHasStartedChat(false);
        setHasReceivedRecommendation(false);
    };

    return {
        isLoggedIn,
        setIsLoggedIn,
        nonMemberChatCount,
        hasStartedChat,
        hasReceivedRecommendation,
        incrementNonMemberChatCount,
        startChat,
        setRecommendationReceived,
        resetChat
    };
};