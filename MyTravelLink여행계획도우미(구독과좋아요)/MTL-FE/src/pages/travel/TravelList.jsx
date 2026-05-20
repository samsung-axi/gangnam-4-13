import React, { useState, useEffect, useMemo } from "react";
import "../../css/travel/TravelList.css";
import TravelPageModal from "./TravelPageModal";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import axiosInstance from "../../components/AxiosInstance";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

const TravelList = () => {
  const [travelItems, setTravelItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("latest");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pinnedItems, setPinnedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const getTravelList = async () => {
    try {
      if (token) {
        const response = await axiosInstance.get(
          "/api/v1/travels/travelInfos/list",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log("API Response:", response.data);
        setTravelItems(response.data.travelInfoList);
      } else {
        console.log("No token available");
      }
    } catch (error) {
      console.error("API Error:", error.response || error);
    }
  };

  const putFavorite = async (travelId, isFavorite) => {
    try {
      if (token) {
        await axiosInstance.put(
          `/api/v1/travels/travelInfos/${travelId}/favorite`,
          { isTrue: isFavorite },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error(
        "즐겨찾기 상태를 업데이트하는 중 오류가 발생했습니다:",
        error
      );
    }
  };

  const putPin = async (travelId, isFixed) => {
    try {
      if (token) {
        await axiosInstance.put(`/api/v1/travels/travelInfos/${travelId}/fixed`, {
          isTrue: isFixed,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error("고정 상태를 업데이트하는 중 오류가 발생했습니다:", error);
    }
  };

  const putUpdateTitle = async (item, newTitle) => {
    try {
      if (token) {
        await axiosInstance.put(`/api/v1/travels/travelInfos/${item.travelId}`, {
          travelInfoTitle: newTitle,
          travelDays: parseInt(item.travelDays), // 숫자로 변환
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error("여행 제목을 업데이트하는 중 오류가 발생했습니다:", error);
    }
  };

  const deleteTravel = async (travelId) => {
    try {
      if (token) {
        await axiosInstance.delete(`/api/v1/travels/travelInfos/${travelId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error("여행을 삭제하는 중 오류가 발생했습니다:", error);
    }
  };

  const handleFilterClick = (filter) => {
    console.log(filter);
    console.log(sortAsc);
    if (filter === true) {
      setSortAsc(filter);
      setActiveFilter(filter);
    } else if (filter === false) {
      setSortAsc(filter);
      setActiveFilter(filter);
    } else {
      setActiveFilter(filter);
    }
  };

  // 고정 토글 핸들러
  const handlePinClick = (item) => {
    if (pinnedItems.includes(item.travelId)) {
      setPinnedItems((prev) => prev.filter((id) => id !== item.travelId));
    } else {
      setPinnedItems((prev) => [...prev, item.travelId]);
    }
    // 고정 상태 변경
    setTravelItems(
      travelItems.map((travelItem) =>
        travelItem.travelId === item.travelId
          ? { ...travelItem, fixed: !travelItem.fixed }
          : travelItem
      )
    );
    putPin(item.travelId, !item.fixed);
    setShowModal(false);
  };

  // 즐겨찾기 토글 함수
  const toggleFavorite = (item) => {
    setTravelItems(
      travelItems.map((travelItem) =>
        travelItem.travelId === item.travelId
          ? { ...travelItem, favorite: !travelItem.favorite }
          : travelItem
      )
    );
    putFavorite(item.travelId, !item.favorite);
  };

  const handleMoreOptionsClick = (id) => {
    setSelectedItem(travelItems.find((item) => item.travelId === id));
    setShowModal(true);
  };

  // 데이터 구조 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      getTravelList();
    }
  }, []);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    // travelItems가 없거나 배열이 아닐 경우 빈 배열 반환
    if (!travelItems || !Array.isArray(travelItems)) {
      return [];
    }
    console.log("searchText:", searchText);
    // 검색어로 먼저 필터링
    let filtered = travelItems;
    if (searchText.trim()) {
      filtered = travelItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    console.log("filtered:", filtered);

    // activeFilter가 'favorite'일 때만 즐겨찾기 필터링 적용
    if (activeFilter === "favorite") {
      return filtered.filter((item) => item.favorite === true);
    }
    if (activeFilter === true) {
      // 최신순 정렬
      return filtered.sort((a, b) => {
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return dateB - dateA;
      });
    } else if (activeFilter === false) {
      // 오래된 순 정렬
      return filtered.sort((a, b) => {
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return dateA - dateB;
      });
    }
    return filtered;
  }, [travelItems, activeFilter, searchText]);

  // 필터링 및 정렬된 데이터 계산
  const sortedAndFilteredData = useMemo(() => {
    let filtered = [...filteredData];

    // 고정된 항목을 최상단으로 정렬
    return filtered.sort((a, b) => {
      // 둘 다 고정되었거나 둘 다 고정되지 않은 경우 기존 정렬 유지
      const isPinnedA = a.fixed;
      const isPinnedB = b.fixed;

      if (activeFilter === true && isPinnedA === isPinnedB) {
        // 날짜 기준 정렬
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return activeFilter === "latest" ? dateB - dateA : dateA - dateB;
      } else if (activeFilter === false && isPinnedA === isPinnedB) {
        // 날짜 기준 정렬
        const dateA = new Date(a.createAt);
        const dateB = new Date(b.createAt);
        return activeFilter === "latest" ? dateA - dateB : dateB - dateA;
      }
      // 고정된 항목을 위로
      return isPinnedB ? 1 : -1;
    });
  }, [filteredData, activeFilter, pinnedItems]);

  // 아이템 이름 수정 함수
  const handleUpdateTitle = (item, newTitle) => {
    console.log("아이템 이름 수정:", newTitle);
    setTravelItems(
      travelItems.map((travelItem) =>
        travelItem.travelId === item.travelId
          ? { ...travelItem, title: newTitle }
          : travelItem
      )
    );
    putUpdateTitle(item, newTitle);
  };

  // 아이템 삭제 함수
  const handleDeleteItem = (item) => {
    setTravelItems(
      travelItems.filter((travelItem) => travelItem.travelId !== item.travelId)
    );
    deleteTravel(item.travelId);
    setShowModal(false);
  };


  // 날짜 형식 변환 함수
  // 2025-02-03T00:39:43 형식을 2025년 2월 3일 00시 39분 형식으로 변환
  const convertDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
  };

  // 데이터 상태 확인
  useEffect(() => {
    console.log("Current travelItems:", travelItems);
    console.log("Filtered Data:", filteredData);
  }, [travelItems, filteredData]);

  return (
    <div className="SJ-Travel-List">
      <div className="SJ-travel-container">

        <div className="SJ-search-Container">

          <input
            id="WS-guidebook-search-input"
            type="text"
            placeholder="내가 만든 여행을 검색하세요"
            className="WS-Link-Input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="SJ-search-button-container">
            <button className="SJ-search-icon">
              {!searchText ? (
                <FaSearch />
              ) : (
                <FaTimes onClick={() => setSearchText("")} />
              )}
            </button>
          </div>
        </div>

        <div className="SJ-filter-buttons">
          <button
            className={`SJ-filter-btn ${activeFilter === "favorite" ? "" : "active"
              }`}
            //activeFilter가 favorite일 때 sortAsc, 아닐 때 !sortAsc
            onClick={() =>
              handleFilterClick(
                activeFilter === "favorite" ? sortAsc : !sortAsc
              )
            }
          >
            생성일{" "}
            {sortAsc === true ? (
              <HiChevronDown style={{ verticalAlign: "middle" }} />
            ) : (
              <HiChevronUp style={{ verticalAlign: "middle" }} />
            )}
          </button>
          <button
            className={`SJ-filter-btn ${activeFilter === "favorite" ? "active" : ""
              }`}
            onClick={() => handleFilterClick("favorite")}
          >
            즐겨찾기
          </button>
        </div>

        <div className="SJ-travel-grid">
          {sortedAndFilteredData.map((item) => (
            <div key={item.id} className="SJ-travel-card">
              <Link to={`/travelInfos/${item.travelId}`} className="HG-travel-card-link" style={{ textDecoration: "none", color: "black" }}>

                {item.fixed && (
                  <div className="SJ-pin-icon">📌</div>
                )}

                <div className="SJ-travel-img">
                  <img src={item.imgUrl} alt={item.title} />
                </div>

                <div className="SJ-card-content">
                  <div className="HG-card-content-container">
                    <div className="SJ-card-header">
                      <div className="SJ-card-title">{item.title}</div>
                    </div>
                    <div className="SJ-card-footer">
                      <span className="SJ-card-period">
                        여행 장소: {item.placeCount} 개
                      </span>
                      <span className="SJ-card-date">{convertDate(new Date(item.createAt))}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="HG-favorite-button-container">
                <div
                  className={`WS-favorite-button ${item.favorite ? "filled" : "outlined"
                    }`}
                  onClick={() => toggleFavorite(item)}
                >
                  {item.favorite ? "♥" : "♡"}
                </div>
                <button
                  className="SJ-more-button"
                  onClick={() => handleMoreOptionsClick(item.travelId)}
                >
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <TravelPageModal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedItem={selectedItem}
            handlePinToggle={handlePinClick}
            onUpdateTitle={handleUpdateTitle}
            onDeleteItem={handleDeleteItem}
            items={travelItems}
          />
        )}
      </div>
    </div>
  );
};

export default TravelList;
