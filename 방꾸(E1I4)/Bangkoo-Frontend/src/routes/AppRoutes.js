import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
// import FurnitureEditorPage from "../pages/3d/FurnitureEditorPage";
import FurnitureEditorContainer from "../pages/3d/FurnitureEditorContainer";
import SearchPage from "../pages/furnitureSearch/SearchPage";
import MyRoom from "../pages/myroom/MyRoom";
import KakaoCallback from "../pages/auth/KakaoCallback";
import AdminDashBoard from "../pages/admin/AdminDashBoard";
import ErrorPage from "../common/ErrorPage";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/placement" element={<FurnitureEditorPage />} />*/}
        <Route path="/editor" element={<FurnitureEditorContainer />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/myroom" element={<MyRoom />} />
        <Route path="/auth/callback/kakao" element={<KakaoCallback />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/*" element={<ErrorPage  />} />
        <Route path="/error" element={<ErrorPage error={"500"} />} />
    </Routes>
  );
}
