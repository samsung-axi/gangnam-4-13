import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Camera from "./pages/Camera";
import Analysis from "./pages/Analysis";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin/index.tsx";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// ScrollToTop 컴포넌트 import
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* ScrollToTop 추가 */}
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* 보호된 라우트들 */}
              <Route path="/camera" element={
                <ProtectedRoute>
                  <Camera />
                </ProtectedRoute>
              } />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              {/** 설문 페이지 제거 */}
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
