import React from "react";
import "../../css/loading/LoadingScreen.css";

const LoadingScreen = () => {
    return (
        <div className="modal">
            {/* 로딩 컨테이너 */}
            <div className="loading-container">
                {/* 중앙 향수 병 */}
                <div className="perfume-bottle"></div>
                {/* 회전하는 원형 테두리 */}
                <div className="rotating-circle"></div>
                {/* 로딩 텍스트 */}
                <div className="loading-text">향수를 찾는 중...</div>
            </div>
        </div>
    );
};

export default LoadingScreen;
