import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddStockForm from '../InventoryCom/AddStockForm';
import { getStockMovements } from '../../api/stockApi';
import DataTable from '../DataTable';

const StockPage = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStockMovements = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getStockMovements();
      setStockMovements(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stock movements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const handleAddClick = () => {
    setOpenDialog(true);
  };

  const columns = [
    { id: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    { id: 'partId', label: 'Part ID', render: (row) => row.inventory?.partId || 'N/A' },
    { id: 'name', label: 'Item Name', render: (row) => row.inventory?.name || 'N/A' },
    { id: 'type', label: 'Type', render: (row) => row.type },
    { id: 'quantity', label: 'Quantity', render: (row) => row.quantity },
    { id: 'supplierName', label: 'Supplier', render: (row) => row.supplier?.name || 'N/A' },
    { id: 'notes', label: 'Notes', render: (row) => row.notes || '-' },
  ];

  const filteredMovements = stockMovements.filter(movement =>
    (movement.inventory?.partId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (movement.inventory?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (movement.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Stock Movements
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Stock Movement
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
          searchPlaceholder="Search by part or supplier..."
        />
      )}
      <AddStockForm
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        onSave={fetchStockMovements}
      />
    </Container>
  );
};

export default StockPage;