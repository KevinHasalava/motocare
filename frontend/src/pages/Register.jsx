// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import {
  Box, Container, Paper, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Link, Stack, CircularProgress, MenuItem,
  ThemeProvider, CssBaseline, GlobalStyles
} from "@mui/material";
import {
  Person as PersonIcon, Email as EmailIcon, Lock as LockIcon, 
  Visibility, VisibilityOff, PersonAdd as RegisterIcon, AccountBox as RoleIcon
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { theme, backgroundKeyframes, gradientText } from "../utils/theme";
import Logo from "../components/Landing_Page/Logo";

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    userType: "customer" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post("http://localhost:5000/api/users/register", submitData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      {/* Background Blobs */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ position: 'absolute', top: '20%', left: '15%', width: 300, height: 300, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
        <Box sx={{ position: 'absolute', bottom: '20%', right: '15%', width: 300, height: 300, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
      </Box>

      <Container maxWidth="sm" sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}>
        <Paper sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'rgba(51, 65, 85, 0.5)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(30, 41, 59, 0.8)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: 450
        }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Logo 
              size="large" 
              variant="default" 
              clickable={true}
              onClick={() => navigate('/')}
            />
          </Box>

          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{ mb: 1, ...gradientText, fontWeight: 'bold' }}
          >
            Create Account
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Join us today and get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              select
              fullWidth
              margin="normal"
              name="userType"
              label="Account Type"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RoleIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="mechanic">Mechanic</MenuItem>
              {/* Admin registration should be restricted */}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <RegisterIcon />}
              sx={{
                py: 1.5,
                mb: 3,
                background: loading ? 'rgba(99, 102, 241, 0.3)' : `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: loading ? 'none' : 'scale(1.02)',
                  boxShadow: loading ? 'none' : `0 8px 25px ${theme.palette.primary.dark}`
                }
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Stack direction="row" spacing={1} justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.light'
                  }
                }}
              >
                Sign In
              </Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Register;