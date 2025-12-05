import React, { useState } from "react";
import {
  TextField, Button, Box, Typography, Container,
  Paper, Stack, InputAdornment, IconButton, Divider,
  alpha, Fade, Zoom, Link, ThemeProvider, CssBaseline
} from "@mui/material";
import {
  Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff,
  DirectionsCar as CarIcon, Engineering as EngineeringIcon,
  Login as LoginIcon, ArrowForward as ArrowIcon,
  Speed as SpeedIcon, Build as BuildIcon
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
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.background.default,
        }}
      >
        {/* Animated Background - Matching Landing Page */}
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          {/* Base gradient */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, 
                ${theme.palette.background.default} 0%, 
                #141922 25%,
                #1A1F2B 50%,
                #141922 75%,
                ${theme.palette.background.default} 100%
              )`,
            }}
          />

          {/* Technical Grid Pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.03,
              backgroundImage: `
                linear-gradient(${alpha(theme.palette.info.main, 0.5)} 1px, transparent 1px),
                linear-gradient(90deg, ${alpha(theme.palette.info.main, 0.5)} 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite',
            }}
          />

          {/* Floating Orbs with theme colors */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
              filter: 'blur(60px)',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: 350,
              height: 350,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
              filter: 'blur(60px)',
              animation: 'float 8s ease-in-out infinite 2s',
            }}
          />

          {/* Speed Lines */}
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: `${30 + i * 20}%`,
                left: '-100%',
                width: '200px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${
                  i % 2 === 0 ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.info.main, 0.3)
                }, transparent)`,
                animation: `speedLine ${5 + i}s linear infinite ${i * 0.5}s`,
              }}
            />
          ))}

          {/* Dashboard-inspired Light Beams */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200%',
              height: '100%',
              opacity: 0.05,
              background: `conic-gradient(
                from 180deg at 50% 0%,
                transparent 0deg,
                ${alpha(theme.palette.primary.main, 0.3)} 45deg,
                transparent 90deg,
                ${alpha(theme.palette.info.main, 0.3)} 135deg,
                transparent 180deg,
                ${alpha(theme.palette.secondary.main, 0.3)} 225deg,
                transparent 270deg,
                ${alpha(theme.palette.success.main, 0.3)} 315deg,
                transparent 360deg
              )`,
              animation: 'rotate 30s linear infinite',
              filter: 'blur(60px)',
            }}
          />
        </Box>

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: theme.palette.background.paper,
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2),
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
                  animation: 'shimmer 3s linear infinite',
                }
              }}
            >
              {/* Logo/Icon Section */}
              <Stack spacing={3} alignItems="center">
                <Zoom in timeout={800}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '25%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                      position: 'relative',
                      animation: 'engineRev 3s ease-in-out infinite',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: -15,
                        borderRadius: '25%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.2,
                        filter: 'blur(15px)',
                        animation: 'rotate 3s linear infinite',
                      }
                    }}
                  >
                    <CarIcon sx={{ fontSize: 50, color: 'white' }} />
                  </Box>
                </Zoom>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '1rem',
                    }}
                  >
                    Login to access your vehicle service dashboard
                  </Typography>
                </Box>
              </Stack>

              <Divider 
                sx={{ 
                  my: 4, 
                  borderColor: alpha(theme.palette.text.primary, 0.1),
                  '&::before, &::after': {
                    borderColor: alpha(theme.palette.text.primary, 0.1),
                  }
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <BuildIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                    PREMIUM SERVICE CENTER
                  </Typography>
                  <SpeedIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                </Stack>
              </Divider>

              {/* Login Form */}
              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={3}>
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
                          <EmailIcon sx={{ color: theme.palette.info.main }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: alpha('#000', 0.3),
                        '& fieldset': {
                          borderColor: alpha(theme.palette.info.main, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.info.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.info.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.info.main,
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: theme.palette.text.primary,
                        '&::placeholder': {
                          color: alpha(theme.palette.text.primary, 0.4),
                        },
                      },
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
                          <LockIcon sx={{ color: theme.palette.secondary.main }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: alpha('#000', 0.3),
                        '& fieldset': {
                          borderColor: alpha(theme.palette.secondary.main, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.secondary.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.secondary.main,
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.secondary.main,
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: theme.palette.text.primary,
                      },
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
                      mt: 2,
                      py: 2,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 15px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                        '&::before': {
                          left: '100%',
                        },
                        '& .MuiButton-endIcon': {
                          transform: 'translateX(5px)',
                        },
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.primary.main, 0.5),
                      },
                    }}
                  >
                    {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                  </Button>
                </Stack>

                {/* Additional Links */}
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                  sx={{ mt: 3 }}
                >
                  <Link
                    href="/forgot-password"
                    sx={{
                      color: alpha(theme.palette.info.main, 0.8),
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: theme.palette.info.main,
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    href="/register"
                    sx={{
                      color: alpha(theme.palette.secondary.main, 0.8),
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create Account
                  </Link>
                </Stack>

                {/* Service Icons */}
                <Stack 
                  direction="row" 
                  spacing={2} 
                  justifyContent="center"
                  sx={{ 
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: alpha(theme.palette.text.primary, 0.1),
                  }}
                >
                  {[
                    { icon: <EngineeringIcon />, label: 'Mechanics' },
                    { icon: <CarIcon />, label: 'Customers' },
                    { icon: <BuildIcon />, label: 'Admins' },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: 'center',
                        p: 1.5,
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.3),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.text.primary, 0.05),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: alpha(theme.palette.background.paper, 0.5),
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mb: 0.5 }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Fade>
        </Container>

        {/* Add animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes speedLine {
            0% { left: -100%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          
          @keyframes engineRev {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.05); }
            75% { transform: scale(0.95); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Box>
    </ThemeProvider>
  );
};

export default Login;