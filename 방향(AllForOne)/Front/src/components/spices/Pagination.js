import React from 'react';
import styles from '../../css/spices/SpicesPagination.module.css';

// 한 번에 보여줄 최대 페이지 번호 개수
const MAX_VISIBLE_PAGES = 10;

/**
 * 페이지네이션 컴포넌트
 * @param {number} currentPage - 현재 페이지 번호
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러 함수
 */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // 현재 보여줄 페이지 번호들을 저장할 배열
    const pageNumbers = [];

    // 현재 페이지가 속한 그룹 번호 계산
    const currentGroup = Math.ceil(currentPage / MAX_VISIBLE_PAGES);
    // 전체 그룹 수 계산
    const totalGroups = Math.ceil(totalPages / MAX_VISIBLE_PAGES);
    
    // 현재 그룹의 시작 페이지와 끝 페이지 계산
    const startPage = (currentGroup - 1) * MAX_VISIBLE_PAGES + 1;
    const endPage = Math.min(currentGroup * MAX_VISIBLE_PAGES, totalPages);

    // 시작 페이지부터 끝 페이지까지의 번호를 배열에 추가
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // 이전 그룹으로 이동하는 핸들러
    const handlePrevGroup = () => {
        const prevGroupFirstPage = Math.max(startPage - MAX_VISIBLE_PAGES, 1);
        onPageChange(prevGroupFirstPage);
    };

    // 다음 그룹으로 이동하는 핸들러
    const handleNextGroup = () => {
        const nextGroupFirstPage = Math.min(endPage + 1, totalPages);
        onPageChange(nextGroupFirstPage);
    };

    return (
        <div className={styles.pagination}>
            {/* 첫 페이지로 이동하는 버튼 */}
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                {'<<'}
            </button>

            {/* 이전 그룹으로 이동하는 버튼 */}
            <button
                className={styles.pageButton}
                onClick={handlePrevGroup}
                disabled={currentGroup === 1}
            >
                {'<'}
            </button>
            
            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`${styles.pageButton} ${
                        currentPage === number ? styles.active : ''
                    }`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
            
            {/* 다음 그룹으로 이동하는 버튼 */}
            <button
                className={styles.pageButton}
                onClick={handleNextGroup}
                disabled={currentGroup === totalGroups}
            >
                {'>'}
            </button>

            {/* 마지막 페이지로 이동하는 버튼 */}
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
            </button>
        </div>
    );
};

export default Pagination;