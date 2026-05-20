import { Howl } from "howler";
import { useSoundContext } from "../Contexts/SoundContext";

export const useMultipleSoundEffects = (soundSources: string[]) => {
  const { isSoundOn } = useSoundContext(); // 전역 상태를 참조
  const sounds = soundSources.map(
    (src) => new Howl({ src: [src], volume: 0.5 })
  );

  const playSound = (index: number) => {
    if (isSoundOn && sounds[index]) {
      sounds[index].play(); // isSoundOn이 true일 때만 재생
    }
  };

  return { playSound };
};
