import '@src/styles.css';
import React from 'react';

const Header = () => {
  return (
    <div className="header bg-white shadow-sm p-4">
      <div className="flex items-center">
        <img src="/logo.png" alt="logo" className="logo h-10 mr-3" />
        <h1 className="title text-xl font-bold text-gray-800">여권의 정석</h1>
      </div>
    </div>
  );
};

export default Header;
