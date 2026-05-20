import { useState, useRef } from 'react';

interface UseGameStageProps {
  initialStage?: number;
  maxStages: number;
  onStageChange?: (newStage: number) => void;
}

export const useGameStage = ({ initialStage = 0, maxStages, onStageChange }: UseGameStageProps) => {
  const [currentStage, setCurrentStage] = useState<number>(initialStage);
  const prevStageRef = useRef<number>(currentStage);

  const goToNextStage = () => {
    if (currentStage < maxStages - 1) {
      const newStage = currentStage + 1;
      setCurrentStage(newStage);
      onStageChange?.(newStage);
      prevStageRef.current = currentStage;
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 0) {
      const newStage = currentStage - 1;
      setCurrentStage(newStage);
      onStageChange?.(newStage);
      prevStageRef.current = currentStage;
    }
  };

  return {
    currentStage,
    prevStage: prevStageRef.current,
    goToNextStage,
    goToPreviousStage,
  };
};