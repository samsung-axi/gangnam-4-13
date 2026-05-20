import React, { useState } from "react";
import "./RadioBtn.css";

const RadioBtn = ({
  name = "option",
  contents = ["버튼 예시1", "버튼 예시2", "버튼 예시3"],
  type = "radio",
  disabled = false,
  onChange = () => {},
}) => {
  /*---라우터 관련-------------------------------*/

  /*---상태관리 변수들(값이 변화하면 화면 랜더링 )---*/
  const [selected, setSelected] = useState("");

  /*---일반 변수--------------------------------*/
  const buttonContents = [...contents];

  /*---일반 메소드 -----------------------------*/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  /*---훅(useEffect)+이벤트(handle)메소드-------*/

  return (
    <div id="radio-btn-container">
      <ul>
        {buttonContents.map((content, index) => (
          <li key={index}>
            <label
              className={`radio-btn ${selected === content ? "active" : ""}`}
              htmlFor={`${name}-${index}`}
            >
              <input
                type={type}
                name={name}
                id={`${name}-${index}`}
                disabled={disabled}
                value={content}
                onChange={handleChange}
              />
              {content}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioBtn;
