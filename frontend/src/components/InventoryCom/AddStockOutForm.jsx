import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField,
  MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio, Alert,
  FormLabel, CircularProgress
} from '@mui/material';
import { createStockMovement } from '../../api/stockApi';
import { getInventoryItems } from '../../api/inventoryApi';

const AddStockOutForm = ({ open, handleClose, onSave }) => {
  const [formData, setFormData] = useState({
    inventory: '',
    partId: '',
    type: 'OUT',
    quantity: 1,
    jobId: '',
    notes: '',
  });
  const [inventoryList, setInventoryList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await getInventoryItems();
        setInventoryList(invRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError('Failed to load required data.');
      }
    };
    if (open) {
      setLoading(true);
      fetchData().finally(() => setLoading(false));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'inventory') {
      const selectedItem = inventoryList.find(item => item._id === value);
      setFormData(prevData => ({
        ...prevData,
        inventory: value,
        partId: selectedItem ? selectedItem.partId : '',
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (!formData.inventory || !formData.type || formData.quantity <= 0) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      if (formData.type === 'deduction' && !formData.jobId) {
        setError('Job ID is required for deduction type.');
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
      <DialogTitle>Add Stock Out</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        ) : (
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
                <FormControlLabel value="OUT" control={<Radio />} label="Manual Out" />
                <FormControlLabel value="deduction" control={<Radio />} label="Deduction" />
              </RadioGroup>
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

            {formData.type === 'deduction' && (
              <TextField
                fullWidth
                margin="dense"
                label="Job ID"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                required
              />
            )}
            
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
        )}
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

export default AddStockOutForm;
