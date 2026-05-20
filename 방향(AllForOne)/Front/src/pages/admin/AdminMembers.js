// AdminMembers.js
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import '../../css/admin/AdminMembers.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchMembers, selectMembers, selectLoading } from "../../module/MemberModule";


function AdminMembers() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const members = useSelector(selectMembers);
    const loading = useSelector(selectLoading);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;

    useEffect(() => {
        dispatch(fetchMembers());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Search Term:", e.target.value); // 입력값 확인
        setSearchTerm(e.target.value || "");
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 페이지네이션 계산
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <img
                src="/images/logo.png"
                alt="1번 이미지"
                className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="admin-members-container">
                <div className="admin-members-header">
                    <div className="admin-members-title">회원정보</div>
                    <form className="admin-members-search-container">
                        <input
                            type="text"
                            className="admin-members-search"
                            placeholder="이름 검색"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search
                            className="admin-members-search-icon"
                            size={20}
                            color="#333"
                        />
                    </form>
                </div>

                <div className="admin-members-divider-line" />

                <div className="admin-members-table">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>성별</th>
                                    <th>출생연도</th>
                                    <th>가입일</th>
                                    <th>역할</th>
                                </tr>
                            </thead>
                            <tbody>  
                                {currentMembers.map((member) => (
                                    <tr key={member.email}>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.gender}</td>
                                        <td>{member.birthyear}</td>
                                        <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                                        <td>{member.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="admin-member-pagination">
                    <button
                        className={`admin-member-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        {'<<'}
                    </button>

                    <button
                        className={`admin-member-pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`admin-member-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className={`admin-member-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        className={`admin-member-pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default AdminMembers;