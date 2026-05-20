import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import MyCard from './pages/myCard';
import Card from './pages/card';
import SavedMyCard from './pages/savedMyCard';
import Guide from './pages/guide';
import RandomCard from './pages/randomCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mycard" element={<MyCard />} />
        <Route path="/card" element={<Card />} />
        <Route path="/savedMyCard" element={<SavedMyCard/>} />
        <Route path="/guide" element={<Guide/>} />
        <Route path="/randomCard" element={<RandomCard/>}/>
      </Routes>
    </Router>
  );
}

export default App; 