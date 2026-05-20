import React from 'react';
import { motion } from 'framer-motion';

// PerfumeCard 컴포넌트 : 개별 향수 정보를 카드 형태로 표시
// perfume prop으로 향수 정보(이미지, 이름, 브랜드, 설명, 유사도 등)를 받음
const PerfumeCard = ({ perfume, currentTheme }) => {
    return (
        // motion.div 컴포넌트 : 애니메이션 효과를 적용한 컨테이너 요소
        <motion.div
            className={`lens-perfume-card ${currentTheme}`}
            whileHover={{ scale: 1.02 }}
        >
            {/* 향수 이미지 */}
            <motion.img
                src={perfume.url}
                alt={perfume.name}
                className="lens-perfume-image"
            />
            <div className="perfume-info">
                {/* 향수 이름 */}
                <h3 className="lens-perfume-name">{perfume.name}</h3>
                {/* 향수 브랜드 */}
                <p className="lens-perfume-brand">{perfume.brand}</p>
                {/* 향수 설명 */}
                <p className="lens-perfume-description">{perfume.description}</p>
            </div>
        </motion.div>
    );
};

export default PerfumeCard;
