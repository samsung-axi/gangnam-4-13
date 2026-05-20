import React, { useEffect } from "react";
import TherapyButton from "./TherapyButton";
import styles from "../../css/therapy/TherapyMain.module.css";
import { useNavigate } from "react-router-dom";

// 향기 테라피의 메인 시작 화면 컴포넌트
// 사용자에게 테라피 시작을 안내하는 첫 화면

const TherapyMain = ({ onStart }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 마운트될 때 자동으로 스크롤 맨 위로
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []); // 컴포넌트가 마운트될 때만 실행

    return (
        <div className={styles.therapyWrapper}>
            <div className={styles.contentContainer}>
                {/* 로고 영역 */}
                <img
                    src="/images/logo.png"
                    alt="로고 이미지"
                    className={styles.logo}
                    onClick={() => navigate('/')}
                />
                {/* 메인 콘텐츠 영역 */}
                <div className={styles.therapyMain}>
                    <h2 className={styles.heading}>향기로 마음을 채우는 작은 여유, 시작해볼까요?</h2>
                    <TherapyButton label="START" onClick={onStart} />
                </div>
            </div>
        </div>
    );
};

export default TherapyMain;