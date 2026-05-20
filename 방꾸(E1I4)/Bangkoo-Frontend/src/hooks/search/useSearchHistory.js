import { useSelector, useDispatch } from "react-redux";
import {
    setKeyword,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
    toggleAutoSave,
} from "@/features/search/searchSlice";
import useAuth from "../login/useAuth"; // 로그인 상태 확인용

export default function useSearchHistory() {
    const dispatch = useDispatch();
    const keyword = useSelector((state) => state.search.keyword);
    const recent = useSelector((state) => state.search.recentKeywords);
    const autoSave = useSelector((state) => state.search.autoSave);
    const { user } = useAuth();
    const userId = user?.userId;

    // 키워드 업데이트
    const updateKeyword = (value) => {
        dispatch(setKeyword(value));
    };

    // 키워드 저장(로그인 여부 따라 다르게 처리)
    const addKeyword = async (value) => {
        if (!value.trim()) return;

        if (userId) {
            // 로그인 상태일 경우 서버 저장만 따로 처리
            // (이 부분은 기존 서버 저장 로직이 없어서 유지)
        } else {
            if (autoSave) {
                // 자동저장 켜져있을 때만 Redux+로컬스토리지에 저장
                dispatch(addRecentKeyword(value));
            }
        }
    };

    const removeKeyword = (id) => {
        dispatch(removeRecentKeyword(id));
    };

    const clearAll = () => {
        dispatch(clearRecentKeywords());
    };

    const toggleAuto = () => {
        dispatch(toggleAutoSave());
    };

    return {
        keyword,
        recent,
        autoSave,
        updateKeyword,
        addKeyword,
        removeKeyword,
        clearAll,
        toggleAuto,
    };
}