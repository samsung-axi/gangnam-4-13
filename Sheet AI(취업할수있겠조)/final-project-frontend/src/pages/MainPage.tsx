import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { devLog } from '@/shared/util/logger';
import Header from '../shared/components/Header';
import FinancialInputModal from '../features/finanacial-form/components/FinancialInputModal.tsx';

import api from "@/shared/config/axios";
import { useAuthState } from '@/shared/hooks/useAuthState'; 
import Footer from '@/shared/components/Footer';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  const { login } = useAuthState(); 

  const fullLine1 = '데이터를 읽고, 신뢰를 만든다.';
  const fullLine2 = 'AI 신용분석의 새로운 기준,';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      console.log('[OAuth2] 받은 JWT:', token);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      login(); 
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const saved = localStorage.getItem('token');
      if (saved) {
        api.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
        login(); 
      }
    }
  }, []);

  useEffect(() => {
    let index1 = 0;
    let index2 = 0;

    const typing1 = setInterval(() => {
      setLine1(fullLine1.slice(0, index1 + 1));
      index1++;
      if (index1 === fullLine1.length) {
        clearInterval(typing1);
        const typing2 = setInterval(() => {
          setLine2(fullLine2.slice(0, index2 + 1));
          index2++;
          if (index2 === fullLine2.length) {
            clearInterval(typing2);
          }
        }, 50);
      }
    }, 50);

    return () => {
      clearInterval(typing1);
    };
  }, []);

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed === '') {
      return;
    }
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleDirectInput = () => {
    setIsModalOpen(true);
  };

  const handleBack = () => {
    devLog('뒤로가기 버튼 클릭됨');
    navigate(-1);
  };

  return (
    <div
      className='flex flex-col min-h-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage:
          "url('https://spp.cmu.ac.th/wp-content/uploads/2020/06/smart-city-01-scaled.jpg')",
      }}
    >
      <Header onBack={handleBack} transparent />
      <FinancialInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-grow relative">
        <div className='absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-10'>
          <div
            className='text-white font-bold text-center leading-snug'
            style={{
              fontSize: '46px',
              textShadow: '2px 2px 4px rgba(0, 68, 128, 0.6)'
            }}
          >
            {line1}
            <br />
            <span
              style={{
                textShadow: '2px 2px 4px rgba(0, 68, 128, 0.6)'
              }}
            >
              {line2}
            </span>{" "}
            <span
              style={{
                color: '#010440',
                fontWeight: 'bold',
                fontSize: '60px'
              }}
            >
              SheetAI
            </span>
          </div>

          <div className='flex flex-row items-center space-x-4 flex-nowrap bg-white/80 p-4 rounded-xl shadow-lg backdrop-blur-sm'>
            <input
              type='text'
              placeholder='(예) 삼성전자 분석해줘'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className='border border-blue-500 rounded px-6 h-14 w-[500px] text-xl placeholder-blue-300'
            />

            <button
              onClick={handleSearch}
              className='bg-white w-14 h-14 rounded flex items-center justify-center border border-blue-300 shadow hover:bg-blue-100 transition'
            >
              <img
                src='https://cdn-icons-png.flaticon.com/512/17320/17320840.png'
                alt='검색 아이콘'
                className='mt-2 ml-1 w-9 h-9'
              />
            </button>

            <button
              onClick={handleDirectInput}
              className='bg-blue-600 text-white text-lg w-[120px] h-14 rounded whitespace-nowrap'
            >
              직접입력
            </button>
          </div>
        </div>
      </main>

      <Footer variant="transparent-black" />
    </div>
  );
};

export default MainPage;
