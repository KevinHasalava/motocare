import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert
} from '@mui/material';
import { createSupplier, updateSupplier } from '../../api/supplierApi';

const AddEditSupplierDialog = ({ open, handleClose, supplierToEdit, onSave }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    supplierId: '', 
    contact: { phone: '', email: '', address: '' } 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplierToEdit) {
      // Set form data from the supplier to edit
      setFormData({
        ...supplierToEdit,
        contact: {
          phone: supplierToEdit.contact?.phone || '',
          email: supplierToEdit.contact?.email || '',
          address: supplierToEdit.contact?.address || '',
        }
      });
    } else {
      // Reset form for a new supplier
      setFormData({ name: '', supplierId: '', contact: { phone: '', email: '', address: '' } });
    }
    setError('');
  }, [supplierToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested contact properties
    if (['phone', 'email', 'address'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (supplierToEdit) {
        await updateSupplier(supplierToEdit._id, formData);
      } else {
        await createSupplier(formData);
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save supplier.');
    } finally {
      setLoading(false);
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
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSupplierDialog;