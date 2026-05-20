import React from "react";
import styles from "./NormalInput2.module.css";

interface NormalInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NormalInput: React.FC<NormalInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  value = "",
  className = "",
  onChange = () => {},
}) => {
  console.log(styles);
  return (
    <div id={styles.NormalInput_container}>
      <label htmlFor="input">
        <input
          className={`${styles.NormalInput_box} ${className}`}
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
