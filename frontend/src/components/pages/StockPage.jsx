import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getStockMovements, deleteStockMovement } from '../../api/stockApi';
import DataTable from '../DataTable';
import AddStockInForm from '../InventoryCom/AddStockInForm';
import AddStockOutForm from '../InventoryCom/AddStockOutForm';

const StockPage = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openInDialog, setOpenInDialog] = useState(false);
  const [openOutDialog, setOpenOutDialog] = useState(false);

  const fetchStockMovements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getStockMovements();
      setStockMovements(response.data);
    } catch (err) {
      console.error("Failed to fetch stock movements:", err);
      setError('Failed to fetch stock movements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const handleOpenInDialog = () => setOpenInDialog(true);
  const handleCloseInDialog = () => setOpenInDialog(false);
  const handleOpenOutDialog = () => setOpenOutDialog(true);
  const handleCloseOutDialog = () => setOpenOutDialog(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock movement?')) {
      try {
        await deleteStockMovement(id);
        fetchStockMovements();
      } catch (err) {
        console.error("Failed to delete stock movement:", err);
        setError(err.response?.data?.message || 'Failed to delete stock movement.');
      }
    }
  };

  const columns = [
    { id: 'partId', label: 'Part ID', render: (row) => row.partId || '-' },
    { id: 'name', label: 'Item Name', render: (row) => row.inventory?.name || '-' },
    { id: 'type', label: 'Type' },
    { id: 'quantity', label: 'Quantity' },
    // New column for buying price
    { id: 'buyingPrice', label: 'Buying Price', render: (row) => `LKR ${row.buyingPrice ? row.buyingPrice.toFixed(2) : '0.00'}` },
    // New column for sales price
    { id: 'salesPrice', label: 'Sales Price', render: (row) => `LKR ${row.salesPrice ? row.salesPrice.toFixed(2) : '0.00'}` },
    { id: 'supplier', label: 'Supplier', render: (row) => row.supplier?.name || '-' },
    { id: 'jobId', label: 'Job ID', render: (row) => row.jobId || '-' },
    { id: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <Button size="small" color="error" onClick={() => handleDelete(row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];
  
  const filteredMovements = stockMovements.filter(m => 
    // FIXED: Added optional chaining to prevent crash on undefined properties
    (m.inventory?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.partId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.jobId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Stock Movements
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenInDialog}
          color='success'
        >
          Add Stock
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenOutDialog}
          color='error'
        >
          Remove Stock
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataTable
          title="Stock Movement History"
          columns={columns}
          data={filteredMovements}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by part name, ID, or job ID..."
        />
      )}
      <AddStockInForm
        open={openInDialog}
        handleClose={handleCloseInDialog}
        onSave={fetchStockMovements}
      />
      <AddStockOutForm
        open={openOutDialog}
        handleClose={handleCloseOutDialog}
        onSave={fetchStockMovements}
      />
    </Container>
  );
};

export default StockPage;