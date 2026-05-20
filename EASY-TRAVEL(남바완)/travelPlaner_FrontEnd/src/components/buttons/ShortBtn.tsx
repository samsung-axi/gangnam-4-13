import React from "react";
import "./ShortBtn.css";

interface ShortBtnProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  content?: string;
  href?: string;
}

const ShortBtn: React.FC<ShortBtnProps> = ({
  onClick,
  type = "button",
  disabled = false,
  content = "버튼 예시",
}) => {
  /*---라우터 관련-------------------------------*/

  /*---상태관리 변수들(값이 변화하면 화면 랜더링 )---*/

  /*---일반 변수--------------------------------*/

  /*---일반 메소드 -----------------------------*/

  /*---훅(useEffect)+이벤트(handle)메소드-------*/

  return (
    <div id="short-btn-container">
      <button
        className="short-btn"
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    </div>
  );
};

export default ShortBtn;
