import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import './App.css';
import InventoryPage from './components/InventoryCom/InventoryPage';
import SupplierPage from './components/InventoryCom/SupplierPage';
import StockPage from './components/InventoryCom/StockPage';
import Landing from './components/pages/Landing';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MotoCare Inventory
            </Typography>
            {/* <Button color="inherit" component={Link} to="/">Home</Button> */}
            <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
            <Button color="inherit" component={Link} to="/suppliers">Suppliers</Button>
            <Button color="inherit" component={Link} to="/stock">Stock</Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/suppliers" element={<SupplierPage />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>
    </Router>
  );
}

export default App;