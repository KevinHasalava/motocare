// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// Import other pages/components you might have
import Landing from './components/pages/Landing';
import Inventory from './components/pages/Inventory'; // Your Inventory Dashboard
import Header from './components/Header'; // If you have a global header

function App() {
  return (
    <Router>
      <div className="App">
        {/* You might want a persistent Header/Navbar here if it spans across routes */}
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Landing />} /> {/* Or your main landing page */}
          <Route path="/home" element={<Landing />} /> {/* Assuming /home also goes to Landing */}
          <Route path="/Inventory" element={<Inventory />} /> {/* Your Inventory Dashboard */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;