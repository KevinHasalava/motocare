import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Fade,
  ThemeProvider,
  CssBaseline,
  GlobalStyles
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api/userProfile';
import { theme, backgroundKeyframes } from '../utils/theme';
import HeaderWrapper from '../components/HeaderWrapper';
import Footer from '../components/Footer';
import { validatePhoneNumber, handlePhoneInput } from '../utils/validationUtils';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check authentication first
        const currentUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!currentUser || !token) {
          navigate('/login');
          return;
        }
        
        // Fetch profile data
        await fetchUserProfile();
      } catch (error) {
        console.error('Profile initialization error:', error);
        setError('Failed to initialize profile');
        setLoading(false);
      }
    };

    initializeProfile();
  }, []); // Empty dependency array - only run once

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getUserProfile();
      
      if (response.data && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
        setRetryCount(0); // Reset retry count on success
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }
      
      // Auto-retry up to 2 times for network errors
      if (retryCount < 2 && (!err.response || err.response.status >= 500)) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchUserProfile();
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  }, [navigate, retryCount]);

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || ''
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Handle phone input filtering
    if (name === 'phone') {
      processedValue = handlePhoneInput(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      setError('');

      // Basic validation
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Phone validation (optional)
      if (formData.phone && formData.phone.trim()) {
        const phoneValidation = validatePhoneNumber(formData.phone);
        if (!phoneValidation.isValid) {
          setError(phoneValidation.error);
          return;
        }
      }

      const response = await updateUserProfile(formData);
      
      // Update local user data
      setUser(response.data.user);
      
      // Update localStorage if email changed
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && formData.email !== currentUser.email) {
        const updatedUser = { ...currentUser, email: formData.email, name: formData.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'admin':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'mechanic':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      default:
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    }
  };

  if (loading && !user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />
        
        {/* Header */}
        <HeaderWrapper 
          navItems={['Home', 'Services', 'Vehicles']} 
          onBookNowClick={() => navigate('/booking')}
          theme={theme}
        />

        <Box
          sx={{
            minHeight: '100vh',
            pt: 12,
            pb: 8,
            background: theme.palette.background.default,
            position: 'relative',
            overflow: 'hidden',
          }}
        >

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: '#111827',
                  fontWeight: 800,
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Loading Profile...
              </Typography>
              <CircularProgress size={60} sx={{ color: '#D32F2F' }} />
            </Box>
          </Container>
        </Box>

        <Footer />
      </ThemeProvider>
    );
  }

  if (!user && !loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />
        
        <HeaderWrapper 
          navItems={['Home', 'Services', 'Vehicles']} 
          onBookNowClick={() => navigate('/booking')}
          theme={theme}
        />

        <Box
          sx={{
            minHeight: '100vh',
            pt: 12,
            pb: 8,
            background: theme.palette.background.default,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Alert 
                severity="error" 
                sx={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                Failed to load profile information. Please try refreshing the page or contact support.
              </Alert>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()} 
                sx={{ mt: 2 }}
              >
                Refresh Page
              </Button>
            </Box>
          </Container>
        </Box>

        <Footer />
      </ThemeProvider>
    );
  }

  const typeStyle = getUserTypeColor(user.userType);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />
      
      {/* Header */}
      <HeaderWrapper 
        navItems={['Home', 'Services', 'Vehicles']} 
        onBookNowClick={() => navigate('/booking')}
        theme={theme}
      />

      <Box
        sx={{
          minHeight: '100vh',
          pt: 12,
          pb: 8,
          background: theme.palette.background.default,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Box>
              {/* Page Header */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    color: '#111827',
                    fontWeight: 900,
                    mb: 1.5,
                    fontSize: { xs: '2.2rem', md: '3rem' }
                  }}
                >
                  My Profile
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: '#6B7280',
                    maxWidth: 600,
                    mx: 'auto',
                    fontSize: '1rem',
                  }}
                >
                  Manage your account information and settings
                </Typography>
              </Box>

              {/* Profile Card */}
              <Card
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: '#D32F2F',
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  {/* Profile Header */}
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: '#D32F2F',
                        fontSize: '2rem',
                        fontWeight: 700,
                        boxShadow: '0 6px 18px rgba(211, 47, 47, 0.3)',
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', color: '#111827', fontWeight: 800, mb: 1, fontSize: '1.6rem' }}>
                        {user.name}
                      </Typography>
                      <Chip
                        label={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                        sx={{
                          background: typeStyle.bg,
                          color: typeStyle.color,
                          border: `1px solid ${typeStyle.color}30`,
                          fontWeight: 600,
                          mr: 2
                        }}
                      />
                      <Chip
                        label={`Member since ${new Date(user.createdAt).getFullYear()}`}
                        size="small"
                        sx={{
                          background: '#F3F4F6',
                          color: '#4B5563',
                          border: '1px solid #E5E7EB'
                        }}
                      />
                    </Box>
                    {!editing && (
                      <IconButton
                        onClick={handleEdit}
                        sx={{
                          background: '#FEE2E2',
                          border: '1px solid #FECACA',
                          color: '#D32F2F',
                          '&:hover': {
                            background: '#FEE2E2',
                            transform: 'scale(1.05)',
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>

                  <Divider sx={{ borderColor: '#F3F4F6', mb: 4 }} />

                  {/* Profile Information */}
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <PersonIcon sx={{ color: '#D32F2F' }} />
                        <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', color: '#111827', fontWeight: 700 }}>
                          Personal Information
                        </Typography>
                      </Stack>
                      
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!editing}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: '#FFFFFF',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#D1D5DB' },
                              '&.Mui-focused fieldset': { borderColor: '#D32F2F' },
                            },
                            '& .MuiInputLabel-root': { color: '#6B7280' },
                            '& .MuiOutlinedInput-input': { color: '#111827' },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editing}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: '#FFFFFF',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#D1D5DB' },
                              '&.Mui-focused fieldset': { borderColor: '#D32F2F' },
                            },
                            '& .MuiInputLabel-root': { color: '#6B7280' },
                            '& .MuiOutlinedInput-input': { color: '#111827' },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!editing}
                          variant="outlined"
                          placeholder="Enter your phone number"
                          inputProps={{
                            maxLength: 10,
                            inputMode: 'numeric',
                            pattern: "0[0-9]{9}"
                          }}
                          helperText={editing ? "Must be 10 digits and start with 0 (optional)" : ""}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: '#FFFFFF',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#D1D5DB' },
                              '&.Mui-focused fieldset': { borderColor: '#D32F2F' },
                            },
                            '& .MuiInputLabel-root': { color: '#6B7280' },
                            '& .MuiOutlinedInput-input': { color: '#111827' },
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Account Information */}
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <SecurityIcon sx={{ color: '#D32F2F' }} />
                        <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', color: '#111827', fontWeight: 700 }}>
                          Account Information
                        </Typography>
                      </Stack>
                      
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            p: 2.5,
                            background: '#F8F9FB',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body1" sx={{ color: '#111827', fontWeight: 600 }}>
                                Account Type
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                              </Typography>
                            </Box>
                            <Chip
                              label={user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                              sx={{
                                background: typeStyle.bg,
                                color: typeStyle.color,
                                border: `1px solid ${typeStyle.color}30`,
                                fontWeight: 600
                              }}
                            />
                          </Stack>
                        </Box>

                        <Box
                          sx={{
                            p: 2.5,
                            background: '#F8F9FB',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body1" sx={{ color: '#111827', fontWeight: 600 }}>
                                Member Since
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Action Buttons */}
                    {editing && (
                      <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                          onClick={handleSave}
                          disabled={updating}
                          sx={{
                            background: '#D32F2F',
                            color: 'white',
                            fontWeight: 700,
                            borderRadius: '12px',
                            py: 1.5,
                            px: 4,
                            boxShadow: '0 4px 14px rgba(211, 47, 47, 0.35)',
                            '&:hover': {
                              background: '#B71C1C',
                            },
                            '&:disabled': {
                              background: '#F3F4F6',
                              color: '#9CA3AF',
                            }
                          }}
                        >
                          {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          disabled={updating}
                          sx={{
                            borderColor: '#E5E7EB',
                            color: '#4B5563',
                            fontWeight: 700,
                            borderRadius: '12px',
                            py: 1.5,
                            px: 4,
                            '&:hover': {
                              borderColor: '#D1D5DB',
                              background: '#F9FAFB',
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Container>

        {/* Snackbar for messages */}
        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? 'error' : 'success'}
            sx={{
              background: error 
                ? 'rgba(239, 68, 68, 0.9)' 
                : 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Box>

      {/* Footer */}
      <Footer />
    </ThemeProvider>
  );
};

export default UserProfilePage;
