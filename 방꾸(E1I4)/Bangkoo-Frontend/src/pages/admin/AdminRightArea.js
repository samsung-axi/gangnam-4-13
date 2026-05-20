import React, { useState } from "react";
import AdminGaguList from "./AdminGaguList";
import AdminHeader from "./AdminHeader";
import { RightArea } from "./css/Admin.styled";

function AdminRightArea() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // ✅ 검색 결과 상태 추가

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
    setSearchResults([]); // ✅ 새로고침 시 검색결과 초기화
  };

  return (
    <RightArea>
      <AdminHeader
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
        onRefresh={handleRefresh}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchResults={setSearchResults} // ✅ props로 전달
      />
      <AdminGaguList
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
        refreshFlag={refreshFlag}
        searchTerm={searchTerm}
        searchResults={searchResults} // ✅ AdminGaguList에도 전달
      />
    </RightArea>
  );
}

export default AdminRightArea;
