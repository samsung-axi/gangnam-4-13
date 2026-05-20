import React, { useState, useContext, useEffect } from "react";
import { SelectedItemContext } from "../../contexts/SelectedItemContext";
import VirtualTryOnSection from "./VirtualTryOnSection";
import ClothingItemsSection from "./ClothingItemsSection";

const VirtualFittingApp = () => {
  const [selectedItemForProduct, setSelectedItemForProduct] = useState(null); // 상품 선택 상태
  const [selectedItemForModel, setSelectedItemForModel] = useState(null); // 모델 선택 상태
  const { selectedItems, removeItems } = useContext(SelectedItemContext);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    console.log("Selected Items Updated: ", selectedItems);
  }, [selectedItems]);

  const goToNextPage = () => {
    if ((currentPage + 1) * 2 < selectedItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const removeSelectedItem = (itemId) => {
    console.log("Removing item with ID:", itemId);
    removeItems({ id: itemId });
  };

  return (
    <div className="virtual-fitting-app">
      <main>
        <VirtualTryOnSection
          selectedItemForProduct={selectedItemForProduct}
          selectedItemForModel={selectedItemForModel}
        />
        <ClothingItemsSection
          selectedItems={selectedItems}
          goToPrevPage={goToPrevPage}
          goToNextPage={goToNextPage}
          removeSelectedItem={removeSelectedItem}
          currentPage={currentPage}
          setSelectedItemForProduct={setSelectedItemForProduct} // 상품 선택 상태 전달
          setSelectedItemForModel={setSelectedItemForModel} // 모델 선택 상태 전달
        />
      </main>

      <footer>
        <p>© 2024 Pickfit. 매일의 스타일을 완성하는 곳, 당신의 취향을 반영한 패션을 제안합니다. 세상에 하나뿐인 나만의 스타일을 경험하세요.</p>
      </footer>
    </div>
  );
};

export default VirtualFittingApp;
