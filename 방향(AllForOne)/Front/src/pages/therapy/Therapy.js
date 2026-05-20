import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TherapyMain from "../../components/therapy/TherapyMain";
import TherapyCategories from "../../components/therapy/TherapyCategories";
import styles from "../../css/therapy/TherapyMain.module.css";

// 향기 테라피의 최상위 페이지 컴포넌트
// 전체 테라피 플로우를 관리하고 상태를 제어

const Therapy = () => {
    const navigate = useNavigate();
    // 카테고리 화면 표시 여부 상태
    const [showCategories, setShowCategories] = useState(false);
    // 카테고리 컴포넌트 리렌더링을 위한 키 값
    const [categoryKey, setCategoryKey] = useState(Date.now()); // 매번 새로운 key 생성

    // START 버튼 클릭 핸들러
    const handleStart = () => {
        setShowCategories(true);
        setCategoryKey(Date.now()); // START 버튼 누를 때마다 key 변경
    };

    // 로고 클릭 핸들러 추가
    const handleLogoClick = () => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.therapyContainer}>
            {/* 조건부 렌더링으로 화면 전환 */}
            {showCategories ? (
                <TherapyCategories key={categoryKey} onClose={() => setShowCategories(false)} onLogoClick={handleLogoClick} />
            ) : (
                <TherapyMain onStart={handleStart} onLogoClick={handleLogoClick} />
            )}
        </div>
    );
};


export default Therapy;
