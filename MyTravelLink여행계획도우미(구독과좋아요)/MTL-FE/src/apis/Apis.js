import axios from 'axios';

const DOMAIN = process.env.REACT_APP_BACKEND_URL; // backend (spring) 연결
const DOMAIN2 = process.env.REACT_APP_AI_API; // fastapi (ai) 연결

// backend 요청
export const request = async (method, url, data) => {

    return await axios({
        method,
        url: `${DOMAIN}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json', // JSON으로 요청한다는 것을 명시
            'Authorization': localStorage.getItem('token'), // 토큰 request header에 담아주기
        },

    })
        .then(res => res.data)
        .catch(error => {
            console.log(error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
        });
};

// 로그인 요청
export const loginRequest = async (method, url, data) => {
    return await axios({
        method,
        url: `${DOMAIN}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res)
        .catch(error => {
            console.log(error);
            throw error;
        });
};

// 회원가입 요청
export const signUpRequest = async (signupData) => {
    const url = '/auth/signUp'; // 회원가입 API 엔드포인트
    return await axios({
        method: 'POST', // POST 요청
        url: `${DOMAIN}${url}`, // 전체 URL
        data: signupData, // 회원가입 데이터
        headers: {
            'Content-Type': 'application/json', // JSON으로 요청
        },
    })
        .then(res => res.data) // 응답 데이터 반환
        .catch(error => {
            console.log(error); // 에러 로깅
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
        });
};

// User 정보 조회
export const checkUser = async (email) => {

    const url = `/user/check?email=${email}`
    return await axios({
        method: 'GET', // GET요청
        url: `${DOMAIN}${url}`,
        data: email,
        headers: {
            'Content-Type': 'application/json', // JSON으로 요청
        },
    })

        .then(res => res.data)
        .catch(error => {
            console.log(error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
        });
}


// fastapi 요청
export const fastAPIrequest = async (method, url, data) => {

    return await axios({
        method,
        url: `${DOMAIN2}${url}`,
        data,
        headers: {
            'Content-Type': 'application/json',
        },

    })
        .then(res => res.data)
        .catch(error => {
            console.log(error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록
        });
};

// src/api.js
export const searchContent = async (query) => {
    try {
        // 환경 변수 이름은 React에서 반드시 REACT_APP_ 접두사로 시작해야 빌드 시 인식됩니다.
        // 만약 꼭 REACT_to_Fast_API를 사용하고 싶다면, process.env.REACT_to_Fast_API 로 읽을 수 있지만,
        // 일반적으로 REACT_APP_BACKEND_URL을 권장합니다.
        const backendUrl = process.env.REACT_APP_BACKEND_FAST_API; // 또는 process.env.REACT_to_Fast_API
        const response = await fetch(`${backendUrl}/youtube/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error("검색 요청 실패");
        }

        const data = await response.json();
        console.log("검색 결과:", data);
        return data; // 반환값은 [{ content, metadata }, ...] 배열
    } catch (error) {
        console.error("API 호출 중 오류:", error);
        return [];
    }
};
