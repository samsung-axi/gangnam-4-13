import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PerfumeCard from './PerfumeCard';

// PerfumeCarousel 컴포넌트: 향수 카드들을 캐러셀 형태로 표시
// props:
// - perfumes: 향수 데이터 배열
// - currentIndex: 현재 선택된 향수의 인덱스
// - setCurrentIndex: 현재 인덱스를 변경하는 함수
// - title: 캐러셀 섹션의 제목
const PerfumeCarousel = ({ perfumes, currentIndex, setCurrentIndex, title, currentTheme }) => {
    return (
        <section className="carousel-section">
            <h2>{title}</h2>

            {/* AnimatePresence : 컴포넌트가 제거될 때도 애니메이션 적용 가능 */}
            <AnimatePresence mode='wait'>
                {/* 메인 카드 영역 */}
                <motion.div 
                    key={currentIndex}
                    className="carousel-card"
                    // 오른쪽에서 나타나는 시작 애니메이션
                    initial={{ opacity: 0, x: 100 }}
                    // 애니메이션 중 완료 상태
                    animate={{ opacity: 1, x: 0 }}
                    // 왼쪽으로 사라지는 종료 애니메이션
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ 
                        duration: 0.8,  // 애니메이션 지속 시간 증가
                        ease: "easeInOut"  // 부드러운 이징 함수 적용
                    }}
                >
                    {/* 현재 선택된 향수 카드 표시 */}
                    <PerfumeCard 
                        perfume={perfumes[currentIndex]} 
                        currentTheme={currentTheme}
                    />
                </motion.div>
            </AnimatePresence>

            {/* 하단 미니 카드 네비게이션 */}
            <div className="mini-cards">
                {/* 모든 향수에 대한 미니 카드 생성 */}
                {perfumes.map((perfume, idx) => (
                    <div 
                        key={idx} 
                        // 현재 선택된 카드에 active 클래스 추가
                        className={`mini-card ${idx === currentIndex ? 'active' : ''}`}
                        // 클릭 해당 향수로 이동
                        onClick={() => setCurrentIndex(idx)}
                    >
                        <img src={perfume.url} alt={perfume.name} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PerfumeCarousel;
