import React, { useEffect, useState, useRef } from "react";
import TutorialStart from "./TutorialStart";
import TutorialStep1 from "./TutorialStep1";
import TutorialStep2 from "./TutorialStep2";
import TutorialStep3 from "./TutorialStep3";
import TutorialStep4 from "./TutorialStep4";

function TutorialManager({ isImageUploaded, forceStart, forceEnd, onStepChange, externalStep, currentTab }) {
    const [step, setStep] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const hasForced = useRef(false);

    const updateStep = (newStep) => {
        setStep(newStep);
        if (typeof onStepChange === "function") {
            onStepChange(newStep);
        }
    };

    // 현재 튜토리얼 단계 디버깅 로그
    // useEffect(() => {
    //     if (step) console.log("🎯 튜토리얼 현재 단계:", step);
    // }, [step]);

    // 외부에서 step이 바뀌면 내부도 반영
    useEffect(() => {
        if (externalStep && externalStep !== step) {
            setStep(externalStep);
        }
    }, [externalStep]);

    // 강제로 튜토리얼 시작 요청 시
    useEffect(() => {
        if (forceStart && !hasForced.current) {
            hasForced.current = true;
            setIsRunning(true);
            updateStep("0");
        }
    }, [forceStart]);

    // 처음 들어온 사용자라면 튜토리얼 자동 시작
    useEffect(() => {
        const seen = localStorage.getItem("hasSeenTutorial");
        if (!seen && !forceStart) {
            setIsRunning(true);
            updateStep("0");
        }
    }, [forceStart]);

    const handleStart = () => updateStep("1.1");

    const handleSkip = () => {
        setIsRunning(false);
        localStorage.setItem("hasSeenTutorial", "true");
        setStep(null);
        onStepChange?.(null);
        hasForced.current = false;

    };

    // 업로드 완료 시 1.1 → 1.2 로 자동 전환
    useEffect(() => {
        if (step === "1.1" && isImageUploaded) {
            updateStep("1.2");
        }
    }, [step, isImageUploaded]);

    if (!isRunning) return null;

    return (
        <>
            {/* 튜토리얼 시작 화면 */}
            {step === "0" && <TutorialStart onStart={handleStart} onSkip={handleSkip} />}

            {/* Step 1 */}
            {(step === "1.1" || step === "1.2") && (
                <TutorialStep1
                    phase={step}
                    onNext={() => updateStep("2.1")} // Step2로 이동
                    onPrev={() => updateStep("0")}
                    onSkip={handleSkip}
                    isImageUploaded={isImageUploaded}
                />
            )}

            {/* Step 2 */}
            {["2.1", "2.2", "2.3"].includes(step) && (
                <TutorialStep2
                    phase={step}
                    onNext={() => {
                        if (step === "2.1") updateStep("2.2");
                        else if (step === "2.2") updateStep("2.3");
                        else if (step === "2.3") updateStep("3.1");
                    }}
                    onPrev={() => {
                        if (step === "2.3") updateStep("2.2");
                        else if (step === "2.2") updateStep("2.1");
                        else if (step === "2.1") updateStep("1.2");
                    }}
                    onSkip={handleSkip}
                />
            )}

            {/* Step 3 */}
            {["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"].includes(step) && (
                <TutorialStep3
                    phase={step}
                    onNext={() => {
                        if (step === "3.1") updateStep("3.2");
                        else if (step === "3.2") updateStep("3.3");
                        else if (step === "3.3") updateStep("3.4");
                        else if (step === "3.4") updateStep("3.5");
                        else if (step === "3.5") updateStep("3.6");
                        else if (step === "3.6") updateStep("3.7");
                        else if (step === "3.7") updateStep("4.1"); // 다음 단계로
                    }}
                    onPrev={() => {
                        if (step === "3.7") updateStep("3.6");
                        else if (step === "3.6") updateStep("3.5");
                        else if (step === "3.5") updateStep("3.4");
                        else if (step === "3.4") updateStep("3.3");
                        else if (step === "3.3") updateStep("3.2");
                        else if (step === "3.2") updateStep("3.1");
                        else if (step === "3.1") updateStep("2.4");
                    }}
                    onSkip={handleSkip}
                    setTutorialStep={updateStep}
                />
            )}
            {/* Step 4 */}
            {["4.1", "4.2", "4.3", "4.4"].includes(step) && (
                <TutorialStep4
                    phase={step}
                    currentTab={currentTab}
                    onNext={() => {
                        if (step === "4.1") updateStep("4.2");
                        else if (step === "4.2") updateStep("4.3");
                        else if (step === "4.3") updateStep("4.4");
                        else if (step === "4.4") {
                            // 튜토리얼 종료
                            setIsRunning(false);
                            localStorage.setItem("hasSeenTutorial", "true");
                            updateStep(null);
                            hasForced.current = false;
                            onStepChange?.(null);
                        }
                    }}
                    onPrev={() => {
                        if (step === "4.4") updateStep("4.3");
                        else if (step === "4.3") updateStep("4.2");
                        else if (step === "4.2") updateStep("4.1");
                        else if (step === "4.1") updateStep("3.7");
                    }}
                    onSkip={handleSkip}
                />
            )}
        </>
    );
}

export default TutorialManager;
