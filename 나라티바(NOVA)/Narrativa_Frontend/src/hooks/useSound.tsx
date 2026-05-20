// src/hooks/useSound.ts
import { Howl } from "howler";

export const useSound = (src: string) => {
  const playSound = () => {
    const sound = new Howl({
      src: [src],
      volume: 0.5, // 소리 크기 조절
    });
    sound.play();
  };

  return playSound;
};
