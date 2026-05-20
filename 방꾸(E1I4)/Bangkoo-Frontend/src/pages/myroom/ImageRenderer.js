import React, { useEffect, useRef } from "react";
import { MainCanvas } from "./css/ImageUploader.styled";
import { drawImageContainWithSideBlur } from "@/hooks/utils/drawUtils.js";

function ImageRenderer({ imageBase64, width, height, detectedObjects, selectedIndex, onMouseDown, onMouseMove, onMouseUp,canvasRef }) {
    const drawBox = (ctx, bbox) => {
        const [x, y, w, h] = bbox;

        ctx.strokeStyle = "red";  // 빨간 외곽선
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, y, w, h);
    };
    const drawMask = (ctx, obj) => {
        const [x, y, w, h] = obj.bbox;
        const mask = obj.mask;
        if (!mask || !mask[0]) return;

        const path = new Path2D();
        for (let j = 0; j < mask.length; j++) {
            for (let i = 0; i < mask[0].length; i++) {
                if (mask[j][i]) {
                    const px = x + (i * w) / mask[0].length;
                    const py = y + (j * h) / mask.length;
                    // 한 픽셀 단위 사각형 경계 그리기
                    path.rect(px, py, w / mask[0].length, h / mask.length);
                }
            }
        }

        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.3; // 얇게
        ctx.stroke(path);    // 🟥 외곽선만 그리기
    };


    //useEffect(() => {
    //     if (!canvasRef.current || !imageBase64) return;
    //
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext("2d");
    //     const image = new Image();
    //
    //     image.onload = () => {
    //         canvas.width = image.width;
    //         canvas.height = image.height;
    //         ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    //
    //         if (typeof selectedIndex === "number") {
    //             const obj = detectedObjects[selectedIndex];
    //             if (obj) {
    //                 drawMask(ctx, obj);
    //             }
    //         }
    //     };
    //     image.src = imageBase64;
    // }, [imageBase64, detectedObjects, selectedIndex]);
    //


    return <MainCanvas ref={canvasRef}
                       onMouseDown={onMouseDown}
                       onMouseMove={onMouseMove}
                       onMouseUp={onMouseUp} />;
}

export default ImageRenderer;
