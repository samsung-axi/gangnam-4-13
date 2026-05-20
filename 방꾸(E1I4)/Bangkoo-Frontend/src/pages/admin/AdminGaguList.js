import React, { useState, useEffect } from "react";
import {
  GaguListContainer,
  GaguTable,
  GaguListHeader,
  GaguListHeaderRow,
  GaguListHeaderItem,
  GaguListBody,
  GaguItem,
  GaguListItem,
  PaginationContainer,
  PaginationButton,
  GaguImageWrapper,
} from "./css/AdminGaguList.style";

import CommonButton from "../../common/CommonButton";
import { fetchProducts, updateAdminProducts } from "../../api/Admin";

const AdminGaguList = ({ checkedItems = [], setCheckedItems, refreshFlag, searchTerm, searchResults }) => {
  // products가 비어있는 경우에도 기본값을 설정
  const [products, setProducts] = useState({ content: [] }); 
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태

  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수

  
// 렌더링시 체크박스 상태와 제품 데이터 확인
useEffect(() => {
  console.log("현재 체크된 아이템 목록:", checkedItems); // 체크된 아이템 목록 출력
  // console.log("현재 제품 목록:", products.content); // 제품 목록 출력
}, [checkedItems, products.content]); // 체크된 아이템이나 제품 목록이 변경될 때마다 출력

  // 검색어가 변경될 때마다 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1); // 검색어가 변경되면 페이지를 1로 초기화
  }, [searchTerm]);

  // 검색 결과가 변경될 때마다 products 상태를 업데이트
  useEffect(() => {
    setProducts(searchResults || {content: []}); // 검색 결과가 업데이트되면 이를 사용
  }, [searchResults]);

 // 페이지, 검색어, 새로고침 신호가 있을 때 데이터를 불러옴
useEffect(() => {
  console.log("검색어의 값:", searchTerm);

  const fetchData = async () => {
    try {
      const page = currentPage > 0 ? currentPage - 1 : 0; // 0부터 시작하는 페이지로 변경
      const res = await fetchProducts(page, itemsPerPage, searchTerm); // API 호출

      console.log("API 응답 데이터:", res); // API 응답 확인

      if (res && res.content) {
        setProducts(res.content);  // `content` 부분을 사용하여 제품 목록 설정
        setTotalPages(res.content.totalPages || 1); // 총 페이지 수 설정
      }
    } catch (err) {
      console.error("❌ 가구 데이터 불러오기 실패:", err); // 에러 발생 시
    }
  };

  fetchData(); // 데이터 불러오기 호출
}, [currentPage, refreshFlag, searchTerm]); // currentPage, refreshFlag, searchTerm이 바뀔 때마다 실행


  const isContentArray = Array.isArray(products?.content) && products.content.length > 0; // 배열인지 체크
  console.log("배열 확인", isContentArray);

  // 전체 선택 체크박스 처리
  const handleCheckAll = (e) => {
    console.log("전체 선택 체크박스 상태:", e.target.checked); // 전체 체크박스 상태 출력
  
    if (e.target.checked) { // 체크박스가 선택되었을 때
      if (Array.isArray(products.content)) {
        const ids = products.content.map((item) =>
          String(item._id || item.id) // 제품의 id를 배열로 수집
        );
        console.log("전체 선택된 아이템 ID:", ids); // 선택된 아이템 ID 출력
        setCheckedItems(ids); // 선택된 아이템의 id를 상태에 저장
      } else {
        console.error("products.content.content는 배열이 아니거나 정의되지 않았습니다.");
      }
    } else {
      console.log("전체 선택 해제됨"); // 전체 선택 해제 출력
      setCheckedItems([]); // 체크박스를 해제할 때 모든 아이템을 선택 해제
    }
  };

  // 개별 아이템 체크박스 처리
  const handleCheck = (item) => {
    const stringId = String(item._id || item.id); // 아이템의 id를 문자열로 변환
    if (!stringId) return; // id가 없으면 함수 종료
  
    console.log("개별 아이템 선택 상태 변경, 선택된 아이템 ID:", stringId); // 선택된 아이템 ID 출력
  
    setCheckedItems((prev) => {
      const updatedCheckedItems = prev.includes(stringId)
        ? prev.filter((id) => id !== stringId) // 이미 선택된 아이템은 선택 해제
        : [...prev, stringId]; // 선택되지 않은 아이템은 추가
  
      console.log("업데이트된 체크된 아이템들:", updatedCheckedItems); // 업데이트된 체크된 아이템 상태 출력
      return updatedCheckedItems;
    });
  };
  

  // 가구 수정 호출
  const handleUpdate = async (item) => {
    const newName = prompt("새 이름을 입력하세요", item.name); // 이름 수정
    const newDesc = prompt("새 설명을 입력하세요", item.description); // 설명 수정
    const newDetail = prompt("새 상세설명을 입력하세요", item.dtail); // 상세설명 수정
    const newPrice = prompt("새 가격을 입력하세요", item.price); // 가격 수정
    const newUrl = prompt("새 링크를 입력하세요", item.url); // 링크 수정
    const newImageUrl = prompt("새 이미지 링크를 입력하세요", item.imageUrl); // 이미지 url수정
    const newModel3D = prompt("새 3D링크를 입력하세요", item.model3dUrl); // 3D url 수정
    const newCategory= prompt("새 카테고리를 입력하세요", item.category); // 카테고리 수정정

    // 이름이나 설명이 바뀌지 않으면 수정하지 않음
    if (
      (!newName || newName === item.name) &&
      (!newDesc || newDesc === item.description)&&
      (!newDetail || newDetail === item.dtail)&&
      (!newPrice || newPrice === item.price)&&
      (!newUrl || newUrl === item.url)&&
      (!newImageUrl || newImageUrl === item.imageUrl)&&
      (!newModel3D || newModel3D === item.model3dUrl)&&
      (!newCategory || newCategory === item.category)
    ) return;

    const updateData = {
      ...item,
      name: newName,
      description: newDesc,
      dtail: newDetail,
      price: newPrice,
      url: newUrl,
      imageUrl: newImageUrl,
      model3dUrl: newModel3D,
      category: newCategory,
      id: item.id || item._id, // 아이템의 id 설정
    };

    try {
      const updated = await updateAdminProducts(updateData.id, updateData); // 수정된 제품 데이터 서버로 전송

      // 상태 업데이트하여 화면에 반영
      setProducts((prev) => {
        const updatedContent = prev.content.map((p) => {
          const pId = p._id || p.id;
          return pId === updated._id || pId === updated.id ? { ...p, ...updated } : p;
        }) || []; // 만약 prev.content.content가 undefined라면 빈 배열을 사용

        return {
          ...prev,
          content: 
           updatedContent,
        };
      });

      alert("수정 성공");
    } catch (err) {
      console.error("수정 실패:", err); // 수정 실패 시
      alert("수정 실패");
    }
  };

  // 모든 항목이 선택되었는지 확인
  const isAllChecked =
    isContentArray &&
    products.content.length > 0 &&
    products.content.every((item) =>
      checkedItems.includes(String(item._id || item.id)) // 모든 항목의 id가 체크된 목록에 포함되는지 확인
    );

  // 페이지네이션 기능
  const renderPagination = () => {
    if (!totalPages || isNaN(totalPages)) return null; // 페이지 수가 없으면 렌더링하지 않음

    const paginationNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2) // 현재 페이지를 기준으로 앞뒤 2페이지까지 보여줌
      ) {
        paginationNumbers.push(i);
      } else if (paginationNumbers[paginationNumbers.length - 1] !== "...") {
        paginationNumbers.push("..."); // 생략 기호 추가
      }
    }

    return paginationNumbers.map((page, index) => (
      <PaginationButton
        key={index}
        onClick={() => typeof page === "number" && setCurrentPage(page)} // 페이지 클릭 시 해당 페이지로 이동
        disabled={currentPage === page} // 현재 페이지는 클릭 불가
      >
        {page}
      </PaginationButton>
    ));
  };

  return (
    <GaguListContainer>
      <GaguTable>
        <GaguListHeader>
          <GaguListHeaderRow>
            <GaguListHeaderItem>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleCheckAll} // 전체 선택/해제 처리
              />
            </GaguListHeaderItem>
            <GaguListHeaderItem>번호</GaguListHeaderItem>
            <GaguListHeaderItem>이미지</GaguListHeaderItem>
            <GaguListHeaderItem>가구명</GaguListHeaderItem>
            <GaguListHeaderItem>Description</GaguListHeaderItem>
            <GaguListHeaderItem>등록일</GaguListHeaderItem>
            <GaguListHeaderItem>수정일</GaguListHeaderItem>
            <GaguListHeaderItem>수정</GaguListHeaderItem>
          </GaguListHeaderRow>
        </GaguListHeader>

        <GaguListBody>
          {isContentArray && products.content.length > 0 ? (
            products.content.map((item, index) => (
              <GaguItem key={item.id}>
                <GaguListItem>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(String(item._id || item.id))} // 개별 체크박스 상태
                    onChange={() => handleCheck(item)} // 개별 선택 처리
                  />
                </GaguListItem>
                <GaguListItem>{(currentPage - 1) * itemsPerPage + index + 1}</GaguListItem>
                <GaguListItem>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <GaguImageWrapper style={{ height: "20px", cursor: "pointer" }}>
                      <img src={item.imageUrl} alt="가구" />
                    </GaguImageWrapper>
                  </a>
                </GaguListItem>
                <GaguListItem>{item.name}</GaguListItem>
                <GaguListItem>{item.description}</GaguListItem>
                <GaguListItem>{item.createdAt}</GaguListItem>
                <GaguListItem>{item.updatedAt}</GaguListItem>
                <GaguListItem>
                  <CommonButton
                    style={{ height: "20px" }}
                    fontSize="xxs"
                    type="edit"
                    onClick={() => handleUpdate(item)} // 수정 버튼 클릭 시 처리
                  >
                    수정
                  </CommonButton>
                </GaguListItem>
              </GaguItem>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </GaguListBody>
      </GaguTable>

      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;
