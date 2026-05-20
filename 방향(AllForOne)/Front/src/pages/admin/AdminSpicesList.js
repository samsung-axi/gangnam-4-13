import React, { useState } from 'react';
import '../../css/admin/AdminSpicesList.css';
import { Search,Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminSpicesList() {
    const filters = [
        { name: 'ALL', color: '#FFFFFF' },
        { name: 'Spicy', color: '#FF5757' },
        { name: 'Chypre', color: '#FF7F43' },
        { name: 'Fruity', color: '#FFBD43' },
        { name: 'Citrus', color: '#FFE043' },
        { name: 'Green', color: '#62D66A' },
        { name: 'Floral', color: '#FF80C1' },
        { name: 'Oriental', color: '#C061FF' },
        { name: 'Musk', color: '#F8E4FF' },
        { name: 'Powdery', color: '#FFFFFF' },
        { name: 'Tobacco Leather', color: '#000000' },
        { name: 'Fougere', color: '#7ED3BB' },
        { name: 'Gourmand', color: '#A1522C' },
        { name: 'Woody', color: '#86390F' },
        { name: 'Aldehyde', color: '#98D1FF' },
        { name: 'Aquatic', color: '#56D2FF' },
        { name: 'Amber', color: '#FFE8D3' },
    ];

    const allItems = [
        { id: 1, name: 'Blood Orange', koreanName: '블러드 오렌지', category: 'Citrus 계열', filter: 'Citrus', image: '/images/bloodOrange.jpg', description: '상큼하고 톡 쏘는 블러드 오렌지의 향' },
        { id: 2, name: 'Fig', koreanName: '무화과', category: 'Fruity 계열', filter: 'Fruity', image: '/images/fig.jpg', description: '부드럽고 따뜻한 무화과의 향기' },
        { id: 3, name: 'Rose', koreanName: '장미', category: 'Floral 계열', filter: 'Floral', image: 'https://kukka-2-media-123.s3.amazonaws.com/media/contents/event_template/56599b79-734a-42b9-81b1-32c2a9c61e10.jpg', description: '우아하고 섬세한 장미의 향' },
        { id: 4, name: 'Vanilla', koreanName: '바닐라', category: 'Gourmand 계열', filter: 'Gourmand', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ2XaryE3PjV73ehMi5hSZrsDNSSAeuaSmwA&s', description: '달콤하고 부드러운 바닐라 향' },
        { id: 5, name: 'Lemon', koreanName: '레몬', category: 'Citrus 계열', filter: 'Citrus', image: 'https://kormedi.com/wp-content/uploads/2020/11/marat-musabirov-580x580.jpg', description: '신선하고 산뜻한 레몬의 향기' },
        { id: 6, name: 'Lavender', koreanName: '라벤더', category: 'Fougere 계열', filter: 'Fougere', image: 'https://dainsoap.co.kr/shopimages/sunny8875/001017000007.jpg?1389161120', description: '평온하고 안정감을 주는 라벤더의 향' },
        { id: 7, name: 'Ocean Breeze', koreanName: '오션 브리즈', category: 'Aquatic 계열', filter: 'Aquatic', image: 'https://pix10.agoda.net/hotelImages/164678/-1/98fae0da7d361de4851d0b9250bcbd8f.jpg?ca=6&ce=1&s=414x232', description: '시원하고 청량한 바다의 향기' },
        { id: 8, name: 'Ambergris', koreanName: '앰버그리스', category: 'Amber 계열', filter: 'Amber', image: 'https://cdn.imweb.me/upload/S201809105b961f2d3ff69/1d1597db9c5f6.jpg', description: '따뜻하고 부드러운 엠버 그리스의 향기' },
        { id: 9, name: 'Sandalwood', koreanName: '샌달우드', category: 'Woody 계열', filter: 'Woody', image: 'https://pimg.mk.co.kr/meet/neds/2017/02/image_readmed_2017_119807_14875724552784100.jpg', description: '고급스럽고 깊이 있는 샌달우드 향' },
        { id: 10, name: 'Patchouli', koreanName: '파출리', category: 'Oriental 계열', filter: 'Oriental', image: 'https://i.namu.wiki/i/yj-JeWpdOEgizRbVjFYhHPpfeRjExoxo0XaUmL43k78CsV-S7Nqt4Jo3m24G6vUGXqiPRWyVKG0G4U3Ewfo-0w.webp', description: '따뜻하고 이국적인 파출리 향기' },
        { id: 11, name: 'Bergamot', koreanName: '베르가못', category: 'Green 계열', filter: 'Green', image: 'https://blog.kakaocdn.net/dn/mSaif/btssf3Jt3KP/GYYzkIY5ogwBDfO3cKPRYk/img.png', description: '상쾌하고 은은한 베르가못의 향' },
        { id: 12, name: 'Cedar', koreanName: '시더', category: 'Woody 계열', filter: 'Woody', image: 'https://blog.kakaocdn.net/dn/cUSmDH/btrA33nSqs2/u0sT7gV0QJhKHfx1kMSRRk/img.jpg', description: '우아하고 자연스러운 삼나무의 향' },
        { id: 13, name: 'Jasmine', koreanName: '자스민', category: 'Floral 계열', filter: 'Floral', image: 'https://i.namu.wiki/i/tVlI5FN8DzhxMCFztMxgMVY72fw9mdVv-5XY23ANPSk4wi9Sbr-3VIBXTyaf3o7d4DXUMTGt_7obsilVBkiFUQ.webp', description: '달콤하고 강렬한 자스민의 향기' },
        { id: 14, name: 'Mint', koreanName: '민트', category: 'Green 계열', filter: 'Green', image: 'https://src.hidoc.co.kr/image/lib/2020/8/25/1598328226869_0.jpg', description: '상쾌하고 활력을 주는 민트 향' },
        { id: 15, name: 'Peach', koreanName: '복숭아', category: 'Fruity 계열', filter: 'Fruity', image: 'https://www.healthweek.co.kr/boardImage/healthweek/20200827/MC4xMjIyMTIwMCAxNTk4NTE2NjA5.jpeg', description: '달콤하고 상큼한 복숭아 향기' },
        { id: 16, name: 'Cinnamon', koreanName: '시나몬', category: 'Spicy 계열', filter: 'Spicy', image: 'https://i.namu.wiki/i/zF0wcwGksW9QUWXsASybErJSEqGJIl5Pgs8RCfXQRk0C69u3TQwaeGMvgoDHhKewB2La4p-HO-JaPaTJe-tKKg.webp', description: '따뜻하고 달콤한 계피의 향기' },
        { id: 17, name: 'Lime', koreanName: '라임', category: 'Citrus 계열', filter: 'Citrus', image: 'https://i.namu.wiki/i/qFtsfHDfxxYpJdC4dtzORabDYdi-jnrxx69Q7vK8QOZU2RX4wk6FqgIbVBHSrk2KN6HthO0OtjugcYmMe_6U7w.webp', description: '톡 쏘고 상큼한 라임의 향' },
        { id: 18, name: 'Ylang Ylang', koreanName: '일랑일랑', category: 'Floral 계열', filter: 'Floral', image: 'https://lh4.googleusercontent.com/proxy/MSvaqQcHOFFv0noCnmeqimEbtBLxDkOn245NZUE0HJ30CJTjRrdo4zHRhytGfvETw3JL3diEjpq4EseiXpb7szQfM5CwXsiePR8H', description: '부드럽고 풍부한 일랑일랑의 향기' },
    ];


    const [activeFilters, setActiveFilters] = useState(new Set(['ALL']));
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isAdding, setIsAdding] = useState(false); // 추가 모달 상태
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 모달 상태
    const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지 모달 상태
    const [selectedItem, setSelectedItem] = useState(null); // 삭제할 항목
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const itemsPerPage = 12;

    const toggleSelectMode = () => {
        setIsSelecting((prev) => {
            if (prev) {
                // 선택 모드를 종료할 때 선택 항목 초기화
                setSelectedItems(new Set());
            }
            return !prev; // 선택 모드 토글
        });
    };
    

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId); // 선택 해제
            } else {
                newSelected.add(itemId); // 선택
            }
            return newSelected;
        });
    };

    const handleAddClick = () => setIsAdding(true);
    const handleAddClose = () => setIsAdding(false);
    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setIsDeleting(true);
    };
    const handleDeleteClose = () => setIsDeleting(false);

    const handleSubmit = () => {
        if (isAdding) {
            // 추가 로직
            setSuccessMessage('항료가 성공적으로 등록되었습니다!'); // 추가 성공 메시지
            setIsAdding(false); // 추가 모달 닫기
        }

        if (isEditing) {
            // 수정 로직
            console.log("수정된 데이터:", editingItem); // 수정 데이터 확인
            setSuccessMessage('항료가 성공적으로 수정되었습니다!'); // 수정 성공 메시지
            setIsEditing(false); // 수정 모달 닫기
        }

        // 상태 초기화 (공통)
        setEditingItem(null);
    };

    const handleDeleteConfirm = () => {
        setIsDeleting(false); // 삭제 모달 닫기
        setSuccessMessage(`${selectedItem} 항료 카드가 삭제되었습니다!`); // 성공 메시지 설정
    };

    const handleEditClose = () => {
        setIsEditing(false); // 수정 모달 닫기
        setEditingItem(null); // 수정 데이터 초기화
    };

    const handleEditClick = (item) => {
        setEditingItem(item); // 선택된 항목을 수정 상태로 설정
        setIsEditing(true); // 수정 모달 열기
    };

    const handleSuccessClose = () => setSuccessMessage('');

    const filteredItems =
        activeFilters.has('ALL') || activeFilters.size === 0
            ? allItems
            : allItems.filter((item) => activeFilters.has(item.filter));

    const searchedItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.koreanName.includes(searchTerm)
    );

    const totalPages = Math.ceil(searchedItems.length / itemsPerPage);
    const displayedItems = searchedItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterClick = (filterName) => {
        const newFilters = new Set(activeFilters);

        if (filterName === 'ALL') {
            if (activeFilters.has('ALL')) {
                newFilters.clear();
            } else {
                newFilters.clear();
                newFilters.add('ALL');
            }
        } else {
            newFilters.delete('ALL');

            if (newFilters.has(filterName)) {
                newFilters.delete(filterName);
            } else {
                newFilters.add(filterName);
            }
        }

        setActiveFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getTextColor = (backgroundColor) => {
        const brightness =
            parseInt(backgroundColor.slice(1, 3), 16) * 0.299 +
            parseInt(backgroundColor.slice(3, 5), 16) * 0.587 +
            parseInt(backgroundColor.slice(5, 7), 16) * 0.114;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 업로드된 이미지 미리보기 URL
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setImagePreview(null); // 파일 선택 영역 초기화
    };

    return (
        <>
            <img src="/images/logo.png" alt="1번 이미지" className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="admin-spices-container">
                <div className="admin-spices-header">
                    <div className="admin-spices-title">향료</div>
                    <form className="admin-spices-search-bar">
                        <input
                            type="text"
                            className="admin-spices-search-input"
                            placeholder="향료명"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search
                            className="admin-spices-list-search-icon"
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                {/* 추가 모달 */}
                {isAdding && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container">
                            <h2 className="admin-spices-modal-title">향료 카드 추가하기</h2>
                            <div className="admin-spices-modal-content">
                                <div className="admin-spices-modal-row">
                                    <label>향료명</label>
                                    <input className='admin-spices-modal-row-name' type="text" placeholder="ex) Blood Orange" />
                                </div>
                                <div className="admin-spices-modal-row">
                                    <label>계열</label>
                                    <input className='admin-spices-modal-row-spices' type="text" placeholder="ex) spicy" />
                                </div>
                                <div className="admin-spices-modal-row-description">
                                    <label>향료 설명</label>
                                    <textarea placeholder="ex) 달콤한 오렌지의..." />
                                </div>
                                <div className="admin-spices-modal-row">
                                    <label className='admin-spices-modal-row-image-label'>이미지</label>
                                    <div
                                        className="admin-spices-image-upload"
                                        onClick={() => document.getElementById("file-input").click()}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="미리보기"
                                                className="admin-spices-image-preview"
                                            />
                                        ) : (
                                            <div className="admin-spices-placeholder">+</div>
                                        )}
                                        <input
                                            id="file-input"
                                            type="file"
                                            className="admin-spices-file-input"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-spices-modal-actions">
                                <button onClick={() => { handleSubmit(); handleReset(); }} className="admin-spices-save-button">
                                    저장
                                </button>
                                <button onClick={() => { handleAddClose(); handleReset(); }} className="admin-spices-cancel-button">
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container">
                            <h2 className="admin-spices-modal-title">향료 카드 수정하기</h2>
                            <div className="admin-spices-modal-content">
                                <div className="admin-spices-modal-row">
                                    <label>향료명</label>
                                    <input
                                        type="text"
                                        className='admin-spices-modal-row-name'
                                        value={editingItem?.name || ''}
                                        onChange={(e) =>
                                            setEditingItem((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        placeholder="ex) Blood Orange"
                                    />
                                </div>
                                <div className="admin-spices-modal-row">
                                    <label>계열</label>
                                    <input
                                        type="text"
                                        className='admin-spices-modal-row-spices'
                                        value={editingItem?.category || ''}
                                        onChange={(e) =>
                                            setEditingItem((prev) => ({ ...prev, category: e.target.value }))
                                        }
                                        placeholder="ex) Citrus 계열"
                                    />
                                </div>
                                <div className="admin-spices-modal-row-description">
                                    <label>향료 설명</label>
                                    <textarea
                                        value={editingItem?.description || ''}
                                        onChange={(e) =>
                                            setEditingItem((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        placeholder="ex) 상큼하고 톡 쏘는 블러드 오렌지의 향"
                                    />
                                </div>
                                <div className="admin-spices-modal-row">
                                    <label className="admin-spices-modal-row-image-label">이미지</label>
                                    <div
                                        className="admin-spices-image-upload"
                                        onClick={() => document.getElementById('file-input-edit').click()}
                                    >
                                        {imagePreview || editingItem?.image ? (
                                            <img
                                                src={imagePreview || editingItem?.image}
                                                alt="미리보기"
                                                className="admin-spices-image-preview"
                                            />
                                        ) : (
                                            <div className="admin-spices-placeholder">+</div>
                                        )}
                                        <input
                                            id="file-input-edit"
                                            type="file"
                                            className="admin-spices-file-input"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditingItem((prev) => ({ ...prev, image: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="admin-spices-modal-actions">
                                <button onClick={() => { handleSubmit(); handleReset(); }} className="admin-spices-save-button">
                                    저장
                                </button>
                                <button onClick={handleEditClose} className="admin-spices-cancel-button">
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 삭제 모달 */}
                {isDeleting && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container-delete">
                            <h2 className="admin-spices-modal-title-delete">- 향료 카드 삭제 -</h2>
                            <p>향료 카드를 삭제하시겠습니까?</p>
                            <div className="admin-spices-modal-actions-delete">
                                <button onClick={handleDeleteConfirm} className="admin-spices-confirm-button">확인</button>
                                <button onClick={handleDeleteClose} className="admin-spices-cancel-button-delete">취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 성공 메시지 모달 */}
                {successMessage && (
                    <div className="admin-spices-modal-backdrop">
                        <div className="admin-spices-modal-container-success">
                            <p className="admin-spices-success-message-success">{successMessage}</p>
                            <div className="admin-spices-modal-actions-success">
                                <button onClick={handleSuccessClose} className="admin-spices-cancel-button-success">확인</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="admin-spices-filters">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className={`admin-spices-filter-item ${activeFilters.has(filter.name) ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeFilters.has(filter.name) || activeFilters.has('ALL') ? filter.color : '#EFEDED',
                                color: activeFilters.has(filter.name) || activeFilters.has('ALL') ? getTextColor(filter.color) : '#000000',
                                borderColor: 'black',
                            }}
                            onClick={() => handleFilterClick(filter.name)}
                        >
                            {filter.name}
                        </div>
                    ))}

                    <div className="admin-spices-controls">
                        <button onClick={handleAddClick} className="admin-spices-add-button">+</button>
                        <button className="admin-spices-select-button" onClick={toggleSelectMode}>
                            {isSelecting ? '✓' : '✓'}
                        </button>
                        <button onClick={handleDeleteClick} className="admin-spices-delete-button">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="admin-spices-items-container">
                    {displayedItems.map((item) => {
                        const filterColor = filters.find((f) => f.name === item.filter)?.color || '#FFFFFF';

                        return (
                            <div
                                key={item.id}
                                className={`admin-spices-item-card ${hoveredItemId === item.id ? 'hover' : ''}`}
                                onMouseEnter={() => setHoveredItemId(item.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                onClick={() => handleCheckboxChange(item.id)}
                                style={{
                                    backgroundColor: hoveredItemId === item.id ? filterColor : '#FFFFFF',
                                }}
                            >
                                {/* 체크박스 표시 */}
                                {isSelecting && (
                                    <>
                                        {/* 체크박스 */}
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${item.id}`} // 고유 ID 부여
                                            className="admin-spices-item-select-checkbox"
                                            checked={selectedItems.has(item.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                e.stopPropagation(); // 카드 클릭 이벤트 방지
                                                handleCheckboxChange(item.id); // 체크박스 상태 변경
                                            }}
                                        />
                                        {/* 커스텀 레이블 */}
                                        <label htmlFor={`checkbox-${item.id}`}></label>
                                    </>
                                )}

                                {/* Edit 아이콘 버튼 */}
                                <button
                                    className="admin-spices-edit-button"
                                    onClick={() => handleEditClick(item)} // 수정 버튼 클릭 시 실행
                                >
                                    <Edit size={16} color="#333" /> {/* Edit 아이콘 사용 */}
                                </button>

                                {hoveredItemId === item.id ? (
                                    <div
                                        className="admin-spices-description"
                                        style={{
                                            color: getTextColor(filterColor), // 밝기에 따라 텍스트 색상 결정
                                        }}
                                    >
                                        {item.description}
                                    </div>
                                ) : (
                                    <>
                                        <img src={item.image} alt={item.name} />
                                        <div className="admin-spices-name">{item.name}</div>
                                        <div className="admin-spices-divider-small"></div>
                                        <div className="admin-spices-category">{item.category}</div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="admin-spices-pagination">
                    {/* 처음으로 이동 버튼 */}
                    <button
                        className={`admin-spices-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        {'<<'}
                    </button>

                    {/* 이전 페이지로 이동 버튼 */}
                    <button
                        className={`admin-spices-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {/* 페이지 번호 */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`admin-spices-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {/* 다음 페이지로 이동 버튼 */}
                    <button
                        className={`admin-spices-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    {/* 마지막으로 이동 버튼 */}
                    <button
                        className={`admin-spices-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        {'>>'}
                    </button>
                </div>

            </div>
        </>
    );
}

export default AdminSpicesList;
