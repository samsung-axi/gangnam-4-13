import './styles.css';
import { isLoadingAtom } from '@src/config/atom.js';
import MainPage from '@src/pages/MainPage.jsx';
import { useAtom } from 'jotai';
import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1 className="title">사진의 정석</h1>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useAtom(isLoadingAtom);
  return (
    <>
      {<MainPage />}
      {/* {loading && <LoadingComponent />} */}
      {/* <WhiteLoadingComponent /> */}
    </>
  );
}

export default App;
