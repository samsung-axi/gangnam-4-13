import axios from "axios";
import { useEffect } from "react";

// axios 기본 인스턴스에 인터셉터 적용
const AxiosIntercepter: React.FC = () => {
  //<Route>바깥에 위치하기 때문에 DOM API 직접 사용
  //현재 url 획득
  //TODO: 디버깅 용

  useEffect(() => {
    console.log("AxiosIntercepter: useEffect");
    const responseIntercepter = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("AxiosIntercepter: ", error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
              window.location.href = "/loginform";
              break;
            case 403:
              window.location.href = "/error/400";
              break;
            // case 500:
            //   window.location.href = "/error/500";
            //   break;
          }
        }
        //if (error.message === "Network Error") {
        // window.location.href = "/unauthorized";
        //}
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseIntercepter);
    };
  }, []);

  return null;
};

export default AxiosIntercepter;
