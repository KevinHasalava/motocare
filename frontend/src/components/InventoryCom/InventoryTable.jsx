import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import InventoryIcon from '@mui/icons-material/Inventory'; // For restocking icon

const InventoryTable = ({ refresh, onEditItemDetails, onRestockItem, setStats }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      const inventoryItems = res.data;
      setItems(inventoryItems);

      // Calculate stats for the dashboard
      const totalItems = inventoryItems.length;
      const lowStockCount = inventoryItems.filter(item => item.quantity <= item.lowStockThreshold).length;
      // Ensure price and quantity are numbers before calculation
      const totalValue = inventoryItems.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
      
      setStats({ totalItems, lowStockCount, totalValue });

    } catch (error) {
      console.error("Error fetching items:", error);
      setStats({ totalItems: 0, lowStockCount: 0, totalValue: 0 }); // Reset stats on error
    }
  };

  const deleteItem = async (id, partId) => {
    // For now, we'll assume deleting an inventory item is a drastic action.
    // In a real system, you might only want to disable it or handle restock history.
    // For simplicity here, we'll make it a confirmation.
    if (window.confirm(`Are you sure you want to delete the item with Part ID ${partId}? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:5001/api/inventory/${id}`); // Assumes backend has a delete route
        fetchItems(); // Refresh list
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ maxWidth: "90%", mx: "auto", mt: 4, p: 2, borderRadius: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        📦 Inventory Items
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.light" }}>
              <TableCell><b>Part ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Current Stock</b></TableCell>
              <TableCell><b>Price (LKR)</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item._id}
                sx={{
                  "&:hover": { bgcolor: "grey.200" },
                  bgcolor: item.quantity <= item.lowStockThreshold ? "warning.light" : "transparent"
                }}
              >
                <TableCell>{item.partId}</TableCell>
                <TableCell>
                  {item.name}
                  {item.quantity <= item.lowStockThreshold && (
                    <Tooltip title="Low Stock">
                      <WarningIcon color="error" sx={{ ml: 1, verticalAlign: 'middle' }} />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>Rs. {Number(item.price).toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Item Details">
                    <IconButton color="primary" onClick={() => onEditItemDetails(item)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Restock Item">
                    <IconButton color="secondary" onClick={() => onRestockItem(item)}>
                      <InventoryIcon />
                    </IconButton>
                  </Tooltip>
                  {/* Delete button might be for removing the entire part record */}
                  <Tooltip title="Delete Item Record">
                    <IconButton color="error" onClick={() => deleteItem(item._id, item.partId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryTable;