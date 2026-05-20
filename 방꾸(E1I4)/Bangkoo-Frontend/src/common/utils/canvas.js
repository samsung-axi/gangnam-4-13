// common/utils/canvas.js

// 배경과 전경 이미지를 합성해서 finalCanvas를 반환
export async function mergeCanvasImages(backgroundSrc, canvasElement, canvasSize) {
    const bgImg = new Image();
    bgImg.src = backgroundSrc;
  
    const fgImg = new Image();
    fgImg.src = canvasElement.toDataURL('image/png');
  
    await Promise.all([
      new Promise(resolve => (bgImg.onload = resolve)),
      new Promise(resolve => (fgImg.onload = resolve)),
    ]);
  
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvasSize.width;
    finalCanvas.height = canvasSize.height;
  
    const ctx = finalCanvas.getContext('2d');
    ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(fgImg, 0, 0, finalCanvas.width, finalCanvas.height);
  
    return finalCanvas;
  }
  
  // finalCanvas를 이미지 blob으로 변환
  export function canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }
  