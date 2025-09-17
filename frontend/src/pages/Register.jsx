import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, GlobalStyles, CssBaseline, ThemeProvider, Alert , Button, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme, backgroundKeyframes, gradientText, mockData } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import handleBookServiceClick from '../pages/VehiclePage';
    



import axios from "axios";


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🛑 Password match validation
    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        userType: "customer" // 👈 Always force as customer
      });

      alert("✅ Registered successfully!");
      navigate("/Login");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (

    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />

        <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
          <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
          <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          <Box
            component="main"
            sx={{ flexGrow: 1, pt: '80px', pb: 8 }}
          >


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
                  type="email"
                  label="Email"
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

                {/* 🔒 No "User Type" input shown to user */}

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




          </Box>

          <Footer />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Register;