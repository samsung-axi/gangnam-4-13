import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { naverLogin } from '../../Apis/UserAPI';

const NaverSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNaverLogin = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const state = params.get('state');

                if (!code || !state) {
                    throw new Error("❌ 네이버 인증 코드가 제공되지 않았습니다.");
                }

                // ✅ 네이버 로그인 API 호출
                const response = await naverLogin(code, state);

                if (!response || !response.results) {
                    throw new Error("❌ 잘못된 응답 구조입니다.");
                }

                const { token, user } = response.results;

                if (!token || !user) {
                    throw new Error("❌ 네이버 로그인 응답이 유효하지 않습니다.");
                }

                // ✅ 중첩된 `company.users` 제거
                const sanitizedUser = { ...user };
                if (sanitizedUser.company) {
                    delete sanitizedUser.company.users; // 🔥 무한 참조 방지
                }

                // ✅ `localStorage`에 저장
                localStorage.setItem("token", token);
                localStorage.setItem("userInfo", JSON.stringify(sanitizedUser));

                // ✅ 로그인 완료 후 메인 페이지로 이동
                navigate("/");
            } catch (error) {
                console.error("❌ 네이버 로그인 실패:", error);
                setError(error.message || "로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };

        fetchNaverLogin();
    }, [location, navigate]);

    return (
        <div>
            {loading ? (
                <p>⏳ 네이버 로그인 중...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>❌ {error}</p>
            ) : (
                <p>✅ 로그인 성공! 메인 페이지로 이동 중...</p>
            )}
        </div>
    );
};

export default NaverSuccess;
