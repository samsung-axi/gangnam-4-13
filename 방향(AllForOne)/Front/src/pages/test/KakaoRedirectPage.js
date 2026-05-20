// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// function KakaoRedirectPage() {

//     const location = useLocation()
//     const navigate = useNavigate()

//     const handleOAuthKakao = async (code) => {
//         try {
//             // 카카오로부터 받아온 code를 서버에 전달하여 카카오로 회원가입, 로그인 처리
//             const response = await axios.get(`http://localhost:8080/oauth/login/kakao?code=${code}`)
//             const data = response.data // 응답 데이터
//             alert("로그인 성공" + data)
//             navigate("/")
//         } catch (error) {
//             navigate("/fail")
//         }
//     }

//     useEffect(() => {
//         const searchParam = new URLSearchParams(location.search)
//         const code = searchParam.get("code") // 카카오는 리다이렉트 시키면서 code를 쿼리스트링으로 전달
//         if (code) {
//             alert("CODE = " + code)
//             handleOAuthKakao(code)
//         }
//     }, [location])

//     return (
//         <>
//             <div>Processing...</div>
//         </>
//     )
// }

// export default KakaoRedirectPage