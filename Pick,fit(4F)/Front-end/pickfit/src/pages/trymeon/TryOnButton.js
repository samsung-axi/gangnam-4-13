// components/TryOnButton.js

import React, { useState, useContext } from "react";
import { SelectedItemContext } from "../../contexts/SelectedItemContext";
import checkWhiteIcon from "../../images/check_white.png";

const TryOnButton = ({ image }) => {
  const [isTriedOn, setIsTriedOn] = useState(false);
  const { setSelectedItem } = useContext(SelectedItemContext);

  const handleTryOnClick = () => {
    console.log("Try On Clicked:");
    console.log({
      id: image.id,      // 상품 ID
      src: image.src,    // 상품 이미지 URL
      bigCategory: image.bigCategory, // 상품 대분류
    });

    // 선택된 데이터를 context에 저장
    setSelectedItem({
      id: image.id,
      name: image.name,
      src: image.src,
      price: image.price,
      bigCategory: image.bigCategory,
    });

    // Try On 상태 변경
    setIsTriedOn(true);
  };

  return (
    <div className="tryon-button" onClick={handleTryOnClick}>
      {isTriedOn ? (
        <img
          src={checkWhiteIcon}
          alt="Checked Icon"
          className="check-icon"
        />
      ) : (
        "Try On"
      )}
    </div>
  );
};

export default TryOnButton;
