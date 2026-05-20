import { createActions, handleActions } from "redux-actions";
import { getAllMembers } from "../api/MemberAPICalls";

// 초기 상태
const initialState = {
    members: [], // 회원 목록
    loading: false, // 로딩 상태
    error: null, // 에러 메시지
};

// 액션 생성
export const {
    members: { fetchMembersStart, fetchMembersSuccess, fetchMembersFail },
} = createActions({
    MEMBERS: {
        FETCH_MEMBERS_START: () => {}, // 데이터 요청 시작
        FETCH_MEMBERS_SUCCESS: (members) => members, // 요청 성공
        FETCH_MEMBERS_FAIL: (error) => error, // 요청 실패
    },
});

// Thunk 함수: 회원 목록 가져오기
export const fetchMembers = () => async (dispatch) => {
    try {
        dispatch(fetchMembersStart());
        const members = await getAllMembers();
        dispatch(fetchMembersSuccess(members));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "회원 목록 불러오기 실패";
        dispatch(fetchMembersFail(errorMessage));
    }
};

// 리듀서
const memberReducer = handleActions(
    {
        [fetchMembersStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchMembersSuccess]: (state, { payload }) => ({
            ...state,
            members: payload, // API에서 받은 회원 목록
            loading: false,
            error: null,
        }),
        [fetchMembersFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload, // 에러 메시지 저장
        }),
    },
    initialState
);

// Selector 함수 사용
// -> 동일한 상태를 여러 컴포넌트에서 사용할 때, Selector 함수로 관리하면 중복 코드 없이 사용 가능
export const selectMembers = (state) => state.members.members;
export const selectLoading = (state) => state.members.loading; 
export const selectError = (state) => state.members.error;  

export default memberReducer;
