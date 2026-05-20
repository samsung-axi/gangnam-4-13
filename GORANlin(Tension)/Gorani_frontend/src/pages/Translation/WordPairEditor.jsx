// src/components/WordPairEditor.js
import React from "react";
import "../../assets/css/Translation/glossary.css";

function WordPairEditor({
  selectedGlossary,
  isSaving,
  onAddWordPair,
  onSaveWordPair,
  onUpdateWordPair,
  onDeleteWord,
  onChangeWordPair,
}) {
  const words = selectedGlossary?.words ?? [];

  return (
    <div className="glossary-editor">
      {/* selectedGlossary.name이 undefined일 경우 기본 문자열 사용 */}
      <h3>{"선택한 용어집 : " + selectedGlossary?.name || "용어집"}</h3>
      <div className="word-list">
        {words.map((wordPair, index) => (
          <div key={index} className="word-pair">
            <input
              type="text"
              placeholder="출발 단어"
              value={wordPair.start}
              onChange={(e) => onChangeWordPair(index, "start", e.target.value)}
              className="word-input"
            />
            <span className="arrow">→</span>
            <input
              type="text"
              placeholder="도착 단어"
              value={wordPair.arrival}
              onChange={(e) =>
                onChangeWordPair(index, "arrival", e.target.value)
              }
              className="word-input"
            />
            <div className="word-actions">
              {!wordPair._id ? (
                <button
                  className="button button--primary"
                  onClick={() => onSaveWordPair(index)}
                  disabled={isSaving === index}
                  aria-label="저장"
                >
                  {isSaving === index ? "저장 중..." : "저장"}
                </button>
              ) : (
                <button
                  className="button button--primary"
                  onClick={() => onUpdateWordPair(index)}
                  disabled={isSaving === index}
                  aria-label="수정"
                >
                  {isSaving === index ? "수정 중..." : "수정"}
                </button>
              )}
              <button
                className="button button--secondary"
                onClick={() => onDeleteWord(index)}
                aria-label="삭제"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {words.length === 0 && (
        <div className="no-words-message">
          아직 단어쌍이 없습니다. 추가 버튼을 눌러 새 단어쌍을 만들어보세요!
        </div>
      )}

      <button
        className="button button--icon button--add-term"
        onClick={onAddWordPair}
        aria-label="단어쌍 추가"
      >
        {/* 추가 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="add-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}

export default WordPairEditor;
