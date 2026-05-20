// RecommendationPopup 컴포넌트
import React from "react";
import TryOnButton from "../trymeon/TryOnButton"; // TryOnButton 불러오기
import "../../styles/trymeon/RecommendationPopup.css";

const RecommendationPopup = ({ onClose, recommendedProducts = [] }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <h3>코디 추천 상품</h3>
        <div className="recommended-products">
          {recommendedProducts.map((product, index) => (
            <div key={`${product.name}-${index}`} className={`recommended-product row-${index < 2 ? 'top' : 'bottom'}`}>
              <img
                src={product.images}
                alt={product.name}
                className="recommended-product-image"
              />
              <div className="recommended-product-info">
                <span className="recommended-product-name">{product.name}</span>
                <span className="recommended-product-price">{product.price} 원</span>
                
                {/* Try On 버튼 추가 */}
                <TryOnButton image={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPopup;