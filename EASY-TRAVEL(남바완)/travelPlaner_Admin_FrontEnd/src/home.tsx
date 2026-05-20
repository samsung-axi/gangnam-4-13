// src/pages/home.tsx
import React from 'react';
import {  useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <main>
      <section className="banner">
        <h1>관리자 페이지</h1>
        <p>관리자페이지 입니다</p>
        <p>docker 테스트!!!!</p>
      </section>
    </main>
  );
};

export default Home;
