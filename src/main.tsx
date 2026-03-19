import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'vite-plugin-pwa/register';
import { AppRouter } from './app/router';
import { AppStateProvider } from './app/store';
import './styles/global.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppStateProvider>
        <AppRouter />
      </AppStateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
