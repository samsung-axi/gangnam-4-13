import React from 'react';
import styles from '../../css/therapy/TherapyDiffuserRecommend.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    selectRecommendations, 
    selectUsageRoutine, 
    selectImageUrls,
    selectLoading,
    selectTherapyTitle
} from '../../module/TherapyModule';
import ColorLoadingScreen from '../../components/loading/ColorLoadingScreen';

const TherapyDiffuserRecommend = () => {
    const navigate = useNavigate();
    // Redux 상태 가져오기
    const recommendations = useSelector(selectRecommendations);
    const usageRoutine = useSelector(selectUsageRoutine);
    const imageUrls = useSelector(selectImageUrls);
    const loading = useSelector(selectLoading);
    const therapyTitle = useSelector(selectTherapyTitle);

    if (loading) {
        return <ColorLoadingScreen loadingText="디퓨저를 찾는 중..." />;
    }

    return (
        <div className={styles.container}>
            {/* 헤더 영역: 로고 */}
            <div className={styles.header}>
                <img
                    src="/images/logo.png"
                    alt="로고"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                />
            </div>

            {/* 메인 컨텐츠 */}
            <h1 className={styles.mainTitle}>키워드에 적합한 디퓨저를 추천합니다.</h1>
            {/* 선택된 카테고리 태그 표시 */}
            <p className={styles.categoryTag}>{therapyTitle}</p>

            {/* 디퓨저 추천 영역 */}
            <div className={styles.diffuserGrid}>
                {/* 선택된 데이터의 제품들을 매핑하여 카드로 표시 */}
                {recommendations.map((product, index) => (
                    <div key={index} className={styles.diffuserCard}>
                        <div className={styles.cardFront}>
                            <img
                                src={imageUrls[index]}
                                alt={product.name}
                                className={styles.diffuserImage}
                            />
                            <div className={styles.divider}></div>
                            <p className={styles.diffuserBrand}>{product.brand}</p>
                            <p className={styles.diffuserName}>
                                {product.name}
                            </p>
                            <p className={styles.diffuserDescription}>
                                {product.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 루틴 설명 박스 */}
            <div className={styles.routineBox}>
                <p className={styles.routineText}>{usageRoutine}</p>
            </div>
        </div>
    );
};

export default TherapyDiffuserRecommend;