import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Grid,
  Alert, CircularProgress, Box, Typography, Paper, IconButton
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
  const [validationErrors, setValidationErrors] = useState({}); 

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        ...supplierToEdit,
        contact: {
          phone: supplierToEdit.contact?.phone || '',
          email: supplierToEdit.contact?.email || '',
          address: supplierToEdit.contact?.address || '',
        }
      });
    } else {
      setFormData({ name: '', supplierId: '', contact: { phone: '', email: '', address: '' } });
    }
    setError('');
    setValidationErrors({}); 
  }, [supplierToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValidationErrors = { ...validationErrors };
    let newValue = value;

    if (name === 'name') {
      // Validation for Supplier Name (Allow only letters and spaces)
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        newValidationErrors.name = 'Name must contain only letters and spaces.';
      } else {
        delete newValidationErrors.name;
      }
    } else if (name === 'phone') {
      // Filter out non-numeric characters for phone
      newValue = value.replace(/[^0-9]/g, ''); 

      // Phone Number Validation (10 digits and starts with 0)
      if (newValue.length > 0) {
        if (!/^0/.test(newValue)) {
          newValidationErrors.phone = 'Phone number must start with 0.';
        } else if (newValue.length !== 10) {
          newValidationErrors.phone = 'Phone number must be exactly 10 digits.';
        } else {
          delete newValidationErrors.phone;
        }
      } else {
        delete newValidationErrors.phone;
      }
    } else if (name === 'email') {
      // Email Validation
      // The basic browser validation (type="email") is used for simple checks.
      // Comprehensive validation is done in validateForm to ensure correct format.
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newValidationErrors.email = 'Please enter a valid email address (e.g., user@domain.com).';
      } else {
          delete newValidationErrors.email;
      }
    }

    setValidationErrors(newValidationErrors);

    if (['phone', 'email', 'address'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [name]: newValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Supplier Name is required.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      errors.name = 'Name must contain only letters and spaces.';
      isValid = false;
    }

    // Phone number validation
    const phone = formData.contact.phone;
    if (phone && phone.length > 0) {
      if (!/^\d{10}$/.test(phone) || !/^0/.test(phone)) {
        errors.phone = 'Phone must be 10 digits and start with 0.';
        isValid = false;
      }
    }
    
    // Email validation (Full validation check on submit)
    const email = formData.contact.email;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address (e.g., user@domain.com).';
        isValid = false;
    }

    // Check if there are any existing field-level errors
    const currentFieldErrors = Object.keys(validationErrors).filter(key => validationErrors[key]);
    if (currentFieldErrors.length > 0) {
        isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please correct the errors in the form.');
      return;
    }
    
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

  const isFormValid = formData.name.trim() !== '' && Object.keys(validationErrors).length === 0 && !loading;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {/* Supplier Name Field */}
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Supplier Name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          error={!!validationErrors.name}
          helperText={validationErrors.name || "Only letters and spaces are allowed."}
          inputProps={{
              pattern: "[a-zA-Z\\s]*"
          }}
        />
        
        <TextField
          margin="dense"
          name="supplierId"
          label="Supplier ID (Optional)"
          fullWidth
          value={formData.supplierId}
          onChange={handleChange}
        />
        
        {/* Phone Field */}
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          type="tel" 
          fullWidth
          value={formData.contact.phone}
          onChange={handleChange}
          inputProps={{
              maxLength: 10,
              inputMode: 'numeric',
              pattern: "0[0-9]{9}" 
          }}
          error={!!validationErrors.phone}
          helperText={validationErrors.phone || "Must be 10 digits and start with 0 (e.g., 071xxxxxxx)."}
        />
        
        {/* Email Field - Updated Validation */}
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.contact.email}
          onChange={handleChange}
          error={!!validationErrors.email}
          helperText={validationErrors.email || "Must be a valid email format (e.g., user@domain.com)."}
        />
        
        <TextField
          margin="dense"
          name="address"
          label="Address"
          fullWidth
          value={formData.contact.address}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !isFormValid}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSupplierDialog;