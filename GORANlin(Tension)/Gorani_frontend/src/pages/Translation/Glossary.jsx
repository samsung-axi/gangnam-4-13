import React, { useState } from "react";
import "../../assets/css/Translation/glossary.css";
import GlossaryModal from "./GlossaryModal";
import GlossaryList from "./GlossaryList";
import WordPairEditor from "./WordPairEditor";
import useGlossaryManager from "../../hooks/useGlossaryManager";

function Glossary({ userInfo = {}, onClose }) {
  const [showGlossary, setShowGlossary] = useState(true);
  const {
    showGlossaryList,
    isGlossaryModalOpen,
    glossaryList,
    defaultGlossary,
    selectedGlossary,
    editingGlossary,
    isGlossaryEnabled,
    isSaving,
    isLoading,
    setIsGlossaryEnabled,
    toggleGlossaryList,
    handleOpenModal,
    handleCloseModal,
    handleCreateGlossary,
    handleDeleteGlossary,
    handleSelectGlossary,
    handleSetDefaultGlossary,
    handleSetDefaultGlossaryAPI,
    handleEditGlossaryName,
    handleChangeGlossaryName,
    handleBlurGlossaryName,
    handleFinishEditGlossaryName,
    handleAddWordPair,
    handleSaveWordPair,
    handleUpdateWordPair,
    handleDeleteWord,
    handleChangeWordPair,
    handleCancelEditGlossaryName,
  } = useGlossaryManager(userInfo);

  const closeGlossary = () => {
    setShowGlossary(false);
    if (onClose) onClose();
  };

  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    showGlossary && ( // showGlossary가 true일 때만 렌더링
      <div className="glossary-box">
        <button className="close-button" onClick={closeGlossary}>
          X
        </button>
        {/* 용어집 활성화/비활성화 토글 */}
        <label className="glossary-toggle">
          <input
            type="checkbox"
            checked={isGlossaryEnabled}
            onChange={() => setIsGlossaryEnabled((prev) => !prev)}
          />
          <span></span>
          {isGlossaryEnabled ? " 용어집 활성화" : " 용어집 비활성화"}
        </label>
        {/* 용어집 리스트 토글 */}
        <div
          className={`glossary-category ${showGlossaryList ? "expanded" : ""}`}
          onClick={toggleGlossaryList}
        >
          용어집 리스트
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`dropdown-icon ${showGlossaryList ? "rotated" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* 용어집 리스트 컴포넌트 */}
        {showGlossaryList && (
          <GlossaryList
            glossaryList={glossaryList}
            defaultGlossary={defaultGlossary}
            editingGlossary={editingGlossary}
            onChangeGlossaryName={handleChangeGlossaryName}
            onBlurGlossaryName={handleBlurGlossaryName}
            onEditGlossaryName={handleEditGlossaryName}
            onSelectGlossary={handleSelectGlossary}
            onSetDefaultGlossary={handleSetDefaultGlossary}
            onSetDefaultGlossaryAPI={handleSetDefaultGlossaryAPI}
            onDeleteGlossary={handleDeleteGlossary}
            onFinishEditGlossaryName={handleFinishEditGlossaryName}
            onCancelEditGlossaryName={handleCancelEditGlossaryName}
          />
        )}

        {/* 용어집 생성 버튼 */}
        <button
          className="button button--primary create-glossary"
          onClick={handleOpenModal}
          aria-label="용어집 생성"
        >
          용어집 생성
        </button>
        {/* 구분선 */}
        <div className="divider"></div>

        {/* 용어집 생성 모달 */}
        {isGlossaryModalOpen && (
          <GlossaryModal
            isOpen={isGlossaryModalOpen}
            onClose={handleCloseModal}
            onCreate={handleCreateGlossary}
          />
        )}

        {/* 단어쌍 에디터 */}
        {selectedGlossary && Array.isArray(selectedGlossary.words) && (
          <WordPairEditor
            selectedGlossary={selectedGlossary}
            isSaving={isSaving}
            onAddWordPair={handleAddWordPair}
            onSaveWordPair={handleSaveWordPair}
            onUpdateWordPair={handleUpdateWordPair}
            onDeleteWord={handleDeleteWord}
            onChangeWordPair={handleChangeWordPair}
          />
        )}
        <span className="mobile-information">
          용어집의 단어쌍 편집은 PC버전에서 가능합니다.
        </span>
      </div>
    )
  );
}

export default Glossary;
