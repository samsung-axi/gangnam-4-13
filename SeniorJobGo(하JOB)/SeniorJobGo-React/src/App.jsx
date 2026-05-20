import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@assets/styles/reset.css';

// 페이지 컴포넌트
// import IntroPage from '@pages/index'
import Intro from '@pages/index';
import Signin from '@pages/auth/signin';
import Signup from '@pages/auth/signup';
import SignupWithId from '@pages/auth/signup/components/SignupWithId'; // 추가
// import Main from '@pages/main';
import Chat from '@pages/chat';
import FindAccount from '@pages/auth/find';

// 전역 스타일
// import '@assets/styles/main.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Intro />}></Route>
        <Route path='/signin' element={<Signin />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/signup/id' element={<SignupWithId />}></Route>
        <Route path='/find-account' element={<FindAccount />}></Route>
        {/* <Route path='/main' element={<Main />}></Route> */}
        <Route path='/chat' element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App