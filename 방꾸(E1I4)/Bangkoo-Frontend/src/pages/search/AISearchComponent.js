import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUploadedImage, setSearchResults, setConfirmedKeyword, setLoading } from "@/features/search/searchSlice";
import SearchInputComponent from "./SearchInputComponent";
import SearchExplanation from "./SearchExplanation";
import SearchTerm from "./SearchTerm";
import Category from "./Category";
import ImageSearchBox from "./ImageSearchBox";
import { useNavigate, useLocation } from "react-router-dom";
import { searchByText, searchImageUnified } from "@/api/search/search";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import useAuth from "@/hooks/login/useAuth";
import { getAnonymousId } from "@/features/search/generateAnonymousId";
import { addRecentKeyword } from "@/features/search/searchSlice";
import { saveSearchLog } from "./SearchLog";

function AISearchComponent({
    mode = "redirect", // "redirect" or "inline"
    onSearchResults, // 검색 결과 콜백 (inline 모드 전용)
    onSearchStart,
    tutorialStep
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { addKeyword, autoSave } = useSearchHistory();
    const { user, isLoggedIn } = useAuth();
    const userId = isLoggedIn ? user?.userId : getAnonymousId();
    // const userId = user?.userId || "anonymous";

    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState(false);
    const [showImageSearchBox, setShowImageSearchBox] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [overrideHover, setOverrideHover] = useState(true); // tutorialStep === "3.2"일 때만 true

    const containerRef = useRef(null); // 전체 검색 영역 감싸는 div
    const isSubmittingRef = useRef(false);


    useEffect(() => {
        if (tutorialStep === "3.2") {
            setOverrideHover(true);
        }
    }, [tutorialStep]);

    const handleClickCategory = () => {
        setCategory(!category);
        setIsHover(false);
        setIsFocused(false);
        setShowImageSearchBox(false);
        setOverrideHover(false);
    };

    const handleClickIsFocused = () => {
        setIsFocused(true);
        setIsHover(false);
        setShowImageSearchBox(false);
        setCategory(false);
        setOverrideHover(false);
    };

    const handleClickImageSearch = () => {
        setShowImageSearchBox(!showImageSearchBox);
        setIsHover(false);
        setIsFocused(false);
        setCategory(false);
        setOverrideHover(false);
    };

    // 카테고리 클릭시 검색
    const handleSearchByCategory = async (categoryName) => {
        const trimmed = categoryName.trim();
        if (!trimmed) return;

        setInputValue(trimmed);
        goToSearch(trimmed);

        setCategory(false);
        setIsFocused(false);
        setShowImageSearchBox(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        const imageParam = params.get("image");

        if (query && inputValue === "") {
            setInputValue(query);
        }

        const stateImage = location.state?.imagePreviewUrl;
        if (stateImage && imagePreviewUrl === "") {
            setImagePreviewUrl(stateImage); // blob URL 사용
            dispatch(setUploadedImage(stateImage));
        } else if (imageParam && imagePreviewUrl === "") {
            setImagePreviewUrl(imageParam); // URL 기반
        }
    }, [location.search, location.state]);

    useEffect(() => {
        function handleClickOutside(event) {
            // SearchComponent, SearchTerm 바깥 클릭 시
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
                setCategory(false);
                setShowImageSearchBox(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClearImage = () => {
        dispatch(setUploadedImage(null));
        setImagePreviewUrl("");
        setImageFile(null);
    };

    const handleImageSearchComplete = (data) => {
        if (typeof data === "string") {
            dispatch(setUploadedImage(data));
            setImagePreviewUrl(data);
            setImageFile(null);
        } else if (typeof data === "object" && data.previewUrl && data.imageFile) {
            dispatch(setUploadedImage(data.previewUrl));
            setImagePreviewUrl(data.previewUrl);
            setImageFile(data.imageFile);
        }
        setShowImageSearchBox(false);
    };

    const goToSearch = async (inputKeyword) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        const searchText = inputKeyword || inputValue || "";
        const isFile = imageFile instanceof File;
        const isUrl = typeof imagePreviewUrl === "string" &&
            (imagePreviewUrl.startsWith("http") || imagePreviewUrl.startsWith("blob:"));

        if (!searchText && !imagePreviewUrl) {
            isSubmittingRef.current = false;
            return;
        }

        if (autoSave) {
            dispatch(addRecentKeyword(searchText));

        if (isLoggedIn) {
            try {
                await saveSearchLog(userId, searchText, "text");
            } catch (e) { console.error(e); }
            }
        }

        try {
            if (mode === "inline") {
                if (typeof onSearchStart === "function") onSearchStart();
                
                let result;
                if (imagePreviewUrl) {
                    result = await searchImageUnified({
                        imageFile: isFile ? imageFile : null,
                        imageUrl: isUrl ? imagePreviewUrl : null,
                        query: searchText,
                        userId,
                        autoSave
                    });
                } else {
                    result = await searchByText(searchText, userId, autoSave);
                }
                if (typeof onSearchResults === "function") {
                    onSearchResults(result, searchText);
                }

            } else if (mode === "redirect") {
                dispatch(setLoading(true));
                
                if (isFile) {
                    const result = await searchImageUnified({
                        imageFile,
                        imageUrl: null,
                        query: searchText,
                        userId,
                        autoSave
                    });
                    dispatch(setSearchResults(result));
                    dispatch(setConfirmedKeyword(searchText));
                    setInputValue(searchText);

                    const params = new URLSearchParams();
                    if (searchText) params.append("query", searchText);
                    params.append("image", "uploaded-file");
                    navigate(`/search?${params.toString()}`, {
                        state: {
                            result,
                            imagePreviewUrl,
                            confirmedKeyword: searchText
                        }
                    });

                } else {
                    const params = new URLSearchParams();
                    if (searchText) params.append("query", searchText);
                    if (isUrl) params.append("image", imagePreviewUrl);
                    navigate(`/search?${params.toString()}`);
                }
            }

        } catch (error) {
            console.error("검색 실패:", error);
        } finally {
            isSubmittingRef.current = false;
            dispatch(setLoading(false));
        }
    };

    return (
        <div ref={containerRef} style={{position: 'relative', zIndex: 10}}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <SearchInputComponent
                    shadow={true}
                    onFocus={handleClickIsFocused}
                    handleClickCategory={handleClickCategory}
                    onClickImage={handleClickImageSearch}
                    imagePreviewUrl={imagePreviewUrl}
                    imageFile={imageFile}
                    onClearImage={handleClearImage}
                    setSearchResults={setSearchResults}
                    onCloseSearchTerm={() => setIsFocused(false)} // 최근 검색어 닫기
                    onSearch={goToSearch}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            </div>

            {/* 검색창 마우스 hover시 */}
            <SearchExplanation
                visible={tutorialStep === "3.2" && overrideHover ? true : isHover}
            />
            {/* 검색창 클릭시 */}
            {isFocused && (
                <SearchTerm
                    onClose={() => setIsFocused(false)}
                    onSearch={goToSearch}
                    setInputValue={setInputValue}
                />
            )}
            {/* 카테고리 */}
            {category && <Category onSearch={handleSearchByCategory} setCategory={setCategory} />}

            {/* 이미지 검색 */}
            {showImageSearchBox && (
                <ImageSearchBox
                    onSearchComplete={handleImageSearchComplete}
                />
            )}
        </div>
    );
}

export default AISearchComponent;