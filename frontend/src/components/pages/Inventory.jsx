import React, { useState } from "react";
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar, Button } from "@mui/material";
import InventoryFormModal from "../InventoryCom/InventoryFormModal"; // This should be correct if InventoryCom is a sibling to pages // Renamed from InventoryForm
import InventoryTable from "../InventoryCom/InventoryTable.jsx";       // Renamed from InventoryList
import StatsCards from "../InventoryCom/StatsCards.jsx";
import AddIcon from '@mui/icons-material/Add';

const Inventory = () => {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', or 'restock'
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({ totalItems: 0, lowStockCount: 0, totalValue: 0 });

  const handleOpenModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleAddOrUpdate = () => {
    setRefresh(!refresh); // Trigger a refresh of the table and stats
  };

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
            Manage spare parts, categories, and stock levels.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Inventory List and Add Button */}
        <Box sx={{ mt: 5, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal('add')}
            sx={{ borderRadius: 2 }}
          >
            Add New Item
          </Button>
        </Box>

        <Box>
          <InventoryTable
            refresh={refresh}
            onEditItemDetails={(item) => handleOpenModal('edit', item)} // Callback for editing item details
            onRestockItem={(item) => handleOpenModal('restock', item)}  // Callback for restocking
            setStats={setStats}
          />
        </Box>
      </Container>
      
      {/* Add/Edit/Restock Modal */}
      <InventoryFormModal
        open={modalOpen}
        handleClose={handleCloseModal}
        onAddOrUpdate={handleAddOrUpdate}
        selectedItem={selectedItem}
        mode={modalMode} // Pass the current mode ('add', 'edit', 'restock')
      />
    </>
  );
};

export default Inventory;