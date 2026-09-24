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
  Grid,
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search, 
  FilterList,
  CalendarToday,
  Person,
  DirectionsCar,
  Build
} from "@mui/icons-material";
import axios from "axios";

// Import Header and Footer
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);

  // Form data for editing
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    service: "",
    mechanic: "",
    status: "",
  });

  useEffect(() => {
    fetchBookings();
    fetchMechanics();
    fetchServices();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { "x-auth-token": token },
      });
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { "x-auth-token": token },
      });
      const mechanicUsers = res.data.filter(user => user.userType === "mechanic");
      setMechanics(mechanicUsers);
    } catch (err) {
      console.error("Failed to fetch mechanics:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/services", {
        headers: { "x-auth-token": token },
      });
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleEditBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/bookings/update-with-job/${editBookingData._id}`,
        formData,
        {
          headers: { "x-auth-token": token },
        }
      );
      setSuccess("Booking updated successfully!");
      setOpenEditDialog(false);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/bookings/delete-with-job/${id}`, {
          headers: { "x-auth-token": token },
        });
        setSuccess("Booking deleted successfully!");
        fetchBookings();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete booking");
      }
    }
  };

  const handleOpenEditDialog = (booking) => {
    setEditBookingData(booking);
    setFormData({
      date: new Date(booking.date).toISOString().split('T')[0],
      timeSlot: booking.timeSlot,
      service: booking.service._id,
      mechanic: booking.mechanic ? booking.mechanic._id : "",
      status: "Booked", // You can add status to booking model if needed
    });
    setOpenEditDialog(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked": return "#f59e0b";
      case "Ongoing": return "#3b82f6";
      case "Completed": return "#10b981";
      case "Cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusChip = (status) => (
    <Chip
      label={status || "Booked"}
      sx={{
        backgroundColor: getStatusColor(status || "Booked"),
        color: "white",
        fontWeight: 600,
        fontSize: "0.75rem",
      }}
    />
  );

  if (loading)
    return (
      <CircularProgress
        sx={{ mt: 10, display: "block", margin: "auto", color: "#6366f1" }}
        size={60}
      />
    );

  // Enhanced filter logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = [
      booking.user?.name,
      booking.user?.email,
      booking.vehicle?.vehicleNumber,
      booking.vehicle?.brand,
      booking.vehicle?.model,
      booking.service?.name,
      booking.mechanic?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || (booking.status || "Booked") === statusFilter;
    
    const matchesDate = !dateFilter || 
      new Date(booking.date).toISOString().split('T')[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
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
              Booking Management
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

            {/* Filter Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    width: "100%",
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
                  label="Status Filter"
                  InputLabelProps={{ sx: { color: "#9ca3af" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Booked">Booked</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "30px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                      color: "white",
                    },
                    "& .MuiInputLabel-root": { color: "#9ca3af" },
                  }}
                  variant="outlined"
                  size="small"
                  label="Date Filter"
                  InputLabelProps={{ sx: { color: "#9ca3af", shrink: true } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  variant="outlined"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: "100%",
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
              </Grid>
            </Grid>

            {/* Bookings Table */}
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
                    {[
                      "Customer", 
                      "Vehicle", 
                      "Service", 
                      "Date & Time", 
                      "Mechanic", 
                      "Status", 
                      "Actions"
                    ].map((head, idx) => (
                      <TableCell key={idx} sx={{ color: "white", fontWeight: 600 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.length ? (
                    filteredBookings.map((booking, idx) => (
                      <TableRow
                        key={booking._id}
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                          "&:hover": { backgroundColor: "rgba(99,102,241,0.15)" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person sx={{ color: "#60a5fa", fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                                {booking.user?.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                {booking.user?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ color: "white" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <DirectionsCar sx={{ color: "#f59e0b", fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                                {booking.vehicle?.vehicleNumber}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                {booking.vehicle?.brand} {booking.vehicle?.model}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Build sx={{ color: "#10b981", fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                                {booking.service?.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                Rs. {booking.service?.price}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                            {new Date(booking.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                            {booking.timeSlot}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {booking.mechanic ? (
                            <Typography variant="body2" sx={{ color: "#a855f7", fontWeight: 600 }}>
                              {booking.mechanic.name}
                            </Typography>
                          ) : (
                            <Typography variant="body2" sx={{ color: "#9ca3af", fontStyle: "italic" }}>
                              Not Assigned
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {getStatusChip(booking.status || "Booked")}
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(booking)} size="small">
                            <EditIcon sx={{ color: "#60a5fa" }} />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteBooking(booking._id)} size="small">
                            <DeleteIcon sx={{ color: "#f87171" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "white" }}>
                        🚫 No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Edit Booking Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ background: "#FFFFFF", color: "#111827", borderBottom: '1px solid #E5E7EB', fontFamily: '"Outfit", sans-serif', fontWeight: 800 }}>
          Edit Booking
        </DialogTitle>
        <DialogContent sx={{ background: "#FFFFFF", color: "#111827" }}>
          <TextField
            fullWidth
            margin="dense"
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            margin="dense"
            label="Time Slot"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            margin="dense"
            label="Service"
            name="service"
            value={formData.service}
            onChange={handleChange}
          >
            {services.map((service) => (
              <MenuItem key={service._id} value={service._id}>
                {service.name} - Rs. {service.price}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="dense"
            label="Mechanic"
            name="mechanic"
            value={formData.mechanic}
            onChange={handleChange}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {mechanics.map((mechanic) => (
              <MenuItem key={mechanic._id} value={mechanic._id}>
                {mechanic.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ background: "#FFFFFF", borderTop: '1px solid #E5E7EB', p: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: "#6B7280" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditBooking} 
            variant="contained"
            sx={{
              background: '#D32F2F',
              color: "white",
              borderRadius: '8px',
              '&:hover': { background: '#B71C1C' },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <AdminFooter />
    </Box>
  );
};

export default AdminBookingManagement;