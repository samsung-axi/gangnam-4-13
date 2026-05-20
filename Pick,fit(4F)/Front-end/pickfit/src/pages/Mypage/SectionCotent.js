import React, { useState, useEffect } from "react";
import "../../styles/MyPage.css";
import MaintenanceSection from "./MaintenanceSection";

const SectionContent = ({
  activeSection,
  email,
  userName,
  phoneNum: initialPhoneNum,
  nickname: initialNickname,
  address: initialAddress,
}) => {
  const [phoneNum, setPhoneNum] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  // 초기값 설정
  useEffect(() => {
    if (initialPhoneNum) {
      setPhoneNum(initialPhoneNum);
      setContactNumber(formatPhoneNumber(initialPhoneNum));
    }
    if (initialNickname) {
      setNickname(initialNickname);
    }
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialPhoneNum, initialNickname, initialAddress]);

  // 저장 버튼 활성화 조건 확인
  useEffect(() => {
    const cleanNumber = contactNumber.replace(/-/g, "");
    if (cleanNumber.length === 11 && nickname && address) {
      if (
        cleanNumber === phoneNum.replace(/-/g, "") &&
        nickname === initialNickname &&
        address === initialAddress
      ) {
        setErrorMessage("변경 사항이 없습니다.");
        setIsButtonDisabled(true);
      } else {
        setErrorMessage("");
        setIsButtonDisabled(false);
      }
    } else {
      setIsButtonDisabled(true);
      if (!nickname || !address) {
        setErrorMessage("닉네임과 주소를 모두 입력하세요.");
      } else if (cleanNumber.length !== 11) {
        setErrorMessage("전화번호는 정확히 11자리를 입력하세요.");
      }
    }
  }, [contactNumber, phoneNum, nickname, address, initialNickname, initialAddress]);

  const handleContactChange = (e) => {
    const input = e.target.value.replace(/-/g, "");
    if (!/^\d*$/.test(input)) {
      setErrorMessage("숫자만 입력 가능합니다.");
      return;
    }
    if (input.length > 11) {
      setErrorMessage("전화번호는 최대 11자리까지 입력 가능합니다.");
      return;
    }
    setErrorMessage("");
    console.log("contactNumber == " , contactNumber);
    setContactNumber(formatPhoneNumber(input));
  };

  const formatPhoneNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    const match = cleanNumber.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (!match) return cleanNumber;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phoneNum: contactNumber.replace(/-/g, ""),
          nickname,
          address,
        }),
      });

      if (response.ok) {
        alert("정보가 성공적으로 저장되었습니다!");
      } else {
        console.error("저장 실패:", await response.text());
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 중 에러:", error);
      alert("저장 중 에러가 발생했습니다.");
    }
  };

  if (activeSection === "info") {
    return (
      <div>
        <h3>이메일</h3>
        <div className="input-box">
          <input
            type="email"
            value={email}
            readOnly
            placeholder="이메일을 입력하세요"
            className="input-field input-disabled"
          />
        </div>
        <h3>이름</h3>
        <div className="input-box">
          <input
            type="text"
            value={userName}
            placeholder="이름을 입력하세요"
            className="input-field input-disabled"
            readOnly
          />
        </div>
        <h3>닉네임</h3>
        <div className="input-box">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="input-field"
          />
        </div>
        <h3>연락처</h3>
        <div className="input-box">
          <input
            type="tel"
            value={contactNumber}
            onChange={handleContactChange}
            placeholder="연락처를 입력하세요"
            className="input-field"
          />
        </div>
        <h3>주소</h3>
        <div className="input-box">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
            className="input-field"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="Storage">
          <button onClick={handleSave} disabled={isButtonDisabled}>
            저장
          </button>
        </div>
      </div>
    );
  }

  const sectionMessages = {
    inquiries: "문의 사항에 대해 나중에 찾아와라",
    notices: "공지 사항을 확인하려면 나중에 찾아와라",
    support: "지원 관련 정보를 보려면 나중에 찾아와라",
  };

  if (["inquiries", "notices", "support"].includes(activeSection)) {
    return <MaintenanceSection message={sectionMessages[activeSection]} />;
  }

  return null;
};

export default SectionContent;
