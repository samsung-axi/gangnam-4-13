import React, { useEffect } from "react";
import { HeaderRoot, LoginBox } from "./Header.styled";
import { Text } from "../../../common/Typography";
import { ReactComponent as Logo } from "../../../assets/images/Logo.svg";
import { ReactComponent as KaKao } from "../../../assets/images/KaKao.svg";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/login/useAuth";
import CommonDialog from "../../../common/CommonDialog";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, toggleLogin, alertMessage, setAlertMessage } = useAuth();

  const goToMain = () => {
    navigate("/"); // 홈 화면으로 리다이렉트
  };

  const handleDialogClose = () => {
    setAlertMessage(null); // 메시지 초기화
  };

  const goToAdmin = () => {
    navigate("/admin"); // 관리자 페이지로 이동
  };

  useEffect(() => {
    // isAdmin이 제대로 반영되는지 콘솔로 확인
    
  }, [isLoggedIn, isAdmin]);

  return (
    <HeaderRoot>
      <Logo onClick={goToMain} />
      
      {/* 관리자일 때만 보이게 */}
      {isLoggedIn && isAdmin && (
        <Text
          size="sm"
          $weight={600}
          style={{ cursor: "pointer", marginRight: "20px" }}
          onClick={goToAdmin}
        >
          관리자 페이지
        </Text>
      )}

      <LoginBox onClick={toggleLogin}>
        <KaKao />
        <Text
          size="sm"
          $weight={600}
          style={{ cursor: "pointer" }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </Text>
      </LoginBox>

      {alertMessage && (
        <CommonDialog
          open={!!alertMessage}
          onClose={handleDialogClose}
          onClick={handleDialogClose}
          title="알림"
          cancel={false}
          submitText="확인"
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Text size="sm">{alertMessage}</Text>
          </div>
        </CommonDialog>
      )}
    </HeaderRoot>
  );
};

export default Header;
