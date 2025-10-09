import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, IconButton,
  createTheme, ThemeProvider, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ListAltIcon from '@mui/icons-material/ListAlt';
// New Import for PDF download
import DownloadIcon from '@mui/icons-material/Download'; 
// Icons for Stock and Supplier navigation
import GroupWorkIcon from '@mui/icons-material/GroupWork'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import AdminHeader from "../../components/AdminHeader";


// PDF Library Imports
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Local Component Imports
import StatsCards from './StatsCards';
import InventoryTable from './InventoryTable';
import AddEditInventoryDialog from './AddEditInventoryDialog';
import CreatePurchaseRequestDialog from './CreatePurchaseRequestDialog';

// API Imports
import { getInventoryItems, deleteInventoryItem } from '../../api/inventoryApi';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog States
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
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
                warning: {
                    main: '#ff9800',
                    light: '#ffb74d',
                }
              }
            : {
                // Palette for dark mode
                background: { default: '#121212', paper: '#1d1d1d' },
                warning: {
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

  const handleAddClick = () => {
    setItemToEdit(null);
    setOpenAddEditDialog(true);
  };

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
    // Calculate total value based on current quantity * buying price
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.buyingPrice || 0)), 0);
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
    setLowStockRequestItems(lowStockItems);
    setOpenRequestDialog(true);
  };

  const handleRequestSuccess = (message) => {
    setSnackbarMessage({ open: true, message, severity: 'success' });
    fetchItems();
    setOpenRequestDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarMessage({ ...snackbarMessage, open: false });
  };

  // -------------------------------------------------------------------
  // NEW FUNCTION: PDF Download Handler for Inventory
  // -------------------------------------------------------------------
  const handleDownloadPdf = () => {
    const doc = new jsPDF('landscape'); // Use landscape for more columns
    
    // Define table headers
    const head = [
      ['Part ID', 'Name', 'Category', 'Stock Qty', 'Min Threshold', 'Buying Price', 'Selling Price', 'Last Update']
    ];
    
    // Prepare data body from filtered suppliers
    const body = filteredItems.map(item => [
      item.partId,
      item.name,
      item.category,
      item.quantity.toString(),
      item.lowStockThreshold.toString(),
      `Rs. ${item.buyingPrice.toFixed(2)}`,
      `Rs. ${item.salesPrice.toFixed(2)}`,
      new Date(item.updatedAt || item.createdAt).toLocaleDateString()
    ]);

    if (body.length === 0) {
        setSnackbarMessage({ open: true, message: 'No inventory items to download.', severity: 'info' });
        return;
    }

    // Add title
    doc.setFontSize(16);
    doc.text("Inventory Stock Report", 14, 20);
    
    // Add generated date
    doc.setFontSize(10);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 28);

    // Generate table using jspdf-autotable
    doc.autoTable({
        startY: 35, 
        head: head,
        body: body,
        theme: 'striped',
        headStyles: { fillColor: [0, 123, 255] }, // Blue header background
        styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak' }
    });

    // Save the PDF file
    doc.save('Inventory_Stock_Report.pdf');
    setSnackbarMessage({ open: true, message: 'Inventory report downloaded successfully!', severity: 'success' });
  };
  // -------------------------------------------------------------------


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 10, color: 'text.primary' }}>
        <AdminHeader />
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
              <StatsCards stats={stats} />

              {/* Action Buttons: Positioned to the right and styled */}
              <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 2,
                  mb: 2, 
                  mt: 4 
              }}>
                {/* PDF DOWNLOAD BUTTON */}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPdf}
                    disabled={loading || filteredItems.length === 0}
                >
                    Download PDF
                </Button>
                
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<GroupWorkIcon />}
                    onClick={() => navigate('/suppliers')}
                >
                    View Suppliers
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<AssessmentIcon />}
                    onClick={() => navigate('/stock')}
                >
                    View Stock Reports
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ListAltIcon />}
                    onClick={() => navigate('/purchase-requests')}
                >
                    View All Requests
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<WarningAmberIcon />}
                    onClick={handleLowStockRequest}
                    disabled={stats.lowStockCount === 0}
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
            open={openAddEditDialog}
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