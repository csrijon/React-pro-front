import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider, SettingsProvider, ToastProvider } from './lib/hooks.jsx';
import { ConfirmProvider } from './components/ui.jsx';
import { AuthModalProvider } from './components/AuthModal.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <ConfirmProvider>
              <AuthModalProvider>
                <App />
              </AuthModalProvider>
            </ConfirmProvider>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
