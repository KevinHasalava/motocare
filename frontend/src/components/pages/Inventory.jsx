import React, { useState } from "react";
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar } from "@mui/material";
import InventoryForm from "../InventoryCom/InventoryForm.jsx";
import InventoryList from "../InventoryCom/InventoryList.jsx";

const Inventory = () => {
  const [refresh, setRefresh] = useState(false);

  const handleAdd = () => setRefresh(!refresh);

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Service Center Inventory Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            📦 Inventory Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage spare parts, categories, and low stock alerts
          </Typography>
        </Box>

        {/* Inventory Form */}
        <Box sx={{ mb: 5 }}>
          <InventoryForm onAdd={handleAdd} />
        </Box>

        {/* Inventory List */}
        <Box>
          <InventoryList refresh={refresh} />
        </Box>
      </Container>
    </>
  );
};

export default Inventory;
