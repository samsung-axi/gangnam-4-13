import '@src/styles.css';
import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="title">사진의 정석</h1>
    </div>
  );
};

export default Header;
