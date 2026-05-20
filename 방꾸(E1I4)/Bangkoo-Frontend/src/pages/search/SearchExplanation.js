import React, { useState, useEffect } from "react";
import { ExplanationBox, ImageBox, TypingText } from "./css/SearchInput.styled";
import { Text } from "@/common/Typography";
import SearchImage from "@/assets/images/SearchImage.png";

function SearchExplanation({ visible }) {
    const fullText = "빨간색 모던한 의자";
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    // 깜빡이는 커서
    useEffect(() => {
        const blink = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        if (!visible) return;

        setDisplayedText("");
        setCurrentIndex(0);
    }, [visible]);

    useEffect(() => {
        if (!visible) return;

        if (currentIndex === fullText.length) {
            const delay = setTimeout(() => {
                setDisplayedText("");
                setCurrentIndex(0);
            }, 2000);
            return () => clearTimeout(delay);
        }

        const randomDelay = Math.floor(Math.random() * 150) + 50; // 50~200ms

        const timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + fullText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
        }, randomDelay);

        return () => clearTimeout(timeout);
    }, [currentIndex, visible]);

    if (!visible) return null;

    return (
        <ExplanationBox>
            <Text size="md" $weight={700}>가구 AI 검색</Text>
            <Text size="xs" $weight={600}>
                원하는 가구를 자연스럽게 설명해보세요.<br />
                새로워진 AI 검색엔진으로 원하는 가구를 찾아드립니다.
            </Text>
            <ImageBox>
                <TypingText>
                    {displayedText}
                    <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
                </TypingText>

                <img src={SearchImage} alt="AI 검색창 이미지" />
            </ImageBox>
        </ExplanationBox>
    );
}

export default SearchExplanation;
