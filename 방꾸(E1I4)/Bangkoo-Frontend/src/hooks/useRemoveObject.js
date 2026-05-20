// ✅ 파일 위치: hooks/useRemoveObject.js
// ✅ 작성자: 김태원
// ✅ 기능: selectedIndex 기준 객체 삭제 후 AI 인페인팅 요청

import { usePlacementHistory } from './usePlacementHistory';
import { requestPlacement } from '@/api/placement';
import base64ToFile from '@/pages/myroom/event/base64ToFile';
import { drawImageContainWithSideBlur } from './utils/drawUtils';

/**
 * 🧼 선택된 객체 삭제 요청을 처리하는 훅
 * @param {object} params
 * @param {HTMLCanvasElement} canvas
 * @param {object} transform
 * @param {number} selectedIndex
 * @param {Array} detectedObjects
 * @param {function} setDetectedObjects
 * @param {function} handleFileChange
 */
export const useRemoveObject = ({
  canvas,
  transform,
  selectedIndex,
  detectedObjects,
  setDetectedObjects,
  handleFileChange,
}) => {
  const { saveState } = usePlacementHistory();

  const removeObject = async () => {
    if (
      selectedIndex === null ||
      selectedIndex < 0 ||
      !canvas ||
      !transform ||
      !detectedObjects[selectedIndex]
    ) {
      alert("삭제할 객체가 없습니다.");
      return;
    }

    const ctx = canvas.getContext('2d');
    const mask = detectedObjects[selectedIndex].mask;
    const [x, y, w, h] = detectedObjects[selectedIndex].bbox;

    // 📌 마스킹된 객체만 빨간색으로 칠해 삭제용 이미지 만들기
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    drawImageContainWithSideBlur(canvas, tempCtx, canvas, transform);

    if (mask && mask.length > 0) {
      const rows = mask.length;
      const cols = mask[0].length;
      const dx = w / cols;
      const dy = h / rows;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (!mask[j][i]) continue;
          const px = x + i * dx;
          const py = y + j * dy;
          const canvasX = px * transform.scaleX + transform.offsetX;
          const canvasY = py * transform.scaleY + transform.offsetY;
          const canvasDX = dx * transform.scaleX;
          const canvasDY = dy * transform.scaleY;

          tempCtx.clearRect(canvasX, canvasY, canvasDX, canvasDY);
        }
      }
    }

    // 🎨 삭제 요청용 이미지 생성
    const blob = await new Promise((resolve) =>
      tempCanvas.toBlob((b) => resolve(b), 'image/jpeg',0.5)
    );

    const base64 = await requestPlacement("remove", blob);
    const file = base64ToFile(`data:image/png;base64,${base64}`, "ai_result.png");

    // 💾 이미지 교체 및 상태 업데이트
    handleFileChange(file);

    // ❌ 삭제된 객체 제거
    const updated = detectedObjects.filter((_, i) => i !== selectedIndex);
    setDetectedObjects(updated);

    // 🧠 히스토리 저장
    await saveState(`data:image/png;base64,${base64}`);

    alert("객체 삭제 성공!");
  };

  return removeObject;
};
