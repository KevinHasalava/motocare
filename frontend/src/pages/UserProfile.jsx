// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Avatar,
  Grid, Stack, Alert, CircularProgress, Divider, Card, CardContent,
  ThemeProvider, CssBaseline, GlobalStyles, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import {
  Person as PersonIcon, Edit as EditIcon, Save as SaveIcon,
  Cancel as CancelIcon, Email as EmailIcon, Badge as BadgeIcon,
  Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme, backgroundKeyframes, gradientText } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in and fetch data
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!savedUser || !token) {
      navigate('/Login');
      return;
    }

    setUser(savedUser);
    setFormData({
      name: savedUser.name || '',
      email: savedUser.email || ''
    });

    // Fetch bookings
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/user/${savedUser._id}`, {
          headers: { 'x-auth-token': token }
        });
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      }
    };

    // Fetch services (assuming you want all available services)
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services', {
          headers: { 'x-auth-token': token }
        });
        setServices(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch services');
      }
    };

    fetchBookings();
    fetchServices();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setPasswordData({ ...passwordData, [field]: !passwordData[field] });
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    });
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData,
        {
          headers: { 'x-auth-token': token }
        }
      );

      // Update local storage and state
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/password`, // Assuming you add this endpoint in backend
        { currentPassword, newPassword },
        {
          headers: { 'x-auth-token': token }
        }
      );
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleBookServiceClick = () => {
    console.log("Book service clicked from User Profile!");
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'admin': return theme.palette.error.main;
      case 'mechanic': return theme.palette.warning.main;
      case 'customer': return theme.palette.success.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(-2)
      : 'U';
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />

      {/* Background Blobs */}
      <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: 384, height: 384, bgcolor: 'primary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite ease-in-out' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 384, height: 384, bgcolor: 'secondary.main', borderRadius: '50%', filter: 'blur(100px)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          navItems={["Features", "Process", "About", "Contact"]}
          onBookNowClick={handleBookServiceClick}
          theme={theme}
        />

        <Box component="main" sx={{ flexGrow: 1, pt: '80px', pb: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{ mt: 4, mb: 6, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
            >
              My <Box component="span" sx={gradientText}>Profile</Box>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Grid container spacing={4}>
              {/* Profile Info */}
              <Grid item xs={12} md={4}>
                <Card sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(30, 41, 59, 0.5)',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>

                    <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
                      {user.name}
                    </Typography>

                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2, 
                        color: getUserTypeColor(user.userType),
                        textTransform: 'capitalize',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.userType}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1} sx={{ textAlign: 'left' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <EmailIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <BadgeIcon sx={{ color: 'secondary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          User ID: {user._id.slice(-6)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Edit Profile Form */}
              <Grid item xs={12} md={8}>
                <Paper sx={{
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(30, 41, 59, 0.5)',
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ ...gradientText, fontWeight: 'bold' }}>
                      Profile Information
                    </Typography>
                    
                    {!editing && (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.light',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)'
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing || loading}
                        variant={editing ? "outlined" : "filled"}
                        InputProps={{
                          readOnly: !editing,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editing || loading}
                        variant={editing ? "outlined" : "filled"}
                        InputProps={{
                          readOnly: !editing,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Account Type"
                        value={user.userType}
                        disabled
                        variant="filled"
                        helperText="Account type cannot be changed"
                        sx={{
                          '& .MuiInputBase-input': {
                            textTransform: 'capitalize',
                            color: getUserTypeColor(user.userType),
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {editing && (
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                        sx={{
                          borderColor: 'text.secondary',
                          color: 'text.secondary',
                          '&:hover': {
                            borderColor: 'text.primary',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        sx={{
                          background: loading ? 'rgba(99, 102, 241, 0.3)' : `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          '&:hover': {
                            transform: loading ? 'none' : 'scale(1.02)',
                            boxShadow: loading ? 'none' : `0 8px 25px ${theme.palette.primary.dark}`
                          }
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Profile Changes'}
                      </Button>
                    </Stack>
                  )}
                </Paper>

                {/* Password Change Section */}
                <Paper sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(30, 41, 59, 0.5)',
                }}>
                  <Typography variant="h5" sx={{ ...gradientText, fontWeight: 'bold', mb: 3 }}>
                    Change Password
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type={passwordData.showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => togglePasswordVisibility('showCurrentPassword')}
                              edge="end"
                            >
                              {passwordData.showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={passwordData.showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => togglePasswordVisibility('showNewPassword')}
                              edge="end"
                            >
                              {passwordData.showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type={passwordData.showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => togglePasswordVisibility('showConfirmPassword')}
                              edge="end"
                            >
                              {passwordData.showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                      onClick={handleChangePassword}
                      disabled={loading}
                      sx={{
                        background: loading ? 'rgba(99, 102, 241, 0.3)' : `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          transform: loading ? 'none' : 'scale(1.02)',
                          boxShadow: loading ? 'none' : `0 8px 25px ${theme.palette.primary.dark}`
                        }
                      }}
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </Button>
                  </Stack>
                </Paper>

                {/* Previous Bookings Section */}
                <Paper sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(30, 41, 59, 0.5)',
                }}>
                  <Typography variant="h5" sx={{ ...gradientText, fontWeight: 'bold', mb: 3 }}>
                    Previous Bookings
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid rgba(51, 65, 85, 0.5)', fontWeight: 'bold' } }}>
                          <TableCell>Date</TableCell>
                          <TableCell>Time Slot</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Service</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookings.length > 0 ? (
                          bookings.map((booking) => (
                            <TableRow key={booking._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                              <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                              <TableCell>{booking.timeSlot}</TableCell>
                              <TableCell>{booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model} (${booking.vehicle.vehicleNumber})` : 'N/A'}</TableCell>
                              <TableCell>{booking.service ? booking.service.name : 'N/A'}</TableCell>
                              <TableCell>{booking.service ? `$${booking.service.price}` : 'N/A'}</TableCell>
                              <TableCell>{booking.status || 'Pending'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography color="text.secondary">No previous bookings found</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                {/* Available Services Section */}
                <Paper sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(30, 41, 59, 0.5)',
                }}>
                  <Typography variant="h5" sx={{ ...gradientText, fontWeight: 'bold', mb: 3 }}>
                    Available Services
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid rgba(51, 65, 85, 0.5)', fontWeight: 'bold' } }}>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Duration (minutes)</TableCell>
                          <TableCell>Price ($)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {services.length > 0 ? (
                          services.map((service) => (
                            <TableRow key={service._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                              <TableCell>{service.name}</TableCell>
                              <TableCell>{service.description || 'N/A'}</TableCell>
                              <TableCell>{service.duration}</TableCell>
                              <TableCell>{service.price}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography color="text.secondary">No services available</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;