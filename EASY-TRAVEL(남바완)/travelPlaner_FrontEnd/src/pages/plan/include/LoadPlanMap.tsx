import { useEffect } from "react";

const LoadKakaoMap = () => {
  useEffect(() => {
    // 이미 카카오맵이 로드되어 있다면 다시 로드하지 않음
    if (window.kakao?.maps) {
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;

    const handleLoad = () => {
      if (window.kakao) {
        // 카카오맵 로드
        window.kakao.maps.load(() => {
          console.log("Kakao Maps SDK loaded successfully");
        });
      }
    };

    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default LoadKakaoMap;
