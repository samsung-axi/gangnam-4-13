// pages/myroom/MyInteriorList.js
import React, { useState } from "react";
import { FurnitureGrid, TextBox } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";
import { Text } from "@/common/Typography";
import CommonDialog from "@/common/CommonDialog";

function MyInteriorList({ interiorList = [], onDelete }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClick = (item) => {
        setSelected(item);
        setOpen(true);

        // ✅ 캔버스에 이미지 넣는 로직 (추후 연결 예정)
        // const canvas = document.querySelector("canvas");
        // const ctx = canvas.getContext("2d");
        // const img = new Image();
        // img.onload = () => {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // };
        // img.src = item.imageUrl;
    };

    return (
        <>
            <FurnitureGrid>
                {interiorList.map((item) => (
                    <TextBox key={item.imageUrl}>
                        <CommonImageBox
                            image={item.imageUrl}
                            type={item.type}
                            showDelete={true}
                            onClick={() => handleClick(item)}
                            onDelete={() => onDelete(item)}
                        />
                        <Text size="xxs" $weight={500}>{item.explanation}</Text>
                    </TextBox>
                ))}
            </FurnitureGrid>

            {/* ✅ 설명 모달 */}
            <CommonDialog
                open={open}
                onClose={() => setOpen(false)}
                title="인테리어 설명"
                cancel={false}
                submit={true}
                submitText="닫기"
                onClick={() => setOpen(false)}
            >
                <Text size="sm">{selected?.explanation || "설명이 없습니다."}</Text>
            </CommonDialog>
        </>
    );
}

export default MyInteriorList;
