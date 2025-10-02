import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, IconButton,
  createTheme, ThemeProvider, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Import Warning Icon
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon for Snackbar
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Local Component Imports
import StatsCards from './StatsCards';
import InventoryTable from './InventoryTable';
import AddEditInventoryDialog from './AddEditInventoryDialog';
import CreatePurchaseRequestDialog from './CreatePurchaseRequestDialog';

// API Imports
import { getInventoryItems, deleteInventoryItem } from '../../api/inventoryApi';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog States
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false); // Renamed from openDialog
  const [itemToEdit, setItemToEdit] = useState(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [lowStockRequestItems, setLowStockRequestItems] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('light');
  const [snackbarMessage, setSnackbarMessage] = useState({ open: false, message: '', severity: 'success' });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Palette for light mode
                background: { default: '#f5f5f5', paper: '#fff' },
                warning: { // Added Warning color for the button
                    main: '#ff9800',
                    light: '#ffb74d',
                }
              }
            : {
                // Palette for dark mode
                background: { default: '#121212', paper: '#1d1d1d' },
                warning: { // Warning color for dark mode (can be same or adjusted)
                    main: '#ffb74d',
                    light: '#ffb74d',
                }
              }),
        },
      }),
    [mode]
  );

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

  useEffect(() => { fetchItems(); }, []);

  // Updated to use setOpenAddEditDialog
  const handleAddClick = () => {
    setItemToEdit(null);
    setOpenAddEditDialog(true);
  };

  // Updated to use setOpenAddEditDialog
  const handleEditClick = (item) => {
    setItemToEdit(item);
    setOpenAddEditDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        fetchItems();
        setSnackbarMessage({ open: true, message: 'Item deleted successfully.', severity: 'success' });
      } catch (err) {
        setSnackbarMessage({ open: true, message: err.response?.data?.message || 'Failed to delete item.', severity: 'error' });
      }
    }
  };

  const stats = useMemo(() => {
    if (!inventory || inventory.length === 0) {
      return { totalItems: 0, lowStockCount: 0, totalInventoryValue: 0 };
    }
    const totalItems = inventory.length;
    const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.buyingPrice || 0)), 0);
    // Passing the raw number to prevent .toFixed() errors in child components
    return { totalItems, lowStockCount, totalInventoryValue }; 
  }, [inventory]);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');

  const handleLowStockRequest = () => {
    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
    if (lowStockItems.length === 0) {
      setSnackbarMessage({ open: true, message: 'No low stock items available to create a request.', severity: 'info' });
      return;
    }
    setLowStockRequestItems(lowStockItems); // Prefill dialog
    setOpenRequestDialog(true);
  };

  const handleRequestSuccess = (message) => {
    setSnackbarMessage({ open: true, message, severity: 'success' });
    fetchItems();
    setOpenRequestDialog(false); // Close dialog on success
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarMessage({ ...snackbarMessage, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, color: 'text.primary' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Inventory Dashboard</Typography>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {/* NOTE: If StatsCards expects a formatted string for totalInventoryValue, 
                  you must format it before passing it, e.g., totalInventoryValue.toFixed(2) 
                  or handle formatting inside StatsCards component. */}
              <StatsCards stats={stats} />

              {/* Action Buttons: Positioned to the right and styled */}
              <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', // Aligns buttons to the right
                  gap: 2, // Space between buttons
                  mb: 2, 
                  mt: 4 
              }}>
                <Button
                    variant="contained"
                    color="warning" // Uses the warning palette color
                    startIcon={<WarningAmberIcon />}
                    onClick={handleLowStockRequest}
                    disabled={stats.lowStockCount === 0} // Disable if no low stock items
                >
                    Request Low Stock Items ({stats.lowStockCount})
                </Button>
                
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

          {/* Add/Edit Inventory Dialog */}
          <AddEditInventoryDialog
            open={openAddEditDialog} // Updated state name
            handleClose={() => setOpenAddEditDialog(false)}
            itemToEdit={itemToEdit}
            onSave={() => {
                setOpenAddEditDialog(false);
                fetchItems();
            }}
          />

          {/* Create Purchase Request Dialog */}
          <CreatePurchaseRequestDialog
            open={openRequestDialog}
            handleClose={() => setOpenRequestDialog(false)}
            onSaveSuccess={handleRequestSuccess}
            prefillItems={lowStockRequestItems} 
          />

          {/* Snackbar */}
          <Snackbar
            open={snackbarMessage.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
                onClose={handleCloseSnackbar} 
                severity={snackbarMessage.severity} 
                sx={{ width: '100%' }}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
              {snackbarMessage.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default InventoryPage;