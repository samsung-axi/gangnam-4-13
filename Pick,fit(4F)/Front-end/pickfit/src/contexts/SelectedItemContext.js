import React, { createContext, useState, useContext } from "react";

export const SelectedItemContext = createContext();

export const SelectedItemProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // 선택된 아이템을 추가하는 함수
  const setSelectedItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]); // 기존 값에 새 값을 추가
  };

  // 선택된 아이템을 제거하는 함수
  const removeItems = (itemToRemove) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id) // 해당 아이템을 제외한 나머지 아이템으로 업데이트
    );
  };

  return (
    <SelectedItemContext.Provider value={{ selectedItems, setSelectedItem, removeItems }}>
      {children}
    </SelectedItemContext.Provider>
  );
};
