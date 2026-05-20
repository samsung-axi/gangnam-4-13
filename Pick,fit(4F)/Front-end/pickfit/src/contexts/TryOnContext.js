// src/contexts/TryOnContext.js
import React, { createContext, useState, useContext } from 'react';

const TryOnContext = createContext();

export const useTryOn = () => useContext(TryOnContext);

export const TryOnProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const setImageForTryOn = (image) => {
    setSelectedImage(image);
  };

  return (
    <TryOnContext.Provider value={{ selectedImage, setImageForTryOn }}>
      {children}
    </TryOnContext.Provider>
  );
};
