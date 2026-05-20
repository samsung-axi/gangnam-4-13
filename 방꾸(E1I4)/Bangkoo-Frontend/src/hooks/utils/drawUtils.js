/**
 * 이미지의 비율을 유지하며 캔버스에 contain 방식으로 그리되,
 * 좌우 여백에는 blur 처리를 적용합니다.
 *
 * @param {HTMLImageElement} image - 그릴 이미지 객체
 * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
 * @param {HTMLCanvasElement} canvas - 캔버스 요소
 * @param {Object=} reuseTransform - 기존 transform 정보 재사용 시
 * @returns {Object} transform 정보 { scaleX, scaleY, offsetX, offsetY, centerArea }
 */
export const drawImageContainWithSideBlur = (image, ctx, canvas, reuseTransform = null) => {
    let transform;

    if (reuseTransform) {
        const { scaleX, scaleY, offsetX, offsetY } = reuseTransform;
        const renderableWidth = image.width * scaleX;
        const renderableHeight = image.height * scaleY;
        const blurWidth = offsetX;

        if (blurWidth > 0) {
            ctx.filter = "blur(15px)";
            ctx.drawImage(
                image,
                0, 0, image.width * 0.05, image.height,
                0, offsetY, blurWidth, renderableHeight
            );
            ctx.drawImage(
                image,
                image.width * 0.95, 0, image.width * 0.05, image.height,
                offsetX + renderableWidth, offsetY, blurWidth, renderableHeight
            );
        }

        ctx.filter = "none";
        ctx.drawImage(image, offsetX, offsetY, renderableWidth, renderableHeight);
        return reuseTransform;
    }

    // 새 transform 계산
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = image.width / image.height;

    let renderableWidth, renderableHeight, xStart, yStart;

    if (imageAspect > canvasAspect) {
        // 이미지가 더 넓음 → 위아래 여백
        renderableWidth = canvas.width;
        renderableHeight = renderableWidth / imageAspect;
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
    } else {
        // 이미지가 더 높음 → 좌우 여백 (blur 적용 대상)
        renderableHeight = canvas.height;
        renderableWidth = renderableHeight * imageAspect;
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
    }

    const blurWidth = xStart;

    if (blurWidth > 0) {
        ctx.filter = "blur(15px)";
        ctx.drawImage(image, 0, 0, image.width * 0.05, image.height, 0, yStart, blurWidth, renderableHeight);
        ctx.drawImage(image, image.width * 0.95, 0, image.width * 0.05, image.height, xStart + renderableWidth, yStart, blurWidth, renderableHeight);
    }

    ctx.filter = "none";
    ctx.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);

    transform = {
        scaleX: renderableWidth / image.width,
        scaleY: renderableHeight / image.height,
        offsetX: xStart,
        offsetY: yStart,
        centerArea: {
            x: xStart,
            y: yStart,
            width: renderableWidth,
            height: renderableHeight
        },
    };

    return transform;
};
