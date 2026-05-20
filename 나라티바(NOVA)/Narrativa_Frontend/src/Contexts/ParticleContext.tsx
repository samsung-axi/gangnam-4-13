import React, { createContext, useContext, useEffect, useState } from "react";
import { Engine, tsParticles } from "@tsparticles/engine";

// 컨텍스트 타입 정의
interface ParticleContextType {
  engine: Engine | null; // tsParticles 엔진 인스턴스
  engineInitialized: boolean; // 엔진 초기화 상태
  isParticlesEnabled: boolean; // 파티클 활성화 상태
  toggleParticles: () => void; // 파티클 활성화/비활성화 토글 함수
}

// 컨텍스트 생성
const ParticleContext = createContext<ParticleContextType | undefined>(
  undefined
);

const ParticleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [engine, setEngine] = useState<Engine | null>(null); // tsParticles 엔진
  const [engineInitialized, setEngineInitialized] = useState(false); // 초기화 여부
  const [isParticlesEnabled, setIsParticlesEnabled] = useState(true); // 활성화 상태

  // 엔진 초기화
  useEffect(() => {
    const initEngine = async () => {
      const engineInstance = tsParticles;
      setEngine(engineInstance);
      setEngineInitialized(true);
    };

    initEngine();
  }, []);

  // 파티클 토글 함수
  const toggleParticles = () => {
    setIsParticlesEnabled((prev) => !prev);
  };

  return (
    <ParticleContext.Provider
      value={{
        engine,
        engineInitialized,
        isParticlesEnabled,
        toggleParticles,
      }}
    >
      {children}
    </ParticleContext.Provider>
  );
};

// 커스텀 훅
export const useParticleEngine = () => {
  const context = useContext(ParticleContext);
  if (!context) {
    throw new Error("useParticleEngine must be used within a ParticleProvider");
  }
  return context;
};

export default ParticleProvider;
