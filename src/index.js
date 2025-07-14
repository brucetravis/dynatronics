import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer'
import HeaderOne from './components/common/header/headerone/HeaderOne';
import AuthProvider from './contexts/AuthProvider';
import HeaderRight from './components/common/header/headerright/HeaderRight';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <HeaderOne />
        <Header />
        <HeaderRight />
          <App />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);


