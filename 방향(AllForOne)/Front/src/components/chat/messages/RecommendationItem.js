import React, { useState, useEffect } from 'react';
import styles from '../../../css/chat/RecommendationItem.module.css';
import StarIcon from '@mui/icons-material/Star';  // 일반 추천
import StyleIcon from '@mui/icons-material/Style'; // 패션
import HomeIcon from '@mui/icons-material/Home';   // 인테리어
import SpaIcon from '@mui/icons-material/Spa';     // 테라피
import SaveScentButton from './SaveScentButton';
import { useSelector } from 'react-redux';
import { selectChatHistory } from '../../../module/ChatModule';

// 전역 변수로 마지막 lineId 저장
let globalLastLineId = null;

const RecommendationItem = ({ imageUrl, recommendations, openImageModal, chatId, recommendationType, lineId }) => {
    const [currentLineId, setCurrentLineId] = useState(lineId);
    const chatHistory = useSelector(selectChatHistory);

    // 모든 컴포넌트에서 공유할 수 있도록 로컬 스토리지에 저장
    const saveLastLineIdToStorage = (id) => {
        if (id) {
            localStorage.setItem('lastLineId', id.toString());
        }
    };

    // 로컬 스토리지에서 마지막 lineId 가져오기
    const getLastLineIdFromStorage = () => {
        const storedId = localStorage.getItem('lastLineId');
        return storedId ? parseInt(storedId, 10) : null;
    };

    // 컴포넌트 마운트 시 전체 채팅 기록에서 가장 최근의 lineId 찾기
    useEffect(() => {
        // 먼저 로컬 스토리지에서 확인
        const storedLineId = getLastLineIdFromStorage();
        
        // 전역 변수에 값이 있으면 그것을 사용
        if (globalLastLineId) {
            setCurrentLineId(globalLastLineId);
            return;
        }
        
        // 로컬 스토리지에 값이 있으면 그것을 사용
        if (storedLineId) {
            globalLastLineId = storedLineId;
            setCurrentLineId(storedLineId);
            return;
        }

        // 전체 채팅 기록을 역순으로 순회하며 가장 최근의 recommendation 메시지 찾기
        const lastValidLineId = findLastValidLineId();
        
        // 전역 변수와 로컬 스토리지에 저장
        if (lastValidLineId) {
            globalLastLineId = lastValidLineId;
            saveLastLineIdToStorage(lastValidLineId);
            setCurrentLineId(lastValidLineId);
        }
    }, [chatHistory]);

    const findLastValidLineId = () => {
        let lastValidLineId = null;

        if (chatHistory && chatHistory.length > 0) {
            // 전체 채팅 기록을 역순으로 순회하며 가장 최근의 recommendation 메시지 찾기
            [...chatHistory].reverse().some(message => {
                if (message.type === 'AI' && message.mode === 'recommendation' && message.recommendations?.length > 0) {
                    const lastRec = message.recommendations[message.recommendations.length - 1];
                    if (lastRec.lineId) {
                        lastValidLineId = lastRec.lineId;
                        return true; // 찾았으면 순회 중단
                    }
                }
                return false;
            });
        }

        return lastValidLineId || lineId;
    };

    const getRecommendationTypeInfo = (type) => {
        switch (type) {
            case 1:
                return {
                    icon: <StarIcon sx={{ fontSize: 28, color: '#fa9522' }} />,  // 일반 추천 아이콘
                    label: 'Perfume Recommendation',
                    subLabel: '당신을 위한 맞춤 향수 추천',
                    className: styles.generalRecommendation,
                    theme: '#fa9522'
                };
            case 2:
                return {
                    icon: <StyleIcon sx={{ fontSize: 28, color: '#ff6bf8' }} />,  // 패션 아이콘
                    label: 'Fashion & Fragrance',
                    subLabel: '패션과 조화로운 향수 추천',
                    className: styles.fashionRecommendation,
                    theme: '#ff6bf8'
                };
            case 3:
                return {
                    icon: <HomeIcon sx={{ fontSize: 28, color: '#51CF66' }} />,  // 인테리어 아이콘
                    label: 'Space & Scent',
                    subLabel: '공간을 채우는 향기 추천',
                    className: styles.interiorRecommendation,
                    theme: '#51CF66'
                };
            case 4:
                return {
                    icon: <SpaIcon sx={{ fontSize: 28, color: '#845EF7' }} />,  // 테라피 아이콘
                    label: 'Aroma Therapy',
                    subLabel: '당신의 삶을 위한 테라피 향수',
                    className: styles.therapyRecommendation,
                    theme: '#845EF7'
                };
            default:
                return {
                    icon: <StarIcon sx={{ fontSize: 28, color: '#007AFF' }} />,
                    label: 'Perfume Recommendation',
                    subLabel: '당신을 위한 맞춤 향수 추천',
                    className: styles.generalRecommendation,
                    theme: '#007AFF'
                };
        }
    };

    const typeInfo = getRecommendationTypeInfo(recommendationType || 1);

    const getLineColor = (lineId) => {
        if (!lineId) {
            console.log('No lineId provided');
            return '#EFEDED';
        }

        const lineColors = {
            1: '#FF5757',  // Spicy
            2: '#FFBD43',  // Fruity
            3: '#FFE043',  // Citrus
            4: '#62D66A',  // Green
            5: '#98D1FF',  // Aldehyde
            6: '#56D2FF',  // Aquatic
            7: '#7ED3BB',  // Fougere
            8: '#A1522C',  // Gourmand
            9: '#86390F',  // Woody
            10: '#C061FF', // Oriental
            11: '#FF80C1', // Floral
            12: '#F8E4FF', // Musk
            13: '#FFFFFF', // Powdery
            14: '#000000'  // Tobacco Leather
        };
        return lineColors[lineId] || '#EFEDED';
    };

    const getLineName = (lineId) => {
        const lineNames = {
            1: 'Spicy',
            2: 'Fruity',
            3: 'Citrus',
            4: 'Green',
            5: 'Aldehyde',
            6: 'Aquatic',
            7: 'Fougere',
            8: 'Gourmand',
            9: 'Woody',
            10: 'Oriental',
            11: 'Floral',
            12: 'Musk',
            13: 'Powdery',
            14: 'Tobacco Leather'
        };
        return lineNames[lineId] || '';
    };

    const currentLineColor = getLineColor(currentLineId);
    console.log('Current line color:', currentLineColor);

    return (
        <div className={`${styles.recommendationContainer} ${typeInfo.className}`}>
            <div className={styles.recommendationType} style={{ '--theme-color': typeInfo.theme }}>
                <div className={styles.typeHeader}>
                    {typeInfo.icon}
                    <div className={styles.typeTitles}>
                        <h3 className={styles.typeLabel}>{typeInfo.label}</h3>
                        <p className={styles.typeSubLabel}>{typeInfo.subLabel}</p>
                    </div>
                </div>
                <div className={styles.typeDivider} />
            </div>

            {/* 공통 이미지 영역 */}
            {imageUrl && (
                <div
                    className={styles.commonImageWrapper}
                    onClick={() => {
                        console.log('Image clicked:', imageUrl);
                        if (typeof openImageModal === 'function') {
                            openImageModal(imageUrl); // 이미지 URL을 전달
                        }
                    }}
                    style={{ 
                        cursor: 'pointer',
                        border: `5px solid ${currentLineColor}`,  // 컨테이너에 테두리 추가
                        borderRadius: '10px',  // 모서리 둥글게
                        overflow: 'hidden'     // 내부 이미지가 테두리를 넘지 않도록
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="향 이미지"
                        className={styles.commonImage}
                        style={{ 
                            width: '100%',     // 컨테이너에 맞게 너비 조정
                            height: '100%',    // 컨테이너에 맞게 높이 조정
                            objectFit: 'cover', // 이미지 비율 유지하며 채우기
                            border: 'none'      // 이미지 자체의 테두리는 제거
                        }}
                    />
                </div>
            )}

            {/* 제품 카드 그리드 */}
            <div className={styles.cardGrid}>
                {recommendations.map((product, index) => (
                    <div key={index} className={styles.recommendationCard} style={{ border: `5px solid ${currentLineColor}` }}>
                        <img
                            src={product.productImageUrls?.[0]}
                            alt={product.productNameKr}
                            className={styles.productImage}
                        />
                        <div className={styles.cardContent}>
                            <p className={styles.productLine}>
                                {getLineName(currentLineId)}
                            </p>
                            <p className={styles.productBrand}>{product.productBrand}</p>
                            <h3 className={styles.productTitle}>{product.productNameKr}</h3>
                            {product.productGrade && product.productGrade.toLowerCase() !== 'none' && (
                                <p className={styles.productGrade}>{product.productGrade}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 통합된 설명 박스 */}
            <div className={styles.unifiedDescriptionBox} style={{ border: `5px solid ${currentLineColor}` }}>
                <div className={styles.reasonSection}>
                    <h4 className={styles.descriptionTitle}>추천 이유</h4>
                    {recommendations.map((product, index) => (
                        <div key={index} className={styles.descriptionItem}>
                            <span className={styles.productLabel}>{product.productNameKr}</span>
                            <p className={styles.descriptionText}>{product.reason}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.situationSection}>
                    <h4 className={styles.descriptionTitle}>사용 상황</h4>
                    {recommendations.map((product, index) => (
                        <div key={index} className={styles.descriptionItem}>
                            <span className={styles.productLabel}>{product.productNameKr}</span>
                            <p className={styles.descriptionText}>{product.situation}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 향기 기록하기 버튼 */}
            <SaveScentButton chatId={chatId} />
        </div>
    );
};

export default RecommendationItem;