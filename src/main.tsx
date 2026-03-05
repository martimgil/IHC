import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Atualizar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App pronto para uso offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
