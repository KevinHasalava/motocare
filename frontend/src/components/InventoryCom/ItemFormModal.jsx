// src/components/InventoryCom/ItemFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import PropTypes from 'prop-types';

const ItemFormModal = ({ open, onClose, itemToEdit, onSave }) => {
  const [form, setForm] = useState({
    partId: "",
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    unit: "",
    lowStockThreshold: "",
  });

  const isEditing = Boolean(itemToEdit);
  const modalTitle = isEditing ? "Edit Inventory Item" : "Add New Inventory Item";

  useEffect(() => {
    if (isEditing && itemToEdit) {
      // Pre-fill form with item data when editing
      setForm({
        partId: itemToEdit.partId || "",
        name: itemToEdit.name || "",
        quantity: itemToEdit.quantity !== undefined ? itemToEdit.quantity : "",
        price: itemToEdit.price !== undefined ? itemToEdit.price : "",
        description: itemToEdit.description || "",
        category: itemToEdit.category || "General",
        unit: itemToEdit.unit || "pcs",
        lowStockThreshold: itemToEdit.lowStockThreshold !== undefined ? itemToEdit.lowStockThreshold : 5,
      });
    } else {
      // Reset form when adding a new item
      setForm({
        partId: "",
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "General",
        unit: "pcs",
        lowStockThreshold: 5,
      });
    }
  }, [itemToEdit, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.partId || !form.name || form.quantity === "" || form.price === "") {
      alert("Part ID, Name, Quantity, and Price are required.");
      return;
    }

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5001/api/inventory/${itemToEdit._id}`, payload);
      } else {
        await axios.post("http://localhost:5001/api/inventory", payload);
      }
      onSave(); // Signal to parent to refresh list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error saving item:", error.response ? error.response.data : error.message);
      alert(`Failed to save item. Please check console for details.`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Part ID"
                name="partId"
                type="text"
                fullWidth
                variant="outlined"
                value={form.partId}
                onChange={handleChange}
                required
                error={!form.partId}
                helperText={!form.partId ? "Part ID is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Name"
                name="name"
                type="text"
                fullWidth
                variant="outlined"
                value={form.name}
                onChange={handleChange}
                required
                error={!form.name}
                helperText={!form.name ? "Name is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                label="Quantity"
                name="quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={form.quantity}
                onChange={handleChange}
                required
                error={form.quantity === ""}
                helperText={form.quantity === "" ? "Quantity is required" : ""}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                label="Price ($)"
                name="price"
                type="number"
                fullWidth
                variant="outlined"
                value={form.price}
                onChange={handleChange}
                required
                error={form.price === ""}
                helperText={form.price === "" ? "Price is required" : ""}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="dense"
                label="Low Stock Threshold"
                name="lowStockThreshold"
                type="number"
                fullWidth
                variant="outlined"
                value={form.lowStockThreshold}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                name="description"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                minRows={2}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Category"
                name="category"
                type="text"
                fullWidth
                variant="outlined"
                value={form.category}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Unit"
                name="unit"
                type="text"
                fullWidth
                variant="outlined"
                value={form.unit}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItemFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemToEdit: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ItemFormModal;