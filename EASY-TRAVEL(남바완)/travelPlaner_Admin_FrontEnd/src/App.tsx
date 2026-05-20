import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { RecoilRoot } from 'recoil';  // Recoil import 추가
import "./assets/css/common/variables.css";
import Layout from "./components/layout/Layout";
import AxiosIntercepter from "./components/intercept/AxiosIntercepter";
import Question from "./pages/question/Question";
import QuestionList from "./pages/question/QuestionList";
import MemberChart from "./pages/member/Member"
import AgentChart from "./pages/agent/Agent"
import Test from "./pages/question/Test"

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <AxiosIntercepter />
      <Layout navigate={navigate} currentPath={location.pathname}>
        <Routes>
          <Route path="admin/question/:inquiry_id" element={<Question />} />
          <Route path="admin/question" element={<QuestionList />} />
          <Route path="admin/chart/member" element={<MemberChart />} />
          <Route path="admin/chart/agent" element={<AgentChart />} />
          <Route path="admin/test" element={<Test />} />
        </Routes>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>  {/* RecoilRoot로 전체 앱을 감싸기 */}
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
