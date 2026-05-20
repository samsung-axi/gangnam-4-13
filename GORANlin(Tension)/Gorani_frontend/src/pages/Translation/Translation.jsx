import React, { useState } from "react";
import "../../assets/css/Main/main.css"; 
import { getTranslationResult } from "../../Apis/TranslateAPI";

const Translation = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Sending request:", inputText);
      const result = await getTranslationResult(inputText, "ko", "en"); // 한국어 → 영어 번역
      console.log("Received result:", result);
      setTranslatedText(result);
    } catch (e) {
      console.error("Error during translation:", e);
      setError("Failed to translate text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translation-container">
      <h1>Translation</h1>
      <textarea
        placeholder="Enter text to translate"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows="5"
        cols="50"
      />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>
      {error && <p className="error">{error}</p>}
      {translatedText && (
        <div className="translation-result">
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translation;
