import React, { useEffect } from 'react';
import styles from '../../../css/chat/SearchBar.module.css';

/**
 * 채팅 내용 검색을 위한 검색바 컴포넌트
 * 
 * 주요 기능:
 * - 검색어 입력 및 검색 실행
 * - 검색 결과 간 이동 (위/아래 화살표)
 * - 검색어 초기화
 * - 검색 상태에 따른 UI 변화
 */

const SearchBar = ({
    searchInput,      // 검색어 입력값
    setSearchInput,   // 검색어 설정 함수
    handleSearch,     // 검색 실행 함수
    goToPreviousHighlight,  // 이전 검색 결과로 이동
    goToNextHighlight,      // 다음 검색 결과로 이동
    clearSearch,            // 검색어 초기화
    currentHighlightedIndex,    // 현재 하이라이트된 검색 결과 인덱스
    highlightedMessageIndexes,   // 검색된 메시지 인덱스 배열
}) => {

    // 검색어 입력 처리
    const handleChange = (e) => {
        const newValue = e.target.value;
        setSearchInput(newValue);
    };

    // 입력값 변경 감지 및 검색 처리
    useEffect(() => {
        if (!searchInput.trim()) {
            clearSearch();
            return;
        }
        handleSearch();
    }, [searchInput]);

    // 키보드 이벤트 핸들러 추가
    // 키보드 이벤트 핸들러 추가
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (searchInput) {  // 검색어가 있을 때만 동작
                if (e.key === 'Enter') {
                    // Enter: 검색 실행
                    e.preventDefault();
                    handleSearch();
                } else if (e.key === 'ArrowUp') {
                    // 위 화살표: 이전 검색 결과로
                    e.preventDefault();
                    goToPreviousHighlight();
                } else if (e.key === 'ArrowDown') {
                    // 아래 화살표: 다음 검색 결과로
                    e.preventDefault();
                    goToNextHighlight();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchInput, goToPreviousHighlight, goToNextHighlight, handleSearch]);

    // 검색 결과 개수 표시를 위한 계산
    const totalResults = highlightedMessageIndexes?.length || 0;
    const currentPosition = currentHighlightedIndex !== null ? currentHighlightedIndex + 1 : 0;

    return (
        // 검색바 컨테이너 (검색어 유무에 따라 스타일 변경)
        <div className={`${styles.searchBar} ${searchInput ? styles.searchActive : styles.searchInactive}`}>
            {/* 검색어 입력 필드 */}
            <input
                type="text"
                placeholder="검색할 단어를 입력해주세요"
                className={styles.searchInput}
                value={searchInput}
                onChange={handleChange}
            />

            {/* 검색 버튼 */}
            <button className={styles.searchButton} onClick={handleSearch}>
                <img
                    src={process.env.PUBLIC_URL + '/images/search.png'}
                    alt="Search"
                    className={styles.searchIcon}
                />
            </button>

            {/* 검색어가 있을 때만 표시되는 추가 버튼들 */}
            {searchInput && (
                <>
                    {/* 검색 결과 카운터 표시 */}
                    {totalResults > 0 && (
                        <span className={styles.resultCounter}>
                            {currentPosition}/{totalResults}
                        </span>
                    )}


                    {/* 위/아래 화살표 버튼을 하나의 컨테이너로 묶음 */}
                    <div className={styles.arrowButtonGroup}>
                        <button
                            className={styles.arrowButton}
                            onClick={goToPreviousHighlight}
                            disabled={!totalResults || currentHighlightedIndex === 0}
                        >
                            ▴
                        </button>
                        <button
                            className={styles.arrowButton}
                            onClick={goToNextHighlight}
                            disabled={!totalResults || currentHighlightedIndex === totalResults - 1}
                        >
                            ▾
                        </button>
                    </div>

                    {/* 검색어 초기화 버튼 */}
                    <button
                        className={styles.clearSearchButton}
                        onClick={clearSearch}
                    >
                        ✕
                    </button>
                </>
            )}
        </div>
    );
}

export default SearchBar;