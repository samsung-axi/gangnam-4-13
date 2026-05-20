import '@src/styles.css';
import Header from '@src/components/layout/Header.jsx';
import { isLoadingAtom } from '@src/config/atom.js';
import MainPage from '@src/pages/MainPage.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import React from 'react';

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useAtom(isLoadingAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <MainPage />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
