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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd, Search } from "@mui/icons-material";
import axios from "axios";

// Import Header and Footer
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  userType: "customer",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [formData, setFormData] = useState(defaultFormState);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users/register", formData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("User added successfully!");
      setOpenAddDialog(false);
      setFormData(defaultFormState); // reset
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${editUserId}`, formData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("User updated successfully!");
      setOpenEditDialog(false);
      setFormData(defaultFormState); // reset
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { "x-auth-token": token },
        });
        setSuccess("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleOpenEditDialog = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
      userType: user.userType,
    });
    setEditUserId(user._id);
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
  const filteredUsers = users.filter((u) => {
    const matchesSearch = [u.name, u.email, u.phone, u.userType]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesUserType = userTypeFilter === "all" || u.userType === userTypeFilter;
    
    return matchesSearch && matchesUserType;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#111827" }}>
      <AdminHeader />

      <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
        <Container maxWidth="xl">
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              background: "radial-gradient(circle at top, #1e3a8a 0%, #111827 70%)",
              boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
            }}
          >
            {/* Heading */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                background: "linear-gradient(90deg,#6366f1,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              👥 Manage Users
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
                startIcon={<PersonAdd />}
                onClick={() => {
                  setFormData(defaultFormState); // 👈 reset BEFORE opening
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
                Add New User
              </Button>

              {/* Filter and Search Controls */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* User Type Filter */}
                <TextField
                  select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
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
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="mechanic">Mechanic</MenuItem>
                  <MenuItem value="cashier">Cashier</MenuItem>
                </TextField>

                {/* Search Bar */}
                <TextField
                  variant="outlined"
                  placeholder="Search users..."
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

            {/* User Table */}
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
                    {["Name", "Email", "Phone", "User Type", "Joined", "Actions"].map((head, idx) => (
                      <TableCell key={idx} sx={{ color: "white", fontWeight: 600 }}>
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length ? (
                    filteredUsers.map((u, idx) => (
                      <TableRow
                        key={u._id}
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                          "&:hover": { backgroundColor: "rgba(99,102,241,0.15)" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>{u.name}</TableCell>
                        <TableCell sx={{ color: "white" }}>{u.email}</TableCell>
                        <TableCell sx={{ color: "white" }}>{u.phone}</TableCell>
                        <TableCell sx={{ color: "white" }}>{u.userType}</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(u)} size="small">
                            <EditIcon sx={{ color: "#60a5fa" }} />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteUser(u._id)} size="small">
                            <DeleteIcon sx={{ color: "#f87171" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: "white" }}>
                        🚫 No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>➕ Add User</DialogTitle>
        <DialogContent>
          {["name", "email", "phone", "password"].map((field) => (
            <TextField
              key={field}
              fullWidth
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
          <TextField
            select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            margin="dense"
            fullWidth
            label="User Type"
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="mechanic">Mechanic</MenuItem>
            <MenuItem value="cashier">Cashier</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>✏️ Edit User</DialogTitle>
        <DialogContent>
          {["name", "email", "phone", "password"].map((field) => (
            <TextField
              key={field}
              fullWidth
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
          <TextField
            select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            margin="dense"
            fullWidth
            label="User Type"
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="mechanic">Mechanic</MenuItem>
            <MenuItem value="cashier">Cashier</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditUser} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <AdminFooter />
    </Box>
  );
};

export default UserManagement;