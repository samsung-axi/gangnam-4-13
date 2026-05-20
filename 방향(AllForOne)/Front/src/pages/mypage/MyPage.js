import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, Package, ShoppingCart } from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import MyReviews from '../../components/mypage/MyReviews';
import MySubscriptions from '../../components/mypage/MySubscriptions';
import styles from '../../css/mypage/MyPage.module.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews', 'subscriptions'
    const auth = JSON.parse(localStorage.getItem('auth'));

    return (
        <>
            {/* 상단 로고 */}
            <img
                src="/images/logo.png"
                alt="로고"
                className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* 헤더 */}
                    <div className={styles.header}>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className={styles.welcomeSection}>
                            <h2>안녕하세요, {auth?.name || '회원'}님</h2>
                        </div>
                        <div className={styles.headerTitle}>
                            <User size={24} />
                            <h1>마이페이지</h1>
                        </div>
                    </div>

                    {/* 탭 네비게이션 */}
                    <div className={styles.tabNavigation}>
                        <button
                            className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <FileText size={18} />
                            <span>내 리뷰</span>
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'subscriptions' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('subscriptions')}
                        >
                            <Package size={18} />
                            <span>구독 관리</span>
                        </button>
                        <button
                            className={styles.tab}
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingCart size={18} />
                            <span>장바구니</span>
                        </button>
                    </div>

                    {/* 탭 콘텐츠 */}
                    <div className={styles.tabContent}>
                        {activeTab === 'reviews' && <MyReviews />}
                        {activeTab === 'subscriptions' && <MySubscriptions />}
                    </div>
                </div>
            </div>

            {/* 사이드바 */}
            <Sidebar />
        </>
    );
};

export default MyPage;

