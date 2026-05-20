import React from "react";
import '../assets/css/header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <h1 className="header-title">
        <span onClick={() => navigate('/')}>시니어JobGo</span>
      </h1>
    </div>
  );
};

export default Header;