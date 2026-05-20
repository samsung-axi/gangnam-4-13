import React, { useState, useEffect } from 'react';
import '../../css/components/Sidebar.css'
import { Menu } from 'lucide-react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setMemberLeave } from '../../api/MemberAPICalls';
import { logout } from '../../module/AuthModule';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 회원탈퇴/로그아웃 메뉴 열림 상태
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [localUser, setLocalUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = JSON.parse(localStorage.getItem('auth'));
        if (storedUser) {
            setLocalUser(storedUser); // 로컬 사용자 정보 상태 저장
        }
    }, [isLoggedIn]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // 메뉴 열림/닫힘
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        dispatch(logout()); // Redux 상태 초기화
        setIsOpen(false); // 사이드바 닫기
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
        window.location.reload(); // 페이지 새로고침
    };

    const handleMemberLeave = async () => {
        try {
            const storedUser = localStorage.getItem('auth');
            if (!storedUser) {
                alert('사용자 정보를 찾을 수 없습니다.');
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser?.id) {
                alert('회원 ID가 유효하지 않습니다.');
                return;
            }

            // setMemberLeave 함수 호출 후 성공 여부 확인
            const success = await setMemberLeave(parsedUser.id);
            if (success) {
                localStorage.removeItem('auth'); // 로컬 스토리지 초기화
                dispatch(logout()); // Redux 상태 초기화
                navigate('/'); // 메인 페이지로 이동
            } else {
                alert('회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원 탈퇴 처리 중 오류:', error);
            alert('회원 탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };



    const handleScrollToIntro = (e) => {
        e.preventDefault(); // 기본 링크 동작 방지

        const target = document.getElementById('intro-section'); // 현재 페이지에서 섹션 찾기
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 부드럽게 스크롤
        } else {
            // 메인 페이지로 이동한 후 스크롤 동작 실행
            navigate('/', { replace: false });
            setTimeout(() => {
                const newTarget = document.getElementById('intro-section');
                if (newTarget) {
                    newTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // 페이지 이동 후 DOM 렌더링 시간을 고려하여 딜레이 추가
        }

        setIsOpen(false); // 사이드바 닫기
    };

    const userNickname = localUser?.name || '사용자';
    const userRole = localUser?.role || 'USER'; // 사용자 역할 가져오기
    const isAdmin = userRole === 'ADMIN';
    const isActive = location.pathname === '/';

    return (
        <>
            <div className="sidebar-container">
                <button
                    onClick={toggleSidebar}
                    className={`sidebar-menu-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className={`sidebar-sidebar ${isOpen ? 'sidebar-sidebar-open' : ''}`}>
                <nav className="sidebar-nav">
                    <div className="sidebar-links">
                        <a href="#" className="sidebar-link" onClick={handleScrollToIntro}>
                            소개
                        </a>
                        <a href="/spiceslist" className="sidebar-link">향료 알아가기</a>
                        <a href="/perfumelist" className="sidebar-link">향수 알아가기</a>
                        <a href="/chat" className="sidebar-link">향수 추천</a>
                        <a href="/history" className="sidebar-link">향기 히스토리</a>
                        <a href="/therapy" className="sidebar-link">향 테라피</a>
                        <a href="/shop" className="sidebar-link">쇼핑하기</a>

                        {/* 관리자 전용 링크 */}
                        {isAdmin && (
                            <a href="/member" className="admin-sidebar-link">회원 조회</a>
                        )}
                    </div>

                    <div className="sidebar-bottom-links">
                        {!isLoggedIn ? (
                            // 비로그인 상태
                            <div className="sidebar-profile-section">
                                <img
                                    src="/images/Main-Propic.png"
                                    alt="기본 프로필"
                                    className="sidebar-profile-img"
                                />
                                <NavLink to="/login">
                                    <button className="sidebar-auth-button login">로그인/회원가입</button>
                                </NavLink>
                            </div>
                        ) : (
                            // 로그인 상태
                            <>
                                <div className="sidebar-profile-section">
                                    <img
                                        src="/images/Main-Propic.png"
                                        alt="프로필"
                                        className="sidebar-profile-img"
                                    />
                                    <span className="sidebar-username" onClick={toggleMenu}>{userNickname}님</span>
                                </div>

                                {/* 회원탈퇴/로그아웃 메뉴 */}
                                {isMenuOpen && (
                                    <div className="sidebar-menu">
                                        <button
                                            className="sidebar-auth-button"
                                            onClick={() => {
                                                navigate('/mypage');
                                                setIsOpen(false);
                                            }}
                                            data-type="mypage"
                                        >
                                            마이페이지
                                        </button>
                                        <button
                                            className="sidebar-auth-button"
                                            onClick={handleMemberLeave}
                                        >
                                            회원탈퇴
                                        </button>
                                        <button
                                            className="sidebar-auth-button"
                                            onClick={handleLogout}
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

        </>
    );
};

export default Sidebar;