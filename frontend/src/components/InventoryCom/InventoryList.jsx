// src/components/pages/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import InventoryTable from "../InventoryCom/InventoryTable";
import ItemFormModal from "../InventoryCom/ItemFormModal";
import StatsCards from "../InventoryCom/StatsCards";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for add modal
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon for confirmation

const Inventory = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-render of InventoryTable
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // For confirmation alerts

  const handleOpenAddItemModal = () => {
    setItemToEdit(null); // Ensure it's for adding
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToEdit(null); // Clear any item being edited
  };

  const handleSaveItem = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment key to trigger re-fetch in InventoryTable
    setAlertMessage({ type: 'success', message: itemToEdit ? 'Item updated successfully!' : 'Item added successfully!' });
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5001/api/inventory/${id}`);
        setRefreshKey(prevKey => prevKey + 1); // Refresh the table
        setAlertMessage({ type: 'success', message: 'Item deleted successfully!' });
      } catch (error) {
        console.error("Error deleting item:", error);
        setAlertMessage({ type: 'error', message: 'Failed to delete item. Please try again.' });
      }
    }
  };

  // Placeholder for calculated stats. In a real app, you might fetch these separately or derive them from fetched items.
  // For now, InventoryTable will calculate and pass them up (or you'd fetch them from a dedicated API endpoint)
  // For simplicity, we'll assume InventoryTable passes these up in a more advanced version.
  // For this current structure, we will fetch items here to calculate stats.
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchAllItemsForStats = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/inventory");
        setInventoryData(res.data);
      } catch (error) {
        console.error("Error fetching items for stats:", error);
        // Handle error appropriately
      }
    };
    fetchAllItemsForStats();
  }, [refreshKey]); // Re-fetch when the table refreshes

  const totalItems = inventoryData.length;
  const lowStockCount = inventoryData.filter(item => item.quantity <= item.lowStockThreshold).length;
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Service Center Inventory Dashboard
          </Typography>
          {/* Add other navigation links here if needed */}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            📦 Inventory Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage spare parts, view stock levels, and track inventory value.
          </Typography>
        </Box>

        {/* Stats Cards Section */}
        <StatsCards
          totalItems={totalItems}
          lowStockCount={lowStockCount}
          totalInventoryValue={totalInventoryValue}
        />

        {/* Inventory Table and Add Item Button */}
        <InventoryTable
          refreshTrigger={refreshKey}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onOpenAddItemModal={handleOpenAddItemModal}
        />
      </Container>

      {/* Modal for Add/Edit Item */}
      <ItemFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        itemToEdit={itemToEdit}
        onSave={handleSaveItem}
      />

      {/* Global Alert for Success/Error Messages */}
      {alertMessage && (
        <Snackbar open={true} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseAlert} severity={alertMessage.type} sx={{ width: '100%' }}>
            {alertMessage.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Inventory;