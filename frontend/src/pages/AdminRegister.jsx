import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, MenuItem, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer"
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        userType: form.userType || "customer"
      });

      alert("✅ Registered successfully!");
      navigate("/Login");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom align="center">
        Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRegister}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="User Type"
          name="userType"
          value={form.userType}
          onChange={handleChange}
          helperText="Select your role (default is Customer)"
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="mechanic">Mechanic</MenuItem>
        </TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default AdminRegister;