import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LeftArrowIcon from '../images/Product_LeftArrow.png';
import RightArrowIcon from '../images/Product_RightArrow.png';
import '../styles/Pagination.css';

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 한 구간에 표시할 페이지 수
  const pagesPerRange = 10;

  // 현재 구간을 계산
  const currentRangeStart = Math.floor((currentPage - 1) / pagesPerRange) * pagesPerRange + 1;
  const currentRangeEnd = Math.min(currentRangeStart + pagesPerRange - 1, totalPages);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPageChange(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      onPageChange(prevPage);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      <button
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <img src={LeftArrowIcon} alt="Previous" className="pagination-icon" />
      </button>
      <div className="pagination-numbers">
        {Array.from({ length: currentRangeEnd - currentRangeStart + 1 }, (_, index) => {
          const pageNumber = currentRangeStart + index;
          return (
            <button
              key={pageNumber}
              className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button
        className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <img src={RightArrowIcon} alt="Next" className="pagination-icon" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
