// pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Container, Paper, Typography, TextField, Button, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";

// ✅ Import Header and Footer
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "customer",
  });
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

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header navItems={['Features', 'Process', 'About', 'Contact']} />

      <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
        <Container sx={{ mt: 2 }}>
          <Typography variant="h4" gutterBottom>👥 User Management</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={{ mb: 2 }}
          >
            Add New User
          </Button>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length ? (
                    users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.userType}</TableCell>
                        <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenEditDialog(u)}>
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteUser(u._id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No users found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Add & Edit Dialogs */}
          {/* ...existing dialog code... */}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default UserManagement;
