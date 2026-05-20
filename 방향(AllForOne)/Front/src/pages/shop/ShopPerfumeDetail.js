// React와 관련 라이브러리 import
import React, { useState, useEffect } from 'react'; // React 기본 훅들
import { useParams, useNavigate } from 'react-router-dom'; // URL 파라미터와 페이지 이동을 위한 훅
import { useDispatch, useSelector } from 'react-redux'; // Redux 상태 관리 훅들
import { Heart, ShoppingBag, CreditCard, Menu, ArrowLeft } from 'lucide-react'; // 아이콘 컴포넌트들
import NotificationBadge from '../../components/shop/NotificationBadge'; // 알림 배지 컴포넌트
import Sidebar from '../../components/sidebar/Sidebar'; // 사이드바 컴포넌트
import EtherTheme from '../../components/perfumes/themes/EtherTheme'; // 에테르 테마 컴포넌트
import NuageTheme from '../../components/perfumes/themes/NuageTheme'; // 누아쥬 테마 컴포넌트
import LunaTheme from '../../components/perfumes/themes/LunaTheme'; // 루나 테마 컴포넌트
import SubscriptionTheme from '../../components/perfumes/themes/SubscriptionTheme'; // 정기구독 테마 컴포넌트
import {
    addToWishlistThunk,
    removeFromWishlistThunk,
    selectWishlistIds,
    fetchWishlist
} from '../../module/WishlistModule'; // 찜 목록 관련 Redux 액션들과 셀렉터
import { addToCartThunk, selectCartCount, fetchCart } from '../../module/CartModule'; // 장바구니 관련 Redux 액션들과 셀렉터
import { createSubscriptionThunk } from '../../module/SubscriptionModule'; // 구독 관련 Redux 액션
import { getPerfumeById } from '../../api/ShopAPICalls'; // 향수 상세 정보 API 호출 함수
import '../../css/shop/PerfumeDetail.css'; // 향수 상세 페이지 스타일
import styles from '../../css/shop/ShoppingTab.module.css'; // 쇼핑 탭 스타일 모듈

/**
 * 향수 상세페이지 컴포넌트
 * 향수의 상세 정보를 표시하고 찜하기, 장바구니 추가, 구매하기 기능을 제공합니다.
 */
function ShopPerfumeDetail() {
    // ===== React Router 훅들 =====
    const { id } = useParams(); // URL에서 향수 ID를 가져옴 (예: /shop/123 → id = "123")
    const navigate = useNavigate(); // 페이지 이동을 위한 함수

    // ===== Redux 훅들 =====
    const dispatch = useDispatch(); // Redux 액션을 디스패치하기 위한 함수
    const wishlistIds = useSelector(selectWishlistIds); // 찜 목록에 있는 향수 ID들의 Set
    const cartCount = useSelector(selectCartCount); // 장바구니에 담긴 상품 개수

    // ===== 로컬 상태 변수들 =====
    // localStorage에서 로그인된 사용자 정보 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));
    const memberId = auth?.id; // 로그인된 사용자의 ID (auth가 없으면 undefined)

    // 향수 상세 정보 관련 상태들
    const [perfume, setPerfume] = useState(null); // 현재 선택된 향수의 상세 정보
    const [loading, setLoading] = useState(true); // 데이터 로딩 중인지 여부
    const [error, setError] = useState(null); // 에러 발생 시 에러 메시지
    const [showActions, setShowActions] = useState(true); // 하단 액션 버튼들 표시 여부 (스크롤에 따라 변경)

    /**
     * ===== 향수 상세 정보를 가져오는 useEffect =====
     * 컴포넌트가 마운트되거나 향수 ID가 변경될 때 실행됩니다.
     */
    useEffect(() => {
        // 로그인된 사용자가 있을 때만 찜 목록과 장바구니 상태를 Redux에서 가져와서 초기화
        if (memberId) {
            dispatch(fetchWishlist(memberId)); // 사용자의 찜 목록을 가져옴
            dispatch(fetchCart(memberId)); // 사용자의 장바구니를 가져옴
        }

        /**
         * 실제 향수 상세 데이터를 백엔드에서 가져오는 비동기 함수
         */
        const fetchPerfumeDetail = async () => {
            try {
                setLoading(true); // 로딩 상태를 true로 설정

                console.log('요청된 향수 ID:', id, '타입:', typeof id);

                // 백엔드 API를 통해 향수 상세 데이터 가져오기
                const perfumeDataArray = await getPerfumeById(parseInt(id));

                console.log('백엔드에서 가져온 향수 데이터:', perfumeDataArray);

                // 배열에서 해당 ID의 향수를 찾기 (API가 배열을 반환하는 경우를 대비)
                const perfumeData = perfumeDataArray.find(p => p.id === parseInt(id)) || perfumeDataArray[0];

                console.log('선택된 향수 데이터:', perfumeData);
                console.log('향수 ID:', perfumeData.id);
                console.log('향수 영문명:', perfumeData.nameEn);
                console.log('향수 한글명:', perfumeData.nameKr);

                // ===== 테마 설정 (향수 이름에 따라 UI 테마 결정) =====
                let theme = 'luna'; // 기본 테마
                const nameToCheck = (perfumeData.nameEn || perfumeData.name || '').toLowerCase();
                console.log('향수 이름 확인:', nameToCheck);
                
                // 액센트와 특수문자를 제거하고 비교
                const normalizedName = nameToCheck
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // 액센트 제거
                    .replace(/[^\w\s]/g, '') // 특수문자 제거
                    .replace(/\s+/g, ''); // 공백 제거
                
                console.log('정규화된 이름:', normalizedName);
                
                if (normalizedName.includes('subscription') || 
                    normalizedName.includes('banghyangsubscriptionbox') || 
                    normalizedName.includes('signaturepackagebox') ||
                    normalizedName.includes('packagebox') ||
                    perfumeData.id === 4 || 
                    perfumeData.id === 1578) {
                    theme = 'subscription'; // 정기구독 테마
                    console.log('정기구독 테마 선택됨');
                } else if (normalizedName.includes('ether')) {
                    theme = 'ether'; // Ether 테마
                    console.log('에테르 테마 선택됨');
                } else if (normalizedName.includes('nuage')) {
                    theme = 'nuage'; // Nuage 테마
                    console.log('누아쥬 테마 선택됨');
                } else if (normalizedName.includes('luna')) {
                    theme = 'luna'; // Luna 테마
                    console.log('루나 테마 선택됨');
                }
                console.log('최종 선택된 테마:', theme);

                // ===== 백엔드 데이터를 프론트엔드에서 사용할 형태로 변환 =====
                const transformedPerfume = {
                    id: perfumeData.id, // 향수 고유 ID (예: 1576)
                    name: perfumeData.nameEn, // 영문 향수명 (예: "Nuage by Banghyang Eau de Parfum")
                    koreanName: perfumeData.nameKr, // 한글 향수명 (예: "누아쥬 바이 방향 오 드 퍼퓸")
                    brand: perfumeData.brand, // 브랜드명 (예: "방향")
                    mainAccord: perfumeData.mainAccord, // 메인 어코드 (예: "프루티 / 플로럴")
                    mainNote: perfumeData.middleNote || 'Unknown', // 메인 노트 (미들 노트 사용)
                    volume: perfumeData.sizeOption, // 용량 (예: "75ml")
                    price: perfumeData.price, // 가격 (예: 72000)
                    // 이미지 URL (여러 소스에서 시도)
                    image: (perfumeData.imageUrls && perfumeData.imageUrls[0]) ||
                        (perfumeData.imageUrlList && perfumeData.imageUrlList[0]) ||
                        '/images/default-perfume.png',
                    description: perfumeData.content, // 향수 설명 (예: "프랑스어로 구름, 포근하고 부드러운 이미지")
                    // 향수 노트들을 배열로 변환 (쉼표로 구분된 문자열을 배열로)
                    notes: {
                        top: perfumeData.topNote ? perfumeData.topNote.split(', ').filter(note => note.trim()) : [],
                        middle: perfumeData.middleNote ? perfumeData.middleNote.split(', ').filter(note => note.trim()) : [],
                        base: perfumeData.baseNote ? perfumeData.baseNote.split(', ').filter(note => note.trim()) : []
                    },
                    theme: theme // 결정된 테마
                };

                setPerfume(transformedPerfume); // 변환된 향수 데이터를 상태에 저장
            } catch (err) {
                console.error('향수 상세 정보 조회 실패:', err);
                setError('향수 정보를 불러오는데 실패했습니다.'); // 에러 메시지 설정
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchPerfumeDetail(); // 함수 실행
    }, [id, memberId]); // id나 memberId가 변경될 때마다 실행

    /**
     * ===== 스크롤 이벤트 핸들러 useEffect =====
     * 스크롤 방향과 푸터 위치에 따라 하단 액션 버튼들의 표시/숨김을 제어합니다.
     */
    useEffect(() => {
        let lastScrollY = window.scrollY; // 이전 스크롤 위치 저장
        let ticking = false; // 스크롤 이벤트 중복 실행 방지 플래그

        /**
         * 스크롤 방향과 푸터 위치를 확인하여 액션 버튼 표시 여부를 결정하는 함수
         */
        const updateScrollDirection = () => {
            const scrollY = window.scrollY; // 현재 스크롤 위치
            const direction = scrollY > lastScrollY ? 'down' : 'up'; // 스크롤 방향 (아래/위)

            // ===== 푸터 요소 찾기 =====
            const footer = document.querySelector('footer') || document.querySelector('.footer');
            let opacity = 1; // 액션 버튼의 투명도 (기본값: 완전 불투명)
            let pointerEvents = 'auto'; // 액션 버튼의 클릭 가능 여부 (기본값: 클릭 가능)
            let shouldHideTransform = false; // transform으로 완전히 숨길지 여부

            if (footer) {
                // 푸터가 존재하는 경우
                const footerRect = footer.getBoundingClientRect(); // 푸터의 위치 정보
                const windowHeight = window.innerHeight; // 화면 높이
                const footerDistance = footerRect.top - windowHeight; // 푸터까지의 거리

                // 푸터가 화면에 보이기 시작하는 100px 전부터 투명도 조절
                if (footerDistance < 100) {
                    opacity = Math.max(0, Math.min(1, footerDistance / 100));
                    if (opacity === 0) {
                        pointerEvents = 'none'; // 완전히 투명하면 클릭 불가능하게 설정
                    }
                }

                // 푸터가 하단 액션과 겹칠 정도로 가까워지면 transform으로 숨김
                // 하단 액션의 대략적인 높이를 80px로 가정
                if (footerRect.top < windowHeight - 40) {
                    shouldHideTransform = true;
                }
            } else {
                // 푸터를 찾을 수 없으면 문서 하단 기준으로 계산
                const documentHeight = document.documentElement.scrollHeight; // 전체 문서 높이
                const windowHeight = window.innerHeight; // 화면 높이
                const scrollBottom = documentHeight - windowHeight; // 스크롤 가능한 최대 위치
                const footerDistanceFallback = scrollBottom - scrollY; // 문서 하단까지의 거리

                if (footerDistanceFallback < 100) {
                    opacity = Math.max(0, Math.min(1, footerDistanceFallback / 100));
                    if (opacity === 0) {
                        pointerEvents = 'none';
                    }
                }

                if (scrollY > scrollBottom - 60) {
                    shouldHideTransform = true;
                }
            }

            // 아래로 스크롤 중이고 100px 이상 스크롤했는지 확인
            const scrollingDown = direction === 'down' && scrollY > 100;

            // ===== 액션 버튼 표시/숨김 결정 =====
            // 기본적으로는 스크롤 방향에 따라 숨김/표시
            // 하지만 푸터와 겹칠 것 같으면 무조건 숨김
            if (scrollingDown || shouldHideTransform) {
                setShowActions(false); // 액션 버튼 숨김
            } else {
                setShowActions(true); // 액션 버튼 표시
            }

            // ===== 하단 액션 요소에 직접 스타일 적용 =====
            const actionsElement = document.querySelector('.perfume-detail-actions');
            if (actionsElement) {
                actionsElement.style.opacity = opacity; // 투명도 적용
                actionsElement.style.pointerEvents = pointerEvents; // 클릭 가능 여부 적용
            }

            lastScrollY = scrollY > 0 ? scrollY : 0; // 현재 스크롤 위치를 이전 위치로 저장
            ticking = false; // 다음 스크롤 이벤트를 받을 수 있도록 플래그 해제
        };

        /**
         * 스크롤 이벤트 발생 시 실행되는 함수
         * requestAnimationFrame을 사용하여 성능 최적화
         */
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection); // 다음 프레임에서 실행
                ticking = true; // 중복 실행 방지
            }
        };

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', onScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
        return () => window.removeEventListener('scroll', onScroll);
    }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 실행

    /**
     * ===== 찜하기 토글 함수 =====
     * 현재 향수가 찜 목록에 있으면 제거하고, 없으면 추가합니다.
     */
    const handleToggleWishlist = () => {
        // 로그인된 사용자가 없으면 로그인 페이지로 이동
        if (!memberId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (wishlistIds.has(perfume.id)) {
            // 이미 찜 목록에 있으면 제거
            dispatch(removeFromWishlistThunk(memberId, perfume.id));
        } else {
            // 찜 목록에 없으면 추가
            dispatch(addToWishlistThunk(memberId, perfume.id));
        }
    };

    /**
     * ===== 장바구니 추가 함수 =====
     * 현재 향수를 장바구니에 추가하고 시각적 피드백을 제공합니다.
     */
    const handleAddToCart = () => {
        // 로그인된 사용자가 없으면 로그인 페이지로 이동
        if (!memberId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        // Redux를 통해 장바구니에 향수 추가 (수량: 1개)
        dispatch(addToCartThunk(memberId, perfume.id, 1));

        // ===== 장바구니 아이콘에 애니메이션 효과 추가 =====
        const cartIcons = document.querySelectorAll('.shopping-bag-icon');
        cartIcons.forEach(icon => {
            icon.style.transform = 'scale(1.3)'; // 1.3배 확대
            icon.style.transition = 'transform 0.3s ease'; // 0.3초 동안 부드럽게 애니메이션
            setTimeout(() => {
                icon.style.transform = 'scale(1)'; // 원래 크기로 복원
            }, 300);
        });

        // ===== 장바구니 배지에 애니메이션 효과 추가 =====
        const cartBadges = document.querySelectorAll('[data-badge="cart"]');
        cartBadges.forEach(badge => {
            badge.style.transform = 'scale(1.2)'; // 1.2배 확대
            badge.style.transition = 'transform 0.2s ease'; // 0.2초 동안 부드럽게 애니메이션
            setTimeout(() => {
                badge.style.transform = 'scale(1)'; // 원래 크기로 복원
            }, 200);
        });
    };

    /**
     * ===== 구매하기 함수 =====
     * 현재 향수를 바로 구매하는 기능 (현재는 콘솔 로그만 출력)
     */
    const handleBuyNow = () => {
        // 구매 페이지로 이동 (구현 예정)
        console.log('구매하기:', perfume.name);
    };

    /**
     * ===== 구독하기 함수 =====
     * 구독 상품을 구독하는 기능
     */
    const handleSubscribe = async () => {
        // 로그인된 사용자가 없으면 로그인 페이지로 이동
        if (!memberId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            // Redux를 통해 구독 생성
            const result = await dispatch(createSubscriptionThunk(memberId, perfume.id));
            
            if (result) {
                alert('구독이 완료되었습니다!');
                console.log('구독 성공:', result);
            }
        } catch (error) {
            // 에러 메시지 정확히 추출
            let errorMessage = '구독 중 오류가 발생했습니다.';
            
            if (error.message) {
                errorMessage = error.message;
            }
            
            // 사용자에게 명확한 메시지 표시
            alert(errorMessage);
            console.error('구독 실패:', errorMessage);
        }
    };

    /**
     * ===== 탭 클릭 함수 =====
     * 상단 네비게이션 탭을 클릭했을 때 해당 페이지로 이동합니다.
     */
    const handleTabClick = (tab) => {
        if (tab === 'shopping') {
            navigate('/shop'); // 쇼핑 페이지로 이동
        } else if (tab === 'wishlist') {
            navigate('/wishlist'); // 찜 목록 페이지로 이동
        } else if (tab === 'cart') {
            navigate('/cart'); // 장바구니 페이지로 이동
        }
    };

    // ===== 로딩 중일 때 렌더링 =====
    if (loading) {
        return (
            <div className="perfume-detail-loading">
                <div className="loading-spinner"></div> {/* 로딩 스피너 */}
                <p>향수 정보를 불러오는 중...</p> {/* 로딩 메시지 */}
            </div>
        );
    }

    // ===== 에러가 있을 때 렌더링 =====
    if (error || !perfume) {
        return (
            <div className="perfume-detail-error">
                <h2>향수를 찾을 수 없습니다</h2> {/* 에러 제목 */}
                <p>{error || '요청하신 향수 정보가 존재하지 않습니다.'}</p> {/* 에러 메시지 */}
                <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
                    쇼핑 계속하기 {/* 쇼핑 페이지로 돌아가는 버튼 */}
                </button>
            </div>
        );
    }

    // ===== 메인 컴포넌트 렌더링 =====
    return (
        <>
            {/* ===== 상단 로고 (클릭 시 메인 페이지로 이동) ===== */}
            <img
                src="/images/logo.png"
                alt="로고"
                className="main-logo-image"
                onClick={() => navigate('/')} // 클릭 시 메인 페이지로 이동
                style={{ cursor: 'pointer' }} // 마우스 커서를 포인터로 변경
            />

            {/* ===== 향수 상세 컨테이너 (테마에 따라 스타일 변경) ===== */}
            <div className={`perfume-detail-container ${perfume.theme}`}>
                <div className="perfume-detail-content">
                    {/* ===== 디테일 컨테이너 영역 ===== */}
                    <div className="detail-container">
                        {/* ===== 페이지 상단 헤더 영역 (ShoppingTab과 동일한 구조) ===== */}
                        <div className={styles.header}>
                            <div className={styles.headerContent}>
                                {/* ===== 뒤로가기 버튼 ===== */}
                                <button
                                    className="back-button"
                                    onClick={() => navigate(-1)} // 이전 페이지로 이동
                                >
                                    <ArrowLeft size={20} /> {/* 왼쪽 화살표 아이콘 */}
                                </button>

                                {/* ===== 네비게이션 탭 영역 ===== */}
                                <div className={styles.navTabs}>
                                    {/* ===== 쇼핑 탭 ===== */}
                                    <button
                                        className={`${styles.tabButton} ${styles.tabButtonActive}`} // 현재 활성화된 탭
                                        onClick={() => handleTabClick('shopping')}
                                    >
                                        쇼핑
                                    </button>
                                    <div className={styles.tabSeparator}></div> {/* 탭 구분선 */}

                                    {/* ===== 찜 탭 (하트 아이콘과 알림 배지 포함) ===== */}
                                    <button
                                        className={styles.tabButton}
                                        onClick={() => handleTabClick('wishlist')}
                                        data-tab="wishlist"
                                    >
                                        <div className={styles.tabIconContainer}>
                                            <Heart className={styles.tabIcon} size={16} /> {/* 하트 아이콘 */}
                                            <NotificationBadge
                                                count={wishlistIds.size} // 찜 목록 개수
                                                show={wishlistIds.size > 0} // 0개보다 많을 때만 표시
                                                type="wishlist"
                                            />
                                        </div>
                                        찜
                                    </button>
                                    <div className={styles.tabSeparator}></div> {/* 탭 구분선 */}

                                    {/* ===== 장바구니 탭 (쇼핑백 아이콘과 알림 배지 포함) ===== */}
                                    <button
                                        className={styles.tabButton}
                                        onClick={() => handleTabClick('cart')}
                                        data-tab="cart"
                                    >
                                        <div className={styles.tabIconContainer}>
                                            <div className={styles.shoppingBagIcon}></div> {/* 쇼핑백 아이콘 */}
                                            <NotificationBadge
                                                count={cartCount} // 장바구니 개수
                                                show={cartCount > 0} // 0개보다 많을 때만 표시
                                                type="cart"
                                            />
                                        </div>
                                        장바구니
                                    </button>
                                </div>
                            </div>
                            {/* ===== 헤더 하단 구분선 ===== */}
                            <div className={styles.headerLine}></div>
                        </div>

                        {/* ===== 메인 콘텐츠 ===== */}
                        <main className="perfume-detail-main">
                            <div className="perfume-detail-card">
                                {/* ===== 향수 이미지 ===== */}
                                <div className="perfume-image-container">
                                    <img
                                        src={perfume.image}
                                        alt={perfume.name}
                                        className="perfume-image"
                                    />
                                </div>

                                {/* ===== 향수 정보 ===== */}
                                <div className="perfume-info-container">
                                    <h1 className="perfume-name">{perfume.name || '향수 이름'}</h1> {/* 영문 향수명 */}
                                    <h2 className="perfume-korean-name">{perfume.koreanName || '향수 한글명'}</h2> {/* 한글 향수명 */}

                                    {/* ===== 향수 속성 정보 ===== */}
                                    <div className="perfume-attributes">
                                        {/* ===== 메인 어코드 ===== */}
                                        <div className="attribute-item">
                                            <span className="attribute-label">Main Accord</span>
                                            <span className="attribute-value accord-tag">{perfume.mainAccord || 'Unknown'}</span>
                                        </div>
                                        {/* ===== 메인 노트 (정기구독 테마가 아닐 때만 표시) ===== */}
                                        {perfume.theme !== 'subscription' && (
                                            <div className="attribute-item">
                                                <span className="attribute-label">Main Note</span>
                                                <span className="attribute-value">{perfume.mainNote || 'Unknown'}</span>
                                            </div>
                                        )}
                                        {/* ===== 용량 ===== */}
                                        <div className="attribute-item">
                                            <span className="attribute-label">용량</span>
                                            <span className="attribute-value">{perfume.volume || '50ml'}</span>
                                        </div>
                                        {/* ===== 가격 ===== */}
                                        <div className="attribute-item">
                                            <span className="attribute-label">가격</span>
                                            <span className="attribute-value price">₩{(perfume.price || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* ===== 향수 노트 이미지 (정기구독 테마가 아닐 때만 표시) ===== */}
                                    {perfume.theme !== 'subscription' && (
                                        <div className="fragrance-notes-image">
                                            <img
                                                src={`/images/${perfume.theme}-note.png`}
                                                alt={`${perfume.theme} 노트`}
                                                className="notes-image"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* ===== 테마별 상세 내용 섹션 ===== */}
                        {perfume && (
                            <div className="perfume-theme-details">
                                {console.log('렌더링 시 perfume.theme:', perfume.theme)}
                                {perfume.theme === 'subscription' && <SubscriptionTheme perfume={perfume} />}
                                {perfume.theme === 'ether' && <EtherTheme perfume={perfume} />}
                                {perfume.theme === 'nuage' && <NuageTheme perfume={perfume} />}
                                {perfume.theme === 'luna' && <LunaTheme perfume={perfume} />}
                            </div>
                        )}

                        {/* ===== 하단 액션 버튼들 (스크롤에 따라 표시/숨김) ===== */}
                        <div className={`perfume-detail-actions ${showActions ? 'show' : 'hide'}`}>
                            {/* ===== 찜하기 버튼 ===== */}
                            <button
                                className={`wishlist-btn ${wishlistIds.has(perfume.id) ? 'active' : ''}`} // 찜 목록에 있으면 active 클래스 추가
                                onClick={handleToggleWishlist}
                            >
                                <Heart className="action-icon" size={20} /> {/* 하트 아이콘 */}
                            </button>

                            {/* ===== 정기구독 테마일 때 구독하기 버튼, 아닐 때 장바구니/구매하기 버튼 ===== */}
                            {perfume.theme === 'subscription' ? (
                                /* ===== 구독하기 버튼 ===== */
                                <button className="subscribe-btn" onClick={handleSubscribe}>
                                    <CreditCard className="action-icon" size={20} /> {/* 신용카드 아이콘 */}
                                    구독하기
                                </button>
                            ) : (
                                <>
                                    {/* ===== 장바구니 추가 버튼 ===== */}
                                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                        <ShoppingBag className="action-icon" size={20} /> {/* 쇼핑백 아이콘 */}
                                        장바구니
                                    </button>

                                    {/* ===== 구매하기 버튼 ===== */}
                                    <button className="buy-now-btn" onClick={handleBuyNow}>
                                        <CreditCard className="action-icon" size={20} /> {/* 신용카드 아이콘 */}
                                        구매하기
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== 사이드바 ===== */}
            <Sidebar />
        </>
    );
}

export default ShopPerfumeDetail;
