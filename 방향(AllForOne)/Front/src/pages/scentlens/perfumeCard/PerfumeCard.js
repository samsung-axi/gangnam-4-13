import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../../css/scentlens/PerfumeCard.module.css';

// PerfumeCard 컴포넌트 : 개별 향수 정보를 카드 형태로 표시
const PerfumeCard = ({ perfume, currentTheme }) => {
    // perfume이 없거나 url이 없는 경우 처리
    if (!perfume || !perfume.url) {
        console.error('향수 데이터가 없거나 불완전합니다:', perfume);
        return (
            <motion.div
                className={`${styles.perfume_card} ${currentTheme ? styles[currentTheme] : ''}`}
                whileHover={{ scale: 1.02 }}
            >
                <div className={styles.perfume_info}>
                    <h3 className={styles.perfume_name}>데이터 로딩 중...</h3>
                    <p className={styles.perfume_description}>향수 정보를 불러오는 중입니다.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`${styles.perfume_card} ${currentTheme ? styles[currentTheme] : ''}`}
            whileHover={{ scale: 1.02 }}
        >
            <motion.img
                src={perfume.url}
                alt={perfume.name || '향수 이미지'}
                className={styles.perfume_image}
            />
            <div className={styles.perfume_info}>
                <h3 className={styles.perfume_name}>{perfume.name || '이름 없음'}</h3>
                <p className={styles.perfume_brand}>{perfume.brand || '브랜드 정보 없음'}</p>
                <p className={styles.perfume_description}>{perfume.content || '설명 없음'}</p>
            </div>
        </motion.div>
    );
};

export default PerfumeCard;