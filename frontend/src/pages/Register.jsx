import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", userType: "customer" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      alert("✅ Registered successfully!");
      navigate("/Login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom align="center">Register</Typography>
      <Box component="form" onSubmit={handleRegister}>
        <TextField fullWidth margin="normal" label="Name" name="name" value={form.name} onChange={handleChange}/>
        <TextField fullWidth margin="normal" label="Email" name="email" value={form.email} onChange={handleChange}/>
        <TextField fullWidth margin="normal" type="password" label="Password" name="password" value={form.password} onChange={handleChange}/>
        <TextField select fullWidth margin="normal" label="User Type" name="userType" value={form.userType} onChange={handleChange}>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="mechanic">Mechanic</MenuItem>
        </TextField>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
      </Box>
    </Container>
  );
};

export default Register;