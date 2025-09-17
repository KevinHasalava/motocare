// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './components/pages/Landing';
import Inventory from './components/pages/Inventory';
import Header from './components/Header'; // Assuming this is a global component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Optional: Place a persistent header here that shows on all pages */}
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/Inventory" element={<Inventory />} />
          {/* Add more routes for other pages here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;