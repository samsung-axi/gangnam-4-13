import React, { useState } from "react";
import "./SearchTextArea.css";

interface TextAreaInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setPromptText?: (promptText: string) => void;
}

const SearchTextArea: React.FC<TextAreaInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  readOnly = false,
  onChange,
  setPromptText,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const inputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  if (onChange === undefined) {
    onChange = inputHandler;
  }

  return (
    <div id="searchTextArea-container">
      <form className="textArea-box">
        <textarea
          className={`searchTextArea-box ${readOnly ? "read-only" : ""}`}
          name="prompt-input"
          placeholder={placeholder}
          value={inputValue}
          autoComplete="off"
          rows={5}
          onChange={onChange}
          readOnly={readOnly}
        ></textarea>
        <button
          onClick={(e) => {
            e.preventDefault();
            setPromptText?.(inputValue);
          }}
          className={`prompt-send-btn ${
            inputValue === "" || readOnly ? "none" : ""
          }`}
        ></button>
      </form>
    </div>
  );
};

export default SearchTextArea;
