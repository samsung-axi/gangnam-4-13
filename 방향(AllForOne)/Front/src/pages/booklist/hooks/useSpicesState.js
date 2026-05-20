import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSpices, modifySpices, deleteSpices, fetchSpices } from '../../../module/SpicesModule';

const useSpicesState = (spices) => {
    const dispatch = useDispatch();

    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationGroup, setPaginationGroup] = useState(0);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI 상태 관리
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSpice, setSelectedSpice] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 작업 상태 관리
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingImage, setEditingImage] = useState(false);

    // ✅ 체크박스 선택 항목 관리
    const [selectedItems, setSelectedItems] = useState(new Set());

    // 페이지당 표시할 아이템 수
    const itemsPerPage = 12;

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchSpices());
                const storedUser = JSON.parse(localStorage.getItem('auth'));
                if (storedUser?.role) {
                    setRole(storedUser.role);
                }
            } catch (error) {
                handleError("데이터 로드 실패");
                console.error('Error loading spices:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [dispatch]);

    // 검색어와 필터에 따른 향료 필터링
    const filteredSpices = useMemo(() => {
        if (!Array.isArray(spices)) return [];

        return spices.filter(spice => {
            const matchesSearch = searchTerm === '' ||
                spice.nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spice.nameEn.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilters = activeFilters.length === 0 ||
                activeFilters.includes(spice.lineName);

            return matchesSearch && matchesFilters;
        });
    }, [spices, searchTerm, activeFilters]);

    // 현재 페이지의 향료 목록 계산
    const currentSpices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSpices.slice(startIndex, endIndex);
    }, [filteredSpices, currentPage, itemsPerPage]);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredSpices.length / itemsPerPage);

    // 에러 핸들러
    const handleError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => setError(null), 3000);
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = (imageUrl) => {
        setImagePreview(imageUrl);
        setSelectedSpice(prev => ({
            ...prev,
            imageUrl: imageUrl
        }));
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // 필터 핸들러
    const handleFilterClick = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
        setCurrentPage(1);
    };

    // ✅ 체크박스 상태 변경 핸들러
    const handleCheckboxChange = (id) => {
        setSelectedItems(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    // ✅ 체크박스 UI 토글 핸들러
    const handleCheckboxToggle = () => {
        setShowCheckboxes(prev => !prev);
        setSelectedItems(new Set()); // 선택된 항목 초기화
    };

    // 추가 버튼 클릭 핸들러
    const handleAddButtonClick = () => {
        setSelectedSpice({
            nameEn: '',
            nameKr: '',
            lineName: 'Spicy',
            contentKr: '',
            imageUrl: null,
            imageUrlList: []
        });
        setShowAddModal(true);
        setIsAdding(true);
        setIsEditing(false);
    };

    // 수정 버튼 클릭 핸들러
    const handleEditButtonClick = (spice) => {
        setSelectedSpice(spice);
        setShowEditModal(true);
        setIsEditing(true);
        setIsAdding(false);
    };

    // 삭제 버튼 클릭 핸들러
    const handleDeleteButtonClick = async () => {
        if (selectedItems.size === 0) {
            handleError("삭제할 항목을 선택하세요.");
            return;
        }

        setIsLoading(true);
        try {
            // 선택된 모든 항목 삭제
            for (const id of selectedItems) {
                await dispatch(deleteSpices(id));
            }
            setSelectedItems(new Set()); // 선택 항목 초기화
            await dispatch(fetchSpices()); // 데이터 새로고침
        } catch (error) {
            console.error('Error:', error);
            handleError("삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (formData) => {
        console.log("✅ handleSubmit 실행됨, formData:", formData);

        if (!formData.nameEn || !formData.nameKr || !formData.contentKr) {
            handleError("모든 필수 항목을 입력해주세요.");
            return;
        }

        setIsLoading(true);  // ✅ 로딩 화면 즉시 표시

        try {
            if (isAdding) {
                await dispatch(createSpices(formData));
            } else if (isEditing) {
                await dispatch(modifySpices({ ...formData, id: formData.id }));
            }

            console.log("✅ 데이터 수정/추가 완료, 데이터 새로고침 시작");

            await dispatch(fetchSpices());  // ✅ 데이터 새로고침

        } catch (error) {
            console.error("❌ `handleSubmit` 실패:", error);
            handleError("작업에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);  // ✅ 로딩 종료
            handleModalClose();  // ✅ 기존 입력 모달 닫기
        }
    };

    // 모달 닫기 핸들러
    const handleModalClose = async () => {
        console.log("📌 `handleModalClose` 실행됨 → 입력 모달 닫힘");

        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedSpice(null);
        setImagePreview(null);
        setIsAdding(false);
        setIsEditing(false);

        setIsLoading(true);  // ✅ 로딩 시작
        try {
            await dispatch(fetchSpices());  // ✅ 데이터 새로고침
        } catch (error) {
            console.error("❌ 데이터 새로고침 실패:", error);
            handleError("데이터 새로고침에 실패했습니다.");
        } finally {
            setIsLoading(false);  // ✅ 로딩 종료
        }
    };

    useEffect(() => {
        console.log("📢 `showSuccessModal` 변경됨:", showSuccessModal);
    }, [showSuccessModal]);

    return {
        // 상태 반환
        searchTerm,
        activeFilters,
        currentPage,
        showCheckboxes,
        selectedCard,
        showAddModal,
        showEditModal,
        successMessage,
        showSuccessModal,
        isDeleting,
        role,
        filteredSpices,
        currentSpices,
        itemsPerPage,
        selectedSpice,
        isEditing,
        isLoading,
        imagePreview,
        paginationGroup,
        editingImage,
        isAdding,
        error,
        totalFilteredItems: filteredSpices.length,
        currentPageGroup: Math.floor((currentPage - 1) / 5),
        maxPageGroup: Math.floor((totalPages - 1) / 5),
        isModalOpen: showAddModal || showEditModal,

        // 상태 설정 함수 반환
        setSearchTerm,
        setActiveFilters,
        setCurrentPage,
        setShowCheckboxes,
        setSelectedCard,
        setShowAddModal,
        setShowEditModal,
        setSelectedSpice,
        setSuccessMessage,
        setIsDeleting,
        setIsEditing,
        setImagePreview,
        setPaginationGroup,
        setEditingImage,
        setIsAdding,

        // 핸들러 반환
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteButtonClick,
        handleModalClose,
        handleSubmit,
        handlePageChange,
        handleImageUpload,
        handleError,
        totalPages,

        // 카드 컴포넌트용 핸들러
        onAddClick: handleAddButtonClick,
        onEditClick: handleEditButtonClick,
        onDeleteClick: handleDeleteButtonClick,

        // ✅ 체크박스 관련 핸들러
        selectedItems,
        handleCheckboxChange
    };
};

export default useSpicesState;