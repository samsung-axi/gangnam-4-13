import { useState } from 'react';

/**
 * 채팅 내용을 검색하는 Hook
 * 
 * 이 Hook으로 할 수 있는 것들:
 * 1. 채팅 내용에서 원하는 단어 찾기
 * 2. 검색된 메시지 강조 표시하기
 * 3. 검색 결과 사이를 위아래로 이동하기
 * 4. 검색 상태 초기화 및 재검색
 */
export const useSearch = (messages) => {
    const [searchInput, setSearchInput] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [highlightedMessageIndexes, setHighlightedMessageIndexes] = useState([]);
    const [currentHighlightedIndex, setCurrentHighlightedIndex] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // 검색어 입력 처리
    const handleInputChange = (value) => {
        setSearchInput(value);
        if (!value.trim()) {
            clearSearch();
        }
    };

    // 검색 실행
    const handleSearch = () => {
        // 검색어가 비어있을 때는 모든 하이라이트 초기화
        if (!searchInput || !searchInput.trim()) {
            clearSearch();
            return;
        }

        setIsSearchMode(true);  // 검색 모드 활성화
        const searchTerm = searchInput.trim().toLowerCase();

        // 검색어가 포함된 메시지 찾기 (위에서 아래로 순차적으로 검색)
        const matchingMessages = messages.reduce((acc, msg, index) => {
            if (msg.content) {
                const content = msg.content.toString().toLowerCase();
                if (content.includes(searchTerm)) {
                    acc.push(index);
                }
            }
            return acc;
        }, []);

        // 검색 결과 설정
        setHighlightedMessageIndexes(matchingMessages);
        setFilteredMessages(matchingMessages.map(index => messages[index]));

        // 검색 결과가 있을 때 가장 마지막 메시지로 이동
        if (matchingMessages.length > 0) {
            const lastIndex = matchingMessages.length - 1;
            setCurrentHighlightedIndex(lastIndex); // 마지막 인덱스로 설정
            scrollToMessage(matchingMessages[lastIndex]); // 마지막 메시지로 스크롤
        } else {
            setCurrentHighlightedIndex(null);
        }
    };

    // 검색어 하이라이트 처리
    const highlightSearchTerm = (text) => {
        if (!text || !searchInput.trim() || !isSearchMode) return text;

        // 검색어를 정규식 특수문자로부터 이스케이프
        const escapedSearchTerm = searchInput.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        // mark 태그로 감싸서 하이라이트 처리
        return text.replace(regex, '<mark>$1</mark>');
    };

    // 검색 초기화
    const clearSearch = () => {
        setSearchInput('');
        setFilteredMessages([]);
        setHighlightedMessageIndexes([]);
        setCurrentHighlightedIndex(null);
        setIsSearchMode(false);  // 검색 모드 해제

        // 가장 마지막 메시지로 스크롤
        setTimeout(() => {
            const messageElements = document.querySelectorAll('[id^="message-"]');
            if (messageElements.length > 0) {
                const lastMessage = messageElements[messageElements.length - 1];
                lastMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    // 특정 메시지로 스크롤
    const scrollToMessage = (index) => {
        const messageElement = document.getElementById(`message-${index}`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 이전 검색 결과로 이동
    const goToPreviousHighlight = () => {
        if (currentHighlightedIndex > 0) {
            const newIndex = currentHighlightedIndex - 1;
            setCurrentHighlightedIndex(newIndex);
            scrollToMessage(highlightedMessageIndexes[newIndex]);
        }
    };

    // 다음 검색 결과로 이동
    const goToNextHighlight = () => {
        if (currentHighlightedIndex < highlightedMessageIndexes.length - 1) {
            const newIndex = currentHighlightedIndex + 1;
            setCurrentHighlightedIndex(newIndex);
            scrollToMessage(highlightedMessageIndexes[newIndex]);
        }
    };

    return {
        searchInput,
        setSearchInput,
        handleInputChange,
        handleSearch,
        goToPreviousHighlight,
        goToNextHighlight,
        clearSearch,
        currentHighlightedIndex,
        highlightedMessageIndexes,
        isSearchMode,
        highlightSearchTerm,
        filteredMessages
    };
};