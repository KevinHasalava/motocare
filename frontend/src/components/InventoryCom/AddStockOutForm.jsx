import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField,
  MenuItem, Select, InputLabel, FormControl, Alert, CircularProgress,
  RadioGroup, FormControlLabel, Radio, FormLabel, Autocomplete, Snackbar
} from '@mui/material';
import { createStockMovement, deductStock } from '../../api/stockApi';
import { getInventoryItems } from '../../api/inventoryApi';

const AddStockOutForm = ({ open, handleClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'OUT',
    jobId: '',
    inventory: null,
    quantity: 1,
    notes: '',
  });
  const [inventoryList, setInventoryList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await getInventoryItems();
        setInventoryList(invRes.data);
      } catch (err) {
        console.error("Failed to fetch inventory items:", err);
        setError('Failed to load inventory data.');
      }
    };
    if (open) {
      setLoading(true);
      fetchData().finally(() => setLoading(false));
      setFormData({
        type: 'OUT',
        jobId: '',
        inventory: null,
        quantity: 1,
        notes: '',
      });
      setValidationErrors({});
      setSnackbar({ ...snackbar, open: false });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleAutocompleteChange = (event, newValue) => {
    setFormData(prevData => ({ ...prevData, inventory: newValue }));
    setValidationErrors(prevErrors => ({ ...prevErrors, inventory: '' }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    if (!formData.inventory) {
      errors.inventory = 'Inventory item is required.';
      isValid = false;
    }
  
    if (isNaN(formData.quantity) || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be a positive number.';
      isValid = false;
    }
  
    if (formData.type === 'deduction' && !formData.jobId.trim()) {
      errors.jobId = 'Job ID is required for this type.';
      isValid = false;
    }
  
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const selectedItem = formData.inventory;
      if (!selectedItem) {
        setError('Selected inventory item is not valid.');
        setLoading(false);
        setSnackbar({ open: true, message: 'Selected inventory item is not valid.', severity: 'error' });
        return;
      }

      let response;
      if (formData.type === 'deduction') {
        const deductionData = {
          jobId: formData.jobId,
          parts: [{
            partId: selectedItem.partId,
            qty: Number(formData.quantity)
          }]
        };
        response = await deductStock(deductionData);
      } else { // 'OUT' type
        const outData = {
          inventory: selectedItem._id,
          partId: selectedItem.partId,
          type: 'OUT',
          quantity: Number(formData.quantity),
          notes: formData.notes,
        };
        response = await createStockMovement(outData);
      }
      
      if (response.status === 200 || response.status === 201) {
        onSave();
        handleClose();
        setSnackbar({ open: true, message: 'Stock movement added successfully!', severity: 'success' });
      } else {
        setError('An unexpected error occurred.');
        setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
      }

    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'An error occurred. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Remove Stock</DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
              </Box>
          ) : (
            <Box component="form" noValidate autoComplete="off">
              <FormControl component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">Movement Type</FormLabel>
                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <FormControlLabel value="OUT" control={<Radio />} label="Manual Out" />
                  <FormControlLabel value="deduction" control={<Radio />} label="Deduct from Job" />
                </RadioGroup>
              </FormControl>
              
              <Autocomplete
                options={inventoryList}
                getOptionLabel={(option) => `${option.partId} - ${option.name}`}
                value={formData.inventory}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Inventory Item"
                    margin="dense"
                    required
                    error={!!validationErrors.inventory}
                    helperText={validationErrors.inventory}
                  />
                )}
              />

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
                  inputProps: { min: 1, step: 1 },
                }}
                error={!!validationErrors.quantity}
                helperText={validationErrors.quantity}
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
                  error={!!validationErrors.jobId}
                  helperText={validationErrors.jobId}
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
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar is now at the top center */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddStockOutForm;