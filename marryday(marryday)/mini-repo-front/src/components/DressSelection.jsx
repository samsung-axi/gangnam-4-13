import { useState, useRef, useEffect, useCallback } from 'react'
import '../styles/DressSelection.css'
import { getDresses } from '../utils/api'

const DressSelection = ({ onDressSelect, selectedDress }) => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [scrollPosition, setScrollPosition] = useState(0)
    const [displayCount, setDisplayCount] = useState(5)
    const [categoryStartIndex, setCategoryStartIndex] = useState(0)
    const [dresses, setDresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const isDraggingRef = useRef(false)
    const isScrollingFromSlider = useRef(false)
    const containerRef = useRef(null)
    const contentRef = useRef(null)

    // 카테고리 정의
    const categories = [
        { id: 'all', name: '전체' },
        { id: 'ballgown', name: '벨라인' },
        { id: 'empire', name: '엠파이어' },
        { id: 'mermaid', name: '머메이드' },
        { id: 'mini', name: '미니드레스' },
        { id: 'aline', name: 'A라인' },
        { id: 'princess', name: '프린세스' }
    ]

    // 한 번에 보여질 카테고리 수
    const categoriesPerView = 4
    const maxStartIndex = Math.max(0, categories.length - categoriesPerView)
    const visibleCategories = categories.slice(
        categoryStartIndex,
        categoryStartIndex + categoriesPerView
    )

    // 스타일을 카테고리로 변환하는 함수
    const styleToCategory = (style) => {
        const styleMap = {
            'A라인': 'aline',
            '미니드레스': 'mini',
            '벨라인': 'ballgown',
            '프린세스': 'princess'
        }
        return styleMap[style] || 'all'
    }

    // 드레스 목록 로드
    useEffect(() => {
        const loadDresses = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await getDresses()
                
                if (response.success && response.data) {
                    // 백엔드 데이터 형식을 컴포넌트 형식으로 변환
                    const transformedDresses = response.data.map((dress) => ({
                        id: dress.id,
                        name: dress.image_name.replace(/\.[^/.]+$/, ''), // 확장자 제거하여 이름 생성
                        image: `/images/${dress.image_name}`, // 프록시 사용
                        description: `${dress.style} 스타일의 드레스`,
                        category: styleToCategory(dress.style)
                    }))
                    setDresses(transformedDresses)
                } else {
                    setError('드레스 목록을 불러올 수 없습니다.')
                    setDresses([])
                }
            } catch (err) {
                console.error('드레스 목록 로드 오류:', err)
                setError('드레스 목록을 불러오는 중 오류가 발생했습니다.')
                setDresses([])
            } finally {
                setLoading(false)
            }
        }

        loadDresses()
    }, [])

    // 선택된 카테고리에 따라 드레스 필터링
    const filteredDresses = selectedCategory === 'all'
        ? dresses
        : dresses.filter(dress => dress.category === selectedCategory)

    const handleDressClick = (dress) => {
        onDressSelect(dress)
    }

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId)
        setDisplayCount(5) // 카테고리 변경 시 표시 개수 리셋
    }

    // 드레스 카드 드래그 시작
    const handleDragStart = (e, dress) => {
        e.dataTransfer.effectAllowed = 'copy'
        e.dataTransfer.setData('application/json', JSON.stringify(dress))
    }

    // 슬라이더 위치 업데이트 (슬라이더를 드래그할 때만)
    useEffect(() => {
        if (isDraggingRef.current && containerRef.current && contentRef.current) {
            isScrollingFromSlider.current = true
            const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight
            if (maxScroll > 0) {
                contentRef.current.scrollTop = (scrollPosition / 100) * maxScroll
            }
            // 스크롤이 완료된 후 플래그 해제
            setTimeout(() => {
                isScrollingFromSlider.current = false
            }, 50)
        }
    }, [scrollPosition])

    // 스크롤 이벤트로 슬라이더 위치 동기화 (마우스 휠 사용 시)
    useEffect(() => {
        const container = contentRef.current
        if (!container) return

        const handleScroll = () => {
            // 슬라이더로 인한 스크롤인 경우 무시
            if (isScrollingFromSlider.current) return

            const maxScroll = container.scrollHeight - container.clientHeight
            if (maxScroll > 0) {
                const currentScroll = container.scrollTop
                const percentage = (currentScroll / maxScroll) * 100
                setScrollPosition(percentage)

                // 스크롤이 하단 근처에 도달하면 추가 로딩 (80% 지점)
                if (percentage > 80 && displayCount < filteredDresses.length) {
                    setDisplayCount(prev => Math.min(prev + 5, filteredDresses.length))
                }
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [displayCount, filteredDresses.length])

    const updateSliderPosition = useCallback((clientY) => {
        const track = document.querySelector('.slider-track')
        if (track) {
            const rect = track.getBoundingClientRect()
            const y = clientY - rect.top
            const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100))
            setScrollPosition(percentage)
        }
    }, [])

    const handleSliderMouseMove = useCallback((e) => {
        if (isDraggingRef.current) {
            e.preventDefault()
            updateSliderPosition(e.clientY)
        }
    }, [updateSliderPosition])

    const handleSliderMouseUp = useCallback(() => {
        isDraggingRef.current = false
        document.removeEventListener('mousemove', handleSliderMouseMove)
        document.removeEventListener('mouseup', handleSliderMouseUp)
    }, [handleSliderMouseMove])

    // 슬라이더 핸들 드래그
    const handleSliderMouseDown = (e) => {
        e.preventDefault()
        isDraggingRef.current = true
        updateSliderPosition(e.clientY)
        document.addEventListener('mousemove', handleSliderMouseMove)
        document.addEventListener('mouseup', handleSliderMouseUp)
    }

    // 화살표 클릭
    const handleArrowClick = (direction) => {
        isDraggingRef.current = true
        const step = 10
        if (direction === 'up') {
            setScrollPosition(Math.max(0, scrollPosition - step))
        } else {
            setScrollPosition(Math.min(100, scrollPosition + step))
        }
        setTimeout(() => {
            isDraggingRef.current = false
        }, 100)
    }

    // 카테고리 슬라이드 이동 (1개씩)
    const handleCategoryNavigation = (direction) => {
        if (direction === 'prev' && categoryStartIndex > 0) {
            setCategoryStartIndex(categoryStartIndex - 1)
        } else if (direction === 'next' && categoryStartIndex < maxStartIndex) {
            setCategoryStartIndex(categoryStartIndex + 1)
        }
    }

    return (
        <div className="dress-selection">
            {/* 카테고리 버튼 */}
            <div className="category-buttons-wrapper">
                <button
                    className="category-nav-button prev"
                    onClick={() => handleCategoryNavigation('prev')}
                    disabled={categoryStartIndex === 0}
                >
                    ‹
                </button>
                <div className="category-buttons">
                    {visibleCategories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <button
                    className="category-nav-button next"
                    onClick={() => handleCategoryNavigation('next')}
                    disabled={categoryStartIndex === maxStartIndex}
                >
                    ›
                </button>
            </div>

            {/* 드레스 그리드와 세로 슬라이더 */}
            <div className="dress-content-wrapper" ref={containerRef}>
                <div className="dress-grid-container" ref={contentRef}>
                    {loading && (
                        <div className="dress-grid">
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                드레스 목록을 불러오는 중...
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="dress-grid">
                            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                                {error}
                            </div>
                        </div>
                    )}
                    {!loading && !error && (
                        <div className="dress-grid">
                            {filteredDresses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    등록된 드레스가 없습니다.
                                </div>
                            ) : (
                                filteredDresses.slice(0, displayCount).map((dress) => (
                                    <div
                                        key={dress.id}
                                        data-dress-id={dress.id}
                                        className={`dress-card ${selectedDress?.id === dress.id ? 'selected' : ''}`}
                                        onClick={() => handleDressClick(dress)}
                                        draggable={true}
                                        onDragStart={(e) => handleDragStart(e, dress)}
                                    >
                                        <img src={dress.image} alt={dress.name} className="dress-image" />
                                        {selectedDress?.id === dress.id && (
                                            <div className="selected-badge">✓</div>
                                        )}
                                        <div className="drag-hint">드래그 가능</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* 세로 슬라이더 */}
                {filteredDresses.length > 0 && (
                    <div className="vertical-slider">
                        <button
                            className="slider-arrow slider-arrow-up"
                            onClick={() => handleArrowClick('up')}
                        >
                            ▲
                        </button>
                        <div className="slider-track">
                            <div
                                className="slider-handle"
                                style={{ top: `${scrollPosition}%` }}
                                onMouseDown={handleSliderMouseDown}
                            />
                        </div>
                        <button
                            className="slider-arrow slider-arrow-down"
                            onClick={() => handleArrowClick('down')}
                        >
                            ▼
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DressSelection

