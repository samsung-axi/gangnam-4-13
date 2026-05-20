import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/perfumes/PerfumeDetail.module.css';
import PerfumeReviews from './PerfumeReviews';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPerfumes, selectPerfumes, fetchPerfumeById } from '../../module/PerfumeModule';
import SimilarPerfumes from '../perfumes/SimilarPerfumes';
import { resetReviews, fetchReviews } from '../../module/ReviewModule';

const PerfumeDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLongTitle, setIsLongTitle] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const location = useLocation();
    const perfumes = useSelector(selectPerfumes);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 페이지 로드/새로고침 시 항상 전체 향수 목록과 현재 향수 데이터 불러오기
    useEffect(() => {
        dispatch(fetchPerfumes());
        if (id) {
            dispatch(fetchPerfumeById(id)); // 현재 향수 상세 정보 로드
            dispatch(fetchReviews(id)); // 현재 향수의 리뷰 로드
        }
    }, [dispatch, id]);

    // ID 기반으로 현재 향수 찾기
    const perfume = useMemo(() =>
        perfumes?.find(p => p.id === parseInt(id)),
        [perfumes, id]
    );

    // 이전 페이지 정보 확인용
    useEffect(() => {
        console.log('Previous page:', location.state?.previousPage);
    }, [location]);

    // 제목 길이 체크 useEffect
    useEffect(() => {
        if (perfume?.nameEn) {
            if (perfume.nameEn.length > 20) {
                setIsLongTitle(true);
            } else {
                setIsLongTitle(false);
            }
        }
    }, [perfume?.nameEn]);

    // 이미지 자동 전환을 위한 useEffect
    useEffect(() => {
        if (perfume?.imageUrlList?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev =>
                    prev === perfume.imageUrlList.length - 1 ? 0 : prev + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [perfume?.imageUrlList?.length]);

    // 향수 변경 시 처리
    const handlePerfumeChange = async (newPerfumeId) => {
        // 기존 리뷰 초기화
        dispatch(resetReviews());
        // 새 향수의 리뷰 로드
        dispatch(fetchReviews(newPerfumeId));
        // 새 향수 데이터 로드
        dispatch(fetchPerfumeById(newPerfumeId));
        // 이미지 인덱스 초기화
        setCurrentImageIndex(0);
    };

    if (!perfume) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem'
            }}>
                향수 정보를 불러오는데 실패했습니다. <br />
                잠시 후 다시 시도해주세요.
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* 로고 */}
            <img
                src="/images/logo.png"
                alt="방향"
                className={styles.logo}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />

            {/* 메인 컨텐츠 영역 */}
            <div style={{
                position: 'relative',
                paddingBottom: '100px'
            }}>

                {/* 상단 향수 이름 */}
                <div className={styles.topSection}>
                    <h1 className={`${styles.topNameEn} ${isLongTitle ? styles.longTitleCustom : ''}`}>
                        {perfume?.nameEn}
                    </h1>
                </div>

                <div className={styles.contentWrapper}>
                    <div className={styles.imageSection}>
                        <div className={styles.imageContainer}>
                            {perfume?.imageUrlList?.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={`${perfume?.nameKr} ${index + 1}`}
                                    className={`${styles.mainImage} ${currentImageIndex === index ? styles.active : ''}`}
                                    style={{ opacity: currentImageIndex === index ? 1 : 0 }}
                                />
                            ))}

                            {/* 페이징 도트 */}
                            <div className={styles.dots}>
                                {perfume?.imageUrlList?.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`${styles.dot} ${currentImageIndex === index ? styles.activeDot : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        {/* 메인 어코드 */}
                        <div className={styles.mainAccords}>
                            {perfume.mainAccord?.split('/')?.map((accord, index) => (
                                <span key={index} className={styles.accordItem}>
                                    #{accord.trim()}
                                </span>
                            ))}
                        </div>

                        {/* 노트 정보 */}
                        <div className={styles.notes}>
                            <div className={styles.noteDivider}></div>
                            {perfume.singleNote ? (
                                // 싱글노트인 경우
                                <div className={styles.singleNoteItem}>
                                    <span className={styles.noteType}>Single Note</span>
                                    <p className={styles.noteNames}>{perfume.singleNote}</p>
                                </div>
                            ) : (
                                // 일반 노트인 경우
                                <>
                                    <div className={styles.noteItem}>
                                        <span className={styles.noteType}>Top</span>
                                        <p className={styles.noteNames}>{perfume.topNote}</p>
                                    </div>
                                    <div className={styles.noteDivider}></div>
                                    <div className={styles.noteItem}>
                                        <span className={styles.noteType}>Middle</span>
                                        <p className={styles.noteNames}>{perfume.middleNote}</p>
                                    </div>
                                    <div className={styles.noteDivider}></div>
                                    <div className={styles.noteItem}>
                                        <span className={styles.noteType}>Base</span>
                                        <p className={styles.noteNames}>{perfume.baseNote}</p>
                                    </div>
                                </>
                            )}
                            <div className={styles.noteDivider}></div>
                        </div>

                        {/* 성분 정보 */}
                        <div className={styles.ingredients}>
                            <div className={styles.ingredientsList}>
                                {/* 항상 보이는 축약된 리스트 */}
                                <div className={styles.shortList}>
                                    {perfume?.ingredients?.split(',').map((ingredient, index, array) => {
                                        if (array.length > 5 && index === 4) {
                                            return <span key={index} className={styles.ingredientItem}>...</span>;
                                        }
                                        if (index < 4 || index === array.length - 1) {
                                            return (
                                                <span key={index} className={styles.ingredientItem}>
                                                    {ingredient.trim()}
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                {/* 성분이 5개 초과일 때만 fullList 렌더링 */}
                                {perfume?.ingredients?.split(',').length > 5 && (
                                    <div className={styles.fullList}>
                                        {perfume?.ingredients?.split(',').map((ingredient, index) => (
                                            <span key={index} className={styles.ingredientItem}>
                                                {ingredient.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 브랜드 정보 */}
                        <div className={styles.brandInfo}>
                            <h3>{perfume.brand}</h3>
                            <p>{perfume.grade}</p>
                        </div>
                        <div className={styles.bottomDivider}></div>

                        {/* 하단 향수 이름 */}
                        <div className={styles.bottomName}>
                            <h2 className={styles.bottomNameEn}>{perfume.nameEn}</h2>
                            <p className={styles.bottomNameKr}>{perfume.nameKr}</p>
                        </div>

                        {/* 향수 설명 */}
                        <div className={styles.descriptionContainer}>
                            <p className={styles.description}>
                                {perfume.content}
                            </p>
                        </div>
                    </div>
                    {/* 구분선 */}
                    <div className={styles.divider}></div>

                    {/* 리뷰 섹션 */}
                    <div style={{
                        position: 'relative',
                        marginTop: '50px',
                        marginBottom: '100px'
                    }}>
                        <PerfumeReviews perfumeId={perfume.id} />
                    </div>

                    {/* 유사 향수 섹션 */}
                    <div className={styles.similarPerfumesSection}>
                        <SimilarPerfumes perfumeId={perfume.id} onPerfumeChange={handlePerfumeChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfumeDetail;