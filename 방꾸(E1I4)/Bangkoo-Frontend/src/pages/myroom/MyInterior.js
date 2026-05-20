// pages/myroom/MyInterior.js
import React, { useState, useEffect } from "react";
import {InteriorBox, InteriorControllerBox} from "./css/MyRoom.styled";
import MyInteriorList from "./MyInteriorList";
import CommonButton from "@/common/CommonButton";

function MyInterior({ interiorList = [], onDelete , onDeleteAll}) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [displayList, setDisplayList] = useState(interiorList);

    // 편집 모드에 따라 type 변경
    useEffect(() => {
        const updated = interiorList.map((item) => ({
            ...item,
            type: isEditMode ? "removeButton" : "basic",
        }));
        setDisplayList(updated);
    }, [isEditMode, interiorList]);

    // 삭제 버튼 클릭 시 상위로 이벤트 전달
    const handleDelete = (item) => {
        if (onDelete) onDelete(item);
    };

    // 전체 삭제 버튼 클릭 시 상위로 전달
    const handleDeleteAll = () => {
        if (onDeleteAll) onDeleteAll();
    };

    const buttonProps = {
        width: "90px",
        height: "34px",
        fontSize: "xxs",
        fontWeight: 800,
        radius: "sm",
        type: "full"
    };

    return (
        <InteriorBox>
            <InteriorControllerBox>
                {isEditMode && (
                    <CommonButton
                        {...buttonProps}
                        bgColor="red"
                        onClick={handleDeleteAll}
                    >
                        전체 삭제
                    </CommonButton>
                )}

                <CommonButton
                    {...buttonProps}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    {isEditMode ? "편집 취소" : "편집"}
                </CommonButton>
            </InteriorControllerBox>
            <MyInteriorList interiorList={displayList} onDelete={handleDelete}/>
        </InteriorBox>
    );
}

export default MyInterior;
