import { withoutTokenRequest} from "./index";
import { jwtDecode } from "jwt-decode"; 

// ✨ 네이버 로그인
export const naverLogin = async (code, state) => {
    const url = '/api/v1/auth/naver';

    return await withoutTokenRequest('POST', url, { code, state })
        .then(res => res.data)
        .catch(error => {
            console.error("❌ 네이버 로그인 실패:", error);
            throw error;
        });
};

// ✨ 카카오 로그인
export async function kakaoLogin(code) {
    try {
        const response = await withoutTokenRequest('POST', `/api/v1/auth/kakao`, { code });
        console.log("📢 Kakao Login Response:", response);

        if (!response.data?.results) {
            throw new Error("Invalid API response: Missing results");
        }

        const { token, user } = response.data.results;

        if (!token || !user) {
            throw new Error("Invalid login response: Missing token or userInfo");
        }

        // ✅ JWT 토큰 디코딩하여 추가 정보 가져오기
        const decodedToken = jwtDecode(token);
        console.log("📢 Decoded Token:", decodedToken);

        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider,
            providerId: user.providerId,
            isActive: user.isActive,
            company: decodedToken.company_id ? {
                companyId: decodedToken.company_id,
                name: decodedToken.company_name || "입력되지 않음",
                registrationNumber: decodedToken.registrationNumber || "입력되지 않음",
                representativeName: decodedToken.representativeName || "입력되지 않음"
            } : null
        };

        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        console.log("✅ 로그인 성공! 저장된 userInfo:", userInfo);
        return true;
    } catch (error) {
        console.error('❌ Kakao Login API error:', error);
        throw error;
    }
};

// ✨ 구글 로그인
export async function googleLogin(code) {
    try {
        const response = await withoutTokenRequest('POST', `/api/v1/auth/google`, { code });
        console.log("📢 Google Login Response:", response);

        if (!response.data?.results) {
            throw new Error("Invalid API response: Missing results");
        }

        const { token, user } = response.data.results;

        if (!token || !user) {
            throw new Error("Invalid login response: Missing token or userInfo");
        }

        // ✅ JWT 토큰 디코딩하여 추가 정보 가져오기
        const decodedToken = jwtDecode(token);
        console.log("📢 Decoded Token:", decodedToken);

        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider,
            providerId: user.providerId,
            isActive: user.isActive,
            company: decodedToken.company_id ? {
                companyId: decodedToken.company_id,
                name: decodedToken.company_name || "입력되지 않음",
                registrationNumber: decodedToken.registrationNumber || "입력되지 않음",
                representativeName: decodedToken.representativeName || "입력되지 않음"
            } : null
        };

        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        console.log("✅ 로그인 성공! 저장된 userInfo:", userInfo);
        return true;
    } catch (error) {
        console.error('❌ Google Login API error:', error);
        throw error;
    }
};