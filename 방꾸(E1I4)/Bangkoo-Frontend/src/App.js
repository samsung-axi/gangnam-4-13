import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/header/Header";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import GlobalToast from "./components/layout/toast/GlobalToast";
import AppInitializer from "./AppInitializer";

function App() {
  return (
    <BrowserRouter>
        {/* 로그인 상태 초기화  */}
        <AppInitializer/>
        <Header />
        <AppRoutes />
        <GlobalToast />
    </BrowserRouter>
  );
}

export default App;
