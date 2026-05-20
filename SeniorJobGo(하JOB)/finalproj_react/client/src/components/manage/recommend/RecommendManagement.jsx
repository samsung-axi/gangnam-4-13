import React from 'react';

const RecommendManagement = () => {
    return (
        <div className="hmk-manage-recommend">
            <div className="hmk-manage-section-header">
                <h1>추천 시스템 관리</h1>
                <button className="hmk-manage-button">알고리즘 설정</button>
            </div>

            <div className="hmk-manage-recommend-stats">
                <div className="hmk-manage-stat-card">
                    <h3>추천 정확도</h3>
                    <div className="hmk-manage-stat-value">92%</div>
                    <div className="hmk-manage-stat-trend positive">+3%</div>
                </div>
                <div className="hmk-manage-stat-card">
                    <h3>일평균 매칭</h3>
                    <div className="hmk-manage-stat-value">156건</div>
                    <div className="hmk-manage-stat-trend positive">+12건</div>
                </div>
                <div className="hmk-manage-stat-card">
                    <h3>사용자 만족도</h3>
                    <div className="hmk-manage-stat-value">4.5/5.0</div>
                    <div className="hmk-manage-stat-trend positive">+0.3</div>
                </div>
            </div>

            <div className="hmk-manage-recommend-sections">
                <div className="hmk-manage-matching-rules">
                    <h2>매칭 규칙 관리</h2>
                    <div className="hmk-manage-rules-list">
                        <div className="hmk-manage-rule-item">
                            <div className="hmk-manage-rule-header">
                                <h3>경력 기반 매칭</h3>
                                <label className="hmk-manage-switch">
                                    <input type="checkbox" checked />
                                    <span className="hmk-manage-slider"></span>
                                </label>
                            </div>
                            <div className="hmk-manage-rule-content">
                                <p>가중치: 0.8</p>
                                <button className="hmk-manage-button-small">설정</button>
                            </div>
                        </div>
                        {/* 추가 규칙 아이템들 */}
                    </div>
                </div>

                <div className="hmk-manage-recommend-logs">
                    <h2>추천 이력</h2>
                    <div className="hmk-manage-log-container">
                        <div className="hmk-manage-log-item">
                            <span className="hmk-manage-log-time">15:20</span>
                            <span className="hmk-manage-log-user">김OO님</span>
                            <span className="hmk-manage-log-message">웹 디자이너 포지션 5건 추천</span>
                        </div>
                        {/* 추가 로그 아이템들 */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendManagement; 