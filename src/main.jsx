import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppContext.jsx';

const AppWithProviders = () => {
  const { user } = useAuth();
  return (
    <AppProvider key={user ? user.id : 'logged-out'}>
      <App />
    </AppProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppWithProviders />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);