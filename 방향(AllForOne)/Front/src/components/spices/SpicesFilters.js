import React from 'react';
import styles from '../../css/spices/SpicesFilters.module.css';
import line_ from '../../data/line_.json';

/**
 * 향료 필터링 컴포넌트
 * @param {string} searchTerm - 검색어
 * @param {function} setSearchTerm - 검색어 설정 함수
 * @param {array} activeFilters - 활성화된 필터 배열
 * @param {function} setActiveFilters - 필터 설정 함수
 */

const SpicesFilters = ({ activeFilters, setActiveFilters }) => {
    // 필터 버튼 데이터 구성 (ALL + 향료 계열들)
    const filterButtons = [
        { name: 'ALL', color: '#EFEDED' },
        ...line_.map(line => ({
            name: line.name,
            color: `#${line.color}`,
            description: line.description,
            content: line.content
        }))
    ];

        /**
     * 배경색에 따른 텍스트 색상 계산 함수
     * @param {string} backgroundColor - 배경색 헥스 코드
     * @returns {string} - 텍스트 색상 (#000000 또는 #FFFFFF)
     */

    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        // 밝기 계산
        const brightness =
            parseInt(hex.slice(0, 2), 16) * 0.299 +
            parseInt(hex.slice(2, 4), 16) * 0.587 +
            parseInt(hex.slice(4, 6), 16) * 0.114;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };


    /**
     * 필터 클릭 핸들러
     * @param {string} filterName - 클릭된 필터 이름
     */

    const handleFilterClick = (filterName) => {
        setActiveFilters(prev => {
            // ALL 버튼 클릭 처리
            if (filterName === 'ALL') {
                if (prev.length === filterButtons.length - 1) {
                    return [];  // 모든 필터가 선택된 상태면 모두 해제
                } else {
                    return filterButtons    // 아니면 모든 필터 선택
                        .filter(filter => filter.name !== 'ALL')
                        .map(filter => filter.name);
                }
            }

            // 개별 필터 토글 처리
            let newFilters;
            if (prev.includes(filterName)) {
                newFilters = prev.filter(name => name !== filterName);
            } else {
                newFilters = [...prev, filterName];
            }

            // 모든 필터가 선택되면 ALL도 포함
            if (newFilters.length === filterButtons.length - 1) {
                return ['ALL', ...newFilters];
            }
            return newFilters;
        });
    };

    return (
        <div className={styles.filters}>
            <div className={styles.filterButtons}>
                {filterButtons.map((filter) => (
                    <button
                        key={filter.name}
                        className={`${styles.filterButton} ${activeFilters.includes(filter.name) ? styles.active : ''
                            }`}
                        style={{
                            backgroundColor: activeFilters.includes(filter.name)
                                ? filter.color
                                : '#EFEDED',
                            color: getTextColor(activeFilters.includes(filter.name)
                                ? filter.color
                                : '#EFEDED'),
                            borderColor: 'black',
                        }}
                        onClick={() => handleFilterClick(filter.name)}
                        title={filter.description}
                    >
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SpicesFilters;