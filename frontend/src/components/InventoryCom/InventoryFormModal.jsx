import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const InventoryFormModal = ({ open, handleClose, onAddOrUpdate, selectedItem, mode }) => {
  const [form, setForm] = useState({
    partId: "",
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    unit: "",
    lowStockThreshold: "",
    // For restock:
    supplier: "",
    orderDate: "",
    receivedDate: "",
  });
  const [isEditMode, setIsEditMode] = useState(mode === 'edit'); // 'edit' for item details, 'restock' for adding stock
  const [isRestockMode, setIsRestockMode] = useState(mode === 'restock');


  useEffect(() => {
    if (selectedItem) {
      if (mode === 'edit') {
        setForm({
          partId: selectedItem.partId || "",
          name: selectedItem.name || "",
          quantity: selectedItem.quantity || "", // This will be displayed but not directly editable in edit mode
          price: selectedItem.price || "",
          description: selectedItem.description || "",
          category: selectedItem.category || "",
          unit: selectedItem.unit || "",
          lowStockThreshold: selectedItem.lowStockThreshold || "",
          // Restock fields not needed for edit item details mode
          supplier: "",
          orderDate: "",
          receivedDate: "",
        });
        setIsEditMode(true);
        setIsRestockMode(false);
      } else if (mode === 'restock') {
        // For restock, we only need partId and quantity
        setForm({
          partId: selectedItem.partId || "", // Pre-fill partId
          name: selectedItem.name || "", // Display name for context
          quantity: "", // Quantity to add
          supplier: "", // Optional
          orderDate: new Date().toISOString().split('T')[0], // Default to today
          receivedDate: new Date().toISOString().split('T')[0], // Default to today
          // Other item details are not needed for restock form
          price: "",
          description: "",
          category: "",
          unit: "",
          lowStockThreshold: "",
        });
        setIsEditMode(false);
        setIsRestockMode(true);
      }
    } else { // For 'add new item' mode
      setForm({
        partId: "",
        name: "",
        quantity: "", // Initial quantity for a new item is 0, so this isn't really used for adding new part details
        price: "",
        description: "",
        category: "",
        unit: "",
        lowStockThreshold: "",
        supplier: "", // Not needed for add
        orderDate: "",
        receivedDate: "",
      });
      setIsEditMode(false);
      setIsRestockMode(false);
    }
  }, [selectedItem, mode]); // Re-run when mode or selectedItem changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'edit') {
        // Update Item Details (excluding quantity)
        const payload = {
          name: form.name,
          description: form.description,
          category: form.category,
          unit: form.unit,
          lowStockThreshold: Number(form.lowStockThreshold),
          price: Number(form.price),
          // partId and quantity are not updated here
        };
        await axios.put(`http://localhost:5001/api/inventory/${selectedItem._id}`, payload);
        onAddOrUpdate(); // Trigger refresh
        handleClose();
      } else if (mode === 'restock') {
        // Restock Item
        const payload = {
          quantity: Number(form.quantity),
          supplier: form.supplier,
          orderDate: form.orderDate,
          receivedDate: form.receivedDate,
        };
        // Use the partId of the selected item to call the restock endpoint
        await axios.post(`http://localhost:5001/api/inventory/restock/${form.partId}`, payload);
        onAddOrUpdate(); // Trigger refresh
        handleClose();
      } else { // Add New Item
        const payload = {
          partId: form.partId,
          name: form.name,
          description: form.description,
          category: form.category,
          unit: form.unit,
          lowStockThreshold: Number(form.lowStockThreshold),
          price: Number(form.price),
          // quantity will be 0 initially, stock managed by restocks
        };
        await axios.post("http://localhost:5001/api/inventory", payload);
        onAddOrUpdate(); // Trigger refresh
        handleClose();
      }
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : mode === 'restock' ? 'restocking' : 'adding'} item:`, error.response?.data?.message || error.message);
      // Optionally show an error message to the user
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper sx={modalStyle} elevation={6}>
          <Typography variant="h5" align="center" gutterBottom>
            {mode === 'edit' ? "✍️ Edit Item Details" : mode === 'restock' ? "📦 Restock Item" : "➕ Add New Item"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Common Fields for Add New Item & Edit Item Details */}
            {!isRestockMode && (
              <>
                <TextField
                  fullWidth margin="normal" label="Part ID" name="partId"
                  value={form.partId} onChange={handleChange} required disabled={isEditMode}
                />
                <TextField
                  fullWidth margin="normal" label="Name" name="name"
                  value={form.name} onChange={handleChange} required
                />
                <TextField
                  fullWidth margin="normal" type="number" label="Price" name="price"
                  value={form.price} onChange={handleChange} required
                />
                <TextField
                  fullWidth margin="normal" multiline minRows={2} label="Description" name="description"
                  value={form.description} onChange={handleChange}
                />
                <TextField
                  fullWidth margin="normal" label="Category" name="category"
                  value={form.category} onChange={handleChange}
                />
                <TextField
                  fullWidth margin="normal" label="Unit" name="unit"
                  value={form.unit} onChange={handleChange}
                />
                <TextField
                  fullWidth margin="normal" type="number" label="Low Stock Threshold" name="lowStockThreshold"
                  value={form.lowStockThreshold} onChange={handleChange} required
                />
              </>
            )}

            {/* Fields specific to Restock Mode */}
            {isRestockMode && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Restocking: {form.name} (Part ID: {form.partId})
                </Typography>
                <TextField
                  fullWidth margin="normal" type="number" label="Quantity to Add" name="quantity"
                  value={form.quantity} onChange={handleChange} required
                />
                <TextField
                  fullWidth margin="normal" label="Supplier" name="supplier"
                  value={form.supplier} onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Order Date"
                  name="orderDate"
                  type="date"
                  value={form.orderDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Received Date"
                  name="receivedDate"
                  type="date"
                  value={form.receivedDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, bgcolor: "primary.main", borderRadius: 2 }}
            >
              {mode === 'edit' ? "Update Item Details" : mode === 'restock' ? "Restock Item" : "Add Item"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default InventoryFormModal;