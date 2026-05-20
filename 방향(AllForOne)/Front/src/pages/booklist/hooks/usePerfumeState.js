import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    fetchPerfumes,
    selectPerfumes,
    deletePerfume,
    createPerfume,
    modifyPerfume
} from '../../../module/PerfumeModule';
import { fetchBookmarks, handleDeleteBookmark } from '../../../module/BookmarkModule';

const usePerfumeState = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const perfumes = useSelector(selectPerfumes) || [];
    const auth = useSelector(state => state.auth);

    // URL에서 페이지 번호 가져오기
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 1;

    // 기본 상태 관리
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerfume, setSelectedPerfume] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [role, setRole] = useState(null);
    const [formData, setFormData] = useState({
        nameEn: "",
        nameKr: "",
        brand: "",
        grade: "",
        singleNoteList: [],
        topNoteList: [],
        middleNoteList: [],
        baseNoteList: [],
        mainAccord: "",
        ingredients: "",
        sizeOption: "",
        content: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrlCount, setImageUrlListCount] = useState(0);
    const [imageUrlList, setImageUrlList] = useState(['']);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editingImage, setEditingImage] = useState(false);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const bookmarkedPerfumes = useSelector(state => state.bookmark.bookmarkedPerfumes) || [];


    const itemsPerPage = 12;
    

    // URL 변경 감지 및 페이지 상태 업데이트
    useEffect(() => {
        const page = parseInt(queryParams.get('page')) || 1;
        setCurrentPage(page);
    }, [location.search]);

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await dispatch(fetchPerfumes());
                const storedUser = JSON.parse(localStorage.getItem('auth'));
                if (storedUser && storedUser.role) {
                    setRole(storedUser.role);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [dispatch]);

    useEffect(() => {
        if (selectedPerfume) {
            setFormData(selectedPerfume);
            setImageUrlList(selectedPerfume.imageUrlList || [selectedPerfume.imageUrl].filter(Boolean));
            setCurrentImageIndex(0);
        }
    }, [selectedPerfume]);

    const filteredPerfumes = perfumes.filter(perfume => {
        const name = perfume?.nameKr || '';
        const brand = perfume?.brand || '';
        const content = perfume?.content || '';
        return (
            (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (activeFilters.length === 0 || activeFilters.includes(perfume.grade))
        );
    });

    // 북마크 관련 핸들러
    const handleBookmarkClick = async () => {
        console.log("📌 북마크 버튼 클릭됨!"); // ✅ 클릭 이벤트 실행 확인
        setShowBookmarkModal(true); // ✅ 먼저 팝업을 띄우도록 설정

        if (auth?.id) {
            try {
                await dispatch(fetchBookmarks(auth.id)); // ✅ 북마크 데이터를 가져옴
                console.log("✅ 북마크 데이터 가져오기 성공");
            } catch (error) {
                console.error("🚨 북마크 데이터 가져오기 실패:", error);
            }
        }

        // 상태 업데이트 강제 트리거 (리렌더링 보장)
        setTimeout(() => {
            setShowBookmarkModal((prev) => !prev); // ✅ 상태 변화를 유도하여 강제 리렌더링
            setShowBookmarkModal((prev) => !prev); // ✅ 상태 변화를 두 번 유도하여 보장
        }, 50);
    };

    const handleBookmarkDelete = async (productId) => {
        try {
            await dispatch(handleDeleteBookmark(productId, auth?.id));
            dispatch(fetchBookmarks(auth?.id));
        } catch (error) {
            console.error("북마크 삭제 실패:", error);
        }
    };

    // 북마크 확인 함수 추가
    const isBookmarked = (perfumeId) => {
        return bookmarkedPerfumes.some(bookmark => bookmark.productId === perfumeId);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    

    const handleFilterClick = (filterId) => {
        setActiveFilters(prev => {
            if (prev.includes(filterId)) {
                return prev.filter(id => id !== filterId);
            }
            return [...prev, filterId];
        });
        setCurrentPage(1);
    };

    const handleCheckboxToggle = () => {
        setShowCheckboxes(!showCheckboxes);
        console.log("버튼 클릭 후 showCheckboxes 상태:", !showCheckboxes);
    };

    const handleCardCheckboxChange = (id) => {
        console.log('이전에 선택된 카드:', selectedCard);  // 이전에 선택된 카드 확인

        setSelectedCard((prevSelected) => {
            if (prevSelected === id) {
                console.log(`카드 ${id} 선택 해제됨`);  // 카드 선택 해제
                return null;  // 선택 해제 시 null로 설정
            } else {
                console.log(`카드 ${id} 선택됨`);  // 새로 선택된 카드 출력
                return id;  // 새 카드 ID로 업데이트
            }
        });
    };

    const handleAddButtonClick = () => {
        setSelectedPerfume({
            nameEn: '',
            nameKr: '',
            content: '',
            brand: '',
            grade: '오 드 퍼퓸',
            singleNoteList: [],
            topNoteList: [],
            middleNoteList: [],
            baseNoteList: [],
            mainAccord: '',
            ingredients: '',
            sizeOption: '',
            imageUrlList: [],
        });
        setShowAddModal(true);
    };

    const handleEditButtonClick = (perfume) => {
        setSelectedPerfume(perfume);
        setShowEditModal(true);
        setSelectedPerfume(perfume);
        setFormData(perfume);
        setImageUrlList(perfume.imageUrlList || []);
        setCurrentImageIndex(0);
        setIsEditing(true); 
        setShowEditModal(true);
    };
    

    const handleDeleteButtonClick = () => {
        if (selectedCard.length === 0) {
            alert("삭제할 향수를 선택하세요.");
            return;
        }
        // 선택된 향수들의 id를 사용하여 삭제
        setIsDeleting(true);  // 삭제 작업 시작
        handleDeleteConfirm(selectedCard);  // 삭제 확인 함수 호출
    };    

    const handleDeleteConfirm = async (cardsToDelete) => {
        if (isLoading || isDeleting) {
            console.log('이미 삭제 작업이 진행 중입니다.');
            return;  // 함수를 종료하여 무한 호출 방지
        }
    
        console.log('삭제 시작');
        setIsLoading(true);  // 로딩 상태 시작
    
        try {
            console.log('삭제할 향수 ID들:', cardsToDelete);
    
            // 여러 개의 향수 삭제 처리 (배치 삭제)
            await dispatch(deletePerfume(cardsToDelete));
    
            // 성공 메시지 설정
            alert("선택된 향수들이 삭제되었습니다!");
            console.log('삭제 성공:', cardsToDelete);
    
            // 상태 업데이트
            setIsDeleting(false);
            setSelectedPerfume(null);
            setSelectedCard([]);  // 삭제 후 선택된 카드들 초기화
    
            // 향수 목록 다시 불러오기
            await dispatch(fetchPerfumes());
            console.log('향수 목록 다시 불러오기 완료');
        } catch (error) {
            console.error("향수 삭제 실패:", error);
            alert("향수 삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);  // 로딩 상태 종료
            console.log('isLoading:', false);
        }
    };
    
    const handleModalClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPerfume(null);
        setFormData({});
        setImageUrlList([]);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // URL 추가 시 자동으로 마지막 이미지로 이동
    const handleImageUrlAdd = () => {
        setImageUrlList((prev) => [...prev, '']);  // ✅ 새 URL 추가
        setCurrentImageIndex((prev) => prev + 1);  // ✅ 새 URL이 추가되면 해당 인덱스로 이동
        setEditingImage(true);  // ✅ 자동으로 입력창이 열리도록 설정
    };    
    
    // URL 수정
    const handleImageUrlChange = (index, value) => {
        setImageUrlList((prev) =>
            prev.map((url, i) =>
                i === index ? (value.trim() !== '' ? value : prev[i]) : url // ✅ 빈 값이면 기존 값 유지
            )
        );
    };    

    // URL 삭제 시 자동으로 이전 이미지로 이동
    const handleImageUrlRemove = (index) => {
        setImageUrlList((prev) => prev.filter((_, i) => i !== index));
        setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));  // ✅ 삭제 후 이전 이미지로 이동
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const updatedData = {
                ...formData,
                imageUrlList: imageUrlList.length > 0
                    ? imageUrlList.filter(url => url.trim() !== '')  // ✅ 빈 값이 아니라면 유지
                    : selectedPerfume.imageUrlList || []  // ✅ 기존 값 유지
            };
    
            if (isEditing) {
                await dispatch(modifyPerfume({ id: selectedPerfume.id, ...updatedData }));
                setSuccessMessage('향수가 성공적으로 수정되었습니다!');
            } else {
                await dispatch(createPerfume(updatedData));
                setSuccessMessage('향수가 성공적으로 추가되었습니다!');
            }
    
            handleModalClose();
            await dispatch(fetchPerfumes());
        } catch (error) {
            console.error('향수 저장 실패:', error);
            alert('향수 저장에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccessMessage('');
        dispatch(fetchPerfumes());
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`/perfumelist?page=${pageNumber}`);
    };

    const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);

    return {
        searchTerm,
        selectedPerfume,
        setSelectedPerfume,
        activeFilters,
        currentPage,
        showCheckboxes,
        selectedCard,
        showAddModal,
        showEditModal,
        selectedPerfume,
        successMessage,
        isDeleting,
        role,
        filteredPerfumes,
        itemsPerPage,
        formData,
        setFormData,
        imageUrlList,
        isLoading,
        showUrlInput,
        setShowUrlInput,
        imageUrlCount,
        currentImageIndex,
        setCurrentImageIndex,
        setShowAddModal,
        setShowEditModal,
        setIsDeleting,
        handleSearch,
        handleFilterClick,
        handleCheckboxToggle,
        handleCardCheckboxChange,
        handleAddButtonClick,
        handleEditButtonClick,
        handleDeleteButtonClick,
        handleDeleteConfirm,
        handleSuccessClose,
        handleModalClose,
        handleInputChange,
        handleImageUrlAdd,
        handleImageUrlChange,
        handleImageUrlRemove,
        handleSubmit,
        totalPages,
        handlePageChange,
        setShowUrlInput,
        isEditing,
        setIsEditing,
        setImageUrlList,
        editingImage, 
        setEditingImage,
        handleBookmarkClick,
        handleBookmarkDelete,
        bookmarkedPerfumes,
        showBookmarkModal,
        setShowBookmarkModal,
        isBookmarked,
        bookmarkedPerfumes,
    };
};

export default usePerfumeState;