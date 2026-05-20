import { useEffect, useRef } from "react";
import useAuth from "./hooks/login/useAuth";

const AppInitializer = () => {
    const { isLoggedIn, user } = useAuth();  // isLoggedIn과 user를 가져옵니다.
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current) {
            // 최초 한 번만 실행되므로, 여기서 별도로 initLogin을 호출하지 않아도 됩니다.
            initializedRef.current = true;
        }
    }, []); // 빈 배열을 의존성으로 주어 최초 한 번만 실행되도록 합니다.

    return null;
};

export default AppInitializer;
