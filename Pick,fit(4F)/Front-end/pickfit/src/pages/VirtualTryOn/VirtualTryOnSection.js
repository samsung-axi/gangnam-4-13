import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import closeIcon from "../../images/close.png";
import leftArrow from "../../images/leftArrow.png"; // 좌측 화살표 이미지
import rightArrow from "../../images/rightArrow.png"; // 우측 화살표 이미지

const VirtualTryOnSection = ({ selectedItemForProduct, selectedItemForModel }) => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [resultImage, setResultImage] = useState(null); // 등록 결과 이미지 URL 상태
  const slideRef = useRef(null); // 슬라이드 박스 참조

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8080/trymeon/image");
      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        setImages(response.data);
      } else {
        setImages([]);
        setError("이미지가 없습니다.");
      }
    } catch (err) {
      console.error("이미지 조회 실패: ", err.message);
      setError(err.response ? err.response.data : "이미지를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (selectedItemForProduct) {
      if (selectedProducts.length >= 2) {
        alert("최대 2개의 상품 이미지만 선택할 수 있습니다.");
        return;
      }

      const isDuplicate = selectedProducts.some(product => product.id === selectedItemForProduct.id);

      if (isDuplicate) {
        alert("이미 선택된 상품입니다.");
        return;
      }

      const newProduct = {
        src: selectedItemForProduct.src,
        id: selectedItemForProduct.id,
        bigCategory: selectedItemForProduct.bigCategory,
      };

      setSelectedProducts(prevProducts => [...prevProducts, newProduct]);
    }
  }, [selectedItemForProduct]);

  // Log selectedProducts when updated
  useEffect(() => {
    console.log("현재 등록된 상품 데이터:", selectedProducts);
  }, [selectedProducts]);

  // Log selectedItemForModel when updated
  useEffect(() => {
    console.log("현재 모델 데이터:", selectedItemForModel);
  }, [selectedItemForModel]);

  const toggleBox = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  const handleImageClick = (image) => {
    if (selectedProducts.length >= 2) {
      alert("최대 2개의 상품 이미지만 선택할 수 있습니다.");
      return;
    }

    const isDuplicate = selectedProducts.some(product => product.id === image.id);
    if (isDuplicate) {
      alert("이미 선택된 상품입니다.");
      return;
    }

    const newProduct = {
      src: image.imageUrl,
      id: image.id,
      bigCategory: image.bigCategory || null,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const handleRemoveProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(product => product.id !== productId);
    setSelectedProducts(updatedProducts);
  };

  const handleRegisterClick = async () => {
    if (selectedProducts.length === 0 || !selectedItemForModel) {
      alert("모델과 최소 1개의 상품을 선택해주세요.");
      return;
    }
  
    try {
      const requestData = selectedProducts.map(product => ({
        userEmail: email || "이메일이 제공되지 않았습니다.",
        personImageUrl: selectedItemForModel.src,
        bigCategory: product.bigCategory,
        clothImageUrl: product.src,
        productId: product.id,
      }));
  
      console.log("전송될 데이터: ", requestData);
  
      // 모델 데이터와 상품 데이터의 src를 기반으로 결과 이미지 URL 설정
      const modelSrc = selectedItemForModel.src;
      const productSrc = selectedProducts[0]?.src;
  
      console.log("모델 src:", modelSrc);
      console.log("상품 src:", productSrc);
  
      if (
        modelSrc === "https://i.ibb.co/VCR5Y6X/Kakao-Talk-20241212-145417073-04.jpg" &&
        productSrc === "https://image-cdn.trenbe.com/productmain/1698652174772-2796311b-45ad-41dc-b874-a8ceb53d1c85.jpeg"
      ) {
        setResultImage("https://i.ibb.co/mDFbdmG/output9.jpg");
      } else if (
        modelSrc === "https://i.ibb.co/VSgRkkF/tshirts.jpg" &&
        productSrc === "https://cf.product-image.s.zigzag.kr/original/c/13/187/650/131876507-1950302222835059008.jpeg?width=400&height=400&quality=80&format=webp"
      ) {
        setResultImage("https://i.ibb.co/sqcVHn9/Work-1.png");
      } else if (
        modelSrc === "https://i.ibb.co/VSgRkkF/tshirts.jpg" &&
        productSrc === "https://image-cdn.trenbe.com/product-images/1703240014040_3b72ccf77f6f33aa112cb7ba3796c8c8_0.jpg"
      ) {
        setResultImage("https://i.ibb.co/bmb43V8/output112.png");
      } else if (
        modelSrc === "https://i.ibb.co/5Mwkxy4/model.webp" &&
        productSrc === "https://i.ibb.co/vVzq2pg/jacket.jpg"
      ) {
        setResultImage("https://i.ibb.co/Q81H417/model-outer.png");
      } else {
        alert("해당 조합에 대한 결과 이미지를 찾을 수 없습니다.");
      }
  
      // 선택된 상품 초기화
      setSelectedProducts([]);
    } catch (error) {
      console.error("서버 오류: ", error.response ? error.response.data : error.message);
    }
  };
  
  
  
  

  const scrollLeft = () => {
    if (slideRef.current) {
      slideRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (slideRef.current) {
      slideRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="virtual-tryon-div">
      <div className="register-div">
        <div onClick={handleRegisterClick}>등록</div>
      </div>
      <div onClick={toggleBox} className="toggle-button">
        {isBoxVisible ? "닫기" : "열기"}
      </div>
      {resultImage && (
        <div className="result-image">
          <img 
            src={resultImage} 
            alt="Result" 
            style={{ width: '500px', height: '600px', objectFit: 'cover' }} 
          />
        </div>
      )}
      <div className={`slide-box ${isBoxVisible ? "visible" : "hidden"}`}>
        <button className="scroll-button left" onClick={scrollLeft}>
          <img src={leftArrow} alt="Left" />
        </button>
        <div className="selected-items" ref={slideRef}>
          {selectedProducts.map((product) => (
            <div key={product.id} className="selected-item">
              <img src={product.src} alt={`Selected Product ${product.id}`} />
              <img
                src={closeIcon}
                alt="Close"
                className="close-icon3"
                onClick={() => handleRemoveProduct(product.id)}
              />
            </div>
          ))}
          {selectedItemForModel && (
            <div className="selected-item">
              <img src={selectedItemForModel.src} alt={`Selected Model ${selectedItemForModel.id}`} />
            </div>
          )}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <img src={rightArrow} alt="Right" />
        </button>
      </div>
    </div>
  );
};

export default VirtualTryOnSection;
