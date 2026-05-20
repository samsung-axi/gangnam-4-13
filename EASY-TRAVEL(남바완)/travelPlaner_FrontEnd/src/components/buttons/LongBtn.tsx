import React from "react";
import "./LongBtn.css";

interface LongBtnProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  content?: string;
}

const LongBtn: React.FC<LongBtnProps> = ({
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
    <div id="long-btn-container">
      <button
        className="long-btn"
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    </div>
  );
};

export default LongBtn;
