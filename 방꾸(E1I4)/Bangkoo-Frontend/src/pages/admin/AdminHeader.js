import React, { useState, useRef } from "react";
import CommonButton from "../../common/CommonButton";
import { GaguListHeader } from "./css/Admin.styled";
import CommonTextField from "../../common/CommonTextField";
import SearchIcon from "@mui/icons-material/Search";
import GaguRegisterModal from "./ItemRegister";
import {
  searchProducts,
  deleteAdminProducts,
  createAdminProducts,
  handleCSVUpload as uploadCSVToServer, // ✅ 이름 충돌 방지
} from "../../api/Admin";
import Papa from "papaparse";

function AdminHeader({ checkedItems, setCheckedItems, onRefresh, onSearchResults, searchTerm, setSearchTerm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(); // 파일 업로드 input 참조

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    onRefresh();
  };

  const handleSearch = async () => {
    console.log("검색어:", searchTerm);
    try {
      const results = await searchProducts(searchTerm, "", "");
      console.log("검색 결과:", results);
      onSearchResults(results); // 검색 결과 부모에 전달
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    onRefresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async () => {
    if (!checkedItems || checkedItems.length === 0) {
      alert("삭제할 항목을 선택해 주세요.");
      return;
    }

    try {
      await Promise.all(checkedItems.map(id => deleteAdminProducts(id)));
      alert("선택한 항목이 삭제되었습니다.");
      setCheckedItems([]);
      onRefresh();
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 실패");
    }
  };

  // ✅ CSV 버튼 클릭 → 파일 선택 input 클릭 유도
  const handleCSVButtonClick = () => {
    fileInputRef.current.click();
  };

  // ✅ CSV 파일 선택 후 실행되는 함수 (JSON 방식으로 백엔드에 전송)
  const handleCSVFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("CSV 파일을 선택해주세요.");
      return;
    }

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          let rows = result.data;

          // 빈 name 제거
          rows = rows.filter(item => item.name && item.name.trim() !== "");

          console.log("CSV 파싱 결과:", rows);

          try {
            const res = await uploadCSVToServer(rows); // ✅ JSON 배열 전송
            console.log("스프링 응답:", res);
            alert("CSV 업로드 및 저장 완료!");
            onRefresh();
          } catch (err) {
            console.error("스프링 처리 중 오류:", err);
            alert("서버 오류 발생");
          }
        },
      });
    } catch (err) {
      console.error("CSV 파싱 오류:", err);
      alert("CSV 파싱 실패");
    }
  };

  return (
    <>
      <h2 style={{ fontSize: "20px", margin: "2% 0 2% 2%" }}>가구목록</h2>

      <GaguListHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {/* 🔍 검색 필드 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #000",
            }}
          >
            <SearchIcon />
            <CommonTextField
              width="180px"
              height="32px"
              placeholder="가구명을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onClearAll={handleClearAll}
              custom="none"
              fontSize="sx"
            />
          </div>

          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleSearch}
          >
            검색
          </CommonButton>
        </div>

        {/* ➕ 등록/삭제/CSV 버튼 */}
        <div style={{ display: "flex", gap: "8px" }}>
          <CommonButton
            type="fill"
            bgColor="green"
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleCSVButtonClick}
          >
            CSV 파일 불러오기
          </CommonButton>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleCSVFileSelect} // ✅ 올바른 핸들러 연결
            style={{ display: "none" }}
          />
          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleOpenModal}
          >
            가구 등록
          </CommonButton>
          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            type="fill"
            bgColor="red"
            onClick={handleDelete}
          >
            삭제
          </CommonButton>
        </div>
      </GaguListHeader>

      {/* 🪟 모달 */}
      {isModalOpen && <GaguRegisterModal handleClose={handleCloseModal} />}
    </>
  );
}

export default AdminHeader;
