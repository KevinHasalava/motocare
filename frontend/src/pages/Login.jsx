// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Alert, CircularProgress,
  ThemeProvider, CssBaseline, GlobalStyles, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme, backgroundKeyframes, gradientText } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', showPassword: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to home page after successful login
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleBookServiceClick = () => {
    console.log('Book service clicked from Login!');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          navItems={['Features', 'Process', 'About', 'Contact']}
          onBookNowClick={handleBookServiceClick}
          theme={theme}
        />

        <Box component="main" sx={{ flexGrow: 1, pt: '80px', pb: 8 }}>
          <Container maxWidth="sm">
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{ mt: 4, mb: 6, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
            >
              <Box component="span" sx={gradientText}>Login</Box>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Paper sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'rgba(51, 65, 85, 0.5)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(30, 41, 59, 0.5)',
            }}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={formData.showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.dark}`,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Login;