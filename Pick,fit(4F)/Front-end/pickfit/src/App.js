// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext"; // WishlistProvider import 추가
import { TryOnProvider } from './contexts/TryOnContext';
import Header from "./components/Header/Header";
import LoadingScreen from "./components/LoadingScreen";
import { SelectedItemProvider } from "./contexts/SelectedItemContext";

const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MyPage = lazy(() => import("./pages/Mypage/MyPage"));
const WishlistPage = lazy(() => import("./pages/Wishist"));
const TryMeOn = lazy(() => import("./pages/trymeon/TryMeOn"));
const VirtualFittingApp = lazy(() => import("./pages/VirtualTryOn/VirtualFittingApp"));
// const Spinner = lazy(() => import("./components/Spinner"));

function App() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // 10초 후 로딩 종료
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 10000); // 10000ms = 10초

  //   return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  // }, []);

  // if (isLoading) {
  //   // 로딩 중일 때 Spinner 표시
  //   return <Spinner />;
  // }

  return (
    <SelectedItemProvider>
      <TryOnProvider>
        <AuthProvider>
          <WishlistProvider> {/* WishlistProvider 추가 */}
            <Header />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/trymeon" element={<TryMeOn />} />
                <Route path="/tryon" element={<VirtualFittingApp />} />
              </Routes>
            </Suspense>
          </WishlistProvider> {/* WishlistProvider 닫기 */}
        </AuthProvider>
      </TryOnProvider>
      </SelectedItemProvider>
  );
}

export default App;