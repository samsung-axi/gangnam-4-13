import React from 'react';

const ResumeManagement = () => {
    return (
        <div className="hmk-manage-resume">
            <div className="hmk-manage-section-header">
                <h1>이력서 작성 지원</h1>
                <div className="hmk-manage-header-actions">
                    <button className="hmk-manage-button">템플릿 추가</button>
                    <button className="hmk-manage-button">가이드라인 설정</button>
                </div>
            </div>

            <div className="hmk-manage-resume-stats">
                <div className="hmk-manage-stat-card">
                    <h3>오늘 작성된 이력서</h3>
                    <div className="hmk-manage-stat-value">45</div>
                    <div className="hmk-manage-stat-trend positive">+8</div>
                </div>
                <div className="hmk-manage-stat-card">
                    <h3>평균 작성 시간</h3>
                    <div className="hmk-manage-stat-value">23분</div>
                    <div className="hmk-manage-stat-trend positive">-2분</div>
                </div>
                <div className="hmk-manage-stat-card">
                    <h3>완성률</h3>
                    <div className="hmk-manage-stat-value">89%</div>
                    <div className="hmk-manage-stat-trend positive">+5%</div>
                </div>
            </div>

            <div className="hmk-manage-resume-sections">
                <div className="hmk-manage-resume-templates">
                    <h2>이력서 템플릿 관리</h2>
                    <div className="hmk-manage-template-grid">
                        {/* 템플릿 카드들 */}
                        <div className="hmk-manage-template-card">
                            <div className="hmk-manage-template-preview">미리보기</div>
                            <div className="hmk-manage-template-info">
                                <h3>기본 템플릿</h3>
                                <p>사용 횟수: 1,234</p>
                            </div>
                            <div className="hmk-manage-template-actions">
                                <button className="hmk-manage-button-small">수정</button>
                                <button className="hmk-manage-button-small">복제</button>
                                <button className="hmk-manage-button-small danger">삭제</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hmk-manage-resume-analytics">
                    <h2>작성 현황 분석</h2>
                    <div className="hmk-manage-analytics-chart">
                        {/* 차트가 들어갈 자리 */}
                        <div className="hmk-manage-chart-placeholder">
                            이력서 작성 추이 차트
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeManagement; 