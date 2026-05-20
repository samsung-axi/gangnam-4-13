import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import MainLayout from './layouts/MainLayout';
import HmkHomePage from './pages/hmk_HomePage';
import HmkJobRecommendationPage from './pages/hmk_JobRecommendationPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HmkHomePage />} />
            <Route path="/job-recommendation" element={<HmkJobRecommendationPage />} />
            {/* 추후 추가될 라우트들 */}
            {/* <Route path="/resume" element={<ResumePage />} /> */}
            {/* <Route path="/jobs" element={<JobsPage />} /> */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
