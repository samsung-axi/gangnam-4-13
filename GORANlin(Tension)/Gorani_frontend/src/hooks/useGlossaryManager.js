import { useEffect, useState } from "react";
import {
  addWordPair,
  createGlossary,
  deleteGlossary,
  deleteWordPair,
  fetchAllGlossaries,
  setDefaultGlossary as setDefaultGlossaryAPI,
  updateGlossaryName,
  updateWordPair,
} from "../Apis/TranslateAPI";

export default function useGlossaryManager(userInfo) {
  const [showGlossaryList, setShowGlossaryList] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [glossaryList, setGlossaryList] = useState([]);
  const [defaultGlossary, setDefaultGlossary] = useState(null);
  const [selectedGlossary, setSelectedGlossary] = useState({
    name: "",
    words: [],
    _id: "",
  });
  const [editingGlossary, setEditingGlossary] = useState(null);
  const [isGlossaryEnabled, setIsGlossaryEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // glossaryList가 변경될 때 기본 용어집과 선택된 용어집 초기화
  // glossaryList가 변경될 때 기본 용어집과 선택된 용어집 초기화
  useEffect(() => {
    if (glossaryList.length > 0) {
      // 선택된 용어집이 없는 경우에만 초기화 로직 실행
      if (!selectedGlossary || !selectedGlossary._id) {
        // isDefault가 true인 용어집을 찾기
        const defaultGlossaryItem = glossaryList.find(
          (glossary) => glossary.isDefault === true
        );

        // 기본 용어집이 없으면 첫 번째 용어집을 선택
        const glossaryToSelect = defaultGlossaryItem || glossaryList[0];

        const safeGlossary = {
          ...glossaryToSelect,
          words: glossaryToSelect.words || [],
        };

        // 기본 용어집 설정
        setDefaultGlossary(safeGlossary.name || "기본");

        // 선택된 용어집 설정 (기본 용어집으로 설정 후 UI 반영)
        setSelectedGlossary(safeGlossary);
      }
    } else {
      setDefaultGlossary(null);
      setSelectedGlossary({ name: "", words: [] });
    }
  }, [glossaryList]); // glossaryList와 selectedGlossary가 변경될 때만 실행

  // 컴포넌트 마운트 시 용어집 목록 로드
  useEffect(() => {
    async function loadGlossaries() {
      try {
        const glossaries = await fetchAllGlossaries(userInfo.id); // API 호출
        setGlossaryList(glossaries); // 목록 업데이트
      } catch (err) {
        console.error("용어집 로드 실패:", err); // 에러 로그
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    }

    if (userInfo && userInfo.id) {
      loadGlossaries();
    }
  }, [userInfo]); // userInfo가 변경될 때마다 실행

  // GlossaryList 관련 핸들러
  const toggleGlossaryList = () => setShowGlossaryList((prev) => !prev);
  const handleOpenModal = () => setIsGlossaryModalOpen(true);
  const handleCloseModal = () => setIsGlossaryModalOpen(false);

  const handleCreateGlossary = async (name) => {
    try {
      const glossaryData = { name, userId: userInfo.id, words: [] };
      const createdGlossary = await createGlossary(glossaryData);

      if (createdGlossary && createdGlossary._id) {
        setGlossaryList((prevList) => [...prevList, createdGlossary]);
        alert(`"${createdGlossary.name}" 용어집이 생성되었습니다.`);
      } else {
        console.error("용어집 생성 후 ID가 반환되지 않았습니다.");
      }
    } catch (error) {
      alert("용어집 생성에 실패했습니다.");
    }
  };

  const handleDeleteGlossary = async (id) => {
    if (!id) {
      console.error("용어집 ID가 없습니다.");
      return;
    }
    try {
      await deleteGlossary(id);
      setGlossaryList((prev) => prev.filter((glossary) => glossary._id !== id)); // `_id` 기준으로 상태 업데이트
      alert("용어집 삭제 성공");
    } catch (error) {
      console.error("용어집 삭제 실패:", error);
      alert("용어집 삭제에 실패했습니다.");
    }
  };

  const handleSelectGlossary = (glossary) => {
    if (!glossary || !glossary._id) {
      alert("유효한 용어집을 선택해주세요.");
      return;
    }

    // 선택한 용어집을 즉시 업데이트
    setSelectedGlossary(glossary);
    setIsDirty(false); // 변경되지 않은 상태로 초기화
  };

  // useGlossaryManager.js

  const handleSetDefaultGlossaryAPI = async (glossaryId) => {
    try {
      // 기본 용어집 설정을 위한 API 호출
      const response = await setDefaultGlossaryAPI(userInfo.id, glossaryId);

      if (response && response.glossary) {
        const updatedGlossary = response.glossary;

        // 용어집 리스트에서 기본 용어집을 업데이트
        setGlossaryList((prevList) => {
          const updatedList = prevList.map((item) =>
            item._id === updatedGlossary._id ? updatedGlossary : item
          );

          // 상태 업데이트 후, setSelectedGlossary를 호출하여 화면에서 기본 용어집 선택
          setSelectedGlossary(updatedGlossary); // 화면에 기본 용어집이 즉시 반영되도록 설정

          return updatedList; // 상태 한 번만 업데이트
        });

        // 기본 용어집 상태 업데이트
        setDefaultGlossary(updatedGlossary.name || null); // 기본 용어집 상태 설정
      } else {
        throw new Error("API 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("기본 용어집 설정 API 실패:", error);
      alert("기본 용어집 설정에 실패했습니다.");
    }
  };

  // GlossaryList에서 onSetDefaultGlossaryAPI로 직접 호출하는 대신
  // useGlossaryManager에서 처리되도록 `onSetDefaultGlossary`를 넘기지 않도록 수정
  const handleSetDefaultGlossary = async (glossaryId) => {
    const glossary = glossaryList.find((g) => g._id === glossaryId); // 선택된 용어집

    // 기존 기본 용어집을 모두 false로 설정
    const updatedGlossaries = glossaryList.map((g) => {
      if (g._id !== glossaryId) {
        return { ...g, isDefault: false }; // 기존 기본 용어집을 false로 변경
      }
      return g; // 현재 선택된 용어집은 그대로 유지
    });

    // 상태 업데이트
    setGlossaryList(updatedGlossaries);

    // API 호출: 기본 용어집 설정
    try {
      await handleSetDefaultGlossaryAPI(glossaryId); // API 호출
      // 알림은 여기서 한 번만 호출
    } catch (error) {
      console.error("기본 용어집 설정 실패:", error);
      alert("기본 용어집 설정에 실패했습니다.");
    }
  };

  const handleEditGlossaryName = (glossary) => {
    setEditingGlossary(glossary._id); // 편집 중인 용어집의 ID를 설정
  };

  const handleFinishEditGlossaryName = async (glossary) => {
    try {
      await updateGlossaryName(glossary._id, glossary.name); // API 호출
      setEditingGlossary(null); // 편집 모드 해제
      alert("용어집 이름이 수정되었습니다.");
    } catch (error) {
      console.error("용어집 이름 수정 실패:", error);
      alert("이름 수정에 실패했습니다.");
    }
  };

  const handleChangeGlossaryName = (event, glossary) => {
    const newName = event.target.value.trim();

    if (!newName) {
      alert("용어집 이름은 비어 있을 수 없습니다.");
      return;
    }

    // 중복 이름 확인
    if (glossaryList.some((item) => item.name === newName)) {
      alert("중복된 이름은 허용되지 않습니다.");
      return;
    }

    // 상태 업데이트
    setGlossaryList((prev) =>
      prev.map((item) =>
        item._id === glossary._id ? { ...item, name: newName } : item
      )
    );

    // 현재 선택된 용어집 이름 동기화
    if (selectedGlossary?._id === glossary._id) {
      setSelectedGlossary((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleBlurGlossaryName = async (glossary) => {
    try {
      if (!glossary.name.trim()) {
        alert("용어집 이름은 비어 있을 수 없습니다.");
        return;
      }
      await updateGlossaryName(glossary._id, glossary.name); // FastAPI에 업데이트 요청
      alert("용어집 이름이 업데이트되었습니다.");
      setEditingGlossary(null);
    } catch (error) {
      console.error("용어집 이름 업데이트 실패:", error);
      alert("업데이트 실패");
    }
  };

  // WordPairEditor 관련 핸들러
  const handleAddWordPair = () => {
    if (!selectedGlossary || !selectedGlossary._id) {
      alert("단어쌍을 추가할 용어집을 선택해주세요.");
      return;
    }

    // 새로운 단어쌍 추가
    const updatedWords = [
      ...selectedGlossary.words,
      { start: "", arrival: "" },
    ];

    // 현재 선택된 용어집 업데이트
    const updatedGlossary = { ...selectedGlossary, words: updatedWords };

    // 상태 업데이트
    setSelectedGlossary(updatedGlossary);

    // 전체 용어집 리스트에서 선택된 용어집 업데이트
    setGlossaryList((prev) =>
      prev.map((g) => (g._id === selectedGlossary._id ? updatedGlossary : g))
    );
  };

  const handleCancelEditGlossaryName = () => {
    setEditingGlossary(null); // 편집 모드를 해제
  };

  const handleSaveWordPair = async (index) => {
    const newWordPair = selectedGlossary.words[index];
    if (!newWordPair.start || !newWordPair.arrival) {
      alert("출발 단어와 도착 단어를 모두 입력해주세요.");
      return;
    }

    setIsSaving(index);
    try {
      const savedWordPair = await addWordPair(
        selectedGlossary._id,
        newWordPair
      );
      setGlossaryList((prev) =>
        prev.map((g) =>
          g.id === selectedGlossary.id
            ? { ...g, words: [...g.words, savedWordPair] }
            : g
        )
      );
      alert("단어쌍이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("단어쌍 저장 실패:", error);
      alert("단어쌍 저장에 실패했습니다.");
    } finally {
      setIsSaving(null);
    }
  };

  const handleUpdateWordPair = async (index) => {
    const updatedWordPair = selectedGlossary.words[index];
    if (!updatedWordPair.start || !updatedWordPair.arrival) {
      alert("출발 단어와 도착 단어를 모두 입력해주세요.");
      return;
    }

    try {
      await updateWordPair(
        selectedGlossary._id,
        updatedWordPair.id,
        updatedWordPair
      );
      setGlossaryList((prev) =>
        prev.map((g) =>
          g._id === selectedGlossary._id
            ? {
                ...g,
                words: g.words.map((word, idx) =>
                  idx === index ? updatedWordPair : word
                ),
              }
            : g
        )
      );
      alert("단어쌍 수정이 완료되었습니다.");
    } catch (error) {
      console.error("단어쌍 수정 실패:", error);
      alert("단어쌍 수정에 실패했습니다.");
    }
  };

  const handleDeleteWord = async (index) => {
    if (!selectedGlossary || !selectedGlossary._id) {
      alert("용어집을 선택해주세요.");
      return;
    }
    if (window.confirm("이 단어쌍을 삭제하시겠습니까?")) {
      try {
        await deleteWordPair(selectedGlossary._id, index);
        const updatedWords = selectedGlossary.words.filter(
          (_, i) => i !== index
        );
        const updatedGlossary = { ...selectedGlossary, words: updatedWords };
        setSelectedGlossary(updatedGlossary);
        setGlossaryList((prev) =>
          prev.map((g) =>
            g._id === selectedGlossary._id ? updatedGlossary : g
          )
        );
        alert("단어쌍이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("단어쌍 삭제 실패:", error);
        alert("단어쌍 삭제에 실패했습니다.");
      }
    }
  };

  const handleChangeWordPair = (index, field, value) => {
    const updatedWords = [...selectedGlossary.words];
    updatedWords[index][field] = value;

    const updatedGlossary = { ...selectedGlossary, words: updatedWords };
    setSelectedGlossary(updatedGlossary);
    setGlossaryList((prev) =>
      prev.map((g) => (g._id === selectedGlossary._id ? updatedGlossary : g))
    );
    setIsDirty(true);
  };

  // Hook이 노출할 값들을 모아서 반환
  return {
    // 상태
    showGlossaryList,
    isGlossaryModalOpen,
    glossaryList,
    defaultGlossary,
    selectedGlossary,
    editingGlossary,
    isGlossaryEnabled,
    isSaving,
    isDirty,
    isLoading,

    // setter
    setIsGlossaryEnabled,

    // GlossaryList 핸들러
    toggleGlossaryList,
    handleOpenModal,
    handleCloseModal,
    handleCreateGlossary,
    handleDeleteGlossary,
    handleSelectGlossary,
    handleSetDefaultGlossary,
    handleEditGlossaryName,
    handleChangeGlossaryName,
    handleBlurGlossaryName,
    handleFinishEditGlossaryName,
    handleSetDefaultGlossaryAPI,
    handleCancelEditGlossaryName,

    // WordPairEditor 핸들러
    handleAddWordPair,
    handleSaveWordPair,
    handleUpdateWordPair,
    handleDeleteWord,
    handleChangeWordPair,
  };
}
