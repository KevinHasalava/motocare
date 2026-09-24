import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Payment, Search, Receipt } from "@mui/icons-material";
import axios from "axios";

// Import Header and Footer
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editFormData, setEditFormData] = useState({
    paymentStatus: "",
    notes: "",
    discount: 0,
    discountPercentage: 0,
    paymentMethod: "",
  });
  const [editPaymentId, setEditPaymentId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payments/all", {
        headers: { "x-auth-token": token },
        params: {
          page: 1,
          limit: 1000 // Get a large number of payments for admin view
        }
      });
      setPayments(res.data.payments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/payments/${editPaymentId}`, editFormData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("Payment updated successfully!");
      setOpenEditDialog(false);
      setEditFormData({
        paymentStatus: "",
        notes: "",
        discount: 0,
        discountPercentage: 0,
        paymentMethod: "",
      });
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment");
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/payments/${id}`, {
          headers: { "x-auth-token": token },
        });
        setSuccess("Payment deleted successfully!");
        fetchPayments();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete payment");
      }
    }
  };

  const handleOpenEditDialog = (payment) => {
    setEditFormData({
      paymentStatus: payment.paymentStatus,
      notes: payment.notes || "",
      discount: payment.discount || 0,
      discountPercentage: payment.discountPercentage || 0,
      paymentMethod: payment.paymentMethod || "",
    });
    setEditPaymentId(payment._id);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    setError("");
    setSuccess("");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'error';
      case 'verified':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading)
    return (
      <CircularProgress
        sx={{ mt: 10, display: "block", margin: "auto", color: "#6366f1" }}
        size={60}
      />
    );

  // filter logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch = [p.invoiceId, p.customer?.name, p.vehicle?.vehicleNumber, p.service?.name]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8F9FB" }}>
      <AdminHeader />

      <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
        <Container maxWidth="xl">
          <Paper
            sx={{
              p: 4,
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            {/* Heading */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 900,
                mb: 3,
                color: '#111827',
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              Manage Payments
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            {/* Filter and Search Controls */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 2, mb: 2 }}>
              {/* Payment Status Filter */}
              <TextField
                select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  minWidth: "150px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "30px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    color: "white",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                  "& .MuiSelect-icon": { color: "#9ca3af" },
                }}
                variant="outlined"
                size="small"
                label="Filter by Status"
                InputLabelProps={{
                  sx: { color: "#9ca3af" }
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
                <MenuItem value="Verified">Verified</MenuItem>
              </TextField>

              {/* Search Bar */}
              <TextField
                variant="outlined"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  minWidth: { xs: "100%", sm: "300px" },
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "30px",
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    color: "white",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Payment Table */}
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "rgba(99,102,241,0.25)" }}>
                    {["Invoice ID", "Customer", "Vehicle", "Service", "Amount", "Status", "Date", "Actions"].map((head, idx) => (
                      <TableCell key={idx} sx={{ color: "white", fontWeight: 600 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.length ? (
                    filteredPayments.map((p, idx) => (
                      <TableRow
                        key={p._id}
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                          "&:hover": { backgroundColor: "rgba(99,102,241,0.15)" },
                        }}
                      >
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          {p.invoiceId}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {p.customer?.name || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {p.vehicle?.vehicleNumber || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {p.service?.name || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          LKR {p.totalAmount?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <Chip
                            label={p.paymentStatus}
                            color={getStatusColor(p.paymentStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {formatDate(p.createdAt)}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(p)} size="small">
                            <EditIcon sx={{ color: "#60a5fa" }} />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePayment(p._id)} size="small">
                            <DeleteIcon sx={{ color: "#f87171" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: "white" }}>
                        🚫 No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Edit Payment Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>✏️ Edit Payment</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Payment Status"
            name="paymentStatus"
            value={editFormData.paymentStatus}
            onChange={handleEditChange}
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            margin="dense"
            label="Payment Method"
            name="paymentMethod"
            value={editFormData.paymentMethod}
            onChange={handleEditChange}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Discount Amount"
            name="discount"
            type="number"
            value={editFormData.discount}
            onChange={handleEditChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
            }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Discount Percentage"
            name="discountPercentage"
            type="number"
            value={editFormData.discountPercentage}
            onChange={handleEditChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Notes"
            name="notes"
            multiline
            rows={3}
            value={editFormData.notes}
            onChange={handleEditChange}
            placeholder="Add payment notes..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditPayment} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <AdminFooter />
    </Box>
  );
};

export default AdminPaymentManagement;
