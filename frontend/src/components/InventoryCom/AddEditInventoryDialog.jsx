import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert, Typography
} from '@mui/material';
import { createInventoryItem, updateInventoryItem } from '../../api/inventoryApi';

const AddEditInventoryDialog = ({ open, handleClose, itemToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    partId: '',
    name: '',
    category: '',
    lowStockThreshold: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      setFormData({
        partId: '',
        name: '',
        category: '',
        lowStockThreshold: 0,
      });
    }
    setError('');
  }, [itemToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (itemToEdit) {
        await updateInventoryItem(itemToEdit._id, formData);
      } else {
        await createInventoryItem(formData);
      }
      onSave();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{itemToEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="dense"
            label="Part ID (e.g., MOTUL-1L)"
            name="partId"
            value={formData.partId}
            onChange={handleChange}
            required
            disabled={!!itemToEdit}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditInventoryDialog;