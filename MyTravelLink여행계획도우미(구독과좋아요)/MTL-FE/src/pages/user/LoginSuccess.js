import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { callLoginAPI } from "../../apis/UserAPICalls";
import '../../css/login/LoginSuccess.css';

function LoginSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // URL 파라미터(token 또는 code) 처리 및 localStorage 저장
    useEffect(() => {
        console.log("[LoginSuccess] location.search:", location.search);
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        const emailFromUrl = params.get('email');
        const nameFromUrl = params.get('name');

        if (tokenFromUrl) {
            console.log("[LoginSuccess] Received token from URL:", tokenFromUrl);
            localStorage.setItem("token", tokenFromUrl);
        }
        if (emailFromUrl) {
            console.log("[LoginSuccess] Received email from URL:", emailFromUrl);
            localStorage.setItem("userEmail", emailFromUrl);
        }
        if (nameFromUrl) {
            console.log("[LoginSuccess] Received name from URL:", nameFromUrl);
            localStorage.setItem("userName", nameFromUrl);
        }
        // 기존 코드 유지
        const code = params.get('code');
        if (!tokenFromUrl && code) {
            console.log('[LoginSuccess] Received code:', code);
            const loginResult = async () => {
                console.log("[LoginSuccess] Dispatching callLoginAPI with code:", code);
                const result = await dispatch(callLoginAPI(code));
                console.log("[LoginSuccess] callLoginAPI result:", result);

                if (result) {
                    alert("로그인 성공");
                    console.log("[LoginSuccess] Navigating to /link");
                    navigate('/link');
                } else {
                    alert("로그인 실패");
                    console.log('[LoginSuccess] 로그인 실패 응답:', result);
                    navigate('/link');
                }
            };
            loginResult();
        } else if (!tokenFromUrl && !code) {
            console.log("[LoginSuccess] URL에 token과 code 모두 없음");
        }
    }, [location, navigate, dispatch]);


    // localStorage에 저장된 토큰 검증 및 다음 단계로 진행
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        const name = localStorage.getItem("userName");
        console.log("[LoginSuccess] Retrieved token:", token);
        console.log("[LoginSuccess] Retrieved email:", email);
        console.log("[LoginSuccess] Retrieved name:", name);

        if (
            !token || token === "Bearer undefined" || token === "Bearerundefined" ||
            !email || !name
        ) {
            alert("로그인이 필요합니다.");
            console.log("[LoginSuccess] No valid token or user info found. Navigating to /login");
            navigate("/login");
            return;
        }
        try {
            // "Bearer " 접두사가 있다면 제거
            const tokenWithoutBearer = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;
            if (!tokenWithoutBearer) {
                throw new Error("Invalid token");
            }
            console.log("[LoginSuccess] Token is valid");
            console.log("[LoginSuccess] Navigating to /link");
            navigate('/link');
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            alert("로그인이 필요합니다.");
            console.log("[LoginSuccess] Token validation failed:", error);
            navigate("/login");
        }
    }, [navigate]);


    return (
        <></>
    );
}

export default LoginSuccess;