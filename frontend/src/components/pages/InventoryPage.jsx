import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StatsCards from '../InventoryCom/StatsCards';
import InventoryTable from '../InventoryCom/InventoryTable';
import AddEditInventoryDialog from '../InventoryCom/AddEditInventoryDialog';
import { getInventoryItems, deleteInventoryItem } from '../../api/inventoryApi';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getInventoryItems();
      setInventory(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddClick = () => {
    setItemToEdit(null);
    setOpenDialog(true);
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        fetchItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item.');
      }
    }
  };

  const stats = useMemo(() => {
    if (!inventory || inventory.length === 0) {
      return { totalItems: 0, lowStockCount: 0, totalInventoryValue: 0 };
    }

    const totalItems = inventory.length;
    const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);

    return { totalItems, lowStockCount, totalInventoryValue };
  }, [inventory]);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Inventory Dashboard
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <StatsCards stats={stats} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add New Item
            </Button>
          </Box>
          <InventoryTable
            inventory={filteredItems}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleSearch={setSearchTerm}
          />
        </>
      )}
      <AddEditInventoryDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        itemToEdit={itemToEdit}
        onSave={fetchItems}
      />
    </Container>
  );
};

export default InventoryPage;