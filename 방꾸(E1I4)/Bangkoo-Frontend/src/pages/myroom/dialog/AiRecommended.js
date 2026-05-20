import React, { useState, useEffect } from "react";
import {
    AiRecommendedRoot,
    FurnitureImageStyled,
    ImageWrapper, ProgressBarWrapper, ProgressInner, ProgressOuter,
    StyledSlider,
} from "./css/AiRecommended.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Text } from "@/common/Typography";
import { useDispatch } from "react-redux";
import { startAnalysis, endAnalysis } from "@/features/ai/aiSlice";

function AiRecommended() {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        dispatch(startAnalysis()); // 분석 시작 상태로 진입

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 8;
                if (next >= 100) {
                    clearInterval(timer);
                    dispatch(endAnalysis()); // 분석 종료
                    return 100;
                }
                return next;
            });
        }, 500);

        return () => clearInterval(timer);
    }, [dispatch]);

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3.5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: false,
    };

    const imageUrls = [
        "https://www.ikea.com/kr/ko/images/products/antilop-highchair-with-safety-belt-white-silver-colour__0727491_pe735716_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/antilop-supporting-cushion-and-cover-multicolour__1250501_pe923783_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/foderskopa-cable-organizer-bag-black__1165769_pe890944_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/goersnygg-carrier-bag-large-light-beige__1013442_pe829201_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/pillerstarr-cooling-bag-patterned-blue__1383823_pe962686_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/eftertraeda-bag-white__0915950_pe784933_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/ingolf-bar-stool-with-backrest-white__0728062_pe736035_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/roenninge-bar-table-birch__1044552_pe842223_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/norberg-wall-mounted-drop-leaf-table-white__0736622_pe740674_s5.jpg",
        "https://www.ikea.com/kr/ko/images/products/lillanaes-bar-stool-chrome-plated-gunnared-dark-grey__1150252_pe884439_s5.jpg",
    ];

    const images = imageUrls.map((url, i) => (
        <ImageWrapper key={i}>
            <FurnitureImageStyled src={url} alt={`가구 ${i + 1}`} />
        </ImageWrapper>
    ));

    return (
        <AiRecommendedRoot>
            <Text size="md" $weight={700}>
                “당신의 <span>공간</span>을 더 아름답게, <span>AI</span>가 어울리는 <span>가구</span>를 골라드려요”
            </Text>

            <StyledSlider {...sliderSettings}>{images}</StyledSlider>

            <ProgressBarWrapper>
                <Text size="xxs" $weight={500}>
                    배치 결과 보기까지 <span>{progress}%</span> 진행중
                </Text>
                <ProgressOuter>
                    <ProgressInner $percent={progress} />
                </ProgressOuter>
            </ProgressBarWrapper>
        </AiRecommendedRoot>
    )
}

export default AiRecommended;
