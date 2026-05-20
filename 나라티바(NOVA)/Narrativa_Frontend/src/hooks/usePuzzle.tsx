import { useState, useRef, useEffect } from 'react';

export default function usePuzzle(pieces: string[], onClose: () => void) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const [scale, setScale] = useState(true);
  const [puzzle, setPuzzle] = useState<{ num: number; url: string }[]>([]);

  // 이미지를 6등분한 퍼즐을 초기화
  const initializePuzzle = () => {
    const newPuzzle = pieces.map((url, index) => ({
      num: index + 1,  // 퍼즐 번호
      url: url,        // 분할된 이미지 URL
    }));
    setPuzzle(shuffleArray(newPuzzle));
  };

  useEffect(() => {
    initializePuzzle(); // 퍼즐 초기화
  }, [pieces]);

  const dragStart = (idx: number) => {
    dragItem.current = idx;
    setScale(false);
  };

  const dragEnter = (idx: number) => {
    dragOverItem.current = idx;
  };

  const drop = () => {
    setTimeout(() => setScale(true), 800);
    if (
      typeof dragItem.current === 'number' &&
      typeof dragOverItem.current === 'number'
    ) {
      const copyListItems = [...puzzle];

      const dragItemContent = [...puzzle][dragItem.current];
      const changTargetItemContent = [...puzzle][dragOverItem.current];
      copyListItems[dragItem.current] = changTargetItemContent;
      copyListItems[dragOverItem.current] = dragItemContent;

      dragItem.current = null;
      dragOverItem.current = null;
      setPuzzle(copyListItems);
    }
  };

  useEffect(() => {
    let pass = '';
    puzzle.forEach(({ num }) => (pass += num));
    if (pass === '123456') {  // 퍼즐이 맞춰졌을 때
      initializePuzzle(); // 퍼즐 초기화
      onClose(); // 모달 닫기
    }
  }, [onClose, puzzle]);

  return { puzzle, dragStart, dragEnter, drop, scale };
}

function shuffleArray(array: { num: number; url: string }[]) {
  return array.sort(() => Math.random() - 0.5);
}
