import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/mypage/MyPage.css";
import BasicProfile from "../../images/basic profile.png"; // 나중에 사용할 기본 이미지
import AccountSettings from "./AccountSettings";
import Logo from "../../layouts/LogoHeader"
import { checkUser } from "../../apis/Apis";

function MyPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();


  // 사용자 정보를 위한 state 추가
  // const [userInfo, setUserInfo] = useState({
  //   name: "Guest", // 기본값
  //   profileImage: ProfileExample, // 기본값
  //   isLoggedIn: false, // 로그인 상태
  // });

  // 구글 로그인 상태 및 사용자 정보 확인
  // useEffect(() => {
  //   // 나중에 구글 로그인 연동 시 구현
  //   const checkGoogleLogin = async () => {
  //     try {
  //       // 구글 로그인 상태 확인 로직 추가 예정
  //       // const googleUser = await checkGoogleAuthStatus();
  //       // if (googleUser) {
  //       //   setUserInfo({
  //       //     name: googleUser.displayName,
  //       //     profileImage: googleUser.photoURL,
  //       //     isLoggedIn: true
  //       //   });
  //       // }
  //     } catch (error) {
  //       console.error("로그인 상태 확인 실패:", error);
  //     }
  //   };

  //   checkGoogleLogin();
  // }, []);

  useEffect(() => {
    // 사용자 정보 불러오는 함수
    const fetchUserInfo = async () => {
      const email = localStorage.getItem("userEmail"); // localStorage에서 이메일 가져오기
      console.log(email);
      try {
        if (!email) {
          console.warn("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
          navigate("/login");
          return;
        }

        // checkUser API 호출
        const userData = await checkUser(email);
        setUserInfo(userData); // API에서 받아온 데이터를 상태로 업데이트
        console.log("유저 정보:", userData); // 콘솔 출력
      } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        alert("유저 정보를 불러오지 못했습니다. 다시 로그인 해주세요.");
        navigate("/login"); // 에러 발생 시 로그인 페이지로 이동
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 링크 페이지로 이동하는 함수
  const handleCreateLink = () => {
    navigate("/Link"); // '/link'는 링크 페이지의 경로입니다
  };

  // 비로그인 시 리다이렉트 또는 로그인 요청
  const handleUnauthorizedAccess = () => {
    // 나중에 구현: 로그인 페이지로 리다이렉트 또는 로그인 모달 표시
    alert("로그인이 필요한 서비스입니다.");
    // navigate('/login');  // 로그인 페이지 경로
  };


  if (showSettings) {
    return <AccountSettings userInfo={userInfo} onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="SJ_my_page">
      <div className="SJ_logo">
        <Logo />
      </div>

      <div className="SJ_profile_section">
        <div className="SJ_profile_image">
          <img
            src={userInfo.profileImg || BasicProfile}
            alt="Profile"
            className="SJ_profile_img"
            onError={(e) => {
              e.target.src = BasicProfile; // 로그인 연동 후 이미지 로드 실패시 사용할 이미지
            }}
          />
        </div>
        <div className="SJ_profile_info">
          <div className="SJ_user_name">{userInfo.name || "guest"}</div>
          <div className="SJ_travel_message">즐거운 여행되세요!</div>
          <button
            className="SJ_settings_button"
            onClick={() => setShowSettings(true)}
          >
            내 정보 관리 &gt;
          </button>
        </div>
      </div>

      <div className="SJ_main_button">
        <button className="SJ_create_link_btn" onClick={handleCreateLink}>
          나만의 여행 링크 만들기!
          <p className="SJ_button_subtitle">유튜브 링크 선택하러 이동</p>
        </button>
      </div>
    </div>
  );
}

export default MyPage;