import React, { useState } from 'react';

const ContentManagement = () => {
    const [activeTab, setActiveTab] = useState('jobs'); // jobs, education, resume

    const renderJobContent = () => (
        <div className="hmk-manage-table-container">
            <table className="hmk-manage-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>회사명</th>
                        <th>등록일</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>시니어 웹 디자이너 모집</td>
                        <td>(주)시니어잡고</td>
                        <td>2024-01-15</td>
                        <td>게시중</td>
                        <td>
                            <button className="hmk-manage-button-small">수정</button>
                            <button className="hmk-manage-button-small">미리보기</button>
                            <button className="hmk-manage-button-small danger">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const renderEducationContent = () => (
        <div className="hmk-manage-table-container">
            <table className="hmk-manage-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>교육 제목</th>
                        <th>카테고리</th>
                        <th>등록일</th>
                        <th>수강생 수</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>디지털 기초 교육</td>
                        <td>IT 기초</td>
                        <td>2024-01-20</td>
                        <td>45명</td>
                        <td>
                            <button className="hmk-manage-button-small">수정</button>
                            <button className="hmk-manage-button-small">상세보기</button>
                            <button className="hmk-manage-button-small danger">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const renderResumeTemplateContent = () => (
        <div className="hmk-manage-template-section">
            <div className="hmk-manage-template-grid">
                {[1, 2, 3].map((template) => (
                    <div key={template} className="hmk-manage-template-card">
                        <div className="hmk-manage-template-preview">
                            템플릿 미리보기 {template}
                        </div>
                        <div className="hmk-manage-template-info">
                            <h3>기본 이력서 템플릿 {template}</h3>
                            <p>사용 횟수: {template * 234}</p>
                        </div>
                        <div className="hmk-manage-template-actions">
                            <button className="hmk-manage-button-small">수정</button>
                            <button className="hmk-manage-button-small">미리보기</button>
                            <button className="hmk-manage-button-small danger">삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="hmk-manage-content-section">
            <div className="hmk-manage-section-header">
                <h1>콘텐츠 관리</h1>
                <div className="hmk-manage-header-actions">
                    {activeTab === 'jobs' && (
                        <button className="hmk-manage-button">새 공고 등록</button>
                    )}
                    {activeTab === 'education' && (
                        <button className="hmk-manage-button">새 교육자료 등록</button>
                    )}
                    {activeTab === 'resume' && (
                        <button className="hmk-manage-button">새 템플릿 추가</button>
                    )}
                </div>
            </div>

            <div className="hmk-manage-tabs">
                <button 
                    className={`hmk-manage-tab ${activeTab === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    채용공고
                </button>
                <button 
                    className={`hmk-manage-tab ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                >
                    교육자료
                </button>
                <button 
                    className={`hmk-manage-tab ${activeTab === 'resume' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resume')}
                >
                    이력서 템플릿
                </button>
            </div>

            {activeTab === 'jobs' && renderJobContent()}
            {activeTab === 'education' && renderEducationContent()}
            {activeTab === 'resume' && renderResumeTemplateContent()}
        </div>
    );
};

export default ContentManagement; 