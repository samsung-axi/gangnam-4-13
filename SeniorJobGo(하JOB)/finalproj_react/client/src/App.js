import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/forms/welcome';
import RegisterIntro from './components/forms/RegisterIntro';
import Register from './components/forms/Register';
import ManageLayout from './components/manage/layout/ManageLayout';
import Dashboard from './components/manage/dashboard/Dashboard';
import UserManagement from './components/manage/users/UserManagement';
import ContentManagement from './components/manage/content/ContentManagement';
import ChatbotManagement from './components/manage/chatbot/ChatbotManagement';
import ResumeManagement from './components/manage/resume/ResumeManagement';
import RecommendManagement from './components/manage/recommend/RecommendManagement';
import ResumeStart from './components/forms/ResumeStart';
import ResumeSequence from './components/forms/ResumeSequence';
import IntroStep from './components/forms/introStep';
import Index from './pages/index';

import './assets/css/seniorForm.css';
import './assets/css/manage.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 웰컴 페이지 */}
        <Route path="/" element={<Welcome />} />
        <Route path="/index" element={<Index />} />
        
        {/* 회원가입 관련 페이지들 */}
        <Route path="/register" element={<RegisterIntro />} />
        <Route path="/register/form" element={<Register />} />

        {/* 관리자 페이지 라우트들 */}
        <Route path="/manage" element={<ManageLayout />}>
          <Route index element={<Navigate to="/manage/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="chatbot" element={<ChatbotManagement />} />
          <Route path="resume" element={<ResumeManagement />} />
          <Route path="recommend" element={<RecommendManagement />} />
        </Route>

        <Route path="/resume/start" element={<ResumeStart />} />
        <Route path="/resume/create" element={<ResumeSequence />} />
        <Route path="/intro" element={<IntroStep />} />
      </Routes>
    </Router>
  );
}

export default App; 