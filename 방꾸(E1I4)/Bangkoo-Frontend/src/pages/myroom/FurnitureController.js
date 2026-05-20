// ✅ 파일 위치: pages/myroom/FurnitureController.js
// ✅ 작성자: 김태원
// ✅ 기능 요약: 이미지 배치 관련 컨트롤 버튼 UI 컴포넌트
// - 튜토리얼, 초기화, AI 배치, 저장 버튼 등을 제공
// - 외부에서 전달받은 canvasRef를 기반으로 AI 배치 요청 가능

import React, {useState, useEffect} from "react";
import { ControllerBox, FlexBox } from "./css/MyRoom.styled";
import CommonButton from "@/common/CommonButton";
import { useApplyPlacement } from "@/hooks/useApplyPlacement";
import AiRecommended from "./dialog/AiRecommended";
import { ModalOverlay, ModalContent } from "./dialog/css/ModalWrapper.styled";

function FurnitureController({
                                 saveClick,
                                 aiClick,
                                 canvasRef,
                                 restoreInitialImageRef,
                                 onTutorialStart,
                                 mode,
                                 centerArea,
                                 imageUploaderRef,
                                 onTutorialAdvance,
                                 tutorialStep,
                                 setTutorialStep,
                                 setShowAiRecommended,
                                 sessionIdRef
}) {

    const [startProgress, setStartProgress] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 🔹 추후 사용될 참조 이미지 (추가 기능 대비)
    // const reference = null;

    // 🔹 캔버스 사이즈 정보 (현재는 고정값 사용)
    const canvasSize = { width: 1024, height: 720 };

    const handleRestoreClick = () => {
        if (imageUploaderRef.current?.restoreOriginalImage) {
            imageUploaderRef.current.restoreOriginalImage();
        } else {
          console.warn("restoreInitialImageRef가 비어있습니다.");
        }
      };

    /**
     * ✅ AI 배치 기능 훅
     * - 배경(canvasRef)을 기반으로 AI 서버에 이미지 전송
     * - 현재는 "remove" 모드 고정
     * - 마스킹/헬퍼 UI는 비활성화(dummy 함수 전달)
     */
    const applyPlacement = useApplyPlacement({
        sessionIdRef,
        mode,
        background: canvasRef,
        canvasSize,
        setShowMask: () => {},
        setShowHelper: () => {},
        centerArea,
        imageUploaderRef,
    });

    /**
     * ✅ AI 이미지 생성 버튼 클릭 시 동작
     * - progress 시작 트리거 먼저 켜고
     * - 100ms 뒤에 applyPlacement() 실행
     */
     const handlePlacementClick = () => {

             if (!mode) {
                alert("작업 모드를 먼저 선택하세요!");
                return;
             }

             setShowAiRecommended(true);
             setIsAnalyzing(true);
             setStartProgress(true);
             applyPlacement(mode);    
         
             setTimeout(() => {
                 setIsAnalyzing(false);
                 setStartProgress(false);
                 // setShowAiRecommended(false);
             }, 7000);
        
             if (typeof onTutorialAdvance === "function") {
                 onTutorialAdvance();
             }
         };

    // 🔸 버튼에 공통 적용할 props 모음
    const buttonProps = {
        height: "44px",
        fontSize: "xs",
        fontWeight: 800,
        radius: "sm",
    };

    return (
        <ControllerBox>
            {/* ✅ 튜토리얼 버튼 (추후 동작 연결 예정) */}
            <CommonButton
                width="135px"
                type="fill"
                onClick={onTutorialStart}
                {...buttonProps}
            >
                튜토리얼
            </CommonButton>

            <FlexBox>
                {/* ✅ 초기 이미지로 되돌리기 버튼 */}
                <CommonButton
                    width="135px"
                    type="outline"
                    onClick={handleRestoreClick}
                    {...buttonProps}
                >
                    초기 이미지
                </CommonButton>

                {/* ✅ AI 이미지 생성 버튼 */}
                <CommonButton
                    className="generate-image-button"
                    width="135px"
                    type="outline"
                    onClick={handlePlacementClick}
                    {...buttonProps}
                >
                    이미지 생성
                </CommonButton>

                {/* ✅ 인테리어 저장 버튼 (외부에서 전달받은 함수 실행) */}
                <CommonButton
                    className={`save-button ${tutorialStep === "4.1" ? "highlight" : ""}`}
                    width="80px"
                    type="outline"
                    onClick={() => {
                        saveClick(); // 원래 저장 열기 동작
                        if (tutorialStep === "4.1" && typeof setTutorialStep === "function") {
                            setTutorialStep("4.2"); // 다음 단계로 이동!
                        }
                    }}
                    {...buttonProps}
                >
                    저장
                </CommonButton>
            </FlexBox>
        </ControllerBox>
    );
}

export default FurnitureController;
