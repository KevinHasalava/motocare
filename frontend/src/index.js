import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import Header from './components/Header';
import Landing from './components/pages/Landing';
import reportWebVitals from './reportWebVitals';
import Inventory from './components/pages/Inventory.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Header" element={<Header />} />
      <Route path="/home" element={<Landing/>} />
      <Route path="/Inventory" element={<Inventory/>} />   {/* ✅ Now loads Inventory Dashboard */}
    </Routes>
  </BrowserRouter> 
);

reportWebVitals();
