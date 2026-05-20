import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// 전역 스타일 및 공통 레이아웃 컴포넌트
import "./assets/css/common/variables.css";
import Layout from "./components/layout/Layout";

import Home from "./pages/main/home"; // 메인화면
import LoginForm from "./pages/user/LoginForm"; // 로그인폼
import HjWebTest from "./pages/main/HjWebTest";

import Plan from "./pages/plan/Plan";
import PlanList from "./pages/plan/PlanList";
import PlanFilter from "./pages/plan/PlanFilter";
// git 대소문자 변경용 주석
import CheckList from "./pages/checkList/CheckList";
import LoadKakaoMap from "./pages/plan/include/LoadPlanMap";
import MiniGame from "./pages/minigame/MiniGame"; // MiniGame 컴포넌트 임포트
import VoiceChat from "./pages/voice/VoiceChat";
import AxiosIntercepter from "./components/intercept/AxiosIntercepter";
import Unauthorized from "./pages/error/Unauthorized";
import InternalServerError from "./pages/error/InternalServerError";
import "./firebase-config";
import LoginCheck from "./components/intercept/loginCheck";
import Question from "./pages/question/Question";
import { useState } from "react";

function App() {
  const [newRequest, setNewRequest] = useState<boolean>(false);
  return (
    <div>
      <LoadKakaoMap />
      <BrowserRouter>
        <LoginCheck />
        <AxiosIntercepter />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/hj" element={<HjWebTest />} />
            <Route
              path="/plan/filter/"
              element={<PlanFilter changeRequestState={setNewRequest} />}
            />
            <Route path="/plans/list" element={<PlanList />} />
            <Route
              path="/plans/:planIdFirst?"
              element={<Plan newRequest={newRequest} />}
            />
            <Route path="/checkList" element={<CheckList />} />
            <Route path="/minigame" element={<MiniGame />} />{" "}
            {/* MiniGame 경로 추가 */}
            <Route path="/checkList/:planId" element={<CheckList />} />
            {/* <Route path="/voice" element={<VoiceChat />} /> */}
            <Route path="/error/400" element={<Unauthorized />} />
            <Route path="/error/500" element={<InternalServerError />} />
            {/* <Route path="/plan/modify" element={<PlanModify />} /> */}
            <Route path="/question" element={<Question />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
