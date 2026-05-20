import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/components/Footer.css';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaGithub } from "react-icons/fa";

const Footer = () => {
    const location = useLocation();
    const isMainPage = location.pathname === '/';

    // 소셜 미디어 링크 데이터
    const socialLinks = [
        { title: '인스타그램', icon: <FaInstagram />, path: '#' },
        { title: '페이스북', icon: <FaFacebook />, path: '#' },
        { title: '트위터', icon: <FaTwitter />, path: '#' },
        { title: '유튜브', icon: <FaYoutube />, path: 'https://www.youtube.com/@AllForOne-1216' },
        { title: '깃허브', icon: <FaGithub />, path: 'https://github.com/Project-AllForOne' }
    ];

    // 클릭 핸들러
    const handleClick = (path) => {
        if (path === '#') {
            alert('링크가 비활성화되어 있습니다.');
        }
    };

    const navigate = useNavigate();

    return (
        <>
            <footer className="footer">
            <img 
                src="/images/logo.png" 
                alt="로고 이미지" 
                className="footer-main-logo-image"
                onClick={() => {
                    navigate('/'); // 경로 변경
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // 스크롤 맨 위로 이동
                }}
                style={{ cursor: 'pointer' }}
            />
                <div className="footer-container">

                    <div className="footer-textbox">
                        <div className="footer-slogan">당신만의 특별한 향기</div>
                        <nav className="footer-navlinks">
                            <div className="footer-nav">
                                <a href="#"
                                onClick={(e) => {
                                e.preventDefault(); // 기본 링크 동작 방지
                                const target = document.getElementById('intro-section'); // 해당 섹션의 id를 가져옴
                                if (target) {
                                    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 부드럽게 스크롤
                                }
                                }}>소개</a>
                                <span className="separator">|</span>
                                <a href="/spiceslist">향료 알아가기</a>
                                <span className="separator">|</span>
                                <a href="/perfumeList">향수 알아가기</a>
                                <span className="separator">|</span>
                                <a href="/chat">맞춤 향수 추천</a>
                                <span className="separator">|</span>
                                <a href="/history">향기 히스토리</a>
                                <span className="separator">|</span>
                                <a href="/FAQ">자주 묻는 질문 (FAQ)</a>
                            </div>
                        </nav>

                        <div className="footer-social">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.path !== '#' ? link.path : undefined} // 깃허브만 링크 활성화
                                    onClick={(e) => {
                                        if (link.path === '#') {
                                            e.preventDefault();
                                        }
                                    }}
                                    target={link.path !== '#' ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    style={{ fontSize: '24px', color: '#000', textDecoration: 'none' }}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div> 

                        <div className="footer-company-info">
                            회사명: 올포원 | 서비스명: 방향(訪香) | 위치: 서울특별시 강남구 테헤란로 123 | 사업자 등록번호: 123-45-67890<br />
                            통신판매업 신고번호: 제 2024-서울강남-1234호 | 대표자: 홍길동 | 고객센터: 02-1234-5678 | 이메일: support@banghyang.com
                        </div>

                        <div className="footer-bottom-block">
                            <div className="footer-legal">
                                <a href="/PrivacyPolicy" className="PrivacyPolicy">
                                    <b>개인정보 처리방침</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/TermsofUse" className="TermsofUse">
                                    <b>이용약관</b>
                                </a>
                                <span className="separator">|</span>
                                <a href="/CookiePolicy" className="CookiePolicy">
                                    <b>쿠키 정책</b>
                                </a>
                            </div>

                            <div className="footer-copyright">
                                © 2024 방향. All rights reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
