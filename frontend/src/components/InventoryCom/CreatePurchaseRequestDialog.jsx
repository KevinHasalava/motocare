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
  // const [lowStockParts, setLowStockParts] = useState([]); // Removed as parts dropdown is removed
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
          // Fetch only suppliers, no need to fetch low stock parts list as dropdown is removed
          const supRes = await getSuppliers(); 
          
          setSuppliers(supRes.data);
          // setLowStockParts(partsRes.data); // Removed

          if (prefillItems && prefillItems.length > 0) {
              const initialParts = prefillItems.map(item => ({
                  ...item,
                  // Ensure suggested quantity is at least 1
                  quantityNeeded: Math.max(1, item.lowStockThreshold - item.quantity),
              }));
              setSelectedParts(initialParts);
          } else {
              // Ensure selectedParts is correctly initialized even if prefill is empty
              setSelectedParts([]); 
          }


        } catch (err) {
          console.error("API Fetch Error:", err);
          setError('Failed to load suppliers. Check API connectivity and routes.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset state on close
      setSelectedSupplierId('');
      setSelectedParts([]);
      setNotes('');
      setError('');
    }
  }, [open, prefillItems]);

  // Removed handlePartSelect function as the dropdown is removed
  // Removed handleQuantityChange and handleRemovePart function as they are still needed for the list
  
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

  // Removed availableParts as the dropdown is removed
  // const availableParts = lowStockParts.filter(p => !selectedParts.some(s => s._id === p._id)); 


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
              {/* Supplier Select field - FIXES applied here to show full placeholder text */}
              <FormControl fullWidth required>
                {/* InputLabel removed to fix placeholder issue */}
                <Select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  displayEmpty 
                  sx={{
                    '& .MuiSelect-select': { 
                      paddingRight: '50px !important', // Ensure space for the icon
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                  renderValue={(selected) => {
                    if (selected === "") {
                        // Display the full placeholder text when nothing is selected
                        return <Box sx={{ color: 'text.secondary' }}>Select Supplier</Box>; 
                    }
                    const supplier = suppliers.find(s => s._id === selected);
                    // Display the selected supplier name and email
                    return supplier ? `${supplier.name} (${supplier.contact?.email || 'N/A'})` : '';
                  }}
                >
                  <MenuItem value="">Select Supplier</MenuItem> 
                  {suppliers.map(s => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name} ({s.contact?.email || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* REMOVED: Add Low Stock Part dropdown column */}
            <Grid item xs={12} sm={6}>
              {/* Empty column now, or fill with another component if needed */}
            </Grid>
            

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Requested Items ({selectedParts.length})</Typography>
              {selectedParts.length === 0 ? (
                <Alert severity="warning">No parts are currently requested. Please pre-fill items from the Inventory Page.</Alert>
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
        {/* Button is enabled only if a supplier is selected and at least one part is present */}
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || selectedParts.length === 0 || !selectedSupplierId}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Send & Save Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePurchaseRequestDialog;