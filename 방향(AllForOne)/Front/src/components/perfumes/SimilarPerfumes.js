import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/SimilarPerfumes.module.css';
import { getProductDetail } from '../../api/PerfumeAPICalls';
import { useNavigate } from 'react-router-dom';

const SimilarPerfumes = ({ perfumeId ,initialData = null, onPerfumeChange }) => {
    const [noteSimilarPerfumes, setNoteSimilarPerfumes] = useState([]);
    const [designSimilarPerfumes, setDesignSimilarPerfumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 초기 데이터가 이미 있으면 바로 사용
        if (initialData) {
            setNoteSimilarPerfumes(initialData.note_based || []);
            setDesignSimilarPerfumes(initialData.design_based || []);
            setIsLoading(false);
            return;
        }

        const loadSimilarPerfumes = async () => {
            if (!perfumeId) return;

            try {
                setIsLoading(true);
                const productDetail = await getProductDetail(perfumeId);
                
                // 통합 API 응답에서 similarPerfumes 추출
                const similarData = productDetail.similarPerfumes || {};
                
                setNoteSimilarPerfumes(similarData.note_based || []);
                setDesignSimilarPerfumes(similarData.design_based || []);
            } catch (err) {
                console.error("향수 상세 정보 불러오기 실패", err);
                setNoteSimilarPerfumes([]);
                setDesignSimilarPerfumes([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadSimilarPerfumes();
    }, [perfumeId, initialData]);

    const handleCardClick = async (id) => {
        // 향수 변경 시 부모 컴포넌트에 알림
        if (onPerfumeChange) {
            onPerfumeChange(id);
        }
        
        await navigate(`/perfumes/${id}`);
        
        // 페이지 최상단으로 즉시 이동
        window.scrollTo(0, 0);
    };

    const PerfumeCardList = ({ perfumes, title }) => (
        <div className={styles.similarSection}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.similarList}>
                {perfumes.map((perfume) => (
                    <div
                        key={perfume.id}
                        className={styles.similarCard}
                        onClick={() => handleCardClick(perfume.id)}
                    >
                        <img
                            src={perfume.imageUrl}
                            alt={perfume.nameKr}
                        />
                        <h4>{perfume.nameKr}</h4>
                        <p className={styles.mainAccord}>{perfume.mainAccord}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    if (!noteSimilarPerfumes.length && !designSimilarPerfumes.length) {
        return <div className={styles.noSimilar}>유사한 향수가 없습니다.</div>;
    }


    return (
        <div className={styles.similarContainer}>
            {noteSimilarPerfumes.length > 0 && (
                <PerfumeCardList
                    perfumes={noteSimilarPerfumes}
                    title="노트 기반 추천"
                />
            )}
            {designSimilarPerfumes.length > 0 && (
                <PerfumeCardList
                    perfumes={designSimilarPerfumes}
                    title="디자인 기반 추천"
                />
            )}
        </div>
    );
};

export default SimilarPerfumes;
