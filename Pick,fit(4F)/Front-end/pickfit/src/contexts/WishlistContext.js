import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// 컨텍스트 생성
export const WishlistContext = createContext();

// 컨텍스트 프로바이더
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState({ email: '' });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUser({ email });
    }
  }, []);

  const loadWishlist = async () => {
    try {
      if (!user.email) {
        console.error('User email not found');
        return;
      }

      const response = await axios.get(`${API_URL}/api/wishlist/${user.email}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to load wishlist', error.message);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loadWishlist, user }}>
      {children}
    </WishlistContext.Provider>
  );
};
