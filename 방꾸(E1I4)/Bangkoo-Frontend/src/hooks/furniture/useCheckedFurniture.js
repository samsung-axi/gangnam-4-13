import { useDispatch, useSelector } from "react-redux";
import {
    toggleItem,
    setItemChecked,
    clearAllSelections,
} from "@/features/furniture/selectionSlice";

export default function useCheckedFurniture() {
    const dispatch = useDispatch();

    // 현재 체크된 상태들 (ex. { 0: true, 2: true })
    const checkedItems = useSelector((state) => state.selection.checkedItems);

    // 체크 토글
    const toggle = (id) => {
        dispatch(toggleItem(id));
    }

    // 특정 체크 해제
    const uncheck = (id) => dispatch(setItemChecked({ id, checked: false }));

    // 전체 체크 초기화
    const clearAll = () => dispatch(clearAllSelections());

    // 체크된 가구 id 리스트 가져오기
    const getCheckedIds = () =>
        Object.entries(checkedItems)
            .filter(([_, checked]) => checked)
            .map(([id]) => id);

    return {
        checkedItems, // 전체 체크 상태
        toggle, // 개별 토글
        uncheck, // 개별 해제
        clearAll, // 전체 해제
        getCheckedIds, // 체크된 ID 배열 반환
    };
}
