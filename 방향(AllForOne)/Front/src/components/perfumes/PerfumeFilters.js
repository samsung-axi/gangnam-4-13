import React from 'react';
import { Trash2, Heart } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeFilters.module.css';
import BookmarkPopover from './BookmarkPopover';

const PerfumeFilters = ({
    activeFilters,
    handleFilterClick,
    role,
    handleAddButtonClick,
    handleCheckboxToggle,
    selectedPerfume,      // selectedPerfume을 prop으로 받음
    setSelectedPerfume,   // setSelectedPerfume을 prop으로 받음
    handleDeleteButtonClick,  // handleDeleteButtonClick을 prop으로 받음
    handleBookmarkClick,
    showBookmarkModal,
    setShowBookmarkModal,
    bookmarkedPerfumes,
    recommendedPerfumes
}) => {
    const filterButtons = [
        { id: '오 드 퍼퓸', label: 'Eau de Perfume' },
        { id: '오 드 뚜왈렛', label: 'Eau de Toilette' },
        { id: '오 드 코롱', label: 'Eau de Cologne' },
        { id: '퍼퓸', label: 'Perfume' },
        { id: '솔리드 퍼퓸', label: 'Solid Perfume' }
    ];

    return (
        <div className={styles.filtersContainer}>
            {/* 필터 버튼 */}
            {filterButtons.map(button => (
                <button
                    key={button.id}
                    className={`${styles.filterButton} ${activeFilters.includes(button.id) ? styles.active : ''}`}
                    onClick={() => handleFilterClick(button.id)}
                >
                    {button.label}
                </button>
            ))}

            {/* 북마크 버튼과 팝오버 */}
            <div className={styles.bookmarkWrapper}>
                <button
                    className={styles.bookmarkButton}
                    onClick={() => {
                        console.log("📌 북마크 버튼 클릭됨!"); // ✅ 로그 추가
                        handleBookmarkClick();
                    }}
                    aria-label="북마크 목록 보기"
                >
                    <Heart size={30} />
                </button>


                <BookmarkPopover
                    show={showBookmarkModal}
                    onClose={() => setShowBookmarkModal(false)}
                    bookmarkedPerfumes={bookmarkedPerfumes}
                    recommendedPerfumes={recommendedPerfumes}
                />
            </div>

            {/* 관리자 컨트롤 버튼 */}
            {role === 'ADMIN' && (
                <div className={styles.adminControls}>
                    <button className={styles.addButton} onClick={handleAddButtonClick}>+</button>
                    <button className={styles.checkboxButton} onClick={handleCheckboxToggle}>✓</button>
                    <button
                        onClick={() => handleDeleteButtonClick(selectedPerfume)}
                        className={styles.deleteButton}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PerfumeFilters;
