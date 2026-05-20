import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import DevTools from '@/shared/components/DevTools.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DevTools>
        <App />
      </DevTools>
    </BrowserRouter>
  </StrictMode>
);
