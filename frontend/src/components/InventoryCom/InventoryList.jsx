import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const InventoryList = ({ refresh }) => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/inventory/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateItem = async (id) => {
    const newName = prompt("Enter new name:");
    const newQuantity = prompt("Enter new quantity:");
    if (!newName || !newQuantity) return;

    try {
      await axios.put(`http://localhost:5001/api/inventory/${id}`, {
        name: newName,
        quantity: Number(newQuantity),
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  return (
    <Paper elevation={3} sx={{ maxWidth: "90%", mx: "auto", mt: 4, p: 2, borderRadius: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        📦 Inventory Items
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.light" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => updateItem(item._id)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryList;
