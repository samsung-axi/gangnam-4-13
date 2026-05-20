import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AISearchComponent from "../search/AISearchComponent";
import {GridBox, SearchRoot, SearchTermBox, TextBox, LoadingBox} from "./css/SearchPage.styled";
import {Text} from "@/common/Typography";
import CommonButton from "@/common/CommonButton";
import CommonImageBox from "@/common/CommonImageBox";
import useAuth from "@/hooks/login/useAuth";
import { setSearchResults, setConfirmedKeyword, setUploadedImage, setLoading } from "@/features/search/searchSlice";
import { searchByText, searchImageUnified } from "@/api/search/search";
import LoadingSpinner from "@/common/LoadingSpinner";
import { getAnonymousId } from "@/features/search/generateAnonymousId";
import useSearchHistory from "@/hooks/search/useSearchHistory";

function SearchPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { isLoggedIn, login, user } = useAuth(); // 로그인 상태, 로그인 함수
    const userId = isLoggedIn ? user?.userId : getAnonymousId();
    const { autoSave } = useSearchHistory();

    const isLoading = useSelector(state => state.search.isLoading); // 로딩
    const searchResults = useSelector((state) => state.search.resultList); // 검색 결과 불러오기
    const keyword = useSelector((state) => state.search.confirmedKeyword); // Redux에서 검색어 가져오기

    const [loadingDots, setLoadingDots] = useState(""); // 로딩

    // location.state에서 전달된 값 추출
    const preloadResult = location.state?.result;
    const preloadImage = location.state?.imagePreviewUrl;
    const preloadKeyword = location.state?.confirmedKeyword;

    const goToRoom = () => {
        if (isLoggedIn) {
            navigate("/myroom");  // 홈 화면으로 리다이렉트
        } else {
            // 로그인 후 돌아올 경로 기억
            sessionStorage.setItem("redirectAfterLogin", "/myroom");
            login(); // 카카오 로그인 페이지로 이동
        }
    };

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingDots(prev => {
                if (prev === "...") return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, [isLoading]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        const imageParam = params.get("image");

        if (preloadResult) {
            dispatch(setSearchResults(preloadResult));
            dispatch(setConfirmedKeyword(preloadKeyword));
            dispatch(setUploadedImage(preloadImage));
            return;
        }

        const fetchSearchResult = async () => {
            try {
                dispatch(setLoading(true));
                let result;

                const decodedQuery = decodeURIComponent(query || "");

                const isValidImageUrl =
                    typeof imageParam === "string" &&
                    (imageParam.startsWith("http") || imageParam.startsWith("blob:"));

                if (imageParam && isValidImageUrl) {
                    result = await searchImageUnified({
                        imageFile: null,
                        imageUrl: imageParam,
                        query: decodedQuery,
                        userId,
                        autoSave
                    });
                } else if (query) {
                    result = await searchByText(decodedQuery, userId, autoSave);
                } else {
                    return;
                }

                dispatch(setSearchResults(result));
                dispatch(setConfirmedKeyword(decodedQuery));
            } catch (err) {
                console.error("검색 실패:", err);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSearchResult();
    }, [location.search, userId, autoSave]);


    return (
        <SearchRoot>
            <AISearchComponent/>

            <SearchTermBox>
                <Text size="base" $weight={800}>
                    {keyword || "검색 결과"}{" "}
                    <span style={{fontWeight: 500}}>({searchResults.length})</span>
                </Text>
            </SearchTermBox>

            {isLoading ?
                <LoadingBox>
                    <LoadingSpinner />
                    <Text size="base" $weight={500}>로딩중{loadingDots}</Text>
                </LoadingBox>
                
                :
                searchResults.length > 0 ? (
                    <GridBox>
                        {searchResults.map((item, index) => (
                            <div key={index}>
                                <CommonImageBox
                                    image={item.이미지}
                                    type={"basic"}
                                    onLink={item.링크}
                                    recommendationReason={item.추천이유 && item.추천이유}
                                />

                                <TextBox>
                                    <div>
                                        <Text size="xs" $weight={800}>{item.이름}</Text>
                                        <Text size="xs" $weight={600}>{item.설명}</Text>
                                    </div>

                                    <Text size="md" $weight={800}>
                                        ₩
                                        {item.할인가 != null ?
                                            item.할인가.toLocaleString()
                                            :
                                            item.정상가 != null ?
                                                item.정상가.toLocaleString()
                                                :
                                                "-"
                                        }
                                    </Text>
                                </TextBox>

                                <CommonButton
                                    width="100%"
                                    height="44px"
                                    fontSize="xs"
                                    fontWeight={700}
                                    radius="sm"
                                    type="fill"
                                    onClick={goToRoom}
                                >
                                    내방 인테리어 하러가기
                                </CommonButton>
                            </div>
                        ))}
                    </GridBox>
                ) : (
                    <Text size="base" $weight={500} color="dark" style={{ textAlign: "center", marginTop: "100px" }}>
                        검색 결과가 없습니다.
                    </Text>
                )

            }


        </SearchRoot>
    );
}

export default SearchPage;