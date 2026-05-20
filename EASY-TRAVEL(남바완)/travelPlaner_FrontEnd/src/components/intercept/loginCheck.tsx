import { useEffect } from "react";
import MemberStore from "../../stores/MemberStore";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const LoginCheck: React.FC = () => {
  const initMemberInfo = MemberStore((state: any) => state.initMemberInfo);

  useEffect(() => {
    const loginCheck = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/members/loginCheck`, {
          withCredentials: true,
        });

        console.log(response.data.data);

        if (!response.data.data.isLogin) {
          initMemberInfo();
        }
      } catch (error) {
        console.error("로그인 체크 오류:", error);
      }
    };
    loginCheck();
  }, []);

  return null;
};

export default LoginCheck;
