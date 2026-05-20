import React, { createContext, useContext, useState, ReactNode } from "react";

// 전역 상태 인터페이스
interface SoundContextProps {
  isSoundOn: boolean; // 효과음 활성화 여부
  toggleSound: () => void; // 효과음 토글 함수
}

// 컨텍스트 생성
const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSoundOn, setIsSoundOn] = useState(true); // 기본값: 활성화

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev); // 상태 토글
  };

  return (
    <SoundContext.Provider value={{ isSoundOn, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

// 커스텀 훅
export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
};
