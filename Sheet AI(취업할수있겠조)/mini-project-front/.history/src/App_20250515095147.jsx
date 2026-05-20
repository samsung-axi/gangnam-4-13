import './styles.css';
import { isLoadingAtom } from '@src/config/atom.js';
import MainPage from '@src/pages/MainPage.jsx';
import { useAtom } from 'jotai';
import React from 'react';

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
