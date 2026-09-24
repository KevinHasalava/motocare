import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, CircularProgress, Alert, IconButton,
  createTheme, ThemeProvider, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import ListAltIcon from '@mui/icons-material/ListAlt';
// New Import for PDF download
import DownloadIcon from '@mui/icons-material/Download'; 
// Icons for Stock and Supplier navigation
import GroupWorkIcon from '@mui/icons-material/GroupWork'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import AdminHeader from "../../components/AdminHeader";


// PDF generation now handled by backend API with custom letterhead template

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
  const [mode] = useState('light');
  const [snackbarMessage, setSnackbarMessage] = useState({ open: false, message: '', severity: 'success' });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          background: { default: '#F8F9FB', paper: '#fff' },
          warning: {
            main: '#ff9800',
            light: '#ffb74d',
          }
        },
      }),
    []
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
  // UPDATED FUNCTION: PDF Download Handler for Inventory (Using Backend API with Template)
  // -------------------------------------------------------------------
  const handleDownloadPdf = async () => {
    try {
      setSnackbarMessage({ open: true, message: 'Generating PDF report...', severity: 'info' });
      
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      // Call backend API to generate PDF with template
      const response = await fetch(`/api/inventory/download-report-pdf?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `InventoryReport_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSnackbarMessage({ open: true, message: 'Inventory report with letterhead downloaded successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setSnackbarMessage({ open: true, message: 'Failed to download PDF report. Please try again.', severity: 'error' });
    }
  };
  // -------------------------------------------------------------------


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 10, color: 'text.primary' }}>
        <AdminHeader />
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', fontFamily: '"Outfit", sans-serif' }}>Inventory Dashboard</Typography>
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