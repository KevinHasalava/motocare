import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Box, Container, Typography, GlobalStyles, CssBaseline, ThemeProvider, Alert , Button, TextField} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme, backgroundKeyframes, mockData } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
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



        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <Header
            navItems={mockData.navItems}
            onBookNowClick={() => navigate('/booking')}
            theme={theme}
          />

          <Box
            component="main"
            sx={{ flexGrow: 1, pt: '80px', pb: 8, display: 'flex', alignItems: 'center' }}
          >
            <Container maxWidth="sm" sx={{ py: 6 }}>
              {/* Card */}
              <Box
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: '20px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '3px',
                    background: '#D32F2F',
                  }
                }}
              >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  {/* Icon */}
                  <Box sx={{
                    width: 68, height: 68, borderRadius: '18px',
                    background: '#D32F2F',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3,
                    boxShadow: '0 8px 24px rgba(211,47,47,0.3)',
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                    </svg>
                  </Box>

                  <Typography variant="h3" sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: '#111827',
                    mb: 1,
                  }}>
                    Create Account
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: '#6B7280', fontSize: '0.95rem',
                  }}>
                    Join Moto-Care and manage your vehicle services
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleRegister}>
                  <TextField
                    fullWidth margin="normal"
                    label="Full Name" name="name"
                    value={form.name} onChange={handleChange} required
                  />
                  <TextField
                    fullWidth margin="normal"
                    type="email" label="Email Address" name="email"
                    value={form.email} onChange={handleChange} required
                  />
                  <TextField
                    fullWidth margin="normal"
                    type="tel" label="Phone Number" name="phone"
                    value={form.phone} onChange={handleChange} required
                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: "0[0-9]{9}" }}
                    helperText="Must be 10 digits and start with 0 (e.g., 071xxxxxxx)"
                  />
                  <TextField
                    fullWidth margin="normal"
                    type="password" label="Password" name="password"
                    value={form.password} onChange={handleChange} required
                    helperText="Must be at least 6 characters with at least one letter and one number"
                  />
                  <TextField
                    fullWidth margin="normal"
                    type="password" label="Confirm Password" name="confirmPassword"
                    value={form.confirmPassword} onChange={handleChange} required
                  />

                  {/* 🔒 No "User Type" input shown to user */}

                  <Button
                    type="submit" fullWidth variant="contained"
                    size="large"
                    sx={{
                      mt: 3, py: 1.8,
                      borderRadius: '12px',
                      fontSize: '1rem', fontWeight: 700,
                      fontFamily: '"Inter", sans-serif',
                      background: '#D32F2F',
                      textTransform: 'none',
                      boxShadow: '0 6px 20px rgba(211,47,47,0.3)',
                      '&:hover': {
                        background: '#B71C1C',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 28px rgba(211,47,47,0.4)',
                      },
                    }}
                  >
                    Create Account
                  </Button>

                  {/* Link to login */}
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      color: '#6B7280', fontSize: '0.9rem',
                    }}>
                      Already have an account?{' '}
                      <Box
                        component="a" href="/login"
                        sx={{
                          color: '#D32F2F', textDecoration: 'none', fontWeight: 600,
                          '&:hover': { textDecoration: 'underline', color: '#B71C1C' },
                        }}
                      >
                        Sign In
                      </Box>
                    </Typography>
                  </Box>
                </Box>
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