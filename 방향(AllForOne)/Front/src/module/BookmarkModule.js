import { createActions, handleActions } from "redux-actions";
import { getBookmarkedPerfumes, toggleBookmark, deleteBookmark } from "../api/BookmarkAPICalls";

const initialState = {
    bookmarkedPerfumes: [],
    recommendedPerfumes: [],
    loading: false,
    error: null,
    lastFetched: null // 추가
};

export const {
    bookmark: {
        fetchBookmarkStart,
        fetchBookmarkSuccess,
        fetchBookmarkFail,
        toggleBookmarkStart,
        toggleBookmarkSuccess,
        toggleBookmarkFail,
        deleteBookmarkStart,
        deleteBookmarkSuccess,
        deleteBookmarkFail,
        initializeBookmarks,
        addBookmarkDirect,     // 추가
        deleteBookmarkDirect, 
    },
} = createActions({
    BOOKMARK: {
        FETCH_BOOKMARK_START: () => ({}),
        FETCH_BOOKMARK_SUCCESS: (data) => (data),
        FETCH_BOOKMARK_FAIL: (error) => (error),
        TOGGLE_BOOKMARK_START: () => ({}),
        TOGGLE_BOOKMARK_SUCCESS: (data) => (data),
        TOGGLE_BOOKMARK_FAIL: (error) => (error),
        DELETE_BOOKMARK_START: () => ({}),
        DELETE_BOOKMARK_SUCCESS: (productId) => (productId),
        DELETE_BOOKMARK_FAIL: (error) => (error),
        INITIALIZE_BOOKMARKS: () => ([]),
        ADD_BOOKMARK_DIRECT: (perfume) => (perfume), // 추가
        DELETE_BOOKMARK_DIRECT: (productId) => (productId), // 추가
    },
});

// Thunk 액션 생성자
export const fetchBookmarks = (memberId) => async (dispatch, getState) => {
    // 현재 상태 확인
    const { loading, lastFetched } = getState().bookmark;
    
    // 이미 로딩 중이면 중복 호출 방지
    if (loading) return;
    
    // 최근에 가져온 데이터가 있으면 불필요한 재요청 방지 (30초 동안)
    const now = Date.now();
    if (lastFetched && (now - lastFetched < 30000)) return;
    
    try {
      dispatch(fetchBookmarkStart({ lastFetched: now }));
      
      // 캐시 사용 설정 - 네트워크 성능 향상
      const data = await getBookmarkedPerfumes(memberId);
      
      // 불필요한 지연 없이 즉시 상태 업데이트
      dispatch(fetchBookmarkSuccess(data));
      
      return data; // 데이터 반환 (필요시 사용)
    } catch (error) {
      dispatch(fetchBookmarkFail(error.message));
      throw error; // 에러 전파
    }
};

export const handleToggleBookmark = (productId, memberId) => async (dispatch) => {
    try {
        dispatch(toggleBookmarkStart());
        const data = await toggleBookmark(productId, memberId);
        dispatch(toggleBookmarkSuccess(data));
    } catch (error) {
        dispatch(toggleBookmarkFail(error.message));
    }
};

export const handleDeleteBookmark = (productId, memberId) => async (dispatch) => {
    try {
        dispatch(deleteBookmarkStart());
        await deleteBookmark(productId, memberId);
        dispatch(deleteBookmarkSuccess(productId));
    } catch (error) {
        dispatch(deleteBookmarkFail(error.message));
    }
};

const bookmarkReducer = handleActions(
    {
        [fetchBookmarkStart]: (state, { payload }) => ({
            ...state,
            loading: true,
            error: null,
            lastFetched: payload?.lastFetched || state.lastFetched // payload에서 lastFetched 받기
        }),
        [fetchBookmarkSuccess]: (state, { payload }) => ({
            ...state,
            bookmarkedPerfumes: payload.bookmarkedPerfumes,
            recommendedPerfumes: payload.recommendedPerfumes,
            loading: false,
        }),
        [fetchBookmarkFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [deleteBookmarkStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [deleteBookmarkSuccess]: (state, { payload: deletedProductId }) => ({
            ...state,
            bookmarkedPerfumes: state.bookmarkedPerfumes.filter(
                perfume => perfume.productId !== deletedProductId
            ),
            loading: false,
        }),
        [deleteBookmarkFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [toggleBookmarkSuccess]: (state, { payload }) => ({
            ...state,
            bookmarkedPerfumes: payload.bookmarkedPerfumes,
            loading: false,
        }),
        [initializeBookmarks]: (state) => ({
            ...state,
            bookmarkedPerfumes: [],
            loading: false,
        }),
        [addBookmarkDirect]: (state, { payload }) => ({
            ...state,
            bookmarkedPerfumes: [
                ...state.bookmarkedPerfumes,
                payload
            ],
        }),
        [deleteBookmarkDirect]: (state, { payload: productId }) => ({
            ...state,
            bookmarkedPerfumes: state.bookmarkedPerfumes.filter(
                perfume => perfume.productId !== productId
            ),
        }),
    },
    initialState
);

export default bookmarkReducer;