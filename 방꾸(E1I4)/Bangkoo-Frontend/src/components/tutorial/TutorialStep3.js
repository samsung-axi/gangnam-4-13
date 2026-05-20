import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle,
    FixedMessage,
    Backdrop6,
    SkipBox,
} from "./css/Tutorial.styled";
import CommonButton from "@/common/CommonButton";

const buttonProps = {
    width:"90px",
    height: "40px",
    fontSize: "xs",
    fontWeight: 600
};

function TutorialStep3({ phase, onNext, onPrev, onSkip, setTutorialStep }) {
    const [highlightRects, setHighlightRects] = useState({});
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [showFixedMessage, setShowFixedMessage] = useState(false);
    const [typedMessage, setTypedMessage] = useState("");

    const getLastFurnitureRect = () => {
        const el = document.querySelector(".furniture-item:last-child");
        return el?.getBoundingClientRect();
    };

    useEffect(() => {
        if (phase?.startsWith("3")) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [phase]);

    useEffect(() => {
        const updateRects = () => {
            const lastFurnitureRect = getLastFurnitureRect();
            if (!lastFurnitureRect) return;
            setHighlightRects(prev => ({ ...prev, lastFurniture: lastFurnitureRect }));

            if (phase === "3.4") {
                setTooltipPos({
                    top: lastFurnitureRect.top + window.scrollY - 48,
                    left: lastFurnitureRect.left + window.scrollX + lastFurnitureRect.width / 2 - 100
                });
            }
        };

        const scrollContainer = document.querySelector(".grid-container");

        if (phase === "3.4") {
            updateRects();
            setTimeout(updateRects, 0);
            window.addEventListener("resize", updateRects);
            scrollContainer?.addEventListener("scroll", updateRects);
        }

        return () => {
            if (phase === "3.4") {
                window.removeEventListener("resize", updateRects);
                scrollContainer?.removeEventListener("scroll", updateRects);
            }
        };
    }, [phase]);

    useEffect(() => {
        const updateRects = () => {
            const selectors = {
                searchBtn: ".search-button",
                drawer: ".drawer-root",
                firstResult: ".first-result",
                preview: ".preview-area",
                lastFurniture: ".furniture-item:last-child",
                placeBtn: ".place-button",
                generateBtn: ".generate-image-button"
            };

            const rects = {};
            for (const [key, selector] of Object.entries(selectors)) {
                const el = document.querySelector(selector);
                if (el) rects[key] = el.getBoundingClientRect();
            }

            setHighlightRects(rects);

            if (phase === "3.3" && rects.firstResult) {
                setTooltipPos({
                    top: rects.firstResult.top + window.scrollY + rects.firstResult.height + 15,
                    left: rects.firstResult.left + window.scrollX + rects.firstResult.width / 2 - 100
                });
            }

            if (phase === "3.5" && rects.generateBtn) {
                setTooltipPos({
                    top: rects.generateBtn.top + window.scrollY + rects.generateBtn.height + 12,
                    left: rects.generateBtn.left + window.scrollX + rects.generateBtn.width / 2 - 100
                });
            }

            if (phase === "3.7" && rects.preview) {
                setTooltipPos({
                    top: rects.preview.bottom + window.scrollY + 10,
                    left: rects.preview.left + window.scrollX + rects.preview.width / 2 - 100
                });
            }

            if (phase === "3.4") {
                const grid = document.querySelector(".grid-container");
                const preview = document.querySelector(".preview-area");
                if (grid) Object.assign(grid.style, { zIndex: "1600", position: "relative" });
                if (preview) Object.assign(preview.style, { zIndex: "1600", position: "relative" });

                const last = document.querySelector(".furniture-item:last-child");
                if (last && grid) grid.scrollTo({
                    top: last.offsetTop - grid.offsetTop,
                    behavior: "smooth"
                });
            }

            if (phase === "3.5") {
                const last = document.querySelector(".furniture-item:last-child");
                if (last) {
                    last.style.display = "none";
                    setTimeout(() => {
                        last.style.display = "block";
                        Object.assign(last.style, { zIndex: "0", position: "relative" });
                    }, 0);
                }
            }

        };
        updateRects();
    }, [phase]);


    useEffect(() => {
        const selectors = {
            searchBtn: ".search-button",
            preview: ".preview-area",
            firstResult: ".first-result",
            placeBtn: ".place-button",
            drawer: ".drawer-root",
            lastFurniture: ".furniture-item:last-child",
            furnitureGrid: ".grid-container",
            generateBtn: ".generate-image-button"
        };

        const elements = {};
        for (const [key, selector] of Object.entries(selectors)) {
            elements[key] = document.querySelector(selector);
        }

        if (phase === "3.1" && elements.searchBtn) {
            elements.searchBtn.dataset.prevZIndex = elements.searchBtn.style.zIndex || "auto";
            elements.searchBtn.style.zIndex = "2000";
        } else if (elements.searchBtn) {
            elements.searchBtn.style.zIndex = elements.searchBtn.dataset.prevZIndex || "auto";
        }

        if (phase !== "3.4") {
            ["furnitureGrid", "preview"].forEach(key => {
                if (elements[key]) {
                    elements[key].style.zIndex = elements[key].dataset.prevZIndex || "auto";
                    elements[key].style.position = elements[key].dataset.prevPosition || "static";
                }
            });
        }

        if (phase === "3.7" && elements.preview) {
            elements.preview.dataset.prevZIndex = elements.preview.style.zIndex || "auto";
            elements.preview.style.zIndex = "2000";
        }

        const elevateEls = [];
        if (phase === "3.3") elevateEls.push(elements.firstResult, elements.placeBtn, elements.drawer);
        if (phase === "3.5") elevateEls.push(elements.preview, elements.generateBtn);

        elevateEls.forEach(el => {
            if (!el) return;
            el.dataset.prevZIndex = el.style.zIndex || "auto";
            el.dataset.prevPosition = el.style.position || "static";
            Object.assign(el.style, { zIndex: "1600", position: "relative" });
        });

        return () => {
            elevateEls.forEach(el => {
                if (!el) return;
                el.style.zIndex = el.dataset.prevZIndex || "auto";
                el.style.position = el.dataset.prevPosition || "static";
            });

            if (elements.preview) {
                elements.preview.style.zIndex = elements.preview.dataset.prevZIndex || "auto";
                elements.preview.style.position = elements.preview.dataset.prevPosition || "static";
            }

            if (elements.drawer) elements.drawer.style.display = "";
        };
    }, [phase]);

    useEffect(() => {
        if (phase === "3.2") {
            setShowFixedMessage(true);
            setTypedMessage("");
            const fullText = " 검색어를 입력해주세요 ";
            let index = 0;

            const typingInterval = setInterval(() => {
                if (index >= fullText.length) {
                    clearInterval(typingInterval);
                    return;
                }
                setTypedMessage(prev => prev + fullText[index++]);
            }, 100);

            const hideTimer = setTimeout(() => {
                setShowFixedMessage(false);
                const drawer = document.querySelector(".drawer-root");
                if (drawer) {
                    drawer.dataset.prevZIndex = drawer.style.zIndex || "auto";
                    drawer.dataset.prevPosition = drawer.style.position || "static";
                    drawer.style.zIndex = "1600";
                    drawer.style.position = "relative";
                }
            }, 3000);

            return () => {
                clearInterval(typingInterval);
                clearTimeout(hideTimer);
                const drawer = document.querySelector(".drawer-root");
                if (drawer) {
                    drawer.style.zIndex = drawer.dataset.prevZIndex || "auto";
                    drawer.style.position = drawer.dataset.prevPosition || "static";
                }
            };
        }
    }, [phase]);

    const highlight = (rect, style = {}) => rect?.width > 0 && rect?.height > 0 && (
        <HighlightStyle
            style={{
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
                zIndex: 2000,
                ...style
            }}
        />
    );

    return (
        <>
            {phase === "3.6" ?
                <Backdrop6 style={{ zIndex: 1300 }} />
                :
                <Backdrop style={{ zIndex: 1300 }} />
            }

            {phase === "3.1" &&
                highlight(highlightRects.searchBtn)
            }
            {phase === "3.2" && showFixedMessage &&
                <FixedMessage><span>{typedMessage}</span></FixedMessage>
            }
            {phase === "3.3" &&
                highlight(highlightRects.firstResult)
            }
            {phase === "3.3" &&
                highlight(highlightRects.placeBtn)
            }
            {phase === "3.3" &&
                <TutorialOverlay
                    message={<span>추가할 가구를 체크한뒤,<br />"배치" 버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }}
                />
            }
            {(phase === "3.4" || phase === "3.7") &&
                highlight(highlightRects.preview)
            }
            {phase === "3.4" && highlightRects.lastFurniture && <>
                {highlight(highlightRects.lastFurniture, { border: "3px solid orange", boxShadow: "0 0 12px orange", zIndex: 1700 })}
                <TutorialOverlay
                    message={<span>배치할 가구를 선택해주세요</span>}
                    position={tooltipPos}
                    arrowDirection="down"
                    style={{ zIndex: 1500 }}
                />
            </>}
            {phase === "3.5" &&
                highlight(highlightRects.preview)
            }
            {phase === "3.5" &&
                highlight(highlightRects.generateBtn)
            }
            {phase === "3.5" &&
                <TutorialOverlay
                    message={<span>이미지 배치 버튼을 눌러주세요.</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }} />
            }

            {phase === "3.7" && (
                <TutorialOverlay
                    message={<span>AI가 배치한 결과를 확인하세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}

            <SkipBox>
                {/*<CommonButton*/}
                {/*    type="outline"*/}
                {/*    bgColor="orange"*/}
                {/*    onClick={onPrev}*/}
                {/*    children="이전"*/}
                {/*    {...buttonProps}*/}
                {/*/>*/}

                {phase === "3.7" && (
                    <CommonButton
                        onClick={onNext}
                        children="다음"
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

export default TutorialStep3;