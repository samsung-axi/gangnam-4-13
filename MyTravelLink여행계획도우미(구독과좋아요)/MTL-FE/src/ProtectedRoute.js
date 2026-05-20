import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { logOut } from './modules/UserModule';

const ProtectedRoute = ({ element }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    } else if (jwtDecode(token).exp < currentTime) {
      
      setModalOpen(true);

      dispatch(logOut());

      alert('로그인해주세요!');

      navigate('/login');
    } else {
      setModalOpen(false);
    }
  }, [token]);

  const handleClose = () => {
    setModalOpen(false);
    navigate(-1); // 이전 페이지로 이동합니다.
  };

  if (token) {
    return element;
  } else {
    return (
      <>
        {isModalOpen && <LoginModal isOpen={isModalOpen} onClose={handleClose} />}
      </>
    );
  }
};

export default ProtectedRoute;
