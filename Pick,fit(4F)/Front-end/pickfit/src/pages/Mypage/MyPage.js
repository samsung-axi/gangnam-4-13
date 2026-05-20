import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSection from "../Mypage/ProfileSection";
import Sidebar from "../Mypage/Sidebar";
import SectionContent from "../Mypage/SectionCotent";
import "../../styles/MyPage.css";
import axios from "axios";

const MyPage = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가
  const [address, setAddress] = useState(""); // 주소 상태 추가
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeSection, setActiveSection] = useState("info");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const API_Store_URL = process.env.REACT_Store_API_URL;

  useEffect(() => {
    // 사용자 정보를 가져오는 API 호출
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
        const { email, name, phoneNum, nickname, address } = response.data; // API에서 추가 필드 가져오기
        setEmail(email);
        setUserName(name);
        setPhoneNum(phoneNum);
        setNickname(nickname); // 닉네임 설정
        setAddress(address); // 주소 설정
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to fetch user data:", error.response || error.message);
        setIsLoggedIn(false); // 로그인되지 않은 상태 처리
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // 메인 페이지로 이동
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="my-page-container">
      <div className="mypage-container">
        <div className="mypage-border-content">
          <div className="my-page-content">
            <div className="pickfit-text">PickFit</div>
            <ProfileSection userName={userName} email={email} />
          </div>

          <div className="border-box-container">
            <div className="border-box1">
              <Sidebar
                activeSection={activeSection}
                handleSectionClick={handleSectionClick}
              />
            </div>
            <div className="border-box2">
              <SectionContent
                activeSection={activeSection}
                email={email}
                userName={userName}
                phoneNum={phoneNum}
                nickname={nickname} // 닉네임 전달
                address={address} // 주소 전달
                setEmail={setEmail}
                setUserName={setUserName}
                setPhoneNum={setPhoneNum}
                setNickname={setNickname} // 닉네임 설정 함수 전달
                setAddress={setAddress} // 주소 설정 함수 전달
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyPage;
