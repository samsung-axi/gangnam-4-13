import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Check, Trash2 } from 'lucide-react';
import { selectSpices } from '../../module/SpicesModule';
import SpicesFilters from '../../components/spices/SpicesFilters';
import SpicesCard from '../../components/spices/SpicesCard';
import SpicesModal from '../../components/spices/SpicesModal';
import Pagination from '../../components/spices/Pagination';
import LoadingScreen from '../../components/loading/LoadingScreen';
import useSpicesState from './hooks/useSpicesState';
import styles from '../../css/spices/SpicesList.module.css';

const SpicesList = () => {
    const navigate = useNavigate();
    const spices = useSelector(selectSpices);
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
        filteredSpices,
        itemsPerPage,
        selectedSpice,
        isEditing,
        isLoading,
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteButtonClick,
        handleDeleteConfirm,
        handleSuccessClose,
        setIsDeleting,
        handleModalClose,
        handleSubmit,
        handlePageChange,
        totalPages,
        setActiveFilters,
        showSuccessModal,
        selectedItems,
        handleCheckboxChange
    } = useSpicesState(spices);

    if (isLoading) {
        return <LoadingScreen message="향료를 불러오는 중..." />;
    }

    return (
        <>
            <div className={styles.container}>
                <img
                    src="/images/logo.png"
                    alt="방향"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                />

                <div className={styles.header}>
                    <div className={styles.title}>향료</div>
                    <div className={styles.searchArea}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="향료 이름 검색 가능"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className={styles.searchIcon}
                            size={20}
                            color="#333"
                        />
                    </div>
                </div>

                <div className={styles.filterControlsContainer}>
                    <SpicesFilters
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        role={role}
                        handleAddButtonClick={handleAddButtonClick}
                        handleCheckboxToggle={handleCheckboxToggle}
                        handleDeleteButtonClick={handleDeleteButtonClick}
                    />

                    {role === 'ADMIN' && (
                        <div className={styles.listControls}>
                            <button
                                className={styles.controlButton}
                                onClick={handleAddButtonClick}
                            >
                                <Plus size={16} color="#333" />
                            </button>
                            <button
                                className={styles.controlButton}
                                onClick={handleCheckboxToggle}
                            >
                                <Check size={16} color="#333" />
                            </button>
                            <button
                                className={styles.controlButton}
                                onClick={handleDeleteButtonClick}
                                disabled={selectedItems.size === 0}
                            >
                                <Trash2 size={16} color="#333" />
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.cardContainer}>
                    {filteredSpices
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((spice) => (
                            <div key={spice.id} className={styles.card}>
                                <SpicesCard
                                    key={spice.id}
                                    spice={spice}
                                    showCheckboxes={showCheckboxes}
                                    role={role}
                                    selectedItems={selectedItems}
                                    handleCheckboxChange={handleCheckboxChange}
                                    onEditClick={handleEditButtonClick}
                                />
                            </div>
                        ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <SpicesModal
                    show={showAddModal || showEditModal}
                    onClose={handleModalClose}
                    spice={selectedSpice}
                    onSubmit={handleSubmit}
                    isEditing={isEditing}
                    successMessage={successMessage}
                    showSuccessModal={showSuccessModal}
                    onSuccessClose={handleSuccessClose}
                />
            </div>
        </>
    );
};

export default SpicesList;