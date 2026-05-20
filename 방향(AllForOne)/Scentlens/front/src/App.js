import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Main from './page/Main';
import ScentLens from './page/Scentlens';


function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='scentlens' element={<ScentLens/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
