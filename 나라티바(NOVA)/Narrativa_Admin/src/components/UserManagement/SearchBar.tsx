import React, { useState } from "react";
import { Search, X, UserCheck } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white rounded-lg
          border-2 shadow-sm
          ${isFocused 
            ? "border-pointer ring-2 sm:ring-4 ring-blue-50" 
            : "border-pointer hover:border-gray-300"
          }
          transition-all duration-200 ease-in-out`}
      >
        <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
          <UserCheck  className="w-4 h-4 sm:w-5 sm:h-5" />
          <div className="w-px h-4 sm:h-5 bg-gray-200" />
          <Search 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isFocused ? "text-blue-500" : "text-gray-400"
            }`}
          />
        </div>
        <input
          type="text"
          placeholder="회원 검색"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none text-sm sm:text-base font-contents text-gray-700 placeholder-gray-400 bg-transparent"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;