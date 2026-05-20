// Product 컴포넌트
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTryOn } from "../../contexts/TryOnContext";
import "../../styles/trymeon/Product.css";
import wishlistRed from "../../images/wishlist_rad.png";
import whishlistBlack from "../../images/wishlist_black.png";
import checkWhiteIcon from "../../images/check_white.png";
import RecommendationPopup from "./RecommendationPopup";
import { SelectedItemContext } from "../../contexts/SelectedItemContext";
import "../../styles/trymeon/TryOnButton.css";

// JSON 데이터 임포트
import blazerSuitData from "../../stylistJson/man/annotated_category_processed_Blazer_Suit.json";
import coatData from "../../stylistJson/man/annotated_category_processed_Coat.json";
// 필요한 다른 JSON 파일들도 동일한 방식으로 임포트

const Product = ({ images = [], removingItems = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clickedIcons, setClickedIcons] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const { setImageForTryOn } = useTryOn();
  const [isTriedOn, setIsTriedOn] = useState({});
  const navigate = useNavigate();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [user, setUser] = useState({ email: "", name: "" });
  const [wishlist, setWishlist] = useState([]);
  const { setSelectedItem } = useContext(SelectedItemContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    setUser({
      email: storedEmail || "",
      name: storedName || "",
    });
  }, []);

  const handleTryOnClick = (image) => {
    setSelectedItem({
      id: image.id,
      name: image.name,
      src: image.src,
      price: image.price,
      bigCategory: image.bigCategory,
    });

    setIsTriedOn((prevState) => ({
      ...prevState,
      [image.id]: true,
    }));
  };

  const getRecommendationsByCategory = (name) => {
    const data = blazerSuitData; // 현재는 blazerSuitData만 사용. 추가 JSON 데이터가 필요한 경우 확장 가능

    // name 기준으로 추천 데이터 찾기
    const matchedItem = data.find((item) => item.product_info.title === name);
    if (matchedItem) {
      console.log("매칭된 데이터 발견:", matchedItem);
      return matchedItem.recommendations;
    } else {
      console.error("Name not found in JSON data:", name);
      return { tops: [], bottoms: [] };
    }
  };

  const handlePopupOpen = (image) => {
    console.log("코디 추천 클릭 - 선택된 이미지 데이터:", image);
    try {
      console.log("추천 상품을 가져오는 중:", image.name);
      const recommendations = getRecommendationsByCategory(image.name);
      console.log("추천 상품 로드 완료:", recommendations);

      const formattedRecommendations = [
        ...recommendations.tops.slice(0, 2).map((item) => ({
          ...item,
          type: "top",
        })),
        ...recommendations.bottoms.slice(0, 2).map((item) => ({
          ...item,
          type: "bottom",
        })),
      ];

      setRecommendedProducts(formattedRecommendations);
      setShowPopup(true);
      console.log("추천 팝업 열림. 추천 상품 목록:", formattedRecommendations);
    } catch (error) {
      console.error("추천 상품을 처리하는 데 실패했습니다:", error.message);
    }
  };

  const handleWishlistClick = async (e, image) => {
    e.stopPropagation();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const isCurrentlyRed = clickedIcons[image.id] || false;

      if (isCurrentlyRed) {
        console.log("위시리스트에서 제거 중:", image.id);
        setClickedIcons((prev) => {
          const updatedIcons = { ...prev };
          delete updatedIcons[image.id];
          return updatedIcons;
        });

        setWishlist((prev) => {
          return prev.filter((item) => item.productId !== image.id);
        });
      } else {
        console.log("위시리스트에 추가 중:", image.id);
        setClickedIcons((prev) => {
          return { ...prev, [image.id]: true };
        });

        setWishlist((prev) => {
          return [...prev, { productId: image.id, ...image }];
        });
      }
    } catch (error) {
      console.error("위시리스트 작업 중 오류 발생:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlazerSuitDataCheck = () => {
    console.log("블레이저 JSON 데이터:", blazerSuitData);
  };

  const handleCoatDataCheck = () => {
    console.log("코트 JSON 데이터:", coatData);
  };

  return (
    <div className="product-gallery">
      {images.map((image) => (
        <div
          key={image.id}
          className={`image-box ${
            removingItems.includes(image.id) ? "removing" : ""
          }`}
        >
          <div
            className="recommendation-tag"
            onClick={() => handlePopupOpen(image)}
          >
            <div
              className="circle"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <span className="recommendation-text">
                {hoveredImage === image.id ? (
                  "클릭!"
                ) : (
                  <>
                    <p className="recommendation-part">코디</p>
                    <p className="recommendation-part">추천</p>
                  </>
                )}
              </span>
            </div>
          </div>

          <img src={image.src} alt={image.name} className="product-image" />
          <div className="image-footer">
            <div className="image-info">
              <span className="image-title" title={image.name}>
                {image.name}
              </span>
              <span className="image-price">{image.price} 원</span>
            </div>
            <div
              className="tryon-button"
              onClick={() => handleTryOnClick(image)}
            >
              {isTriedOn[image.id] ? (
                <img
                  src={checkWhiteIcon}
                  alt="Checked Icon"
                  className="check-icon"
                />
              ) : (
                "입어보기"
              )}
            </div>
          </div>
          <div
            className={`wishlist-icon ${
              clickedIcons[image.id] ? "clicked" : ""
            }`}
            onClick={(e) => handleWishlistClick(e, image)}
          >
            <img
              src={clickedIcons[image.id] ? wishlistRed : whishlistBlack}
              alt="Wishlist Icon"
            />
          </div>
        </div>
      ))}

      {showPopup && (
        <RecommendationPopup
          onClose={() => setShowPopup(false)}
          recommendedProducts={recommendedProducts}
        />
      )}
    </div>
  );
};

export default Product;
