import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Grid,
  Alert, CircularProgress, Typography, Box, Paper, IconButton
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { 
    getLowStockParts,
    createPurchaseRequest 
} from '../../api/purchaseRequestApi.js';

import{ getSuppliers } from '../../api/supplierApi.js';

const PartQuantityRow = ({ item, onChange, onRemove }) => (
  <Paper elevation={1} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={4}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
      </Grid>
      <Grid item xs={6} sm={2}>
        <Typography variant="body2">Stock: {item.quantity}</Typography>
      </Grid>
      <Grid item xs={6} sm={2}>
        <Typography variant="body2">Threshold: {item.lowStockThreshold}</Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Quantity Needed"
          type="number"
          size="small"
          fullWidth
          value={item.quantityNeeded || Math.max(1, item.lowStockThreshold - item.quantity)}
          onChange={(e) => onChange(item._id, Math.max(1, parseInt(e.target.value) || 1))}
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
        <IconButton onClick={() => onRemove(item._id)} color="error" size="small">
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Grid>
    </Grid>
  </Paper>
);

const CreatePurchaseRequestDialog = ({ open, handleClose, onSaveSuccess, prefillItems = [] }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedParts, setSelectedParts] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          const [supRes, partsRes] = await Promise.all([
            getSuppliers(), 
            getLowStockParts(),
          ]);
          
          const fetchedLowStockParts = partsRes.data;
          setSuppliers(supRes.data);
          setLowStockParts(fetchedLowStockParts);

          if (prefillItems && prefillItems.length > 0) {
              const initialParts = prefillItems.map(item => ({
                  ...item,
                  quantityNeeded: Math.max(1, item.lowStockThreshold - item.quantity),
              }));
              setSelectedParts(initialParts);
          } else {
              setSelectedParts([]);
          }


        } catch (err) {
          console.error("API Fetch Error:", err);
          setError('Failed to load suppliers or low stock parts. Check API connectivity and routes.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setSelectedSupplierId('');
      setSelectedParts([]);
      setNotes('');
      setError('');
    }
  }, [open, prefillItems]);


  const handlePartSelect = (e) => {
    const partId = e.target.value;
    const partToAdd = lowStockParts.find(p => p._id === partId);
    if (partToAdd && !selectedParts.some(p => p._id === partId)) {
      const suggestedQuantity = Math.max(1, partToAdd.lowStockThreshold - partToAdd.quantity);
      setSelectedParts([...selectedParts, { ...partToAdd, quantityNeeded: suggestedQuantity }]);
    }
  };

  const handleQuantityChange = (id, qty) => {
    setSelectedParts(prev => prev.map(p => p._id === id ? { ...p, quantityNeeded: qty } : p));
  };

  const handleRemovePart = (id) => {
    setSelectedParts(prev => prev.filter(p => p._id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedSupplierId) return setError('Please select a supplier.');
    if (selectedParts.length === 0) return setError('Select at least one part.');

    const requestedParts = selectedParts.map(p => ({
      inventoryId: p._id,
      partName: p.name,
      currentStock: p.quantity,
      quantityNeeded: p.quantityNeeded
    }));

    setIsSubmitting(true);
    setError('');
    try {
        await createPurchaseRequest({
            supplierId: selectedSupplierId,
            requestedParts,
            notes
        });
        
        onSaveSuccess('Purchase request created and email sent successfully!');
        handleClose();
    } catch (err) {
      console.error('Request Submission Failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create request due to a server error.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableParts = lowStockParts.filter(p => !selectedParts.some(s => s._id === p._id));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Create New Purchase Request</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Supplier</InputLabel>
                <Select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {suppliers.map(s => (
                    <MenuItem key={s._id} value={s._id}>
                      {/* FIX: Access the email via the contact object */}
                      {s.name} ({s.contact?.email || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={availableParts.length === 0}>
                <InputLabel>Add Low Stock Part</InputLabel>
                <Select value="" onChange={handlePartSelect}>
                  {availableParts.length > 0 ? availableParts.map(p => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name} (Stock: {p.quantity}, Threshold: {p.lowStockThreshold})
                    </MenuItem>
                  )) : <MenuItem disabled>No more low stock parts</MenuItem>}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Requested Items ({selectedParts.length})</Typography>
              {selectedParts.length === 0 ? (
                <Alert severity="info">Use the dropdown to add parts, or they might be pre-filled from the Inventory Page.</Alert>
              ) : (
                <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1 }}>
                  {selectedParts.map(p => (
                    <PartQuantityRow
                      key={p._id}
                      item={p}
                      onChange={handleQuantityChange}
                      onRemove={handleRemovePart}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes / Instructions"
                multiline
                rows={3}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || selectedParts.length === 0 || !selectedSupplierId}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Send & Save Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePurchaseRequestDialog;