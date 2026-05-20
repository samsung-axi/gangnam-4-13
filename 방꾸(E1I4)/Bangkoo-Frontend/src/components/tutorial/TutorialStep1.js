import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle,
    SkipBox
} from "./css/Tutorial.styled";
import CommonButton from "../../common/CommonButton";

const buttonProps = {
    width:"90px",
    height: "40px",
    fontSize: "xs",
    fontWeight: 600
};

function TutorialStep1({ phase, onNext, onPrev, onSkip, isImageUploaded}) {
    const [uploadBtnBox, setUploadBtnBox] = useState(null);
    const [previewBox, setPreviewBox] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const updateHighlightTargets = () => {
            const uploadBtn = document.querySelector(".upload-button");
            const preview = document.querySelector(".preview-area");

            if (preview) {
                const rect = preview.getBoundingClientRect();
                setPreviewBox({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                });
            }

            // 업로드 버튼 강조 및 툴팁은 1.1 단계일 때만
            if (phase === "1.1" && uploadBtn) {
                const rect = uploadBtn.getBoundingClientRect();
                setUploadBtnBox({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                });

                setTooltipPos({
                    top: rect.top + window.scrollY - 75,
                    left: rect.left + rect.width / 2 - 120
                });
            }

            // 다음 버튼 툴팁 위치는 1.2 단계일 때
            if (phase === "1.2") {
                requestAnimationFrame(() => {
                    const nextBtn = document.querySelector(".tutorial-next-button");
                    if (nextBtn) {
                        const rect = nextBtn.getBoundingClientRect();
                        setTooltipPos({
                            top: rect.bottom + 20,
                            left: rect.left + rect.width / 2 - 100
                        });
                    }
                });
            }
        };

        updateHighlightTargets();
        const interval = setInterval(updateHighlightTargets, 500);
        return () => clearInterval(interval);
    }, [phase]);

    useEffect(() => {
        const uploadBtn = document.querySelector(".upload-button");
        const preview = document.querySelector(".preview-area");

        const elementsToElevate = [];

        // 1.1 단계일 때만 uploadBtn 강조
        if (phase === "1.1") {
            if (uploadBtn) elementsToElevate.push(uploadBtn);
        }

        // preview는 1.1, 1.2 둘 다 강조
        if (preview) elementsToElevate.push(preview);

        elementsToElevate.forEach(el => {
            el.dataset.prevZIndex = el.style.zIndex;
            el.dataset.prevPosition = el.style.position;
            el.style.zIndex = "9999";
            el.style.position = "relative";
        });

        return () => {
            elementsToElevate.forEach(el => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });
        };
    }, [phase]);

    // 업로드 완료되면 1.2로 자동 전환
    useEffect(() => {
        if (phase === "1.1" && isImageUploaded) {
            onNext(); // 1.2로 넘어가도록 onNext 호출
        }
    }, [isImageUploaded, phase, onNext]);

    return (
        <>
            <Backdrop />

            {/* 강조 영역 */}
            {phase === "1.1" && uploadBtnBox && <HighlightStyle style={uploadBtnBox} />}
            {previewBox && <HighlightStyle style={previewBox} />}

            {/* 툴팁 */}
            {phase === "1.1" && uploadBtnBox && (
                <TutorialOverlay
                    message={
                        <span>
                          사진을 업로드하면 AI가 가구를 자동으로<br />
                          탐지해서 '나의 가구'에 등록돼요.
                        </span>
                    }
                    position={tooltipPos}
                    arrowDirection="down"
                />
            )}
            {/*{phase === "1.2" && (*/}
            {/*    <TutorialOverlay*/}
            {/*        message={<span>다음 버튼을 클릭해주세요</span>}*/}
            {/*        position={tooltipPos}*/}
            {/*        arrowDirection="up"*/}
            {/*        arrowLeft={100}*/}
            {/*    />*/}
            {/*)}*/}

            {/* 튜토리얼 상단 버튼 */}
            <SkipBox>
                {/*<CommonButton*/}
                {/*    type="outline"*/}
                {/*    bgColor={"orange"}*/}
                {/*    onClick={onPrev}*/}
                {/*    children={"이전"}*/}
                {/*    {...buttonProps}*/}
                {/*/>*/}

                {phase === "1.2" && (
                    <CommonButton
                        className="tutorial-next-button"
                        onClick={onNext}
                        children={"다음"}
                        {...buttonProps}
                    />
                )}

                <CommonButton
                    bgColor={"grey"}
                    onClick={onSkip}
                    children={"Skip"}
                    {...buttonProps}
                />
            </SkipBox>
        </>
    );
}

export default TutorialStep1;
