import React, { useState } from "react";
import {
  TextField, Button, Box, Typography, Container,
  Paper, Stack, InputAdornment, IconButton, Divider,
  Fade, Zoom, Link, ThemeProvider, CssBaseline
} from "@mui/material";
import {
  Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff,
  DirectionsCar as CarIcon, Engineering as EngineeringIcon,
  Login as LoginIcon, ArrowForward as ArrowIcon,
  Build as BuildIcon, CheckCircle as CheckIcon,
} from '@mui/icons-material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import API_URL from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email, password
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.userType === "admin") navigate("/admin-dashboard");
      else if (user.userType === "mechanic") navigate("/mechanic-portal");
      else if (user.userType === "cashier") navigate("/cashier-dashboard");
      else navigate("/home");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          background: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* ── Left Panel: Image & brand ──────────────────────── */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            overflow: 'hidden',
            background: '#111827',
          }}
        >
          {/* Background image */}
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop"
            alt="Premium automotive service"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
            }}
          />
          {/* Gradient overlay */}
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.85) 100%)',
          }} />
          {/* Content */}
          <Box sx={{ position: 'relative', p: 6, zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '12px',
                background: '#D32F2F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(211,47,47,0.4)',
              }}>
                <CarIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', fontFamily: '"Outfit", sans-serif' }}>
                Moto-Care
              </Typography>
            </Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '2rem', fontFamily: '"Outfit", sans-serif', lineHeight: 1.2, mb: 1.5 }}>
              Professional Auto Service Platform
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, mb: 3 }}>
              Serving Imaduwa, Galle District with 15+ years of trusted vehicle care excellence.
            </Typography>
            {['Certified Expert Mechanics', 'Real-time Service Tracking', 'Complete Digital Records'].map((item) => (
              <Stack key={item} direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <CheckIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{item}</Typography>
              </Stack>
            ))}
          </Box>
        </Box>

        {/* ── Right Panel: Login Form ────────────────────────── */}
        <Box
          sx={{
            width: { xs: '100%', md: '460px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
            background: '#FFFFFF',
            borderLeft: { md: '1px solid #E5E7EB' },
          }}
        >
          <Fade in timeout={600}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              {/* Mobile logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: '#D32F2F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CarIcon sx={{ color: 'white', fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
                  Moto-Care
                </Typography>
              </Box>

              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: '#111827',
                    fontFamily: '"Outfit", sans-serif',
                    mb: 0.75,
                  }}
                >
                  Welcome back
                </Typography>
                <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
                  Login to access your vehicle service dashboard
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#9CA3AF' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        background: '#F9FAFB',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                        '&.Mui-focused fieldset': { borderColor: '#D32F2F', borderWidth: 2 },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': { color: '#D32F2F' },
                      },
                      '& .MuiOutlinedInput-input': { color: '#111827' },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#9CA3AF' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#9CA3AF' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        background: '#F9FAFB',
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                        '&.Mui-focused fieldset': { borderColor: '#D32F2F', borderWidth: 2 },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': { color: '#D32F2F' },
                      },
                      '& .MuiOutlinedInput-input': { color: '#111827' },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={<LoginIcon />}
                    endIcon={<ArrowIcon />}
                    sx={{
                      py: 1.7,
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontFamily: '"Inter", sans-serif',
                      background: '#D32F2F',
                      textTransform: 'none',
                      boxShadow: '0 6px 20px rgba(211,47,47,0.3)',
                      '&:hover': {
                        background: '#B71C1C',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 28px rgba(211,47,47,0.4)',
                      },
                      '&:disabled': {
                        background: 'rgba(211,47,47,0.4)',
                        color: 'rgba(255,255,255,0.6)',
                      },
                      transition: 'all 0.22s ease',
                    }}
                  >
                    {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                  </Button>
                </Stack>

                {/* Links */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 3 }}
                >
                  <Link
                    href="/forgot-password"
                    sx={{
                      color: '#6B7280',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      '&:hover': { color: '#D32F2F', textDecoration: 'underline' },
                    }}
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    href="/register"
                    sx={{
                      color: '#D32F2F',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Create Account →
                  </Link>
                </Stack>

                {/* Role icons */}
                <Divider sx={{ my: 3, borderColor: '#E5E7EB' }} />
                <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2 }}>
                  Login portal for
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {[
                    { icon: <CarIcon />, label: 'Customers', color: '#D32F2F', bg: '#FFEBEE' },
                    { icon: <EngineeringIcon />, label: 'Mechanics', color: '#D97706', bg: '#FFFBEB' },
                    { icon: <BuildIcon />, label: 'Admins', color: '#7C3AED', bg: '#F5F3FF' },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 1.5,
                        borderRadius: '10px',
                        background: item.bg,
                        border: '1px solid',
                        borderColor: `${item.color}22`,
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                      }}
                    >
                      <Box sx={{ color: item.color, mb: 0.5 }}>{item.icon}</Box>
                      <Typography sx={{ color: item.color, fontSize: '0.72rem', fontWeight: 700 }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;