import { useLocation } from "react-router-dom";

const useHeaderVisibility = () => {
    const location = useLocation();
    const isMainPage = location.pathname === "/";
    const noHeaderRoutes = [
      "/login", 
      "/delete-account", 
      "/", 
      "/game-page", 
      "/game-world-view",
      "/game-intro"
    ];
    const noPaddingRoutes = ["/bookmarks"];
    
    return {
      isMainPage,
      isHeaderVisible: !noHeaderRoutes.includes(location.pathname),
      isPaddingRequired: !noPaddingRoutes.includes(location.pathname),
      showHeader: !noHeaderRoutes.includes(location.pathname)
    };
  };

export default useHeaderVisibility;