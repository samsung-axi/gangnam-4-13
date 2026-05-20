import React, { useState } from "react";
import "../../assets/css/Translation/glossary.css";

function GlossaryList({
  glossaryList,
  defaultGlossary,
  editingGlossary,
  onChangeGlossaryName,
  onBlurGlossaryName,
  onEditGlossaryName,
  onSelectGlossary,
  onSetDefaultGlossary,
  onSetDefaultGlossaryAPI,
  onDeleteGlossary,
  onFinishEditGlossaryName,
  onCancelEditGlossaryName,
}) {
  const [loadingStates, setLoadingStates] = useState({});

  const handleSetDefaultGlossary = async (glossary) => {
    const glossaryId = glossary._id || glossary.id;
    setLoadingStates((prev) => ({ ...prev, [glossaryId]: true }));

    try {
      await onSetDefaultGlossary(glossaryId);
    } catch (error) {
      console.error("기본 용어집 설정 실패:", error);
      alert("기본 용어집 설정에 실패했습니다.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [glossaryId]: false }));
    }
  };

  return (
    <div className="glossary-list">
      {glossaryList.map((glossary, i) => (
        <div
          key={glossary._id || glossary.id || i}
          className="glossary-item"
          onClick={() => onSelectGlossary(glossary)}
        >
          <input
            type="text"
            value={glossary.name}
            onChange={(e) => onChangeGlossaryName(e, glossary)}
            autoFocus
            style={{
              display: editingGlossary === glossary._id ? "block" : "none",
            }}
          />
          <span
            style={{
              display: editingGlossary === glossary._id ? "none" : "block",
            }}
          >
            {glossary.name}{" "}
            {defaultGlossary === glossary.name && <strong>(기본)</strong>}
          </span>
          <div className="glossary-buttons">
            <button
              className="button glossary-default-button"
              onClick={() => handleSetDefaultGlossary(glossary)}
              disabled={loadingStates[glossary._id || glossary.id]}
              style={{
                display: editingGlossary === glossary._id ? "none" : "block",
              }}
            >
              기본
            </button>
            <button
              className="button glossary-edit-button"
              onClick={() => onEditGlossaryName(glossary)}
              style={{
                display: editingGlossary === glossary._id ? "none" : "block",
              }}
            >
              <svg
                fill="#ffffff"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22,7.24a1,1,0,0,0-.29-.71L17.47,2.29A1,1,0,0,0,16.76,2a1,1,0,0,0-.71.29L13.22,5.12h0L2.29,16.05a1,1,0,0,0-.29.71V21a1,1,0,0,0,1,1H7.24A1,1,0,0,0,8,21.71L18.87,10.78h0L21.71,8a1.19,1.19,0,0,0,.22-.33,1,1,0,0,0,0-.24.7.7,0,0,0,0-.14ZM6.83,20H4V17.17l9.93-9.93,2.83,2.83ZM18.17,8.66,15.34,5.83l1.42-1.41,2.82,2.82Z" />
              </svg>
            </button>
            <button
              className="button glossary-delete-button"
              onClick={() => onDeleteGlossary(glossary._id || glossary.id)}
              aria-label={`${glossary.name} 삭제`}
              style={{
                display: editingGlossary === glossary._id ? "none" : "block",
              }}
            >
              <svg
                fill="#ffffff"
                width="25px"
                height="25px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"
                />
              </svg>
            </button>
            <button
              className="button glossary-save-button"
              onClick={() => onFinishEditGlossaryName(glossary)}
              style={{
                display: editingGlossary === glossary._id ? "block" : "none",
              }}
            >
              완료
            </button>
            <button
              className="button glossary-cancel-button"
              onClick={() => onCancelEditGlossaryName()}
              style={{
                display: editingGlossary === glossary._id ? "block" : "none",
              }}
            >
              취소
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GlossaryList;
