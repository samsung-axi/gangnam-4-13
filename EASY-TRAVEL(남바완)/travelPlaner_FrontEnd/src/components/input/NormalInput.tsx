import React from "react";
import "./NormalInput.css";

interface NormalInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NormalInput: React.FC<NormalInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  value = "",
  onChange = () => {},
}) => {
  return (
    <div id="NormalInput-container">
      <label htmlFor="input">
        <input
          className="NormalInput-box"
          name="input"
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          value={value} // 부모 상태를 반영
          onChange={onChange} // 부모로부터 전달된 onChange 호출
        />
      </label>
    </div>
  );
};

export default NormalInput;
