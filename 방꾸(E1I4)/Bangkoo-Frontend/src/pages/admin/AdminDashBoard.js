/**
 * 관리자 페이지의 왼쪽 영역과
 * 오른쪽 영역의 합친 컴포넌트
 */

import React, { useState } from "react";
import AdminLeftArea from "./AdminLeftArea";
import AdminRightArea from "./AdminRightArea";
import { AdminContainer } from "./css/Admin.styled";

function AdminDashBoard() {
  const [selectedMenu, setSelectedMenu] = useState("gagu");

  return (
    <AdminContainer>
      <AdminLeftArea onMenuSelect={setSelectedMenu} />
      <AdminRightArea selectedMenu={selectedMenu} />
    </AdminContainer>
  );
}

export default AdminDashBoard;
