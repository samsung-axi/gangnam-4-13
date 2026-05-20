import React, { type ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'jotai-devtools/styles.css';
import { DevTools as JotaiDevTools } from 'jotai-devtools';
import { createStore, Provider as JotaiProvider } from 'jotai';

interface DevToolsProps {
  children?: ReactNode;
}

const jotaiStore = createStore();
const queryClient: QueryClient = new QueryClient();

const DevTools: React.FC<DevToolsProps> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition='bottom-left' />
        <JotaiProvider store={jotaiStore}>
          <JotaiDevTools />
          {children}
        </JotaiProvider>
      </QueryClientProvider>
    </>
  );
};

export default DevTools;
