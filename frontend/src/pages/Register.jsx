import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, GlobalStyles, CssBaseline, ThemeProvider, Alert , Button, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme, backgroundKeyframes, gradientText, mockData } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import handleBookServiceClick from '../pages/VehiclePage';
import { validatePhoneNumber, handlePhoneInput } from '../utils/validationUtils';

import axios from "axios";
import API_URL from "../config/api";


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Handle phone input filtering
    if (name === 'phone') {
      processedValue = handlePhoneInput(value);
    }

    setForm({ ...form, [name]: processedValue });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

// 🛑 All fields required
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("❌ All fields are required");
      return;
    }

    // 📧 Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("❌ Invalid email address");
      return;
    }

    // 📞 Phone Validation
    const phoneValidation = validatePhoneNumber(form.phone);
    if (!phoneValidation.isValid) {
      setError(`❌ ${phoneValidation.error}`);
      return;
    }

    // 🔑 Password Validation (improved - more user-friendly)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      setError("❌ Password must be at least 6 characters long and contain at least one letter and one number");
      return;
    }


    // 🛑 Password match validation
    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
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
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  inputProps={{
                    maxLength: 10,
                    inputMode: 'numeric',
                    pattern: "0[0-9]{9}"
                  }}
                  helperText="Must be 10 digits and start with 0 (e.g., 071xxxxxxx)"
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
                  helperText="Must be at least 6 characters with at least one letter and one number"
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