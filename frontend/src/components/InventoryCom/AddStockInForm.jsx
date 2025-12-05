import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField,
  MenuItem, Select, InputLabel, FormControl, Alert, CircularProgress, Snackbar,
  Autocomplete
} from '@mui/material';
import { createStockMovement } from '../../api/stockApi';
import { getInventoryItems } from '../../api/inventoryApi';
import { getSuppliers } from '../../api/supplierApi';

const AddStockInForm = ({ open, handleClose, onSave }) => {
  const [formData, setFormData] = useState({
    inventory: null,
    partId: '',
    supplier: '',
    type: 'IN',
    quantity: '',
    buyingPrice: '',
    salesPrice: '',
    notes: '',
  });
  const [inventoryList, setInventoryList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      setLoading(true);
      fetchData().finally(() => setLoading(false));
      setFormData({
        inventory: null,
        partId: '',
        supplier: '',
        type: 'IN',
        quantity: '',
        buyingPrice: '',
        salesPrice: '',
        notes: '',
      });
      setValidationErrors({});
      setSnackbar({ ...snackbar, open: false });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    
    // FIX 1: Logic to prevent non-numeric, '+' and '-' characters in price and quantity fields
    if (name === 'buyingPrice' || name === 'salesPrice') {
        // Allows digits and one decimal point, but restricts '+' and '-'
        if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
            return; 
        }
    } else if (name === 'quantity') {
        // Allows only whole digits (no decimal point), and restricts '+' and '-'
        if (value !== '' && !/^\d*$/.test(value)) {
            return;
        }
    }

    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAutocompleteChange = (event, newValue) => {
    setValidationErrors(prevErrors => ({ ...prevErrors, inventory: '' }));
    setFormData(prevData => ({
      ...prevData,
      inventory: newValue,
      partId: newValue ? newValue.partId : '',
    }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
  
    if (!formData.inventory) {
      errors.inventory = 'Inventory item is required.';
      isValid = false;
    }
    if (!formData.supplier) {
      errors.supplier = 'Supplier is required.';
      isValid = false;
    }
  
    // Check if Quantity is a positive number
    const quantityValue = parseFloat(formData.quantity);
    if (isNaN(quantityValue) || quantityValue <= 0 || !/^\d+$/.test(formData.quantity)) {
      errors.quantity = 'Quantity must be a whole positive number.';
      isValid = false;
    }

    // Check if Buying Price is a positive number
    const buyingPriceValue = parseFloat(formData.buyingPrice);
    if (isNaN(buyingPriceValue) || buyingPriceValue <= 0) {
      errors.buyingPrice = 'Buying price must be a positive number.';
      isValid = false;
    }

    // Check if Sales Price is a positive number
    const salesPriceValue = parseFloat(formData.salesPrice);
    if (isNaN(salesPriceValue) || salesPriceValue <= 0) {
      errors.salesPrice = 'Sales price must be a positive number.';
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
      const payload = {
        ...formData,
        inventory: formData.inventory._id,
        partId: formData.inventory.partId,
      };
      await createStockMovement(payload);
      onSave();
      handleClose();
      setSnackbar({ open: true, message: 'Stock added successfully!', severity: 'success' });
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
        <DialogTitle>Add Stock In</DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
              </Box>
          ) : (
            <Box component="form" noValidate autoComplete="off">
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
              
              <FormControl fullWidth margin="dense" required error={!!validationErrors.supplier}>
                <InputLabel>Supplier</InputLabel>
                <Select
                  label="Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                >
                  {supplierList.map((supplier) => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
                {/* MUI HelperText should be used here, but keeping P tag for minimal changes */}
                {validationErrors.supplier && <p className="text-red-500 text-xs mt-1">{validationErrors.supplier}</p>}
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
                // FIX 2: Restrict typing of '+' or '-' in the input field
                onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === '.') {
                        e.preventDefault();
                    }
                }}
                InputProps={{
                  // FIX 3: Quantity must be a whole number
                  inputProps: { min: 1, step: 1 },
                }}
                error={!!validationErrors.quantity}
                helperText={validationErrors.quantity}
              />
              
              <TextField
                fullWidth
                margin="dense"
                label="Buying Price"
                name="buyingPrice"
                type="number"
                value={formData.buyingPrice}
                onChange={handleChange}
                required
                 // FIX 2: Restrict typing of '+' or '-' in the input field
                onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+') {
                        e.preventDefault();
                    }
                }}
                InputProps={{
                  inputProps: { min: 0, step: "any" },
                }}
                error={!!validationErrors.buyingPrice}
                helperText={validationErrors.buyingPrice}
              />
              
              <TextField
                fullWidth
                margin="dense"
                label="Sales Price"
                name="salesPrice"
                type="number"
                value={formData.salesPrice}
                onChange={handleChange}
                required
                 // FIX 2: Restrict typing of '+' or '-' in the input field
                onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+') {
                        e.preventDefault();
                    }
                }}
                InputProps={{
                  inputProps: { min: 0, step: "any" },
                }}
                error={!!validationErrors.salesPrice}
                helperText={validationErrors.salesPrice}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Stock'}
          </Button>
        </DialogActions>
      </Dialog>
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

export default AddStockInForm;