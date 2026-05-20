import React from 'react';
import '../../styles/trymeon/CategoryFilter.css';

const removeExtension = (subcategory) => {
  return subcategory.replace('.json', '');
};

const CategoryFilter = ({ 
  selectedCategory, 
  selectedSubcategory, 
  availableSubcategories, // 하위 카테고리 목록
  onCategorySelect, 
  onResetFilters, 
  onSubcategorySelect 
}) => {
  return (
    <div className="category-filter-section">
      <div className="main-categories">
        <button 
          className={!selectedCategory ? 'active' : ''} 
          onClick={onResetFilters}
        >
          ALL
        </button>
        <button 
          className={selectedCategory === '남자' ? 'active' : ''} 
          onClick={() => onCategorySelect('남자')}
        >
          Man
        </button>
        <button 
          className={selectedCategory === '여자' ? 'active' : ''} 
          onClick={() => onCategorySelect('여자')}
        >
          Woman
        </button>
      </div>
      {selectedCategory && (
        <div className="subcategories">
          {availableSubcategories.map((subcategory) => (
            <button 
              key={subcategory} 
              className={selectedSubcategory === subcategory ? 'active' : ''} 
              onClick={() => onSubcategorySelect(subcategory)}
            >
              {removeExtension(subcategory)} {/* 확장자를 제거하고 표시 */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;