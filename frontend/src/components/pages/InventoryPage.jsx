import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, IconButton,
  createTheme, ThemeProvider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
  const [mode, setMode] = useState('light'); // මේක අලුතින් එකතු කරනවා

  // StockPage එකේ වගේම theme එක හදනවා
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Palette for light mode
                background: {
                  default: '#f5f5f5',
                  paper: '#fff',
                },
              }
            : {
                // Palette for dark mode
                background: {
                  default: '#121212',
                  paper: '#1d1d1d',
                },
              }),
        },
      }),
    [mode],
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
  
  // මේක අලුතින් එකතු කරනවා
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    // මුළු component එකම ThemeProvider එකෙන් wrap කරනවා
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, color: 'text.primary' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Inventory Dashboard
            </Typography>
            {/* Dark/Light mode switch button එක එකතු කරනවා */}
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
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
      </Box>
    </ThemeProvider>
  );
};

export default InventoryPage;