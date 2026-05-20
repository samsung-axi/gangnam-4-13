import React, { useState } from "react";
import "./SearchInput.css";

interface NormalInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<NormalInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  onChange = () => {},
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  onChange = inputHandler;

  return (
    <div id="searchInput-container">
      <label htmlFor="input">
        <input
          className="searchInput-box"
          name="input"
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          value={inputValue}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default SearchInput;
