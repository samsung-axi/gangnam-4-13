import React from "react";
import {StartRoot} from "./css/Home.styled"
import CommonButton from '@/common/CommonButton';
import {useNavigate} from "react-router-dom";
import useAuth from "@/hooks/login/useAuth";

function StartComponent() {
    const navigate = useNavigate();
    const { isLoggedIn, login } = useAuth(); // 로그인 상태, 로그인 함수

    const goToRoom = () => {
        if (isLoggedIn) {
            navigate("/myroom");  // 홈 화면으로 리다이렉트
        } else {
            login(); // 카카오 로그인 페이지로 이동
        }
    };

    return (
        <StartRoot>
            <CommonButton
                width="220px"
                height="50px"
                fontSize="base"
                fontWeight={700}
                radius="full"
                type="fill"
                onClick={goToRoom}
            >
                지금 시작하기
            </CommonButton>
        </StartRoot>
    );
}
export default StartComponent;