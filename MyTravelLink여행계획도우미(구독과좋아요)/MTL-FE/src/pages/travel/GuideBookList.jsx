import React, { useState, useMemo, useEffect } from "react";
import "../../css/travel/GuidebookList.css";
import TravelPageModal from "./TravelPageModal";
import { FaSearch, FaTimes } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { Link } from "react-router-dom";
import axiosInstance from '../../components/AxiosInstance';

function GuidebookList() {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [guideBookData, setGuideBookData] = useState([]);
  const [searchAuthor, setSearchAuthor] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    getGuideBookList();
    setToken(localStorage.getItem('token'));
  }, []);

  // 가이드북 목록 조회 api
  const getGuideBookList = async () => {
    try {
      if (token) {
        const response = await axiosInstance.get('/api/v1/travels/guidebooks/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGuideBookData(response.data.guideBooks || []);
        console.log(response.data.guideBooks);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('가이드북 목록을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  // 즐겨찾기 업데이트 api
  const putFavorite = async (id, favorite) => {
    try {
      if (token) {
        const response = await axiosInstance.put(`/api/v1/travels/guidebooks/${id}/favorite`, {
          isTrue: favorite
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('즐겨찾기 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  // 고정 업데이트 api
  const putPin = async (id, pin) => {
    try {
      if (token) {
        const response = await axiosInstance.put(`/api/v1/travels/guidebooks/${id}/fixed`, {
          isTrue: pin
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('고정 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  // 제목 업데이트 api
  const putUpdateTitle = async (id, title) => {
    try {
      if (token) {
        const response = await axiosInstance.put(`/api/v1/travels/guidebooks/${id}/title`, {
          value: title
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('제목 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  // 가이드북 삭제 api
  const deleteGuideBook = async (id) => {
    try {
      if (token) {
        const response = await axiosInstance.delete(`/api/v1/travels/guidebooks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('가이드북 삭제 중 오류가 발생했습니다:', error);
    }
  };

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    // travelItems가 없거나 배열이 아닐 경우 빈 배열 반환
    if (!guideBookData || !Array.isArray(guideBookData)) {
      return [];
    }
    // 검색어로 먼저 필터링
    let filtered = guideBookData;
    if (searchText.trim()) {
      filtered = guideBookData.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    //작성자로 필터링
    if (Array.isArray(searchAuthor) && searchAuthor.length > 0) {
      filtered = filtered.filter(item =>
        item.authors.some(author => searchAuthor.includes(author))
      );
    }

    console.log("filtered:", filtered);

    // activeFilter가 'favorite'일 때만 즐겨찾기 필터링 적용
    if (activeFilter === "favorite") {
      return filtered.filter((item) => item.isFavorite === true);
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
  }, [guideBookData, activeFilter, searchText, searchAuthor]);


  // 정렬된 가이드북 데이터 계산
  const sortedGuideBooks = useMemo(() => {
    let sorted = [...filteredData];

    // 먼저 고정된 항목을 최상단으로 정렬
    sorted.sort((a, b) => {
      const isPinnedA = a.fixed;
      const isPinnedB = b.fixed;
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;

      // 고정 상태가 같은 경우 날짜순 정렬
      if (isPinnedA === isPinnedB) {
        if (sortAsc) {
          return new Date(b.createAt) - new Date(a.createAt);
        } else {
          return new Date(a.createAt) - new Date(b.createAt);
        }
      }
      return 0;
    });

    // 즐겨찾기 필터 적용
    if (activeFilter === "favorite") {
      sorted = sorted.filter((guide) => guide.isFavorite);
    }

    return sorted;
  }, [filteredData, activeFilter, sortAsc]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id) => {
    // 즐겨찾기 상태 변경
    const favorite = guideBookData.find((guide) => guide.id === id).isFavorite;
    putFavorite(id, !favorite);
    setGuideBookData(
      guideBookData.map((guide) =>
        guide.id === id ? { ...guide, isFavorite: !guide.isFavorite } : guide
      )
    );
  };

  // 고정 토글 핸들러
  const handlePinClick = (item) => {
    // 고정 상태 변경
    setGuideBookData(
      guideBookData.map((guide) =>
        guide.id === item.id ? { ...guide, fixed: !guide.fixed } : guide
      )
    );
    putPin(item.id, !item.fixed);
    setShowModal(false);
  };

  // 더보기 버튼 클릭 핸들러
  const handleMoreOptionsClick = (item) => {
    setSelectedGuide(item);
    setShowModal(true);
  };

  // 제목 업데이트 함수 추가
  const handleUpdateTitle = (item, newTitle) => {
    try {
      console.log(item.id, newTitle);
      putUpdateTitle(item.id, newTitle);
      setGuideBookData(guideBookData.map((guide) =>
        guide.id === item.id ? { ...guide, title: newTitle } : guide
      ));
    } catch (error) {
      console.error('가이드북 제목을 업데이트하는 중 오류가 발생했습니다:', error);
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

  const handleDeleteItem = (item) => {
    setGuideBookData(guideBookData.filter((guide) => guide.id !== item.id));
    deleteGuideBook(item.id);
    setShowModal(false);
  };

  const handleAuthorClick = (author) => {
    if (!searchAuthor.includes(author)) setSearchAuthor([...searchAuthor, author]);
    console.log(author);
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
  return (
    <div className="SJ-guidebook-list">

      <div className="SJ-search-Container">
        <input
          id="WS-guidebook-search-input"
          type="text"
          placeholder="가이드북 제목을 검색하세요"
          className="WS-Link-Input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="SJ-search-button-container">
          <button className="SJ-search-icon">
            {!searchText ? (
              <FaSearch />
            ) : (
              < FaTimes onClick={() => setSearchText("")} />
            )}
          </button>
        </div>
      </div>

      {Array.isArray(searchAuthor) && searchAuthor.length > 0 && <div className='HG-search-author-container'>
        {searchAuthor.map((author, index) => (
          <div key={index} className='HG-search-author-item'>
            #{author.length > 8 ? `${author.slice(0, 8)}...` : author} <FaTimes className="WS-search-author-item-delete-icon" onClick={() => setSearchAuthor(searchAuthor.filter((item) => item !== author))} />
          </div>
        ))}
      </div>
      }

      {/* 필터 버튼 */}
      <div className="SJ-filter-buttons">
        <button
          className={`SJ-filter-btn ${activeFilter === "favorite" ? "" : "active"
            }`}
          //activeFilter가 favorite일 때 sortAsc, 아닐 때 !sortAsc
          onClick={() => handleFilterClick(activeFilter === "favorite" ? sortAsc : !sortAsc)}
        >
          생성일 {sortAsc === true ? <HiChevronDown style={{ verticalAlign: "middle" }} /> : <HiChevronUp style={{ verticalAlign: "middle" }} />}
        </button>
        <button
          className={`SJ-filter-btn ${activeFilter === "favorite" ? "active" : ""
            }`}
          onClick={() => handleFilterClick("favorite")}
        >
          즐겨찾기
        </button>
      </div>

      <div className="WS-guide-container">
        {Array.isArray(sortedGuideBooks) && sortedGuideBooks.map((guide) => (
          <div key={guide.id} className="SJ-guide-card">
            <div className="SJ-guide-content">
              <Link to={`/guidebooks/${guide.id}`} style={{ textDecoration: "none", color: "black" }}>
                {guide.fixed && (
                  <div className="SJ-pin-icon">📌</div>
                )}

                <div className="SJ-guide-category">{guide.travelInfoTitle}</div>

                <div className="SJ-guide-header">
                  <div className="SJ-guide-title">{guide.title}</div>
                  <div className="SJ-guide-score">코스 {guide.courseCount}</div>
                </div>
              </Link>
              <div className="SJ-guide-footer">
                <div className="SJ-guide-date">생성일 : {convertDate(new Date(guide.createAt))}</div>
                <div className="SJ-guide-tags">
                  {Array.isArray(guide.authors) && guide.authors.map((author, index) => (
                    <span key={index} className="SJ-guide-tag"
                      onClick={() => handleAuthorClick(author)}
                    >
                      #{author}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className={`WS-favorite-button  ${guide.fixed ? "filled" : "outlined"
                  }`}
                onClick={() => toggleFavorite(guide.id)}
              >
                {guide.isFavorite ? "♥" : "♡"}
              </div>
              <button
                className="SJ-more-button"
                onClick={() => handleMoreOptionsClick(guide)}
              >
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 컴포넌트 추가 */}
      <TravelPageModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedItem={selectedGuide}
        handlePinToggle={handlePinClick}
        onUpdateTitle={handleUpdateTitle}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
}

export default GuidebookList;
