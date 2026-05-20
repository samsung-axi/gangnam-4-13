import React from "react";
import styles from "../../css/therapy/TherapyButton.module.css";

// 테라피 시작 버튼 컴포넌트
// 재사용 가능한 스타일된 버튼 컴포넌트

const TherapyButton = ({ label, onClick }) => {
    return (
        // 클릭 이벤트와 라벨을 받아 표시하는 버튼
        <button className={styles.therapyButton} onClick={onClick}>
            {label}
        </button>
    );
};

export default TherapyButton;
