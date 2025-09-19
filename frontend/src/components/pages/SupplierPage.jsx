import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getSuppliers, deleteSupplier } from '../../api/supplierApi';
import DataTable from '../DataTable'; // Note: Path is now relative to pages/
import AddEditSupplierDialog from './AddEditSupplierDialog'; // Note: Path is now relative to pages/

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setError('Failed to fetch suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenDialog = (supplier = null) => {
    setSupplierToEdit(supplier);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
      } catch (err) {
        console.error("Failed to delete supplier:", err);
        setError(err.response?.data?.message || 'Failed to delete supplier.');
      }
    }
  };

  const columns = [
    { id: 'supplierId', label: 'Supplier ID', render: (row) => row.supplierId || '-' },
    { id: 'name', label: 'Name' },
    // **FIXED:** Added optional chaining to prevent crash
    { id: 'contact.phone', label: 'Phone', render: (row) => row.contact?.phone || '-' },
    { id: 'contact.email', label: 'Email', render: (row) => row.contact?.email || '-' },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <Button size="small" onClick={() => handleOpenDialog(row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(row._id)}>Delete</Button>
        </Box>
      ),
    },
  ];
  
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.supplierId && s.supplierId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Supplier Management
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Supplier
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
          title="Supplier List"
          columns={columns}
          data={filteredSuppliers}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name or ID..."
        />
      )}
      <AddEditSupplierDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        supplierToEdit={supplierToEdit}
        onSave={fetchSuppliers}
      />
    </Container>
  );
};

export default SupplierPage;