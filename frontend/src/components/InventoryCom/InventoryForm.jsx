import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const InventoryForm = ({ onAdd }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        lowStockThreshold: Number(form.lowStockThreshold),
      };

      const res = await axios.post("http://localhost:5001/api/inventory", payload);
      onAdd(res.data);

      setForm({
        partId: "",
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "",
        unit: "",
        lowStockThreshold: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{ maxWidth: 450, mx: "auto", p: 3, mt: 4, borderRadius: 3 }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        ➕ Add Inventory Item
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth margin="normal" label="Part ID" name="partId"
          value={form.partId} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" label="Name" name="name" required
          value={form.name} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" type="number" label="Quantity" name="quantity" required
          value={form.quantity} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" type="number" label="Price" name="price"
          value={form.price} onChange={handleChange}
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
          value={form.lowStockThreshold} onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, bgcolor: "primary.main", borderRadius: 2 }}
        >
          Add Item
        </Button>
      </Box>
    </Paper>
  );
};

export default InventoryForm;
