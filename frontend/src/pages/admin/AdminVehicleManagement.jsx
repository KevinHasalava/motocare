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
import { Edit as EditIcon, Delete as DeleteIcon, Build, Search, DirectionsCar } from "@mui/icons-material";
import axios from "axios";

// Import Header and Footer
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const defaultFormState = {
  vehicleNumber: "",
  type: "",
  brand: "",
  model: "",
  year: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
};

const AdminVehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formData, setFormData] = useState(defaultFormState);
  const [editVehicleId, setEditVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/vehicles", {
        headers: { "x-auth-token": token },
      });
      setVehicles(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/vehicles", formData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("Vehicle added successfully!");
      setOpenAddDialog(false);
      setFormData(defaultFormState);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    }
  };

  const handleEditVehicle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/vehicles/${editVehicleId}`, formData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("Vehicle updated successfully!");
      setOpenEditDialog(false);
      setFormData(defaultFormState);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
          headers: { "x-auth-token": token },
        });
        setSuccess("Vehicle deleted successfully!");
        fetchVehicles();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete vehicle");
      }
    }
  };

  const handleOpenEditDialog = (vehicle) => {
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      ownerName: vehicle.ownerName,
      ownerEmail: vehicle.ownerEmail,
      ownerPhone: vehicle.ownerPhone,
    });
    setEditVehicleId(vehicle._id);
    setOpenEditDialog(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  if (loading)
    return (
      <CircularProgress
        sx={{ mt: 10, display: "block", margin: "auto", color: "#6366f1" }}
        size={60}
      />
    );

  // filter logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = [v.vehicleNumber, v.brand, v.model, v.ownerName, v.ownerEmail]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || v.type === typeFilter;

    return matchesSearch && matchesType;
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
              Manage Vehicles
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

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Button
                startIcon={<Build />}
                onClick={() => {
                  setFormData(defaultFormState);
                  setOpenAddDialog(true);
                }}
                sx={{
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                  color: "white",
                  borderRadius: "50px",
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                Add New Vehicle
              </Button>

              {/* Filter and Search Controls */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Vehicle Type Filter */}
                <TextField
                  select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
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
                  label="Filter by Type"
                  InputLabelProps={{
                    sx: { color: "#9ca3af" }
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                  <MenuItem value="Three Wheel">Three Wheel</MenuItem>
                </TextField>

                {/* Search Bar */}
                <TextField
                  variant="outlined"
                  placeholder="Search vehicles..."
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
            </Box>

            {/* Vehicle Table */}
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
                    {["Vehicle Number", "Type", "Brand/Model", "Year", "Owner", "Actions"].map((head, idx) => (
                      <TableCell key={idx} sx={{ color: "white", fontWeight: 600 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.length ? (
                    filteredVehicles.map((v, idx) => (
                      <TableRow
                        key={v._id}
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                          "&:hover": { backgroundColor: "rgba(99,102,241,0.15)" },
                        }}
                      >
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          {v.vehicleNumber}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <Chip label={v.type} size="small" color="primary" />
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {v.brand} {v.model}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>{v.year}</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <div>{v.ownerName}</div>
                          <div style={{ fontSize: '0.8em', color: '#9ca3af' }}>{v.ownerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(v)} size="small">
                            <EditIcon sx={{ color: "#60a5fa" }} />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteVehicle(v._id)} size="small">
                            <DeleteIcon sx={{ color: "#f87171" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: "white" }}>
                        🚫 No vehicles found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Add Vehicle Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>🚗 Add Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="e.g., WP-1234"
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Vehicle Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Van">Van</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Motorcycle">Motorcycle</MenuItem>
            <MenuItem value="Three Wheel">Three Wheel</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Email"
            name="ownerEmail"
            type="email"
            value={formData.ownerEmail}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Phone"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddVehicle} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>✏️ Edit Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="e.g., WP-1234"
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Vehicle Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Van">Van</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Motorcycle">Motorcycle</MenuItem>
            <MenuItem value="Three Wheel">Three Wheel</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Email"
            name="ownerEmail"
            type="email"
            value={formData.ownerEmail}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Phone"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditVehicle} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <AdminFooter />
    </Box>
  );
};

export default AdminVehicleManagement;
