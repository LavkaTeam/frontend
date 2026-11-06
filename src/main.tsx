// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

import { App } from './App.tsx';

import './index.css';
import { isDemoMode } from './features/demo/config';

const queryClient = new QueryClient();

const render = () =>
  createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>,
    // </StrictMode>,
  );

// The demo deployment sets up its API handling before the first request.
const bootstrap = async () => {
  if (isDemoMode) {
    const { initDemo } = await import('./features/demo/init');
    await initDemo();
  }

  render();
};

void bootstrap();
