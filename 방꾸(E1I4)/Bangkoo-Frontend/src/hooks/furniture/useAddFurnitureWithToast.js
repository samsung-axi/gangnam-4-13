import { toast } from "react-toastify";
import CustomToast from "@/common/CustomToast";
import { useDispatch, useSelector } from "react-redux";
import { addFurniture as addFurnitureAction } from "@/features/furniture/furnitureSlice";

// 토스트 포함 추가 로직
export function useAddFurnitureWithToast() {
    const dispatch = useDispatch();
    const furnitureList = useSelector(state => state.furniture.list); // 상태 가져오기

    return function addFurniture(item) {
        const newItem = {
            ...item,
            id: Date.now(),
            type: "addFurniture",
            isCustom: true,
            name: item.이름,
            description: item.설명,
            link: item.링크,
            image: item.이미지,
            price: item.가격,
        };
        console.log("2.디스패치 전에 토스트 내부:", newItem);

        // 디스패치 후에 상태 변경을 기다리기 위해 await 사용
        dispatch(addFurnitureAction(newItem));

        // 상태가 업데이트된 후 확인
        console.log("3.디스패치 후의 상태:", furnitureList); // 상태 확인

        toast(({ closeToast }) => (
            <CustomToast
                message="선택하신 가구가 내 가구에 추가되었습니다."
                closeToast={closeToast}
            />
        ), {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeButton: false,
        });
    };
}
