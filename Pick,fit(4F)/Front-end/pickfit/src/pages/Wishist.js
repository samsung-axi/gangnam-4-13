import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Wishlist.css';
import wishlistIcon from '../images/wishlist2.png';
import closeIcon from '../images/close.png';

const API_URL = process.env.REACT_APP_API_URL;

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]); // 위시리스트 상태

  // 위시리스트 데이터를 가져오는 함수
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const response = await axios.get(`${API_URL}/api/wishlist/${userEmail}`);
          const data = response?.data?.data || [];
          setWishlistItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist items:', error.message);
      }
    };

    fetchWishlist();
  }, []);

  // 위시리스트에서 항목 삭제 함수
  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await axios.delete(`${API_URL}/api/wishlist/${itemId}`, {
          params: { userEmail },
        });
        // 삭제 후 위시리스트 업데이트
        setWishlistItems((prevItems) => prevItems.filter((item) => item.productId !== itemId));
      }
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1>Wishlist</h1>
      </div>
      <div className="divider"></div>
      <div className="body">
        {wishlistItems.length === 0 ? (
          <div className="icon-with-text">
            <img className="icon" src={wishlistIcon} alt="Wishlist Icon" />
            <p className="no-items-text">
              Wishlist에 등록된 상품이 없습니다. <br />
              Pick, Fit에서 다양한 상품들을 등록해보세요.
            </p>
          </div>
        ) : (
          <div className="wishlist-products">
            {wishlistItems.map((item) => (
              <div key={item.productId} className="wishlist-item">
                <img src={item.imageUrl} alt={item.title} className="wishlist-image" />
                <div className="wishlist-details">
                  <p className="wishlist-title">{item.title}</p>
                  <p className="wishlist-price">{item.price} 원</p>
                </div>
                <img
                  src={closeIcon}
                  alt="Remove"
                  className="remove-icon"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;