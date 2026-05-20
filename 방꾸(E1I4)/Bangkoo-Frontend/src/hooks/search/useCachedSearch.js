import { useDispatch, useSelector } from "react-redux";
import {
    setCachedResults,
    setCachedCheckedIds,
    clearCachedKeyword,
    clearAllCachedSearch,
} from "@/features/search/cachedSearchSlice";

export default function useCachedSearch() {
    const dispatch = useDispatch();
    const cached = useSelector((state) => state.cachedSearch.cache);

    const getCachedResult = (keyword) => {
        return cached[keyword]?.results || null;
    };

    const getCachedCheckedIds = (keyword) => {
        return cached[keyword]?.checkedIds || [];
    };

    const saveToCache = (keyword, results) => {
        dispatch(setCachedResults({ keyword, results }));
    };

    const saveCheckedIds = (keyword, checkedIds) => {
        dispatch(setCachedCheckedIds({ keyword, checkedIds }));
    };

    return {
        getCachedResult,
        getCachedCheckedIds,
        saveToCache,
        saveCheckedIds,
        clearCachedKeyword: (keyword) => dispatch(clearCachedKeyword(keyword)),
        clearAllCachedSearch: () => dispatch(clearAllCachedSearch()),
    };
}
