import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { SocketProvider } from './contexts/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);
