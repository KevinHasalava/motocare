// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'; // BrowserRouter is fine here too
import './index.css';
import App from './App';
import Header from './components/Header'; // Keep if you use it
import Landing from './components/pages/Landing';
import Inventory from './components/pages/Inventory.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* Or <Router> if you prefer */}
    <Routes>
      <Route path="/" element={<App />} /> {/* This will render App, which itself contains routing */}
      {/* If App.js is just a wrapper, you might map routes here directly */}
      {/* Example: If App.js is empty and only used for routing setup */}
      {/* <Route path="/" element={<Landing />} /> */}
      {/* <Route path="/home" element={<Landing />} /> */}
      {/* <Route path="/Inventory" element={<Inventory />} /> */}

      {/* Based on your current App.js, this structure is also fine */}
      <Route path="/Header" element={<Header />} />
      <Route path="/home" element={<Landing/>} />
      <Route path="/Inventory" element={<Inventory/>} />
    </Routes>
  </BrowserRouter>
);