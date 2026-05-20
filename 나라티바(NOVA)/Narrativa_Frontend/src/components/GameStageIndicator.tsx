import React, { useState, useEffect } from 'react';

interface GameStageIndicatorProps {
  currentStage: number;
  maxStages: number;
}

const GameStageIndicator: React.FC<GameStageIndicatorProps> = ({ currentStage, maxStages }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prevState => !prevState);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: maxStages }, (_, index) => index).map((stage) => (
        <div
          key={stage}
          className={`w-4 h-4 rounded-full mx-2 ${
            stage <= currentStage
              ? `bg-custom-violet bg-opacity-${isBlinking ? '100' : '50'} border`
              : 'bg-gray-500 bg-opacity-50 border'
          }`}
        />
      ))}
    </div>
  );
};

export default GameStageIndicator;