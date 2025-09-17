// src/components/InventoryCom/InventoryTable.jsx
import React, { useState, useEffect, useMemo } from "react";
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
  IconButton,
  TextField,
  Box,
  TablePagination,
  Collapse,
  Alert,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RestoreIcon from '@mui/icons-material/Restore'; // For history, if you add it later
import InventoryIcon from '@mui/icons-material/Inventory';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import PropTypes from 'prop-types';

// Helper function to check for low stock
const isLowStock = (item) => item.quantity <= item.lowStockThreshold;

const InventoryTable = ({ refreshTrigger, onEditItem, onDeleteItem, onOpenAddItemModal }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setAlertMessage({ type: 'error', message: 'Failed to load inventory items.' });
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (item) => {
    onEditItem(item);
  };

  const handleDelete = (id) => {
    onDeleteItem(id);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when search term changes
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  // Calculate stats for the header cards
  const totalItems = items.length;
  const lowStockCount = items.filter(isLowStock).length;
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 3, overflow: 'hidden' }}>
      {alertMessage && (
        <Collapse in={alertMessage !== null}>
          <Alert
            severity={alertMessage.type}
            action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseAlert}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2, borderRadius: 0 }}
          >
            {alertMessage.message}
          </Alert>
        </Collapse>
      )}

      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            📦 Inventory Items
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Search Inventory"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={onOpenAddItemModal}
              sx={{ borderRadius: 2, px: 3 }}
            >
              + Add Item
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium" aria-label="inventory table">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Part ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                const rowSx = isLowStock(item) ? { '& > *': { borderBottom: 'unset' }, bgcolor: '#fff3e0' } : { '& > *': { borderBottom: 'unset' } }; // Light orange for low stock
                return (
                  <React.Fragment key={item._id}>
                    <TableRow key={item._id} sx={rowSx}>
                      <TableCell>{item.partId}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {isLowStock(item) ? (
                          <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LowPriorityIcon sx={{ mr: 0.5, fontSize: 18 }} /> Low Stock
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <InventoryIcon sx={{ mr: 0.5, fontSize: 18 }} /> In Stock
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item)} color="primary" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item._id)} color="error" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm ? "No items found matching your search." : "No inventory items available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
      </Box>
    </Paper>
  );
};

InventoryTable.propTypes = {
  refreshTrigger: PropTypes.bool.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onOpenAddItemModal: PropTypes.func.isRequired,
};

export default InventoryTable;