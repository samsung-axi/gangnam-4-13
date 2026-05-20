import React from 'react';

const UserManagement = () => {
    return (
        <div className="hmk-manage-users">
            <div className="hmk-manage-section-header">
                <h1>사용자 관리</h1>
                <button className="hmk-manage-button">새 사용자 추가</button>
            </div>
            <div className="hmk-manage-table-container">
                <table className="hmk-manage-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>가입일</th>
                            <th>상태</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>홍길동</td>
                            <td>hong@example.com</td>
                            <td>2024-01-01</td>
                            <td>활성</td>
                            <td>
                                <button className="hmk-manage-button-small">수정</button>
                                <button className="hmk-manage-button-small danger">삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement; 