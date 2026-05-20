// ✅ 파일 위치: hooks/useApplyPlacement.js
// ✅ 작성자: 김태원
// ✅ 기능 요약:
//  - 사용자가 가구를 추가(add), 삭제(remove), 이동(move)할 때
//  - 캔버스에서 필요한 부분을 Blob으로 추출하고,
//  - AI 서버에 전송 후 받은 결과를 다시 캔버스에 반영하며
//  - 썸네일 합성 등 전처리 작업을 포함한 전체 흐름을 처리한다.

import { useRef, useEffect } from "react";
import { requestPlacement } from '@/api/placement';
import { usePlacementHistory } from './usePlacementHistory';
import base64ToFile from '../pages/myroom/event/base64ToFile';
import { drawImageContainWithSideBlur } from './utils/drawUtils';
import { isoContours } from 'marchingsquares';

export const useApplyPlacement = ({
  mode,                  // 현재 모드: add | remove | move
  background,            // 캔버스 Ref (AI 처리 대상)
  canvasSize,            // (미사용) 캔버스 사이즈
  setShowMask,           // 마스킹 UI 표시 토글 함수
  setShowHelper,         // 헬퍼 UI 표시 토글 함수
  centerArea,            // centerArea: 이미지 처리 범위 (x,y,w,h)
  handleFileChange,      // 이미지 업데이트 처리 함수
  imageUploaderRef,      // ImageUploader의 ref: 썸네일, 위치, 크기 등 접근용
  sessionIdRef,          // 세션 ID 참조
}) => {
  const transformRef = useRef(null);

  const scale = imageUploaderRef.current?.thumbnailScale || 1;
  const angle = imageUploaderRef.current?.thumbnailRotation || 0;

  const { saveState } = usePlacementHistory(sessionIdRef);

  const originalBackgroundRef = useRef(null);

  // 🔹 centerArea 부분 캡처 후 Blob으로 변환
  const extractCenterImageBlob = async (canvas, centerArea) => {
    const { x, y, width, height } = centerArea;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(x, y, width, height);
    tempCtx.putImageData(imageData, 0, 0);

    return new Promise((resolve) =>
      tempCanvas.toBlob((blob) => resolve(blob), "image/png", 1.0)
    );
  };

  // 🔹 썸네일 이미지를 캔버스에 그려주고 윤곽선도 같이 그림
  const drawThumbnailOnCanvas = async (baseImage, {
    thumbnail, finalPos, offsetRatio, transform, bbox, outputSize, scale=1, angle,
  }) => {
    const thumbImg = new Image();
    thumbImg.crossOrigin = 'anonymous';
    thumbImg.src = thumbnail;

    await new Promise((resolve, reject) => {
      thumbImg.onload = resolve;
      thumbImg.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 배경 이미지 그리기
    const { x, y, width, height } = transform.centerArea;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(
      baseImage,
      transform.centerArea.x, transform.centerArea.y, transform.centerArea.width, transform.centerArea.height, // source
      0, 0, outputSize.width, outputSize.height 
    );
    // 썸네일 위치 계산
    const scaleX = transform.centerArea.width / canvas.width;
    const scaleY = transform.centerArea.height / canvas.height;
    
    const originalThumbWidth = thumbImg.width;
    const originalThumbHeight = thumbImg.height;
    const originalAspect = originalThumbWidth / originalThumbHeight;
    
    // 1️⃣ bbox width 기준으로 계산
    const thumbWidth = bbox[2] * transform.scaleX;
    const thumbHeight = thumbWidth / originalAspect;

    const centerX = finalPos.x - x;
    const centerY = finalPos.y - y;
    
    const tx = centerX - thumbWidth * offsetRatio.x;
    const ty = centerY - thumbHeight * offsetRatio.y;

    ctx.drawImage(thumbImg, tx, ty, thumbWidth, thumbHeight);

    // 🔥 윤곽선 그리기 (Marching Squares 활용)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = thumbWidth;
    maskCanvas.height = thumbHeight;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.drawImage(thumbImg, 0, 0, thumbWidth, thumbHeight);
    const imageData = maskCtx.getImageData(0, 0, thumbWidth, thumbHeight);

    // 알파맵 생성
    const alphaMap = [];
    for (let y = 0; y < thumbHeight; y++) {
      const row = [];
      for (let x = 0; x < thumbWidth; x++) {
        const index = (y * thumbWidth + x) * 4 + 3;
        row.push(imageData.data[index] > 10 ? 1 : 0);
      }
      alphaMap.push(row);
    }

    // 윤곽선 좌표 추출
    const contours = isoContours(alphaMap, 1);
    const contour = contours[0]?.coordinates?.[0] || [];

    ctx.beginPath();
    contour.forEach(([cx, cy], i) => {
      if (i === 0) ctx.moveTo(tx + cx, ty + cy);
      else ctx.lineTo(tx + cx, ty + cy);
    });
    ctx.closePath();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0)
    );
  };

  // 🔄 실제 실행 함수
  return async (mode) => {

    const reference = imageUploaderRef.current?.reference;

  //   if (mode === "add" && !reference) {
  //     alert("참조 이미지(reference)가 필요합니다. 가구를 선택해 주세요!");
  //     setShowMask(false);
  //     return;
  // }

    setShowMask(true);
    setShowHelper(false);
    await new Promise((res) => setTimeout(res, 200));

    const canvas = background?.current;
    if (!canvas) {
      alert("캔버스를 찾을 수 없습니다.");
      return;
    }

    let blob;

    if (mode === 'add' && imageUploaderRef?.current?.merge3DWithCanvas) {
      blob = await imageUploaderRef.current.merge3DWithCanvas();
      // console.log("🧩 3D + 2D 캔버스 병합 완료");
      // window.open(URL.createObjectURL(blob),"_blank");
    } else {
      blob = await extractCenterImageBlob(canvas, centerArea);
    }
    try {
      if (mode === 'move' && imageUploaderRef?.current) {
        const {
          thumbnail,
          finalThumbnailPos,
          clickOffsetRatio,
          transform,
          bbox,
        } = imageUploaderRef.current;

        const outputSize = {
          width: transform.centerArea.width,
          height: transform.centerArea.height,
        };

        if ([thumbnail, finalThumbnailPos, clickOffsetRatio, transform, bbox, outputSize].every(Boolean)) {
          blob = await drawThumbnailOnCanvas(canvas, {
            thumbnail,
            finalPos: finalThumbnailPos,
            offsetRatio: clickOffsetRatio,
            transform,
            bbox,
            outputSize,
            scale, 
            angle,
          });

          const win = window.open("", "_blank");
          if (win) {
            win.document.title = "📸 최종 합성 이미지 미리보기";
            win.document.body.innerHTML = `<img src="${URL.createObjectURL(blob)}" style="max-width: 100%;">`;
          }
        }
      }

      // console.log("🚩 blob:", blob, blob instanceof Blob);

      let base64;
      if (mode === "add") {
        // add 모드일 땐 thumbnail(base64 string) 을 참조로 
          base64 = await requestPlacement(
          mode,
          blob,
        );
      } else {
        // remove / move 모드
        base64 = await requestPlacement(mode, blob);
      }

      const resultImage = new Image();
      resultImage.onload = async () => {

        if (imageUploaderRef?.current) {
          imageUploaderRef.current.setFinalThumbnailPos?.(null);
          imageUploaderRef.current.setDraggingThumbnailPos?.(null);
          imageUploaderRef.current.setClickOffsetRatio?.({ x: 0.5, y: 0.5 }); 
          imageUploaderRef.current.clearSelectedIndex?.();
        }

        const ctx = canvas.getContext("2d");
        canvas.width = resultImage.width;
        canvas.height = resultImage.height;

        const transform = drawImageContainWithSideBlur(resultImage, ctx, canvas);
        transformRef.current = transform;
        originalBackgroundRef.current = resultImage;

        if (imageUploaderRef?.current) {
          imageUploaderRef.current.updatedTransform?.(transform);
          const { centerArea } = transform;
          imageUploaderRef.current.updateCanvasSize?.({
            width: centerArea?.width || canvas.width,
            height: centerArea?.height || canvas.height,
          });
          imageUploaderRef.current.setImageBase64?.(canvas.toDataURL("image/png"));
          imageUploaderRef.current.setBgImage?.(resultImage);
        }

             if (!sessionIdRef.current) {
                sessionIdRef.current = crypto.randomUUID();
              }
        await saveState(`data:image/png;base64,${base64}`);
        // handleFileChange?.(base64ToFile(resultImage.src, "ai_result.png"));
      };
      resultImage.src = `data:image/png;base64,${base64}`;
    } catch (err) {
      console.error(`❌ AI 서버 ${mode} 처리 실패:`, err);
      alert("AI 서버로 전송 중 오류 발생!");
    }

    setShowMask(false);
  };
};