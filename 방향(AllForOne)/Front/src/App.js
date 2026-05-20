import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './module/AuthModule';
import { fetchBookmarks, initializeBookmarks } from './module/BookmarkModule';
import { fetchCart, resetCart } from './module/CartModule';
import { fetchWishlist, resetWishlist } from './module/WishlistModule';
import './App.css'

import Main from "./pages/Main";
import Login from "./pages/Login";
import History from "./pages/history/History";
import Layout from './layouts/Layout';
import PrivacyPolicy from './pages/footer/PrivacyPolicy';
import CookiePolicy from './pages/footer/CookiePolicy';
import TermsOfUse from './pages/footer/TermsofUse';
import FAQ from './pages/footer/FAQ';
import Chat from "./pages/chat/Chat";
import PerfumeList from './pages/booklist/PerfumeList';
import SpicesList from './pages/booklist/SpicesList';
import AdminSpicesList from './pages/admin/AdminSpicesList';
import AdminMembers from './pages/admin/AdminMembers';
import AdminPerfumeList from './pages/admin/AdminPerfumeList';
import ErrorScreen from './Fail';
import Therapy from './pages/therapy/Therapy';
import TherapyDiffuserRecommend from './components/therapy/TherapyDiffuserRecommend';
import PerfumeDetail from './components/perfumes/PerfumeDetail';
import ScentLens from './pages/scentlens/Scentlens';
import Shop from './pages/shop/Shop';
import Wishlist from './pages/shop/Wishlist';
import Cart from './pages/shop/Cart';
import ShopPerfumeDetail from './pages/shop/ShopPerfumeDetail';
import MyPage from './pages/mypage/MyPage';

// 원래 로그인
import LoginTest from "./pages/test/LoginTest";
import KakaoRedirectPage from './pages/test/KakaoRedirectPage';
import MemberTest from './pages/test/MemberTest';
import PerfumeReviews from './components/perfumes/PerfumeReviews';
function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // 로그인 상태를 localStorage에서 가져오기
    const storedUser = JSON.parse(localStorage.getItem('auth'));
    const isLogin = !!storedUser;

    if (isLogin && storedUser.role) {
      dispatch(loginSuccess(storedUser)); // Redux에 로그인 정보 업데이트
      dispatch(fetchBookmarks(storedUser.id)); // 북마크 정보 가져오기
      
      // 찜 목록 가져오기
      try {
        dispatch(fetchWishlist(storedUser.id));
      } catch (error) {
        console.warn('찜 목록 로드 실패:', error);
      }
      
      // 장바구니 목록 가져오기
      try {
        dispatch(fetchCart(storedUser.id));
      } catch (error) {
        console.warn('장바구니 목록 로드 실패:', error);
      }
    } else {
      dispatch(logout()); // Redux 상태 초기화
      dispatch(initializeBookmarks()); // 북마크 상태 초기화
      dispatch(resetWishlist()); // 찜 상태 초기화
      dispatch(resetCart()); // 장바구니 상태 초기화
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
            <Route path='/CookiePolicy' element={<CookiePolicy />} />
            <Route path='/TermsofUse' element={<TermsOfUse />} />
            <Route path='/FAQ' element={<FAQ />} />
            <Route path='/spiceslist' element={<SpicesList />} />
            <Route path='/perfumelist' element={<PerfumeList />} />
            <Route path='/perfumes/:id' element={<PerfumeDetail />} />
            <Route path="/history" element={<History />} />
            <Route path='/member' element={<AdminMembers />} />
            <Route path='/therapy' element={<Therapy />} />
            <Route path='/therapy/recommend' element={<TherapyDiffuserRecommend />} />
            <Route path='/reviews/:id' element={<PerfumeReviews />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/perfume/:id' element={<ShopPerfumeDetail />} />
            <Route path='/mypage' element={<MyPage />} />
          </Route>


          <Route index element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/redirected/kakao" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin/spices" element={<AdminSpicesList />} />
          <Route path="/admin/perfumes" element={<AdminPerfumeList />} />
          <Route path='/fail' element={<ErrorScreen />} />
          <Route path='/scentlens' element={<ScentLens/>}/>

          {/* <Route path='/logintest' element={<LoginTest />} />
          <Route path='/oauth/redirected/kakao' element={<KakaoRedirectPage />} />
          <Route path='/membertest' element={<MemberTest />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default React.memo(App);