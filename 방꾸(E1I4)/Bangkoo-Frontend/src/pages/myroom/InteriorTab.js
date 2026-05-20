// pages/myroom/InteriorTab.js
import { useSelector } from "react-redux";
import MyInterior from "./MyInterior";
import {Text} from "@/common/Typography";
import {EmptyBox} from "./css/MyRoom.styled";
import React from "react";
import { useLoadInteriorResults } from "../../hooks/useLoadInteriorResults";

export default function InteriorTab({ onDelete, onDeleteAll }) {

    useLoadInteriorResults();

    const interiorList = useSelector((state) => state.interior.list);

    return (
        <>
            {interiorList.length === 0 ?
                <EmptyBox>
                    <Text size="sm" $weight={500} color="dark">저장된 내방 인테리어가 없습니다.</Text>
                </EmptyBox>
                :
                <MyInterior
                    interiorList={interiorList}
                    onDelete={onDelete}
                    onDeleteAll={onDeleteAll}
                    className="interior-item"
                />
            }

        </>

    );
}