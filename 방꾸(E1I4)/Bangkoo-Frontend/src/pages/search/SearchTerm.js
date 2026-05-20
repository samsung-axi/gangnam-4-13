import React, { useEffect, useState ,useRef  } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setConfirmedKeyword,
    setUploadedImage,
    removeRecentKeyword,
    clearRecentKeywords,
} from "@/features/search/searchSlice";
import {
    SearchTermBox,
    RecentBox,
    PopularityBox,
    RecentTitleBox,
    RecentTextBox,
    RecentBottomBox,
    SearchScrollBox,
    KeywordBox, AutoSaveBox,
} from "./css/SearchInput.styled";
import { Text } from "@/common/Typography";
import CommonIconButton from "@/common/CommonIconButton"
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";
import CommonButton from "@/common/CommonButton";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import useAuth from "@/hooks/login/useAuth";
import { getAnonymousId } from "@/features/search/generateAnonymousId";
import { saveSearchLog } from "./SearchLog";

import {
    fetchRecentSearches,
    deleteSearchItem,
    deleteAllSearchLogs,
    fetchPopularSearches
} from "@/api/search/search";

function SearchTerm({onClose, onSearch, setInputValue}) {
    const dispatch = useDispatch();
    const { autoSave, toggleAuto } = useSearchHistory();
    const { user, isLoggedIn } = useAuth();
    const userId = isLoggedIn ? user?.userId : getAnonymousId();

    const [recentKeywords, setRecentKeywords] = useState([]);
    const [popularKeywords, setPopularKeywords] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const offSessionQueriesRef = useRef(new Set());

    useEffect(() => {
        if (!autoSave) {
          setRecentKeywords([]); 
          return;
        }
        (async () => {
          const recents = isLoggedIn
            ? await fetchRecentSearches(userId)
            : JSON.parse(localStorage.getItem("recentKeywords") || "[]");
          setRecentKeywords(recents);
    
          const popular = await fetchPopularSearches();
          setPopularKeywords(popular.map(item => item.query));
        })();
      }, [userId, autoSave]);
    
    // 검색 실행
    const handleSearch = async (keyword) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;
    
        dispatch(setConfirmedKeyword(trimmed));
        dispatch(setUploadedImage(null));
        if (setInputValue) setInputValue(trimmed);
        if (onSearch) onSearch(trimmed, autoSave);
        if (onClose) onClose();
    
        if (!autoSave) return;
    
        if (isLoggedIn) {
          // 로그인 유저는 서버에 저장 후 로컬 상태만 바로 갱신
          try {
            await saveSearchLog(userId, trimmed, "text");
          } catch (e) {
            console.error("검색 로그 저장 실패", e);
          }
         // 로컬 상태에만 반영 (서버 반영은 백그라운드에서)
          setRecentKeywords(prev => {
            const updated = [trimmed, ...prev.filter(q => q !== trimmed)];
            return updated.slice(0, 10);
          });
        } else {
          // 익명유저는 localStorage + 로컬 상태
          const stored = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
          const updated = [trimmed, ...stored.filter(k => k !== trimmed)].slice(0, 10);
          localStorage.setItem("recentKeywords", JSON.stringify(updated));
          setRecentKeywords(updated);
        }
      };
    
      // 개별 삭제
      const handleDeleteKeyword = async (keyword) => {
        if (isLoggedIn) {
          await deleteSearchItem(userId, keyword);
          setRecentKeywords(prev => prev.filter(q => q !== keyword));
        } else {
          dispatch(removeRecentKeyword(keyword));
          setRecentKeywords(prev => prev.filter(q => q !== keyword));
        }
      };
    
      // 전체 삭제
      const handleClearAll = async () => {
        if (isLoggedIn) {
          await deleteAllSearchLogs(userId);
          setRecentKeywords([]);
        } else {
          dispatch(clearRecentKeywords());
          setRecentKeywords([]);
        }
      };

    return (
        <SearchTermBox>
            <RecentBox>
                <RecentTitleBox>
                    <Text size="sm" $weight={800}>최근 검색어</Text>
                    <Text
                        size="xxs"
                        onClick={handleClearAll}
                        $weight={600}
                        color="grey"
                        style={{ cursor: 'pointer' }}
                    >
                        전체 삭제
                    </Text>
                </RecentTitleBox>

                <SearchScrollBox>
                    {!autoSave ? (
                        <AutoSaveBox>
                            <Text size="xs">검색어 저장 기능이 꺼져있습니다.</Text>
                            <Text size="xxs" color="grey" style={{marginTop: 4}}>"자동저장 켜기"를 활성화하면  최근검색어를 확인하실수 있습니다.</Text>
                        </AutoSaveBox>

                    ) : recentKeywords.length === 0 ? (
                        <AutoSaveBox>
                            <Text size="xs" color="grey">최근 검색어가 없습니다.</Text>
                        </AutoSaveBox>

                    ) : (
                        recentKeywords.map((item) => (
                            <RecentTextBox key={item}>
                                <Text
                                    size="xs"
                                    $weight={500}
                                    onClick={() => handleSearch(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item}
                                </Text>
                                <CommonIconButton
                                    width="20px"
                                    height="20px"
                                    type="full"
                                    color="orange"
                                    icon={<CloseIcon/>}
                                    onClick={() => handleDeleteKeyword(item)}
                                />
                            </RecentTextBox>
                        ))
                    )}
                </SearchScrollBox>

                <RecentBottomBox >
                    <Text
                        onClick={toggleAuto}
                        size="xxs"
                        $weight={600}
                    >
                        자동저장 {autoSave ? '끄기' : '켜기'}
                    </Text>
                </RecentBottomBox>

            </RecentBox>

            <PopularityBox>
                <Text size="sm" $weight={800}>인기 검색어</Text>
                <KeywordBox>
                    {popularKeywords.map((keyword, index) => (
                        <CommonButton
                            key={index}
                            width="90px"
                            height="30px"
                            fontSize="xxs"
                            fontWeight={700}
                            radius="full"
                            type="outline"
                            onClick={() => handleSearch(keyword)}
                        >
                            {keyword}
                        </CommonButton>
                    ))}
                </KeywordBox>
            </PopularityBox>
        </SearchTermBox>
    );
}

export default SearchTerm;
