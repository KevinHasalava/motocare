import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  getSuppliers, createSupplier, updateSupplier, deleteSupplier
} from '../../api/supplierApi';
import DataTable from '../DataTable';

const AddEditSupplierDialog = ({ open, handleClose, supplierToEdit, onSave }) => {
  const [formData, setFormData] = useState({ name: '', supplierId: '', contact: { phone: '', email: '', address: '' } });
  const [error, setError] = useState('');

  useEffect(() => {
    if (supplierToEdit) {
      setFormData(supplierToEdit);
    } else {
      setFormData({ name: '', supplierId: '', contact: { phone: '', email: '', address: '' } });
    }
  }, [supplierToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.contact) {
      setFormData({ ...formData, contact: { ...formData.contact, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (supplierToEdit) {
        await updateSupplier(supplierToEdit._id, formData);
      } else {
        await createSupplier(formData);
      }
      onSave();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save supplier.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Supplier Name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="supplierId"
          label="Supplier ID (Optional)"
          fullWidth
          value={formData.supplierId}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          fullWidth
          value={formData.contact.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.contact.email}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
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
      }
    }
  };

  const columns = [
    { id: 'supplierId', label: 'Supplier ID' },
    { id: 'name', label: 'Name' },
    { id: 'contact.phone', label: 'Phone', render: (row) => row.contact.phone || '-' },
    { id: 'contact.email', label: 'Email', render: (row) => row.contact.email || '-' },
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Supplier
        </Button>
      </Box>
      <DataTable
        title="Supplier List"
        columns={columns}
        data={filteredSuppliers}
        onSearchChange={setSearchTerm}
      />
      <AddEditSupplierDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        supplierToEdit={supplierToEdit}
        onSave={fetchSuppliers}
      />
    </Container>
  );
};

export default SuppliersPage;