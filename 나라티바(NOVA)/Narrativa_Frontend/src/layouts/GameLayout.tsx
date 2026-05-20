import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../Contexts/AudioContext';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GAME_ROUTES = ['/game-intro', '/game-world-view', '/game-page', '/game-ending'];

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const { stop } = useAudio();
  const location = useLocation();

  useEffect(() => {
    return () => {
      const currentPath = location.pathname;
      const isLeavingGameRoutes = !GAME_ROUTES.some(route => 
        currentPath.startsWith(route)
      );
      
      if (isLeavingGameRoutes) {
        stop();
      }
    };
  }, [location.pathname, stop]);

  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
};

export default GameLayout;