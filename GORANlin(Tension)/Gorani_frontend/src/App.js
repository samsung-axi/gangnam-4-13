// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Translation from "./pages/Translation/Translation";
import NaverLogin from "./pages/Login/Naver";
import MyPage from "./pages/User/MyPage";
import NaverSuccess from "./pages/Login/NaverSuccess";
import KakaoLogin from "./pages/Login/KakaoLogin";
import KakaoSuccessPage from "./pages/Login/KakaoSucess";
import KakaoCallback from "./pages/Login/KakooCallBack";
import GoogleSuccess from "./pages/Login/GoogleSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/naver" element={<NaverLogin />} />
        <Route path="/naver-success" element={<NaverSuccess />} />
        <Route path="/kakao" element={<KakaoLogin />} />
        <Route path="/kakaoSuccess" element={<KakaoSuccessPage />} />
        <Route path="/kakaoCallback" element={<KakaoCallback />} />
        <Route path="/google/success" element={<GoogleSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
