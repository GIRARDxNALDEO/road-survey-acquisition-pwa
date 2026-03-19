import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'vite-plugin-pwa/register';
import { AppRouter } from './app/router';
import { AppStateProvider } from './app/store';
import './styles/global.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AppStateProvider>
        <AppRouter />
      </AppStateProvider>
    </HashRouter>
  </React.StrictMode>
);
