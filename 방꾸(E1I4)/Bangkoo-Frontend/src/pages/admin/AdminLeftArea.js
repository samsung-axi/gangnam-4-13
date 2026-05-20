import React from "react";
import CommonButton from "../../common/CommonButton";
import { useNavigate } from "react-router-dom";
import { LeftArea } from "./css/Admin.styled";

function AdminLeftArea({ onMenuSelect }) {
  const navigate = useNavigate();

  return (
    <LeftArea>
      <CommonButton
        width="80%"
        height="5%"
        fontSize="17px"
        fontWeight={850}
        type="fill"
        color="orange"
        bgColor="lightOrange"
        onClick={()=> onMenuSelect("gagu")} 
      >
        가구 목록
      </CommonButton>

      <CommonButton
        width="80%"
        height="5%"
        fontSize="s"
        fontWeight={800}
        type="fill"
        margin="10px"
        radius="full"
        onClick={() => navigate("/")}
      >
        메인 화면으로 이동
      </CommonButton>
    </LeftArea>
  );
}

export default AdminLeftArea;
