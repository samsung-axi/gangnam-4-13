import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./components/Layout";
import InsertConferenceInfo from "./pages/insert_conference_info/InsertConferenceInfo";
import Result from "./pages/result/Result";
import SignUp from "./pages/sign_up/SignUp";
import SocialSignUp from "./pages/social_sign_up/SocialSignUp";
import DocsAgentTest from "./pages/docs_agent_test/docs_agent_test";
import AdminUser from "./pages/admin/AdminUser";
import AdminCompany from "./pages/admin/superadmin/AdminCompany";
import AdminPosition from "./pages/admin/AdminPosition";
import AdminTemplate from "./pages/admin/AdminTemplate";
import Login from "./pages/log_in/Login";
import ChooseMethod from "./pages/sign_up_choose/choose_method";
import MyPage from "./pages/mypage/MyPage";
import Intro from "./pages/intro/Intro";

import Calendar from "./pages/calendar/Calendar";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectListPage from "./pages/project_list/projectlist";

import AdminAdmin from "./pages/admin/superadmin/AdminAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AlterInfo from "./pages/mypage_alter/alterInfo";
import ConferenceListPage from "./pages/conference_list/conferencelist";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import FindId from "./pages/find_id/FindId";
import FindPw from "./pages/find_pw/FindPw";
import NotFoundAccount from "./pages/find_pw/not_found/NotFoundAccount";
import Chatbot from "./pages/chatbot/ChatBot";
import StreamingChatComponent from "./pages/chatbot/StreamingChatComponent";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* 공개 라우트 */}
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/sign_up"
            element={
              <RedirectIfAuthenticated>
                <ChooseMethod />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/sign_up/form"
            element={
              <RedirectIfAuthenticated>
                <SignUp />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/social_sign_up"
            element={
              <RedirectIfAuthenticated>
                <SocialSignUp />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/find_id" element={<FindId />} />
          <Route path="/find_pw" element={<FindPw />} />
          <Route path="/find_pw/not_found" element={<NotFoundAccount />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/result" element={<Result />} />
          <Route path="/chatbot/stream" element={<StreamingChatComponent />} />

          <Route
            path="/dashboard/:meetingId"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insert_info"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <InsertConferenceInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docs_agent_test"
            element={
              <ProtectedRoute allowedRoles={["companyAdmin"]}>
                <DocsAgentTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <ProtectedRoute allowedRoles={["companyAdmin", "superAdmin"]}>
                <AdminUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/company"
            element={
              <ProtectedRoute allowedRoles={["superAdmin"]}>
                <AdminCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/position"
            element={
              <ProtectedRoute allowedRoles={["companyAdmin"]}>
                <AdminPosition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/template"
            element={
              <ProtectedRoute allowedRoles={["companyAdmin"]}>
                <AdminTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["companyAdmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admin"
            element={
              <ProtectedRoute allowedRoles={["superAdmin"]}>
                <AdminAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage/alterInfo"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <AlterInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projectlist"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <ProjectListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conferencelist/:projectId"
            element={
              <ProtectedRoute allowedRoles={["user", "companyAdmin"]}>
                <ConferenceListPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
