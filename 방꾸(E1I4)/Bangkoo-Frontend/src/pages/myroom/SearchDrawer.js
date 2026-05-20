import React, {useState, useEffect} from "react";
import {
    ButtonBox,
    CloseButton,
    NoContent,
    Content,
    DrawerRoot,
    DrawerWrapper,
    SearchBox,
    KeywordBox,
    TextBox
} from "./css/SearchDrawer.styled";
import {Text} from "@/common/Typography";
import AISearchComponent from "../search/AISearchComponent";
import CommonImageBox from "@/common/CommonImageBox";
import CommonButton from "@/common/CommonButton";
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";

import { appendFurniture } from "@/features/furniture/furnitureSlice";
import { useSelector, useDispatch } from "react-redux";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import useCachedSearch from "@/hooks/search/useCachedSearch";
import LoadingSpinner from "@/common/LoadingSpinner";

const SearchDrawer = ({ onClose, tutorialStep, setTutorialStep }) => {
    const [isOpen, setIsOpen] = useState(false); // 애니메이션 제어용
    const dispatch = useDispatch();
    const myFurniture = useSelector((state) => state.furniture.list);
    const [rawList, setRawList] = useState([]);
    const [confirmedKeyword, setConfirmedKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState("");

    const {
        checkedItems,
        toggle,
        clearAll,
        getCheckedIds,
    } = useCheckedFurniture();

    const {
        getCachedResult,
        saveToCache,
        getCachedCheckedIds,
        saveCheckedIds
    } = useCachedSearch();

    const list = rawList;

    useEffect(() => {
        // mount 후 슬라이드 인
        requestAnimationFrame(() => setIsOpen(true));

        const lastKeyword = localStorage.getItem("lastSearchKeyword");
        if (lastKeyword) {
            const cachedResults = getCachedResult(lastKeyword);
            const cachedChecked = getCachedCheckedIds(lastKeyword);

            if (cachedResults && cachedResults.length > 0) {
                const resultWithId = cachedResults.map((item, index) => ({
                    ...item,
                    id: `${item.이름}-${index}`
                }));

                setConfirmedKeyword(lastKeyword);
                setRawList(resultWithId);

                // 체크 상태 복원
                cachedChecked?.forEach(id => {
                    if (!checkedItems[id]) toggle(id);
                });
            } else {
                // 캐시가 없다면 검색 상태 초기화
                localStorage.removeItem("lastSearchKeyword");
                setConfirmedKeyword("");
                setRawList([]);
            }
        }
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setLoadingDots(prev => prev === "..." ? "" : prev + ".");
        }, 500);
        return () => clearInterval(interval);
    }, [isLoading]);

    const isInMyFurniture = (itemId) =>
        myFurniture.some((f) => f.originalId === itemId);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false); // 1. 애니메이션 시작
            setTimeout(() => {
                onClose();       // 3. 애니메이션 끝나고 컴포넌트 제거
            }, 300);           // 2. transition-duration 만큼 기다림
        }
    };

    const renderResults = () => {
        if (isLoading) {
            return (
                <NoContent>
                    <LoadingSpinner />
                    <Text size="base" $weight={500}>로딩중{loadingDots}</Text>
                </NoContent>
            );
        }
        if (rawList.length === 0) {
            return (
                <NoContent>
                    <Text size="base" $weight={500} color="dark" style={{ textAlign: "center", marginTop: "100px" }}>
                        검색 결과가 없습니다.
                    </Text>
                </NoContent>
            );
        }
        return (
            <Content className="search-result-box">
                {(tutorialStep === "3.3") && (
                    <div className="drawer-backdrop"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.85)",
                            zIndex: 1500
                        }}
                    />
                )}
                {list.map((item, index) => (
                    <div key={item.id}>
                        <div className={`search-result-item ${index === 0 ? "first-result" : ""}`}>
                            <CommonImageBox
                                image={item.이미지}
                                type="checkbox"
                                isChecked={!!checkedItems[item.id] || isInMyFurniture(item.id)}
                                onLink={item.링크}
                                onCheck={(e) => {
                                    toggle(item.id);

                                    // 체크 상태 저장
                                    const updatedChecked = {
                                        ...checkedItems,
                                        [item.id]: !checkedItems[item.id] // toggle 후 상태
                                    };
                                    const checkedIds = Object.entries(updatedChecked)
                                        .filter(([_, isChecked]) => isChecked)
                                        .map(([id]) => id);

                                    saveCheckedIds(confirmedKeyword, checkedIds);
                                }}
                                recommendationReason={item.추천이유}
                            />
                        </div>
                        <TextBox>
                            <Text size="xs" $weight={800}>{item.이름}</Text>
                            <Text size="xs" $weight={600}>{item.설명}</Text>
                            <Text size="xs" $weight={800}>
                                ₩{item.할인가 != null ? item.할인가.toLocaleString() : item.정상가 != null ? item.정상가.toLocaleString() : "-"}
                            </Text>
                        </TextBox>


                    </div>
                ))}
            </Content>
        );
    };

    return (
        <DrawerRoot onClick={handleOverlayClick} className="drawer-root">
            <DrawerWrapper $isOpen={isOpen}>
                <Text size="base" $weight={800}>가구검색</Text>

                <SearchBox>
                    <AISearchComponent
                        mode="inline"
                        onSearchStart={() => {
                            setIsLoading(true);
                            setRawList([]);
                        }}
                        tutorialStep={tutorialStep}
                        onSearchResults={(result, keyword) => {
                            const resultWithId = result.map((item, index) => ({
                                ...item,
                                id: `${item.이름}-${index}`
                            }));

                            saveToCache(keyword, resultWithId);
                            localStorage.setItem("lastSearchKeyword", keyword);

                            setRawList(resultWithId);
                            setConfirmedKeyword(keyword);
                            setIsLoading(false);

                            const cachedChecked = getCachedCheckedIds(keyword);
                            cachedChecked?.forEach(id => {
                                if (!checkedItems[id]) toggle(id);
                            });

                            if (tutorialStep === "3.2") setTutorialStep("3.3");
                        }}
                    />
                </SearchBox>

                <KeywordBox>
                    <Text size="sm" $weight={800}>
                        {confirmedKeyword || "검색 결과"} <span style={{fontWeight: 500}}>({rawList.length})</span>
                    </Text>
                    <Text size="xxs" $weight={600} color="red">
                        * 체크된 가구만 배치가 가능합니다.
                    </Text>
                </KeywordBox>


                {renderResults()}

                <ButtonBox>
                    <CommonButton
                        className="place-button"
                        width="120px"
                        height="44px"
                        fontSize="xs"
                        fontWeight={800}
                        radius="sm"
                        type="fill"
                        onClick={() => {
                            const checkedMap = { ...checkedItems };
                            const selectedIds = getCheckedIds();

                            const selectedFurniture = list.filter(item =>
                                selectedIds.includes(item.id)
                            );
                            console.log(selectedFurniture);
                            selectedFurniture.forEach((item) => {
                                console.log(item.glb이미지);
                                dispatch(appendFurniture({
                                    id: item.id,
                                    image: item.이미지,
                                    name: item.이름,
                                    description: item.설명,
                                    price: item.할인가 ?? item.정상가,
                                    link: item.링크,
                                    model3dUrl: item.glb이미지,
                                    type: "addFurniture",
                                    isCustom: true,
                                }));
                            });
                            if (tutorialStep === "3.3") setTutorialStep("3.4");

                            clearAll();
                            onClose();
                        }}
                    >
                        배치
                    </CommonButton>
                </ButtonBox>

                <CloseButton
                    onClick={handleOverlayClick}
                    style={tutorialStep === "3.3" ? { display:"none" } : {}}
                >
                    <CloseIcon/>
                    닫기
                </CloseButton>
            </DrawerWrapper>
        </DrawerRoot>
    );
};

export default SearchDrawer;
