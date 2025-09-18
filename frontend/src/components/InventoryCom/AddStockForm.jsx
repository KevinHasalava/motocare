import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField,
  MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio, Alert,
  FormLabel,
} from '@mui/material';
import { createStockMovement } from '../../api/stockApi';
import { getInventoryItems } from '../../api/inventoryApi';
import { getSuppliers } from '../../api/supplierApi';

const AddStockForm = ({ open, handleClose, onSave }) => {
  const [formData, setFormData] = useState({
    inventory: '',
    supplier: '',
    type: 'IN',
    quantity: 1,
    buyingPrice: '',
    notes: '',
  });
  const [inventoryList, setInventoryList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, supRes] = await Promise.all([
          getInventoryItems(),
          getSuppliers(),
        ]);
        setInventoryList(invRes.data);
        setSupplierList(supRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError('Failed to load required data.');
      }
    };
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Basic validation
      if (!formData.inventory || !formData.type || formData.quantity <= 0) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      if (formData.type === 'IN' && !formData.supplier) {
        setError('Supplier is required for stock-in transactions.');
        setLoading(false);
        return;
      }
      await createStockMovement(formData);
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
      <DialogTitle>Add Stock Movement</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" noValidate autoComplete="off">
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Inventory Item</InputLabel>
            <Select
              label="Inventory Item"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
            >
              {inventoryList.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.partId} - {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }} required>
            <FormLabel>Movement Type</FormLabel>
            <RadioGroup
              row
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <FormControlLabel value="IN" control={<Radio />} label="Stock In" />
              <FormControlLabel value="OUT" control={<Radio />} label="Stock Out" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="dense" required={formData.type === 'IN'}>
            <InputLabel>Supplier</InputLabel>
            <Select
              label="Supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              disabled={formData.type === 'OUT'}
            >
              {supplierList.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          
          <TextField
            fullWidth
            margin="dense"
            label="Buying Price (Optional)"
            name="buyingPrice"
            type="number"
            value={formData.buyingPrice}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Notes (Optional)"
            name="notes"
            multiline
            rows={2}
            value={formData.notes}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Adding...' : 'Add Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockForm;