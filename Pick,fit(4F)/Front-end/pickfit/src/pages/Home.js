import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactFullpage from "@fullpage/react-fullpage";
import mainLogo from "../images/main_logo.png"; // 첫 번째 영역 로고
import mainSecondLogo from "../images/main_second_logo.png"; // 두 번째 영역 로고
import "animate.css";
import axios from "axios";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [animateSection, setAnimateSection] = useState(false); // 애니메이션 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 상태 관리



  const secondSectionRef = useRef(null);



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const userEmail = searchParams.get("userEmail");
    const userName = searchParams.get("userName");

    if (accessToken && userEmail && userName) {
      const expiresIn = 3600;
      const expirationTime = Date.now() + expiresIn * 1000;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", userName);
      localStorage.setItem("expiration_time", expirationTime);

      setUserName(userName);
      setIsLoggedIn(true);
      setRemainingTime(expiresIn);

      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const expirationTime = localStorage.getItem("expiration_time");
      if (expirationTime) {
        const timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          localStorage.clear();
          setIsLoggedIn(false);
          setUserName("");
          setRemainingTime(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2번째 섹션에 대한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animationElement = document.querySelector(".animationStatus"); // 클래스 선택

          if (entry.isIntersecting) {
            setAnimateSection(true);

            // animationStatus 클래스의 opacity를 1로 설정
            if (animationElement) {
              animationElement.style.opacity = "1";
            }
          } else {
            setAnimateSection(false); // 애니메이션 초기화

            // animationStatus 클래스의 opacity를 0으로 설정
            if (animationElement) {
              animationElement.style.opacity = "0";
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (secondSectionRef.current) {
      observer.observe(secondSectionRef.current);
    }

    return () => {
      if (secondSectionRef.current) {
        observer.unobserve(secondSectionRef.current);
      }
    };
  }, []);

  

  
  const handleLockClick = () => {
    setIsModalOpen(true); // 모달창 열기
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Logout response:", response.data);
  
      // 상태 초기화
      setIsLoggedIn(false);
      setUserName("");
      setRemainingTime(0);
  
      // 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    } finally {
      setIsModalOpen(false); // 모달창 닫기
    }
  };
  
  const handleLogoutCancel = () => {
    setIsModalOpen(false); // 모달창 닫기
  };



  

  return (
    <div>
      {isModalOpen && (
  <div style={modalStyles.overlay}>
    <div style={modalStyles.modal}>
      <p>정말 로그아웃 하시겠습니까?</p>
      <button onClick={handleLogoutConfirm} style={modalStyles.button}>
        로그아웃
      </button>
      <button onClick={handleLogoutCancel} style={modalStyles.button}>
        취소
      </button>
    </div>
  </div>
)}
      <div style={{ marginTop: "60px" }}>
        <ReactFullpage
          scrollingSpeed={1000}
          render={() => (
            <div id="fullpage-wrapper">
              {/* 첫 번째 섹션: 메인 로고 */}
              <div
                className="section"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage: `url(${mainLogo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100vw",
                  height: "100vh",
                }}
              ></div>

              {/* 두 번째 섹션: 두 번째 로고와 배경색 */}
              <div
                className="section"
                ref={secondSectionRef}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  backgroundImage: `url(${mainSecondLogo})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "#191618",
                  width: "100vw",
                  height: "100vh",
                }}
              >
                {/* 텍스트 배치 */}
                <div class="animationStatus" style={{ position: "relactive", width: "100%", height: "100%" }}>
                  <div
                    className={`animate__animated ${animateSection ? "animate__fadeInLeft" : ""
                      }`}
                    style={{ ...styles.textContainer, top: "10%", left: "10%" }}
                  >
                    <span style={styles.yellowDot}>●</span>
                    <strong style={styles.title}>
                      <span style={styles.pickfitFont}>PickFit</span>과 함께라면 쇼핑이 즐거워집니다!
                    </strong>
                    <p style={styles.subtitle}>
                      당신의 스타일에 맞는 옷을 추가하고, 스타일리시한 코디를 제안받아 완벽한 룩을 찾아보세요.
                    </p>
                  </div>

                  <div
                    className={`animate__animated ${animateSection ? "animate__fadeInLeft" : ""
                      }`}
                    style={{ ...styles.textContainer, top: "30%", left: "40%" }}
                  >
                    <span style={styles.yellowDot}>●</span>
                    <strong style={styles.title}>
                      당신의 스타일을 완성하는 <span style={styles.pickfitFont}>PickFit</span>!
                    </strong>
                    <p style={styles.subtitle}>
                      이제 더 이상 고민하지 마세요. 버츄얼 트라이온 기능으로 원하는 옷을 직접 입어보지 않고도 쉽게 확인할 수 있습니다!
                    </p>
                  </div>

                  <div
                    className={`animate__animated ${animateSection ? "animate__fadeInUp" : ""
                      }`}
                    style={{ ...styles.textContainer, top: "70%", left: "20%" }}
                  >
                    <span style={styles.yellowDot}>●</span>
                    <strong style={styles.title}>
                      버츄얼 트라이온의 혁신, <span style={styles.pickfitFont}>PickFit</span>!
                    </strong>
                    <p style={styles.subtitle}>
                      당신의 스타일에 맞는 옷을 선택하고, 그에 어울리는 완벽한 코디를 손쉽게 찾아보세요.
                    </p>
                  </div>

                  <div
                    className={`animate__animated ${animateSection ? "animate__fadeInRight" : ""
                      }`}
                    style={{ ...styles.textContainer, top: "70%", left: "60%" }}
                  >
                    <span style={styles.yellowDot}>●</span>
                    <strong style={styles.title}>
                      <span style={styles.pickfitFont}>PickFit</span>으로 쇼핑의 새로운 경험을!
                    </strong>
                    <p style={styles.subtitle}>
                      이제는 원하는 옷을 사진으로 확인하고, 나만의 스타일을 완성하는 데 도움을 받으세요.
                    </p>
                  </div>

                  <div
                    className={`animate__animated ${animateSection ? "animate__fadeInRight" : ""
                      }`}
                    style={{ ...styles.textContainer, top: "20%", left: "80%" }}
                  >
                    <span style={styles.yellowDot}>●</span>
                    <strong style={styles.title}>
                      <span style={styles.pickfitFont}>PickFit</span>으로 나만의 패션을 창조하세요!
                    </strong>
                    <p style={styles.subtitle}>
                      최신 트렌드를 반영한 코디 추천으로 언제 어디서나 스타일을 한층 업그레이드할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};



const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "center",
    
  },

  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
  },
};

// 스타일 정의
const styles = {
  yellowDot: {
    color: "orange",
    marginRight: "5px",
    fontSize: "20px",
  },
  textContainer: {
    position: "absolute",
    maxWidth: "300px",
    color: "white",
    fontSize: "14px",
    textAlign: "left",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: "10px",
    fontSize: "11px",
    lineHeight: "1.5",
  },
  pickfitFont: {
    fontFamily: "'Racing Sans One', sans-serif",
    fontWeight: "bold",
  },
};

export default Home;