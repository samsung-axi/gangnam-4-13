import React from "react";
import "./SearchInput2.css";

interface NormalInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput2: React.FC<NormalInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  value,
  onChange = () => {},
}) => {
  return (
    <div id="searchInput2-container">
      <label htmlFor="input" className="searchInput2-wrapper">
        <input
          className="searchInput2-box"
          name="input"
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          value={value}
          onChange={onChange}
        />
        <span
          className="searchInput2-icon"
          onClick={() => alert("검색 테스트")}
        ></span>
      </label>
    </div>
  );
};

export default SearchInput2;
