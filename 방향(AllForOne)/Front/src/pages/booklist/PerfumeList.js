import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PerfumeCard from '../../components/perfumes/PerfumeCard';
import PerfumeFilters from '../../components/perfumes/PerfumeFilters';
import PerfumePagination from '../../components/perfumes/Pagination';
import PerfumeModal from '../../components/perfumes/PerfumeModal';
import LoadingScreen from '../../components/loading/LoadingScreen';
import usePerfumeState from './hooks/usePerfumeState';
import styles from '../../css/perfumes/PerfumeList.module.css';
import { useDispatch } from 'react-redux';
import { fetchPerfumes } from '../../module/PerfumeModule';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPerfumes } from '../../module/PerfumeModule';
import BookmarkPopover from '../../components/perfumes/BookmarkPopover';

const PerfumeList = () => {
    const dispatch = useDispatch();
    const perfumes = useSelector(selectPerfumes);

    useEffect(() => {
        if (!perfumes || perfumes.length === 0) {
            dispatch(fetchPerfumes());
        }
    }, []);

    const navigate = useNavigate();
    const {
        searchTerm,
        activeFilters,
        currentPage,
        showCheckboxes,
        selectedCard,
        showAddModal,
        showEditModal,
        successMessage,
        isDeleting,
        role,
        filteredPerfumes,
        itemsPerPage,
        formData,
        setFormData,
        setSelectedPerfume,
        selectedPerfume,
        imageUrls,
        handleDeleteButtonClick,
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleCardCheckboxChange,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteConfirm,
        handleSuccessClose,
        setIsDeleting,
        handleModalClose,
        handleInputChange,
        handleImageUrlAdd,
        handleImageUrlChange,
        handleImageUrlRemove,
        handleSubmit,
        showUrlInput,
        setShowUrlInput,
        imageUrlCount,
        currentImageIndex,
        setCurrentImageIndex,
        handlePageChange,
        totalPages,
        isLoading,
        imageUrlList,
        isEditing,
        setIsEditing,
        setImageUrlList,
        editingImage,
        setEditingImage,
        handlePreviewClick,
        showBookmarkModal,
        setShowBookmarkModal,
        bookmarkedPerfumes,
        recommendedPerfumes,
        handleBookmarkDelete,
        handleBookmarkClick,
        isBookmarked
    } = usePerfumeState();

    if (isLoading) {
        return <LoadingScreen message="향수를 불러오는 중..." />;
    }

    return (
        <>
            <div className={styles.container}>
                {/* 로고 이미지 */}
                <img
                    src="/images/logo.png"
                    alt="방향"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                />

                <div className={styles.header}>
                    <div className={styles.title}>향수</div>
                    <form className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="브랜드명, 향수 이름 검색 가능"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className={styles.searchIcon}
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                <div className={styles.dividerLine} />

                <PerfumeFilters
                    activeFilters={activeFilters}
                    handleFilterClick={handleFilterClick}
                    role={role}
                    handleAddButtonClick={handleAddButtonClick}
                    handleCheckboxToggle={handleCheckboxToggle}
                    handleDeleteButtonClick={handleDeleteButtonClick}
                    selectedPerfume={selectedPerfume}
                    setSelectedPerfume={setSelectedPerfume}  // setSelectedPerfume 전달
                    handleBookmarkClick={handleBookmarkClick}
                />

                <div className={styles.itemsContainer}>
                    {filteredPerfumes
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((perfume) => (
                            <PerfumeCard
                                key={perfume.id}
                                perfume={perfume}
                                showCheckboxes={showCheckboxes}
                                selectedCard={selectedCard}
                                onCheckboxChange={handleCardCheckboxChange}
                                role={role}
                                onEditClick={handleEditButtonClick}
                                currentPage={currentPage}
                                isBookmarked={isBookmarked(perfume.id)}
                            />
                        ))}
                </div>

                <PerfumePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <PerfumeModal
                    show={showAddModal || showEditModal}
                    onClose={handleModalClose}
                    isEditing={showEditModal}
                    isDeleting={isDeleting}
                    onDelete={handleDeleteConfirm}
                    onDeleteClose={() => setIsDeleting(false)}
                    successMessage={successMessage}
                    onSuccessClose={handleSuccessClose}
                    setShowUrlInput={setShowUrlInput}
                    formData={formData}
                    setIsEditing={setIsEditing}
                    setFormData={setFormData}
                    imageUrlList={imageUrlList}
                    imageUrlCount={imageUrlCount}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    onInputChange={handleInputChange}
                    onImageUrlAdd={handleImageUrlAdd}
                    onImageUrlChange={handleImageUrlChange}
                    onImageUrlRemove={handleImageUrlRemove}
                    onSubmit={handleSubmit}
                    setImageUrlList={setImageUrlList}
                    editingImage={editingImage}
                    setEditingImage={setEditingImage}
                />

                {/* 북마크 모달 */}
                <BookmarkPopover
                    show={showBookmarkModal}
                    onClose={() => setShowBookmarkModal(false)}
                    bookmarkedPerfumes={bookmarkedPerfumes}
                    recommendedPerfumes={recommendedPerfumes}
                    handleBookmarkDelete={handleBookmarkDelete}
                />
            </div>
        </>
    );
};

export default PerfumeList;