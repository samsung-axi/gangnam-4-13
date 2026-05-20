import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.js';
import Main from './pages/main.jsx';
import Card from './pages/card.jsx';
import Mycard from './pages/myCard.jsx';
import SavedMyCard from './pages/savedMyCard.jsx';
import Guide from './pages/guide.jsx';
import RandomCard from './pages/randomCard.jsx';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/card' element={<Card />} />
        <Route path='/mycard' element={<Mycard />} />
        <Route path='/savedMyCard' element={<SavedMyCard />} />
        <Route path='/guide' element={<Guide />} />
        <Route path='/randomCard' element={<RandomCard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
